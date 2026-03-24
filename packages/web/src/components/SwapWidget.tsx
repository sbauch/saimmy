"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useBalance,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther, parseAbi } from "viem";
import { formatToken, formatBalance, formatSwapAmount } from "@/lib/format";

const SAIMMY = "0xaE58EbfBE35D4F4a320DFB550fE4d27c0d2A7ba3" as const;
const SWAPPER = "0x2256E668509cAAc99174ad5f174eB4d132268db9" as const;

const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
]);

const SWAPPER_ABI = parseAbi([
  "function sell(uint256 saimmyAmount) returns (uint256 ethOut)",
  "function buy() payable returns (uint256 saimmyOut)",
  "function getPrice() view returns (uint256)",
  "function poolInitialized() view returns (bool)",
]);

const LP_FEE_BPS = 120; // 1.2%

const formatBal = (val: bigint | undefined) => {
  if (val === undefined) return "...";
  return formatBalance(val);
};

export function SwapWidget() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const publicClient = usePublicClient();

  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [editedField, setEditedField] = useState<"input" | "output">("input");
  const [priceWei, setPriceWei] = useState<bigint | null>(null);
  const [poolReady, setPoolReady] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Balances
  const { data: ethBalance, refetch: refetchEth } = useBalance({ address });
  const { data: tokenReads, refetch: refetchTokens } = useReadContracts({
    contracts: address ? [
      { address: SAIMMY, abi: ERC20_ABI, functionName: "balanceOf", args: [address] },
      { address: SAIMMY, abi: ERC20_ABI, functionName: "allowance", args: [address, SWAPPER] },
    ] : [],
  });
  const saimmyBalance = tokenReads?.[0]?.result as bigint | undefined;
  const allowance = tokenReads?.[1]?.result as bigint | undefined;

  // Fetch price from SaimmySwapper.getPrice()
  const fetchPrice = useCallback(async () => {
    if (!publicClient) return;
    try {
      const [initialized, price] = await Promise.all([
        publicClient.readContract({ address: SWAPPER, abi: SWAPPER_ABI, functionName: "poolInitialized" }),
        publicClient.readContract({ address: SWAPPER, abi: SWAPPER_ABI, functionName: "getPrice" }).catch(() => null),
      ]);
      setPoolReady(initialized as boolean);
      if (price) setPriceWei(price as bigint);
    } catch { setPoolReady(false); }
  }, [publicClient]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 15_000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  // Tx confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (isConfirmed) {
      refetchEth(); refetchTokens(); fetchPrice();
      setInputAmount(""); setOutputAmount("");
      setTxHash(undefined);
    }
  }, [isConfirmed, refetchEth, refetchTokens, fetchPrice]);

  // Forward estimate: input → output
  useEffect(() => {
    if (editedField !== "input" || !priceWei) return;
    if (!inputAmount || parseFloat(inputAmount) <= 0) { setOutputAmount(""); return; }
    try {
      const feeMultiplier = 1 - LP_FEE_BPS / 10000;
      const pricePerSaimmy = parseFloat(formatEther(priceWei));
      if (direction === "buy") {
        const saimmyOut = (parseFloat(inputAmount) / pricePerSaimmy) * feeMultiplier;
        setOutputAmount(saimmyOut.toString());
      } else {
        const ethOut = parseFloat(inputAmount) * pricePerSaimmy * feeMultiplier;
        setOutputAmount(ethOut.toString());
      }
    } catch { setOutputAmount(""); }
  }, [inputAmount, priceWei, direction, editedField]);

  // Reverse estimate: output → input
  useEffect(() => {
    if (editedField !== "output" || !priceWei) return;
    if (!outputAmount || parseFloat(outputAmount) <= 0) { setInputAmount(""); return; }
    try {
      const feeMultiplier = 1 / (1 - LP_FEE_BPS / 10000);
      const pricePerSaimmy = parseFloat(formatEther(priceWei));
      if (direction === "buy") {
        const ethNeeded = parseFloat(outputAmount) * pricePerSaimmy * feeMultiplier;
        setInputAmount(ethNeeded.toString());
      } else {
        const saimmyNeeded = (parseFloat(outputAmount) / pricePerSaimmy) * feeMultiplier;
        setInputAmount(saimmyNeeded.toString());
      }
    } catch { setInputAmount(""); }
  }, [outputAmount, priceWei, direction, editedField]);

  const fromToken = direction === "buy" ? "ETH" : "SAIMMY";
  const toToken = direction === "buy" ? "SAIMMY" : "ETH";
  const fromBalance = direction === "buy" ? ethBalance?.value : saimmyBalance;
  const toBalance = direction === "buy" ? saimmyBalance : ethBalance?.value;
  const inputWei = (() => { try { return inputAmount ? parseEther(inputAmount) : 0n; } catch { return 0n; } })();
  const insufficientBalance = inputWei > 0n && inputWei > (fromBalance ?? 0n);
  const needsApproval = direction === "sell" && allowance !== undefined && inputWei > 0n && allowance < inputWei;
  const busy = isSwapping || isConfirming;

  const handleFlip = () => {
    const prevOutput = outputAmount;
    setDirection(d => d === "buy" ? "sell" : "buy");
    setInputAmount(prevOutput);
    setOutputAmount("");
    setEditedField("input");
    setError(null);
  };

  const handleMax = () => {
    setEditedField("input");
    if (direction === "buy" && ethBalance) {
      const max = parseFloat(formatEther(ethBalance.value)) * 0.95;
      setInputAmount(max > 0 ? max.toString() : "");
    } else if (direction === "sell" && saimmyBalance) {
      setInputAmount(formatEther(saimmyBalance));
    }
  };

  const handleSwap = async () => {
    if (!address || !publicClient) return;
    setIsSwapping(true);
    setError(null);
    try {
      if (needsApproval) {
        const approveHash = await writeContractAsync({
          address: SAIMMY, abi: ERC20_ABI, functionName: "approve", args: [SWAPPER, inputWei],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        refetchTokens();
      }

      let hash: `0x${string}`;
      if (direction === "buy") {
        hash = await writeContractAsync({
          address: SWAPPER, abi: SWAPPER_ABI, functionName: "buy", value: inputWei,
        });
      } else {
        hash = await writeContractAsync({
          address: SWAPPER, abi: SWAPPER_ABI, functionName: "sell", args: [inputWei],
        });
      }
      setTxHash(hash);
    } catch (err: any) {
      const msg = err?.shortMessage || err?.message || "";
      if (/user rejected|denied/i.test(msg)) {
        setError("Transaction rejected");
      } else {
        setError(msg || "Swap failed");
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const priceDisplay = priceWei
    ? `1 SAIMMY ≈ ${formatToken(parseFloat(formatEther(priceWei)))} ETH`
    : null;

  return (
    <div className="border border-border-accent rounded-xl bg-bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted uppercase tracking-widest">swap</span>
        {priceDisplay && <span className="font-mono text-[10px] text-text-muted">{priceDisplay}</span>}
      </div>

      {!poolReady && (
        <div className="mb-3 border border-border bg-bg-hover p-3 font-mono text-sm text-text-muted">
          Pool not initialized yet.
        </div>
      )}

      {/* From */}
      <div className="border border-border rounded-lg bg-bg-hover p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">You pay</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-text-muted">{formatBal(fromBalance)} {fromToken}</span>
            <button onClick={handleMax} className="font-mono text-[10px] font-semibold text-accent hover:text-accent-hover uppercase transition-colors">Max</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="0.0"
            value={editedField === "input" ? inputAmount : (inputAmount ? formatSwapAmount(parseFloat(inputAmount)) : "")}
            onChange={e => { setInputAmount(e.target.value); setEditedField("input"); setError(null); }}
            onFocus={() => setEditedField("input")}
            className="flex-1 bg-transparent font-mono text-xl text-text outline-none placeholder:text-text-muted/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="font-mono text-sm font-bold text-text-muted">{fromToken}</span>
        </div>
      </div>

      {/* Flip */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleFlip}
          className="border border-border rounded-full bg-bg-card p-2 transition-transform hover:rotate-180 hover:border-accent-purple"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted">
            <path d="M4 6l4-4 4 4" /><path d="M4 10l4 4 4-4" />
          </svg>
        </button>
      </div>

      {/* To */}
      <div className="border border-border rounded-lg bg-bg-hover p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">You receive</span>
          <span className="font-mono text-[10px] text-text-muted">{formatBal(toBalance)} {toToken}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="0.0"
            value={editedField === "output" ? outputAmount : (outputAmount ? formatSwapAmount(parseFloat(outputAmount)) : "")}
            onChange={e => { setOutputAmount(e.target.value); setEditedField("output"); setError(null); }}
            onFocus={() => setEditedField("output")}
            className="flex-1 bg-transparent font-mono text-xl text-text outline-none placeholder:text-text-muted/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="font-mono text-sm font-bold text-text-muted">{toToken}</span>
        </div>
      </div>

      {inputAmount && outputAmount && (
        <p className="mt-2 text-center font-mono text-[10px] text-text-muted">
          Estimate includes 1.2% pool fee. Actual output may differ.
        </p>
      )}

      {error && (
        <div className="mt-3 border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
          {error}
        </div>
      )}
      {insufficientBalance && !error && (
        <div className="mt-3 border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
          Insufficient {fromToken} balance
        </div>
      )}
      {isConfirmed && txHash && (
        <div className="mt-3 border border-green bg-green/10 px-3 py-2 font-mono text-sm text-green">
          Swap successful!{" "}
          <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-70">View tx</a>
        </div>
      )}

      {!address ? (
        <button
          onClick={openConnectModal}
          className="mt-4 w-full border border-accent bg-accent rounded py-3 font-mono text-sm font-bold uppercase tracking-wider text-bg transition-all hover:bg-accent-hover"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleSwap}
          disabled={!poolReady || !inputAmount || parseFloat(inputAmount) <= 0 || insufficientBalance || busy}
          className="mt-4 w-full border border-accent bg-accent rounded py-3 font-mono text-sm font-bold uppercase tracking-wider text-bg transition-all hover:bg-accent-hover disabled:opacity-40 disabled:border-border disabled:bg-transparent disabled:text-text-muted"
        >
          {busy
            ? (isConfirming ? "Confirming..." : needsApproval ? "Approving..." : "Swapping...")
            : !inputAmount || parseFloat(inputAmount) <= 0
              ? "Enter amount"
              : insufficientBalance
                ? `Insufficient ${fromToken}`
                : needsApproval
                  ? "Approve & Swap"
                  : `Swap ${fromToken} → ${toToken}`}
        </button>
      )}

      <p className="mt-2 text-center font-mono text-[10px] text-text-muted">
        Uniswap V4 · SAIMMY/WETH · Base
      </p>
    </div>
  );
}
