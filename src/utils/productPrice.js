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
  if (min > 0 && max > min) {
    return { current: `${formatPrice(min)} - ${formatPrice(max)}`, original: null };
  }
  return { current: formatPrice(min || max || 0), original: null };
};
