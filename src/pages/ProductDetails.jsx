import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductDetailsBySlug } from "../services/api";
import Loader from "../loader/Loader";

import { Eye, Phone, MessageSquare, X } from 'lucide-react';
import { useDispatch } from "react-redux"; 
import { normalizeProductForCart } from "../utils/cartAdapter";
import { addItem } from "../cart/cartSlice";
import CartPopup from "../components/CartPopup";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [cartPopup, setCartPopup] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Modal States
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Custom Size Form State
  const [customMeasurement, setCustomMeasurement] = useState({
    length: "",
    body: "",
    color: "",
    quantity: "",
    sleeve: "",
    orderType: "Full Set",
    note: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductDetailsBySlug(slug);

        if (!res?.product?.id) throw new Error("Product not found");

        const prd = res.product;
        setProduct(prd);
        setRelatedProducts(res.related_products || []);

        // Initial default selections
        setSelectedImage(prd.thumbnail || "/images/motorola.png");

        const defaultColor = prd.colors?.[0] || null;
        const defaultSize = prd.size_chart?.[0] || null;

        setSelectedColor(defaultColor);
        setSelectedSize(defaultSize);

        // Find initial matching variant
        if (prd.variants?.length > 0) {
          const initialVariant = findMatchingVariant(
            prd.variants,
            defaultColor?.name,
            defaultSize?.size
          ) || prd.variants[0];

          setSelectedVariant(initialVariant);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Helper function to match color & size to a specific variant
  const findMatchingVariant = (variants, colorName, sizeName) => {
    if (!variants || variants.length === 0) return null;
    return variants.find(
      (v) =>
        (!colorName || v.color?.toLowerCase() === colorName?.toLowerCase()) &&
        (!sizeName || v.size?.toLowerCase() === sizeName?.toLowerCase())
    );
  };

  // Handle Color Selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }

    if (product?.variants) {
      const matched = findMatchingVariant(
        product.variants,
        color.name,
        selectedSize?.size
      );
      setSelectedVariant(matched || null);
    }
  };

  // Handle Size Selection
  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj);

    if (product?.variants) {
      const matched = findMatchingVariant(
        product.variants,
        selectedColor?.name,
        sizeObj.size
      );
      setSelectedVariant(matched || null);
    }
  };

  if (loading) return <Loader type="productdetails" />;

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">
        Product not found.
      </div>
    );
  }

  // Calculated Price based on Selected Variant or Main Product Price
  const finalPrice =
    selectedVariant?.price ??
    product.price?.offer ??
    product.price?.final ??
    0;

  // Dynamic In Stock Status
  const isAvailableInStock = selectedVariant
    ? selectedVariant.in_stock && selectedVariant.quantity > 0
    : product.stock?.in_stock;

  const handleAddToCart = (quantity = 1) => {
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color!");
      return;
    }

    if (product.size_chart?.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Selected variation is out of stock or unavailable!");
      return;
    }

    const normalizedProduct = normalizeProductForCart(
      product,
      selectedVariant,
      selectedColor,
      quantity
    );

    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: selectedImage || product.thumbnail || "/images/motorola.png",
      price: Number(finalPrice),
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  };

  const handleBuyNow = (quantity = 1) => {
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color!");
      return;
    }

    if (product.size_chart?.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Selected variation is out of stock or unavailable!");
      return;
    }

    const item = normalizeProductForCart(
      product,
      selectedVariant,
      selectedColor,
      quantity
    );

    navigate("/checkout", {
      state: { item },
    });
  };

  const handleCustomMeasurementChange = (e) => {
    const { name, value } = e.target;
    setCustomMeasurement(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomMeasurementSubmit = (e) => {
    e.preventDefault();
    handleAddToCart(Number(customMeasurement.quantity) || 1);
    setIsCustomSizeOpen(false);
  };

  const discountPercentage = product.price?.regular && finalPrice < product.price.regular
    ? Math.round(((product.price.regular - finalPrice) / product.price.regular) * 100)
    : null;

  return (
    <div className="bg-white min-h-screen py-16 px-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white border border-gray-100 p-4 sm:p-6 shadow-sm rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDE - Product Gallery & Main Image */}
          <div className="lg:col-span-5 flex gap-3">
            {/* Thumbnails list */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] scrollbar-thin">
              {[product.thumbnail, ...(product.gallery?.map((g) => g.url) || [])].map(
                (img, index) =>
                  img && (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-16 border rounded cursor-pointer object-cover transition ${
                        selectedImage === img
                          ? "border-black ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    />
                  )
              )}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative border rounded overflow-hidden">
              {discountPercentage && (
                <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
                  {discountPercentage}% Off
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto max-h-[450px] object-contain mx-auto"
              />
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCT DETAILS */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              {/* SKU & Brand */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                {(selectedVariant?.sku || product.sku) && (
                  <span>SKU: <strong className="text-gray-700">{selectedVariant?.sku || product.sku}</strong></span>
                )}
                <span>Brand: <strong className="text-gray-700">{product.brand?.name || "No Brand"}</strong></span>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{Number(finalPrice).toLocaleString()}
                </span>
                {product.price?.regular && (
                  <span className="line-through text-gray-400 text-sm">
                    ₹{Number(product.price.regular).toLocaleString()}
                  </span>
                )}
                {discountPercentage && (
                  <span className="bg-pink-100 text-pink-600 text-xs font-bold px-1.5 py-0.5 rounded">
                    {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Available Sizes & Size Controls */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm font-semibold text-gray-700">Available Sizes</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomSizeOpen(true)}
                      className="text-xs font-semibold text-gray-700 border border-gray-400 px-2.5 py-1 rounded hover:bg-gray-50 transition"
                    >
                      Custom Size
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs font-semibold text-red-500 underline hover:text-red-600 transition"
                    >
                      Size Chart
                    </button>
                  </div>
                </div>

                {product.size_chart?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.size_chart.map((sizeObj) => {
                      const isSelected = selectedSize?.size_id === sizeObj.size_id;
                      return (
                        <button
                          key={sizeObj.size_id}
                          onClick={() => handleSizeSelect(sizeObj)}
                          className={`w-9 h-9 border rounded flex items-center justify-center text-xs uppercase font-medium transition ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {sizeObj.size}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="space-y-2 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Colors</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor?.color_id === color.color_id;
                      return (
                        <button
                          key={color.id}
                          onClick={() => handleColorSelect(color)}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            isSelected
                              ? "ring-2 ring-blue-500 ring-offset-1 border-white"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.code || color.name }}
                          title={color.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact / Action Links */}
              <div className="space-y-2 max-w-md mb-4">
                <a
                  href="tel:8809613820026"
                  className="w-full bg-[#1e88e5] text-white py-2 px-4 rounded text-xs font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                >
                  <Phone size={14} />
                  কল করতে ক্লিক করুন : 8809613820026
                </a>
              </div>

              {/* Delivery info */}
              <div className="mb-6">
                <span className="text-base font-bold text-gray-900">
                  Delivery Type – Cash On Delivery
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap gap-3 max-w-md">
                <button
                  disabled={!isAvailableInStock}
                  onClick={() => handleBuyNow(1)}
                  className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded text-white text-center transition ${
                    isAvailableInStock
                      ? "bg-[#00a0e9] hover:bg-sky-600 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  disabled={!isAvailableInStock}
                  onClick={() => handleAddToCart(1)}
                  className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded text-white text-center transition ${
                    isAvailableInStock
                      ? "bg-[#ff6f00] hover:bg-orange-600 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => window.open(`https://wa.me/8809613820026?text=Interested%20in%20${encodeURIComponent(product.name)}`, '_blank')}
                  className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  Order by Whatsapp <MessageSquare size={14} className="text-green-500" />
                </button>
              </div>

              {/* Details & Exchange Navigation Tabs */}
              <div className="flex gap-6 border-t border-gray-200 pt-4 mt-6">
                <a href="#product-details" className="text-sm font-bold text-gray-900 border-b-2 border-black pb-1">
                  Product Details
                </a>
                <a href="#exchange-guidelines" className="text-sm font-bold text-gray-900 border-b-2 border-transparent pb-1 hover:border-gray-400">
                  Exchange Guidelines
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div id="product-details" className="max-w-6xl mx-auto bg-white p-6 shadow-sm rounded-md mt-6 border border-gray-100">
        <h3 className="font-bold text-lg mb-3">Product Details</h3>
        <div
          className="text-gray-600 leading-relaxed text-sm"
          dangerouslySetInnerHTML={{
            __html: product.description || product.short_description || "No product description available.",
          }}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10">
          <h3 className="text-center font-bold text-xl mb-6">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="bg-white border border-gray-200 rounded hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden group"
              >
                <Link to={`/product-details/${rp.slug}`}>
                  <div className="relative">
                    <img
                      src={rp.thumbnail || "/images/motorola.png"}
                      alt={rp.name}
                      className="w-full aspect-square object-cover"
                    />
                    <button className="hidden md:flex absolute bottom-0 left-0 right-0 bg-[#e62e04] text-white text-[10px] font-semibold py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 items-center justify-center gap-1">
                      <Eye size={14} /> View Details
                    </button>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-gray-700 leading-tight line-clamp-2 mb-1 min-h-[2.5em]">
                      {rp.name}
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-900 font-bold text-sm">
                        ₹{Number(rp.price?.final || rp.price?.offer || 0).toLocaleString()}
                      </span>
                      {rp.price?.regular && (
                        <span className="text-gray-400 text-[10px] line-through">
                          ₹{Number(rp.price.regular).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM SIZE MODAL (Exact match to image design) */}
      {isCustomSizeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-xl">
            <button
              onClick={() => setIsCustomSizeOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-sm font-semibold text-gray-700 mb-6">
              Please give your measurement :
            </h3>

            <form onSubmit={handleCustomMeasurementSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Length:</label>
                  <input
                    type="text"
                    name="length"
                    value={customMeasurement.length}
                    onChange={handleCustomMeasurementChange}
                    className="w-full bg-[#4a7ec4] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Body:</label>
                  <input
                    type="text"
                    name="body"
                    value={customMeasurement.body}
                    onChange={handleCustomMeasurementChange}
                    className="w-full bg-[#4a7ec4] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color:</label>
                  <input
                    type="text"
                    name="color"
                    value={customMeasurement.color}
                    onChange={handleCustomMeasurementChange}
                    className="w-full bg-[#4a7ec4] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantity:</label>
                  <input
                    type="text"
                    name="quantity"
                    value={customMeasurement.quantity}
                    onChange={handleCustomMeasurementChange}
                    className="w-full bg-[#4a7ec4] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sleeve</label>
                  <input
                    type="text"
                    name="sleeve"
                    value={customMeasurement.sleeve}
                    onChange={handleCustomMeasurementChange}
                    className="w-full bg-[#4a7ec4] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order Type:</label>
                <select
                  name="orderType"
                  value={customMeasurement.orderType}
                  onChange={handleCustomMeasurementChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 bg-white focus:outline-none"
                >
                  <option value="Full Set">Full Set</option>
                  <option value="Top Only">Top Only</option>
                  <option value="Bottom Only">Bottom Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Note:</label>
                <textarea
                  name="note"
                  rows={3}
                  value={customMeasurement.note}
                  onChange={handleCustomMeasurementChange}
                  className="w-full border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-gray-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4a148c] hover:bg-[#380e6b] text-white font-semibold py-2.5 rounded text-xs uppercase tracking-wider transition"
              >
                ADD TO CART
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SIZE CHART MODAL */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative shadow-xl">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-base font-bold text-gray-800 mb-4">
              Available Size Guide
            </h3>

            {product.size_chart?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-600 border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-2 border-b">Size</th>
                      <th className="px-4 py-2 border-b">Chest / Waist</th>
                      <th className="px-4 py-2 border-b">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.size_chart.map((s, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold uppercase">{s.size}</td>
                        <td className="px-4 py-2">{s.chest || s.waist || "Standard"}</td>
                        <td className="px-4 py-2">{s.length || "Standard"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Standard sizes: S, M, L, XL, XXL</p>
            )}
          </div>
        </div>
      )}

      <CartPopup popup={cartPopup} onClose={() => setCartPopup(null)} />
    </div>
  );
}