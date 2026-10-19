// Product (details পেজের nested শেপ বা card-এর flat শেপ) থেকে cartSlice.addItem-এর payload বানায়
export function normalizeProductForCart(
  product,
  selectedVariant = null,
  selectedColor = null,
  quantity = 1,
  selectedSize = null
) {
  if (!product) return null;

  const priceObj = product.price && typeof product.price === "object" ? product.price : null;

  // size/color আলাদা না পাঠালে variant থেকে নেয়
  const size =
    selectedSize ||
    (selectedVariant?.size
      ? { size_id: selectedVariant.size_id, size: selectedVariant.size }
      : null);

  return {
    id: product.id || product.product_id,
    name: product.name || product.product_name || "Unknown Product",
    slug: product.slug || product.product_slug || "",
    thumb_image: product.thumb_image || product.thumbnail || null,
    image: product.image || "",
    brand: product.brand,
    brand_name: product.brand_name,
    quantity,

    has_variants: Boolean(product.variants?.length > 0 || selectedVariant),
    variant_id: selectedVariant?.id || 0,
    selectedSize: size ? { id: size.size_id ?? size.id, name: size.size ?? size.name } : null,
    selectedColor: selectedColor
      ? { id: selectedColor.color_id ?? selectedColor.id, name: selectedColor.name }
      : null,

    selected_price: selectedVariant?.price ?? null,
    offer_price: priceObj ? priceObj.offer ?? priceObj.final ?? null : null,
    price: priceObj ? priceObj.regular ?? null : product.discount_price ?? product.price ?? null,
    min_price: product.min_price ?? null,
  };
}
