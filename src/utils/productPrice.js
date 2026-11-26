export const formatPrice = (value) => `৳${Number(value).toLocaleString('en-US')}`;

// Offer থাকলে offer price + কাটা মূল দাম, না থাকলে variable প্রডাক্টের min–max রেঞ্জ দেখাবে
export const getPriceInfo = (product) => {
  const offer = Number(product.offer_price);
  const regular = Number(product.price);

  if (offer > 0 && regular > 0) {
    return { current: formatPrice(offer), original: formatPrice(regular) };
  }
  if (regular > 0) {
    return { current: formatPrice(regular), original: null };
  }

  const min = Number(product.min_price);
  const max = Number(product.max_price);

  // variable প্রডাক্টে discount থাকলে (flash sale) কাটা মূল দামের রেঞ্জও দেখাবে
  const regularMin = Number(product.regular_min_price);
  const regularMax = Number(product.regular_max_price);
  const original =
    min > 0 && regularMin > min
      ? regularMax > regularMin
        ? `${formatPrice(regularMin)} - ${formatPrice(regularMax)}`
        : formatPrice(regularMin)
      : null;

  if (min > 0 && max > min) {
    return { current: `${formatPrice(min)} - ${formatPrice(max)}`, original };
  }
  return { current: formatPrice(min || max || 0), original };
};
