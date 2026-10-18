export function normalizeProductForCart(product, selectedVariation, selectedColor, quantity = 1) {
  if (!product) return null;

    const price = selectedVariation?.price ?? 
                product.discount_price ??
                product.price?.final ??
                product.price?.offer ??
                product.price?.regular ??
                product.original_price ??
                product.price ??
                0;

  const numericPrice = Number(price) || 0;

  return {
    id: product.id || product.product_id,
    product_id: product.id || product.product_id,
    product_slug: product.product_slug || product.slug || "",
    product_name: product.product_name || product.name || "Unknown Product",
    image: product.thumb_image || product.image || product.thumbnail || "/images/motorola.png",
    variation_id: selectedVariation?.id || null,
    size_id: selectedVariation?.size_id || null,
    variation_size_id: selectedVariation?.size_id || null, // backend match
    variation_size: selectedVariation?.size || null,
    color_id: selectedColor?.color_id || selectedColor?.id || null, // backend match
    color_name: selectedColor?.name || null,
    quantity: quantity,
    discount_price: numericPrice,
    unit_price: numericPrice,
    totalPrice: numericPrice,
  };
}