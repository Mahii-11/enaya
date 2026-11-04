// পুরোনো API-র প্রোডাক্ট (product_slug, product_type, price...) কে শেয়ার্ড ProductCard-এর শেপে বদলায়
export const toCardProduct = (p) => ({
  ...p,
  id: p.product_id || p.id,
  slug: p.product_slug || p.slug,
  type: p.product_type || p.type,
});
