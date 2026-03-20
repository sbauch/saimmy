/**
 * Format token amounts for display.
 *
 * - Large numbers: thousands separators (1,234,567)
 * - Small numbers: subscript zeros (0.0₉32 instead of 0.000000000932)
 * - No scientific notation ever
 * - Configurable significant digits
 */

const SUBSCRIPT_DIGITS: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
};

/**
 * Format a number for display in a swap/balance context.
 *
 * @param value - The number to format
 * @param opts.significantDigits - How many significant digits to show (default 4)
 * @param opts.subscriptZeros - Use subscript notation for leading zeros after decimal (default true)
 * @param opts.locale - Locale for thousands separators (default user locale)
 */
export function formatToken(
  value: number | string,
  opts: { significantDigits?: number; subscriptZeros?: boolean } = {}
): string {
  const { significantDigits = 4, subscriptZeros = true } = opts;

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "0";

  // Large numbers: use locale formatting
  if (Math.abs(num) >= 1) {
    if (Math.abs(num) >= 1_000_000) {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
    }
    if (Math.abs(num) >= 1_000) {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    }
    // 1-999: show significant digits
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: Math.max(2, significantDigits),
    });
  }

  // Small numbers (< 1): count leading zeros after decimal
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Convert to string without scientific notation
  let str = abs.toFixed(20); // enough precision
  const dotIdx = str.indexOf(".");
  if (dotIdx === -1) return sign + str;

  const decimals = str.slice(dotIdx + 1);

  // Count leading zeros
  let leadingZeros = 0;
  for (const ch of decimals) {
    if (ch === "0") leadingZeros++;
    else break;
  }

  // If few leading zeros (≤ 3), just show normally
  if (leadingZeros <= 3) {
    const maxDp = leadingZeros + significantDigits;
    return sign + abs.toLocaleString(undefined, {
      minimumFractionDigits: Math.min(maxDp, 2),
      maximumFractionDigits: maxDp,
    });
  }

  // Many leading zeros: use subscript notation
  // 0.000000000932 → 0.0₉32
  if (!subscriptZeros) {
    const maxDp = leadingZeros + significantDigits;
    return sign + abs.toFixed(maxDp);
  }

  const significantPart = decimals.slice(leadingZeros, leadingZeros + significantDigits);
  const subscriptCount = leadingZeros.toString().split("").map(d => SUBSCRIPT_DIGITS[d] || d).join("");

  return `${sign}0.0${subscriptCount}${significantPart}`;
}

/**
 * Format a bigint token balance for display.
 * @param val - Balance in wei (18 decimals)
 * @param decimals - Token decimals (default 18)
 */
export function formatBalance(val: bigint | undefined, decimals = 18): string {
  if (val === undefined || val === 0n) return "0";
  const num = Number(val) / 10 ** decimals;
  return formatToken(num, { significantDigits: 4 });
}

/**
 * Format a swap output amount (more precision).
 */
export function formatSwapAmount(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "";

  // Large SAIMMY amounts: no decimals
  if (Math.abs(num) >= 1000) {
    return Math.round(num).toLocaleString();
  }

  return formatToken(num, { significantDigits: 4 });
}
