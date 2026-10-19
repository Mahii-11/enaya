import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ShoppingBag,
  ShoppingCart,
  Play,
  CheckCircle,
  RotateCcw,
  ShieldCheck,
  Truck,
  Timer,
  Minus,
  Plus,
  Ruler,
  X,
} from 'lucide-react';
import { getProductDetails } from '../services/api';
import { addItem, createCartLine, openCartPopup } from '../cart/cartSlice';
import { formatPrice, getPriceInfo } from '../utils/productPrice';
import useProductCardCart from '../hooks/useProductCardCart';
import ProductCard from '../components/ProductCard';
import SelectOptionsPopup from '../components/SelectOptionsPopup';
import ProductDetailsSkeleton from '../loader/ProductDetailsSkeleton';

const WHATSAPP_NUMBER = '8809613820026';

const getYouTubeThumb = (embedUrl) => {
  const id = embedUrl?.match(/embed\/([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
};

const sameId = (a, b) => String(a) === String(b);

// গ্যালারি আইটেম string বা {url|image|path} যেকোনোটা হতে পারে
const toImageUrl = (g) => (typeof g === 'string' ? g : g?.url || g?.image || g?.path || null);

/* ---------------- Flash sale countdown ---------------- */
function FlashSaleStrip({ flashSale }) {
  const end = useMemo(
    () => new Date(String(flashSale.end_time).replace(' ', 'T')).getTime(),
    [flashSale.end_time]
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const left = end - now;
  if (!Number.isFinite(end) || left <= 0) return null;

  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  const seconds = Math.floor((left % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
      <span className="flex items-center gap-1.5 font-bold">
        <Timer className="w-4 h-4" />
        {flashSale.title}
        {flashSale.offer_percent ? ` - ${flashSale.offer_percent}% OFF` : ''}
      </span>
      <span className="font-mono font-semibold">
        Ends in {days > 0 ? `${days}d ` : ''}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}

/* ---------------- Size chart & custom size (এখন static, পরে dynamic হবে) ---------------- */
const SIZE_CHART_DATA = [
  { size: 'S', waist: '24-26', hips: '32-34', length: '34' },
  { size: 'M', waist: '26-28', hips: '34-36', length: '34.5' },
  { size: 'L', waist: '28-30', hips: '36-38', length: '35' },
  { size: 'XL', waist: '30-32', hips: '38-40', length: '35.5' },
  { size: 'XXL', waist: '32-34', hips: '40-42', length: '36' },
];

const INITIAL_MEASUREMENTS = {
  length: '',
  body: '',
  color: '',
  sleeve: '',
  orderType: 'Full Set',
  note: '',
};

// দুটো পপআপের কমন ফ্রেম: backdrop/Esc দিয়ে বন্ধ, থিম রঙের হেডার
function ModalShell({ title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="bg-[#C8795A] text-white px-5 py-3 flex justify-between items-center sticky top-0">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Ruler className="w-4 h-4" /> {title}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SizeChartModal({ onClose }) {
  return (
    <ModalShell title="Size Chart" onClose={onClose}>
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-[#C8795A]/10 text-neutral-900 font-bold border-b border-[#C8795A]/20">
              <th className="p-2 border border-gray-200">Size</th>
              <th className="p-2 border border-gray-200">Waist (ইঞ্চি)</th>
              <th className="p-2 border border-gray-200">Hips (ইঞ্চি)</th>
              <th className="p-2 border border-gray-200">Length (ইঞ্চি)</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART_DATA.map((row) => (
              <tr key={row.size} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-2 font-bold border border-gray-200">{row.size}</td>
                <td className="p-2 border border-gray-200">{row.waist}</td>
                <td className="p-2 border border-gray-200">{row.hips}</td>
                <td className="p-2 border border-gray-200">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
}

function CustomSizeModal({ colors, onClose }) {
  const [form, setForm] = useState(INITIAL_MEASUREMENTS);
  const [qty, setQty] = useState(1);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const inputClass =
    'w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#C8795A] focus:outline-none bg-white';

  return (
    <ModalShell title="Custom Size" onClose={onClose}>
      <div className="p-5">
        <div className="mb-4 pb-2 border-b">
          <h4 className="font-bold text-gray-900 text-sm">Please give your measurement</h4>
          <p className="text-xs text-gray-500">সঠিক মাপ দিন, পারফেক্ট ফিট নিশ্চিত করুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Length (লম্বা)</label>
            <input type="text" placeholder="ইঞ্চি / সেমি" className={inputClass} value={form.length} onChange={set('length')} />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Body / Waist (বডি)</label>
            <input type="text" placeholder="ইঞ্চি / সেমি" className={inputClass} value={form.body} onChange={set('body')} />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Color (কালার)</label>
            <select className={inputClass} value={form.color} onChange={set('color')}>
              <option value="">কালার নির্বাচন করুন</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Quantity (পরিমাণ)</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4 font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Sleeve (হাতা)</label>
            <input type="text" placeholder="ইঞ্চি / সেমি" className={inputClass} value={form.sleeve} onChange={set('sleeve')} />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Order Type</label>
            <select className={inputClass} value={form.orderType} onChange={set('orderType')}>
              <option value="Full Set">Full Set</option>
              <option value="Single Top">Single Top</option>
              <option value="Single Bottom">Single Bottom</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Note (অতিরিক্ত নোট)</label>
            <textarea
              rows="3"
              placeholder="এখানে লিখুন..."
              className={inputClass}
              value={form.note}
              onChange={set('note')}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="border border-[#C8795A] text-[#C8795A] hover:bg-[#C8795A] hover:text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> ADD TO CART
          </button>
          <button
            type="button"
            className="border border-[#C8795A] text-[#C8795A] hover:bg-[#C8795A] hover:text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------------- Page content ---------------- */
function ProductDetailsContent({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const combinations = product.combinations || [];
  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 0;

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [error, setError] = useState(null); // { field: 'size' | 'color' | 'other', message }
  const sizeRef = useRef(null);
  const colorRef = useRef(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);

  // Main image + gallery + color images (ডুপ্লিকেট বাদ) + video
  const media = useMemo(() => {
    const urls = [product.image, ...(product.gallery || []).map(toImageUrl), ...colors.map((c) => c.image)];
    const images = [...new Set(urls.filter(Boolean))].map((url) => ({ type: 'image', url }));
    if (product.video?.video_embed_url) {
      images.push({
        type: 'video',
        embed: product.video.video_embed_url,
        url: getYouTubeThumb(product.video.video_embed_url),
      });
    }
    return images;
  }, [product, colors]);

  const selectedCombo = useMemo(() => {
    if (combinations.length === 0) return null;
    if ((needsSize && !selectedSize) || (needsColor && !selectedColor)) return null;
    return (
      combinations.find(
        (c) =>
          (!needsSize || sameId(c.size_id, selectedSize.id)) &&
          (!needsColor || sameId(c.color_id, selectedColor.id))
      ) || null
    );
  }, [combinations, needsSize, needsColor, selectedSize, selectedColor]);

  // Stock না থাকা size/color disabled, অন্যটা বেছে থাকলে তার সাথে মিলিয়ে
  const isSizeAvailable = (size) =>
    combinations.length === 0
      ? product.in_stock
      : combinations.some(
          (c) =>
            sameId(c.size_id, size.id) &&
            (!selectedColor || sameId(c.color_id, selectedColor.id)) &&
            c.quantity > 0
        );

  const isColorAvailable = (color) =>
    combinations.length === 0
      ? product.in_stock
      : combinations.some(
          (c) =>
            sameId(c.color_id, color.id) &&
            (!selectedSize || sameId(c.size_id, selectedSize.id)) &&
            c.quantity > 0
        );

  const maxQty = Math.max(1, selectedCombo ? selectedCombo.quantity : product.stock_qty || 1);
  const safeQuantity = Math.min(quantity, maxQty);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
    setError(null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setQuantity(1);
    setError(null);
    const idx = media.findIndex((m) => m.type === 'image' && m.url === color.image);
    if (idx >= 0) setSelectedMedia(idx);
  };

  /* ----- Price display ----- */
  const priceView = (() => {
    if (selectedCombo) {
      const regular = Number(selectedCombo.regular_price);
      const price = Number(selectedCombo.price);
      return {
        current: formatPrice(price),
        original: regular > price ? formatPrice(regular) : null,
        discount: selectedCombo.discount_percent > 0 ? `${selectedCombo.discount_percent}% OFF` : null,
      };
    }
    const info = getPriceInfo(product);
    return {
      current: info.current,
      original: info.original,
      discount: product.discount_percent > 0 ? `${product.discount_percent}% OFF` : null,
    };
  })();

  /* ----- Cart actions ----- */
  const validate = () => {
    if (!product.in_stock) return { field: 'other', message: 'This product is out of stock' };
    if (needsSize && !selectedSize) return { field: 'size', message: 'Please select a size' };
    if (needsColor && !selectedColor) return { field: 'color', message: 'Please select a color' };
    if (combinations.length > 0 && !selectedCombo)
      return { field: 'other', message: 'Selected combination is unavailable' };
    if (selectedCombo && selectedCombo.quantity <= 0)
      return { field: 'other', message: 'Selected combination is out of stock' };
    return null;
  };

  // Size/Color না বেছে চাপলে ঐ অংশে স্ক্রল করে লাল করে দেখায়, যাতে ইউজার বুঝতে পারে কেন add হয়নি
  const showError = (problem) => {
    setError(problem);
    const target = problem.field === 'size' ? sizeRef : problem.field === 'color' ? colorRef : null;
    target?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const buildPayload = (extra = {}) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumb_image: selectedColor?.image || product.image,
    brand: product.brand,
    quantity: safeQuantity,
    // কম্বিনেশনে variant id নেই, তাই size+color থেকে ইউনিক সংখ্যা: M/Black আর L/Red আলাদা লাইন হয়
    variant_id: selectedCombo
      ? Number(selectedCombo.size_id || 0) * 100000 + Number(selectedCombo.color_id || 0)
      : 0,
    has_variants: combinations.length > 0,
    selectedSize: selectedSize ? { id: selectedSize.id, name: selectedSize.name } : null,
    selectedColor: selectedColor ? { id: selectedColor.id, name: selectedColor.name } : null,
    selected_price: selectedCombo?.price ?? null,
    offer_price: product.offer_price,
    price: product.price,
    min_price: product.min_price,
    ...extra,
  });

  const handleAddToCart = () => {
    const problem = validate();
    if (problem) return showError(problem);
    setError(null);
    dispatch(addItem(buildPayload()));
    dispatch(openCartPopup());
  };

  const handleBuyNow = () => {
    const problem = validate();
    if (problem) return showError(problem);
    setError(null);
    // Buy Now: কার্টে add হয় না, সরাসরি এই আইটেম নিয়ে checkout-এ যায়
    navigate('/checkout', { state: { buyNowItem: createCartLine(buildPayload()) } });
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Interested in ${product.name}`
  )}`;

  const active = media[selectedMedia] || media[0];
  const canBuy = product.in_stock;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans bg-gray-50 text-gray-800">
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#C8795A]">Home</Link>
        {[product.category, product.sub_category, product.child_category]
          .filter(Boolean)
          .map((c) => (
            <span key={c.id} className="flex items-center gap-1.5">
              <span>/</span>
              <span>{c.name}</span>
            </span>
          ))}
        <span>/</span>
        <span className="text-gray-800 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-2xl shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          {media.length > 1 && (
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
              {media.map((item, idx) => (
                <button
                  key={`${item.type}-${idx}`}
                  type="button"
                  onClick={() => setSelectedMedia(idx)}
                  className={`relative w-16 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all bg-gray-900 ${
                    selectedMedia === idx
                      ? 'border-[#C8795A] shadow-md'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.url && <img src={item.url} alt="" className="w-full h-full object-cover" />}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex-1 order-1 md:order-2 bg-gray-100 rounded-2xl overflow-hidden border">
            {active?.type === 'video' ? (
              <iframe
                src={`${active.embed}?rel=0`}
                title={product.name}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-[450px] border-0 bg-black"
              />
            ) : (
              <img
                src={active?.url || product.image}
                alt={product.name}
                className="w-full h-[450px] object-cover"
              />
            )}
          </div>
        </div>

        {/* Right Column: Info & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <span className="text-2xl font-extrabold text-[#C8795A]">{priceView.current}</span>
              {priceView.original && (
                <span className="text-sm text-gray-400 line-through">{priceView.original}</span>
              )}
              {priceView.discount && (
                <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {priceView.discount}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>(Inclusive of all taxes)</span>
              {product.sku && <span>SKU: {product.sku}</span>}
              {product.brand?.name && <span>Brand: {product.brand.name}</span>}
              <span className={product.in_stock ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
              {selectedCombo && selectedCombo.quantity > 0 && selectedCombo.quantity <= 5 && (
                <span className="text-orange-600 font-semibold">Only {selectedCombo.quantity} left</span>
              )}
            </p>

            {product.flash_sale && <FlashSaleStrip flashSale={product.flash_sale} />}

            <div className="mb-5 flex flex-wrap gap-2">
              <div className="bg-[#C8795A]/10 p-2.5 sm:p-3 rounded-xl border border-[#C8795A]/20 flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs sm:text-sm text-neutral-900 w-fit">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Truck className="w-4 h-4 text-[#C8795A] shrink-0" />
                  <span>Delivery Type:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Cash On Delivery</span>
                  <span className="text-[#C8795A] font-medium text-[11px] sm:text-xs">
                    (সারাদেশে হোম ডেলিভারি)
                  </span>
                </div>
              </div>
              {product.is_free_shipping && (
                <span className="self-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-xl">
                  Free Shipping
                </span>
              )}
            </div>

            {/* Size Selector */}
            {needsSize && (
              <div
                ref={sizeRef}
                className={`mb-5 rounded-xl transition-colors ${
                  error?.field === 'size' ? 'ring-2 ring-red-400 bg-red-50/60 p-3 -m-3 mb-2' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 max-w-md">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Available Sizes
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomSizeOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#C8795A]/50 text-[#C8795A] bg-[#C8795A]/10 hover:bg-[#C8795A]/20 flex items-center gap-1 transition-all"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Custom Size
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs text-[#C8795A] font-bold underline hover:opacity-80 transition-opacity"
                    >
                      Size Chart
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => {
                    const available = isSizeAvailable(size);
                    const isSelected = selectedSize && sameId(selectedSize.id, size.id);
                    return (
                      <button
                        key={size.id}
                        type="button"
                        disabled={!available}
                        onClick={() => handleSizeSelect(size)}
                        title={available ? size.name : `${size.name} - Out of stock`}
                        className={`min-w-10 h-10 px-2 text-xs font-semibold rounded-lg border transition-all ${
                          !available
                            ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                            : isSelected
                            ? 'border-[#C8795A] bg-[#C8795A] text-white shadow-sm'
                            : 'border-gray-300 text-gray-700 hover:border-[#C8795A]'
                        }`}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
                {error?.field === 'size' && (
                  <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
                    {error.message}
                  </p>
                )}
              </div>
            )}

            {/* Color Selector */}
            {needsColor && (
              <div
                ref={colorRef}
                className={`mb-6 rounded-xl transition-colors ${
                  error?.field === 'color' ? 'ring-2 ring-red-400 bg-red-50/60 p-3 -m-3 mb-3' : ''
                }`}
              >
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Colors{selectedColor ? `: ${selectedColor.name}` : ''}
                </span>
                <div className="flex gap-3">
                  {colors.map((color) => {
                    const available = isColorAvailable(color);
                    const isSelected = selectedColor && sameId(selectedColor.id, color.id);
                    return (
                      <button
                        key={color.id}
                        type="button"
                        disabled={!available}
                        onClick={() => handleColorSelect(color)}
                        style={{ backgroundColor: color.code || color.name }}
                        title={available ? color.name : `${color.name} - Out of stock`}
                        aria-label={color.name}
                        className={`w-7 h-7 rounded-full border border-gray-200 transition-transform ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[#C8795A] scale-110' : 'hover:scale-105'
                        } ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                      />
                    );
                  })}
                </div>
                {error?.field === 'color' && (
                  <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            {error?.field === 'other' && (
              <p role="alert" className="mb-3 text-xs font-semibold text-red-600">
                {error.message}
              </p>
            )}

            {/* Quantity */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, safeQuantity - 1))}
                  disabled={safeQuantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{safeQuantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQty, safeQuantity + 1))}
                  disabled={safeQuantity >= maxQty}
                  aria-label="Increase quantity"
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap gap-3 border-t pt-5">
              <button
                type="button"
                disabled={!canBuy}
                onClick={handleBuyNow}
                className="flex-1 min-w-[130px] border border-[#C8795A] text-[#C8795A] hover:bg-[#C8795A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
              <button
                type="button"
                disabled={!canBuy}
                onClick={handleAddToCart}
                className="flex-1 min-w-[130px] border border-[#C8795A] text-[#C8795A] hover:bg-[#C8795A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border border-green-600 text-green-700 hover:bg-green-50 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                Order by Whatsapp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features & Assurance Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-green-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">100% Original Product</h4>
            <p className="text-[11px] text-gray-500">অরিজিনাল পণ্য</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <RotateCcw className="w-8 h-8 text-[#C8795A]" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Easy Return Policy</h4>
            <p className="text-[11px] text-gray-500">সহজ রিটার্ন সুবিধা</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Secure Payment</h4>
            <p className="text-[11px] text-gray-500">নিরাপদ পেমেন্ট</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex border-b mb-4">
          {[
            ['details', 'Product Details'],
            ...(product.specifications?.length > 0 ? [['specs', 'Specifications']] : []),
            ['exchange', 'Exchange Guidelines'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 px-4 text-xs font-bold transition-all ${
                activeTab === key
                  ? 'border-b-2 border-[#C8795A] text-[#C8795A]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div
            className="prose prose-sm max-w-none text-xs text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1"
            dangerouslySetInnerHTML={{
              __html:
                product.description || product.short_description || 'No product description available.',
            }}
          />
        )}

        {activeTab === 'specs' && (
          <table className="w-full text-xs text-left">
            <tbody>
              {product.specifications.map((spec, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <th className="py-2 pr-4 font-semibold text-gray-700 w-1/3">
                    {spec.name || spec.key || spec.title}
                  </th>
                  <td className="py-2 text-gray-600">{spec.value || spec.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'exchange' && (
          <div className="text-xs text-gray-600 leading-relaxed">
            পণ্য ডেলিভারি পাওয়ার পর কোনো সাইজ বা ত্রুটিজনিত সমস্যা থাকলে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা রয়েছে।
          </div>
        )}
      </div>

      {/* Related Products (হোম সেকশনের কার্ডের একই ডিজাইন) */}
      {product.related_products?.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {product.related_products.map((prod) => (
              <ProductCard key={prod.id} product={prod} onBuyNow={buyNow} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />

      {isSizeChartOpen && <SizeChartModal onClose={() => setIsSizeChartOpen(false)} />}
      {isCustomSizeOpen && (
        <CustomSizeModal colors={colors} onClose={() => setIsCustomSizeOpen(false)} />
      )}
    </div>
  );
}

/* ---------------- Page (fetch by slug) ---------------- */
export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getProductDetails(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus('ready');
        document.title = data.seo?.title || data.name;
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === 'loading') return <ProductDetailsSkeleton />;

  if (status === 'error' || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
        <p className="text-sm text-gray-500">This product is unavailable or the link is incorrect.</p>
        <Link to="/" className="mt-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  // key দিয়ে প্রোডাক্ট বদলালে সিলেকশন state রিসেট হয়
  return <ProductDetailsContent key={product.id} product={product} />;
}
