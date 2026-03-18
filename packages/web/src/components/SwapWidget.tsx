'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  useAccount, useBalance, useWriteContract,
  useWaitForTransactionReceipt, useSwitchChain, useChainId
} from 'wagmi'
import { createPublicClient, http } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseEther, formatEther, parseUnits, formatUnits } from 'viem'
import { base } from 'wagmi/chains'

// Stable public client — no wallet needed for price reads
const publicClient = createPublicClient({ chain: base, transport: http() })

// ── Constants ─────────────────────────────────────────────────────────────────

const SAIMMY          = '0xaE58EbfBE35D4F4a320DFB550fE4d27c0d2A7ba3' as const
const ZERO            = '0x0000000000000000000000000000000000000000' as const
const POOL_ID         = '0xd4a90dfc9938ff1a5675e8f16e24855843fb399d7331cc77d19a62c68c08e46c' as `0x${string}`
const DOPPLER_ADAPTER = '0xd59ce43e53d69f190e15d9822fb4540dccc91178' as const
const STATE_VIEW      = '0xa3c0c9b65bad0b08107aa264b0f3db444b867a71' as const

// ── ABIs ──────────────────────────────────────────────────────────────────────

const stateViewAbi = [{
  name: 'getSlot0', type: 'function', stateMutability: 'view',
  inputs: [{ name: 'poolId', type: 'bytes32' }],
  outputs: [
    { name: 'sqrtPriceX96', type: 'uint160' },
    { name: 'tick', type: 'int24' },
    { name: 'protocolFee', type: 'uint24' },
    { name: 'lpFee', type: 'uint24' },
  ],
}] as const

const getPriceAbi = [{
  name: 'getPrice', type: 'function', stateMutability: 'view',
  inputs: [{ name: 'token', type: 'address' }],
  outputs: [{ type: 'uint256' }],
}] as const

const swapAbi = [{
  name: 'swap', type: 'function', stateMutability: 'payable',
  inputs: [
    { name: 'tokenIn', type: 'address' },
    { name: 'tokenOut', type: 'address' },
    { name: 'amountIn', type: 'uint256' },
  ],
  outputs: [{ type: 'uint256' }],
}] as const

