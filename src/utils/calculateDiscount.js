/**
 * Calculates the discounted price given an original price and discount percentage.
 * 
 * @param {number} price - Original product price
 * @param {number} discountPercentage - Discount percentage (e.g. 20 for 20%)
 * @returns {number} - Calculated discounted price rounded to nearest integer
 */
export function calculateDiscountedPrice(price, discountPercentage) {
  const discount = Number(discountPercentage);

  if (
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isFinite(discount) ||
    discount <= 0 ||
    discount > 100
  ) {
    return price;
  }

  return Math.round(price * (1 - discount / 100));
}

/**
 * Checks if a discount is valid and greater than zero.
 */
export function hasValidDiscount(price, discountPercentage) {
  const discount = Number(discountPercentage);
  return (
    Number.isFinite(price) &&
    price > 0 &&
    Number.isFinite(discount) &&
    discount > 0 &&
    discount <= 100
  );
}

/**
 * Calculates total savings between original and discounted price.
 */
export function calculateSavings(price, discountPercentage) {
  if (!hasValidDiscount(price, discountPercentage)) return 0;
  return Math.round(price - calculateDiscountedPrice(price, discountPercentage));
}
