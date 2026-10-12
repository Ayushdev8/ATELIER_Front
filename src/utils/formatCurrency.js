/**
 * Formats a numeric price into a currency string (default USD format with $).
 * 
 * @param {number} amount - The amount to format
 * @param {string} symbol - Currency symbol, defaults to '$'
 * @returns {string} - Formatted currency string, e.g. '$2,499'
 */
export function formatCurrency(amount, symbol = '$') {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return `${symbol}0`;
  }
  const numeric = Number(amount);
  return `${symbol}${numeric.toLocaleString('en-US', {
    minimumFractionDigits: numeric % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