const erc20Abi = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
] as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(val: bigint, decimals = 18, places = 6): string {
  const n = parseFloat(formatUnits(val, decimals))
  if (n === 0) return '0'
  return n.toFixed(places).replace(/\.?0+$/, '') || '0'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SwapWidget() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const onWrongNetwork = isConnected && chainId !== base.id


  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [inputAmount, setInputAmount]   = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [editedField, setEditedField]   = useState<'input' | 'output'>('input')
  const [saimmyPerEth, setSaimmyPerEth] = useState<bigint | null>(null)
  const [lpFee, setLpFee]               = useState<number | null>(null)
  const [poolReady, setPoolReady]       = useState(false)
  const [saimmyBalance, setSaimmyBalance] = useState<bigint | null>(null)
  const [error, setError]               = useState<string | null>(null)

  const { data: ethBalance } = useBalance({ address, chainId: base.id })
  const { writeContractAsync } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })
  const [isSwapping, setIsSwapping] = useState(false)

  // ── Fetch pool + price ─────────────────────────────────────────────────────

  const fetchPool = useCallback(async () => {
    const client = publicClient
    if (!client) return
    try {
      const slot0Result = await publicClient.readContract({
        address: STATE_VIEW, abi: stateViewAbi,
        functionName: 'getSlot0', args: [POOL_ID],
      }) as [bigint, number, number, number]

      const [sqrtPriceX96, , , fee] = slot0Result
      if (sqrtPriceX96 === 0n) { setPoolReady(false); return }
      setPoolReady(true)
      setLpFee(fee / 1_000_000)

      // WETH=token0, SAIMMY=token1 → price = sqrtP² / Q96² = SAIMMY per ETH
      // Multiply by 1e18 to keep as a bigint scaled by 1e18
      const Q96 = 2n ** 96n
      const saimmyPerEthVal = (sqrtPriceX96 * sqrtPriceX96 * 10n ** 18n) / (Q96 * Q96)
      setSaimmyPerEth(saimmyPerEthVal)
    } catch { setPoolReady(false) }
  }, [publicClient])

  useEffect(() => {
    fetchPool()
    const id = setInterval(fetchPool, 15_000)
    return () => clearInterval(id)
  }, [fetchPool])

  // ── Fetch SAIMMY balance ───────────────────────────────────────────────────

  useEffect(() => {
    if (!address) return
    publicClient?.readContract({
      address: SAIMMY, abi: erc20Abi,
      functionName: 'balanceOf', args: [address],
    }).then(b => setSaimmyBalance(b as bigint)).catch(() => {})
  }, [address, isConfirmed])

  // ── Price estimates ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!saimmyPerEth || editedField !== 'input') return
    try {
      const amt = parseFloat(inputAmount)
      if (!inputAmount || isNaN(amt) || amt <= 0) { setOutputAmount(''); return }
      const feeMult = BigInt(Math.round((1 - (lpFee ?? 0.012)) * 1e6))
      if (direction === 'buy') {
        const ethWei = parseEther(inputAmount)
        const out = (ethWei * saimmyPerEth * feeMult) / (10n ** 18n * 1_000_000n)
        setOutputAmount(fmt(out))
      } else {
        const saimmyWei = parseUnits(inputAmount, 18)
        const out = (saimmyWei * 10n ** 18n * feeMult) / (saimmyPerEth * 1_000_000n)
        setOutputAmount(fmt(out))
      }
    } catch { setOutputAmount('') }
  }, [inputAmount, saimmyPerEth, direction, lpFee, editedField])

  useEffect(() => {
    if (!saimmyPerEth || editedField !== 'output') return
    try {
      const amt = parseFloat(outputAmount)
      if (!outputAmount || isNaN(amt) || amt <= 0) { setInputAmount(''); return }
      const feeMult = BigInt(Math.round((1 - (lpFee ?? 0.012)) * 1e6))
      if (direction === 'buy') {
        const saimmyWei = parseUnits(outputAmount, 18)
        const inp = (saimmyWei * 10n ** 18n * 1_000_000n) / (saimmyPerEth * feeMult)
        setInputAmount(fmt(inp))
      } else {
        const ethWei = parseEther(outputAmount)
        const inp = (ethWei * saimmyPerEth * 1_000_000n) / (10n ** 18n * feeMult)
        setInputAmount(fmt(inp))
      }
    } catch { setInputAmount('') }
  }, [outputAmount, saimmyPerEth, direction, lpFee, editedField])

  // ── Swap ──────────────────────────────────────────────────────────────────

  const handleSwap = async () => {
    if (!address || !inputAmount) return
    setIsSwapping(true)
    setError(null)
    try {
      const amountIn = direction === 'buy'
        ? parseEther(inputAmount)
        : parseUnits(inputAmount, 18)
      const tokenIn  = direction === 'buy' ? ZERO : SAIMMY
      const tokenOut = direction === 'buy' ? SAIMMY : ZERO

      if (direction === 'sell') {
        const approveTx = await writeContractAsync({
          address: SAIMMY, abi: erc20Abi,
          functionName: 'approve', args: [DOPPLER_ADAPTER, amountIn],
        })
        await publicClient.waitForTransactionReceipt({ hash: approveTx })
      }

      const hash = await writeContractAsync({
        address: DOPPLER_ADAPTER, abi: swapAbi,
        functionName: 'swap', args: [tokenIn, tokenOut, amountIn],
        value: direction === 'buy' ? amountIn : 0n,
      })
      setTxHash(hash)
    } catch (err: unknown) {
      const msg = (err as { shortMessage?: string; message?: string })?.shortMessage
        || (err as { message?: string })?.message || ''
      if (/user rejected|denied/i.test(msg)) setError('Transaction rejected')
      else { setError('Swap failed — try again'); console.error(err) }
    } finally {
      setIsSwapping(false)
    }
  }

  const handleFlip = () => {
    setDirection(d => d === 'buy' ? 'sell' : 'buy')
    setInputAmount(outputAmount)
    setOutputAmount('')
    setEditedField('input')
    setError(null)
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const fromSymbol = direction === 'buy' ? 'ETH' : '$SAIMMY'
  const toSymbol   = direction === 'buy' ? '$SAIMMY' : 'ETH'
  const fromBal    = direction === 'buy' ? ethBalance?.value : saimmyBalance
  const inputWei   = (() => { try { return inputAmount ? parseUnits(inputAmount, 18) : 0n } catch { return 0n } })()
  const insufficient = inputWei > 0n && fromBal != null && inputWei > fromBal
  const busy = isSwapping || isConfirming

  // saimmyPerEth is SAIMMY-per-ETH scaled by 1e18 (i.e. bigint wei units)
  const saimmyPerEthFloat = saimmyPerEth && saimmyPerEth > 0n
    ? parseFloat(formatUnits(saimmyPerEth, 18))
    : null
  const priceStr = saimmyPerEthFloat != null
    ? `1 ETH ≈ ${saimmyPerEthFloat >= 1_000_000
        ? `${(saimmyPerEthFloat / 1_000_000).toFixed(1)}M`
        : saimmyPerEthFloat >= 1_000
          ? `${(saimmyPerEthFloat / 1_000).toFixed(1)}K`
          : saimmyPerEthFloat.toFixed(2)} $SAIMMY`
    : null

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted uppercase tracking-widest">swap</span>
        <div className="flex items-center gap-3">
          {priceStr && <span className="font-mono text-xs text-text-muted">{priceStr}{lpFee != null ? ` · ${(lpFee * 100).toFixed(1)}% fee` : ''}</span>}
          <span className="font-mono text-xs text-text-muted border border-border px-2 py-0.5">Base</span>
        </div>
      </div>

      {!poolReady && (
        <p className="font-mono text-xs text-text-muted border border-border px-3 py-2">
          pool loading...
        </p>
      )}

      {/* You pay */}
      <div className="border border-border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">you pay</span>
          {fromBal != null && (
            <button
              onClick={() => {
                const maxVal = direction === 'buy' && ethBalance?.value
                  ? ethBalance.value > parseEther('0.001')
                    ? ethBalance.value - parseEther('0.001')
                    : 0n
                  : (fromBal ?? 0n)
                setInputAmount(fmt(maxVal))
                setEditedField('input')
              }}
              className="font-mono text-xs text-text-muted hover:text-text transition-colors"
            >
              max: {fmt(fromBal)} {fromSymbol}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <input
            type="number"
            placeholder="0.00"
            value={inputAmount}
            onChange={e => { setInputAmount(e.target.value); setEditedField('input'); setError(null) }}
            className="bg-transparent text-2xl font-mono w-full outline-none placeholder:text-text-muted/40"
          />
          <span className="font-mono text-sm text-text-muted whitespace-nowrap">{fromSymbol}</span>
        </div>
      </div>

      {/* Flip */}
      <div className="flex justify-center">
        <button onClick={handleFlip} className="font-mono text-text-muted hover:text-text transition-colors text-lg leading-none">⇅</button>
      </div>

      {/* You receive */}
      <div className="border border-indigo/40 p-4 space-y-2 bg-indigo/5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">you receive</span>
          {lpFee != null && <span className="font-mono text-xs text-text-muted">{(lpFee * 100).toFixed(1)}% fee</span>}
        </div>
        <div className="flex items-center justify-between gap-4">
          <input
            type="number"
            placeholder="0.00"
            value={outputAmount}
            onChange={e => { setOutputAmount(e.target.value); setEditedField('output'); setError(null) }}
            className="bg-transparent text-2xl font-mono w-full outline-none placeholder:text-text-muted/40"
          />
          <span className="font-mono text-sm text-indigo whitespace-nowrap">{toSymbol}</span>
        </div>
      </div>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
      {isConfirmed && <p className="font-mono text-xs text-green-400">swap confirmed ✓</p>}

      {/* Action */}
      {!isConnected ? (
        <div className="[&>div]:w-full [&>div>button]:w-full [&>div>button]:font-mono [&>div>button]:text-sm [&>div>button]:uppercase [&>div>button]:tracking-wider [&>div>button]:border [&>div>button]:border-indigo [&>div>button]:text-indigo [&>div>button]:py-3 [&>div>button]:bg-transparent [&>div>button:hover]:bg-indigo [&>div>button:hover]:text-white [&>div>button]:transition-all [&>div>button]:rounded-none">
          <ConnectButton label="connect wallet to swap" />
        </div>
      ) : onWrongNetwork ? (
        <button
          onClick={() => switchChain({ chainId: base.id })}
          className="w-full border border-yellow-500 text-yellow-500 font-mono text-sm py-3 uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-all"
        >
          switch to Base
        </button>
      ) : (
        <button
          onClick={handleSwap}
          disabled={busy || !poolReady || !inputAmount || insufficient}
          className="w-full border border-indigo text-indigo font-mono text-sm py-3 uppercase tracking-wider hover:bg-indigo hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy
            ? (isConfirming ? 'confirming...' : 'swapping...')
            : insufficient
              ? 'insufficient balance'
              : `swap ${fromSymbol} → ${toSymbol}`}
        </button>
      )}

      <p className="text-center font-mono text-xs text-text-muted">
        powered by Uniswap V4 · on Base
      </p>
    </div>
  )
}
