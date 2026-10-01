/**
 * Formats a numeric amount in Indian Rupees (INR - ₹)
 * Uses standard Indian numbering system (e.g. ₹1,299, ₹14,500)
 */
export function formatINR(amount: number, showDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const rounded = showDecimals ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = rounded.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian currency numbering regex: last 3 digits, then groups of 2
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return showDecimals && decimalPart
    ? `₹${integerPart}.${decimalPart}`
    : `₹${integerPart}`;
}

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';
