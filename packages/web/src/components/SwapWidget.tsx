'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPublicClient, http, formatUnits } from 'viem'
import { base } from 'viem/chains'

const SAIMMY = '0xaE58EbfBE35D4F4a320DFB550fE4d27c0d2A7ba3'
const POOL_ID = '0xd4a90dfc9938ff1a5675e8f16e24855843fb399d7331cc77d19a62c68c08e46c' as `0x${string}`
const STATE_VIEW = '0xa3c0c9b65bad0b08107aa264b0f3db444b867a71' as const

const UNISWAP_URL = `https://app.uniswap.org/swap?chain=base&outputCurrency=${SAIMMY}&inputCurrency=ETH`
const DOPPLER_URL = `https://app.doppler.lol/tokens/base/${SAIMMY}`

const publicClient = createPublicClient({ chain: base, transport: http() })

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

export function SwapWidget() {
  const [priceStr, setPriceStr] = useState<string | null>(null)
  const [feeStr, setFeeStr] = useState<string | null>(null)

  const fetchPool = useCallback(async () => {
    try {
      const slot0Result = await publicClient.readContract({
        address: STATE_VIEW, abi: stateViewAbi,
        functionName: 'getSlot0', args: [POOL_ID],
      }) as [bigint, number, number, number]

      const [sqrtPriceX96, , , fee] = slot0Result
      if (sqrtPriceX96 === 0n) return

      setFeeStr(`${(fee / 1_000_000 * 100).toFixed(1)}%`)

      const Q96 = 2n ** 96n
      const saimmyPerEth = (sqrtPriceX96 * sqrtPriceX96 * 10n ** 18n) / (Q96 * Q96)
      const n = parseFloat(formatUnits(saimmyPerEth, 18))
      if (n >= 1_000_000) setPriceStr(`${(n / 1_000_000).toFixed(1)}M`)
      else if (n >= 1_000) setPriceStr(`${(n / 1_000).toFixed(1)}K`)
      else setPriceStr(n.toFixed(2))
    } catch {}
  }, [])

  useEffect(() => {
    fetchPool()
    const id = setInterval(fetchPool, 15_000)
    return () => clearInterval(id)
  }, [fetchPool])

  return (
    <div className="border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted uppercase tracking-widest">swap</span>
        <div className="flex items-center gap-3">
          {priceStr && (
            <span className="font-mono text-xs text-text-muted">
              1 ETH ≈ {priceStr} $SAIMMY{feeStr ? ` · ${feeStr} fee` : ''}
            </span>
          )}
          <span className="font-mono text-xs text-text-muted border border-border px-2 py-0.5">Base</span>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={UNISWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-indigo text-indigo font-mono text-sm py-3 uppercase tracking-wider hover:bg-indigo hover:text-white transition-all text-center"
        >
          swap on Uniswap
        </a>
        <a
          href={DOPPLER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-border text-text-muted font-mono text-sm py-3 uppercase tracking-wider hover:border-indigo hover:text-indigo transition-all text-center"
        >
          swap on Doppler
        </a>
      </div>

      <p className="text-center font-mono text-xs text-text-muted">
        Uniswap V4 · on Base
      </p>
    </div>
  )
}
