import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Play, 
  Ruler, 
  CheckCircle, 
  RotateCcw, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  X,
  MessageCircle,
  Truck
} from 'lucide-react';

const ProductDetailsPage = () => {
  // Config: Toggle custom size feature per product (backend field simulation)
  const isCustomSizeEnabled = true;

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isCustomSizeActive, setIsCustomSizeActive] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);

  // Form state for measurement
  const [customMeasurements, setCustomMeasurements] = useState({
    length: '',
    body: '',
    color: '',
    sleeve: '',
    orderType: 'Full Set',
    note: ''
  });

    const productImages = [
    { type: 'image', url: '/images/women.jpg' },
    { type: 'image', url: '/images/women-3.jpg' },
    { type: 'image', url: '/images/women-1.jpg' },
    { type: 'image', url: '/images/women-2.jpg' },
    { type: 'video', url: '/images/' },
  ];

  const colors = [
    { id: 'black', hex: '#000000' },
    { id: 'navy', hex: '#1e3a8a' },
    { id: 'purple', hex: '#5b21b6' },
    { id: 'pink', hex: '#db2777' },
    { id: 'green', hex: '#065f46' },
  ];

  const sizeChartData = [
    { size: 'S', waist: '24-26', hips: '32-34', length: '34' },
    { size: 'M', waist: '26-28', hips: '34-36', length: '34.5' },
    { size: 'L', waist: '28-30', hips: '36-38', length: '35' },
    { size: 'XL', waist: '30-32', hips: '38-40', length: '35.5' },
    { size: 'XXL', waist: '32-34', hips: '40-42', length: '36' },
  ];

  const relatedProducts = [
    { title: 'Active Ankle Length Tights - Navy Blue', price: '৳529', original: '৳1,599', discount: '66% OFF' },
    { title: 'Active Ankle Length Tights - Dark Grey', price: '৳529', original: '৳1,599', discount: '66% OFF' },
    { title: 'Active Ankle Length Tights - Maroon', price: '৳529', original: '৳1,599', discount: '66% OFF' },
    { title: 'Printed Active Tights - Block Print', price: '৳599', original: '৳1,799', discount: '66% OFF' },
    { title: 'Active Ankle Length Tights - Olive Green', price: '৳529', original: '৳1,599', discount: '66% OFF' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans bg-gray-50 text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-2xl shadow-sm">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
            {productImages.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                  selectedImage === idx ? 'border-purple-700 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={item.url} alt="" className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="relative flex-1 order-1 md:order-2 bg-gray-100 rounded-2xl overflow-hidden group border">
            {productImages[selectedImage].type === 'video' ? (
              <div className="w-full h-[450px] bg-black flex items-center justify-center relative">
                <Play className="w-16 h-16 text-white cursor-pointer hover:scale-110 transition-transform" />
                <span className="absolute bottom-4 left-4 text-xs text-white bg-black/60 px-3 py-1 rounded-full">
                  ভিডিও দেখার সুবিধা আছে
                </span>
              </div>
            ) : (
              <img 
                src={productImages[selectedImage].url} 
                alt="Product Main" 
                className="w-full h-[450px] object-cover"
              />
            )}
          </div>
        </div>

        {/* Center/Right Main Info & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Snug Fit Active Ankle Length Tights in Black
            </h1>

            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-2xl font-extrabold text-purple-700">৳529</span>
              <span className="text-sm text-gray-400 line-through">৳1,599</span>
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">66% OFF</span>
            </div>

            <p className="text-xs text-gray-500 mb-4">(Inclusive of all taxes) <span className="ml-4">SKU: 235940063_BD-1179245663</span></p>

           <div className="mb-5">
  <div className="bg-purple-50 p-2.5 sm:p-3 rounded-xl border border-purple-100 flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs sm:text-sm text-purple-900 w-fit">
    <div className="flex items-center gap-1.5 font-semibold">
      <Truck className="w-4 h-4 text-purple-700 shrink-0" />
      <span>Delivery Type:</span>
    </div>
    
    <div className="flex items-center gap-1.5">
      <span>Cash On Delivery</span>
      <span className="text-purple-600 font-medium text-[11px] sm:text-xs">
        (সারাদেশে হোম ডেলিভারি)
      </span>
    </div>
  </div>
</div>
            {/* Standard Size Selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Available Sizes</span>
               
              </div>

              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => { setSelectedSize(sz); setIsCustomSizeActive(false); }}
                    className={`w-10 h-10 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === sz && !isCustomSizeActive 
                        ? 'border-purple-700 bg-purple-700 text-white shadow-sm' 
                        : 'border-gray-300 text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}

                {/* Conditional Custom Size Button (Controlled via Backend Status) */}
                {isCustomSizeEnabled && (
                  <button
                    onClick={() => setIsCustomSizeActive(!isCustomSizeActive)}
                    className={`px-3 h-10 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all ${
                      isCustomSizeActive 
                        ? 'border-purple-700 bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-600' 
                        : 'border-purple-300 text-purple-700 bg-purple-50/50 hover:bg-purple-100'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Custom Size
                  </button>
                )}
                 <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs text-purple-700 font-bold underline hover:text-purple-900 transition-colors"
                >
                  Size Chart
                </button>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Colors</span>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === c.id ? 'ring-2 ring-offset-2 ring-purple-700 scale-110' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap gap-3 border-t pt-5">
              <button className="flex-1 min-w-[130px] border border-purple-800  text-purple-900 hover:bg-purple-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
              <button className="flex-1 min-w-[130px] border border-purple-800 text-purple-900 hover:bg-purple-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button className="px-4 border border-green-600 text-green-700 hover:bg-green-50 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all">
                Order by Whatsapp
              </button>
              <button className="px-4 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all">
                <MessageCircle className="w-4 h-4" /> Messenger এ কথা বলুন
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Size Form Section */}
      {isCustomSizeEnabled && isCustomSizeActive && (
        <div className="mt-6 bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <Ruler className="w-5 h-5 text-purple-700" />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Please give your measurement</h3>
              <p className="text-xs text-gray-500">সঠিক মাপ দিন, পারফেক্ট ফিট নিশ্চিত করুন</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Length (লম্বা)</label>
              <input 
                type="text" 
                placeholder="ইঞ্চি / সেমি" 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                value={customMeasurements.length}
                onChange={(e) => setCustomMeasurements({...customMeasurements, length: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Body / Waist (বডি)</label>
              <input 
                type="text" 
                placeholder="ইঞ্চি / সেমি" 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                value={customMeasurements.body}
                onChange={(e) => setCustomMeasurements({...customMeasurements, body: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Color (কালার)</label>
              <select 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                value={customMeasurements.color}
                onChange={(e) => setCustomMeasurements({...customMeasurements, color: e.target.value})}
              >
                <option value="">কালার নির্বাচন করুন</option>
                {colors.map(c => <option key={c.id} value={c.id}>{c.id.toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Quantity (পরিমাণ)</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >-</button>
                <span className="px-4 py-1 font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >+</button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Sleeve (হাতা)</label>
              <input 
                type="text" 
                placeholder="ইঞ্চি / সেমি" 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                value={customMeasurements.sleeve}
                onChange={(e) => setCustomMeasurements({...customMeasurements, sleeve: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Order Type</label>
              <select 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                value={customMeasurements.orderType}
                onChange={(e) => setCustomMeasurements({...customMeasurements, orderType: e.target.value})}
              >
                <option value="Full Set">Full Set</option>
                <option value="Single Top">Single Top</option>
                <option value="Single Bottom">Single Bottom</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Note (অতিরিক্ত নোট)</label>
              <textarea 
                rows="3" 
                placeholder="এখানে লিখুন..." 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                value={customMeasurements.note}
                onChange={(e) => setCustomMeasurements({...customMeasurements, note: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-6">
            <button className="border border-purple-800 hover:bg-purple-50 text-purple-900 font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all">
              <ShoppingCart className="w-4 h-4" /> ADD TO CART
            </button>
              <button className="border border-purple-800 hover:bg-purple-50 text-purple-900 font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all">
              <ShoppingBag className="w-4 h-4" />  Buy Now
            </button>
          </div>
         
        </div>
      )}

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
          <RotateCcw className="w-8 h-8 text-purple-600" />
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
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'details' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Product Details
          </button>
          <button 
            onClick={() => setActiveTab('exchange')}
            className={`pb-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'exchange' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Exchange Guidelines
          </button>
        </div>

        {activeTab === 'details' ? (
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-center gap-2"><span className="text-purple-600">✔</span> সুপার সফট ও স্ট্রেচেবল ফেব্রিক</li>
            <li className="flex items-center gap-2"><span className="text-purple-600">✔</span> ঘাম শোষণ করে ও দ্রুত শুকায়</li>
            <li className="flex items-center gap-2"><span className="text-purple-600">✔</span> জিম, যোগা, রানিং ও দৈনন্দিন ব্যবহারের জন্য পারফেক্ট</li>
            <li className="flex items-center gap-2"><span className="text-purple-600">✔</span> দীর্ঘক্ষণ ব্যবহারেও আরামদায়ক</li>
            <li className="flex items-center gap-2"><span className="text-purple-600">✔</span> বাংলাদেশের আবহাওয়ার জন্য উপযুক্ত</li>
          </ul>
        ) : (
          <div className="text-xs text-gray-600 leading-relaxed">
            পণ্য ডেলিভারি পাওয়ার পর কোনো সাইজ বা ত্রুটিজনিত সমস্যা থাকলে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা রয়েছে।
          </div>
        )}
      </div>

      {/* Related Products Slider */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Related Products</h3>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {relatedProducts.map((prod, index) => (
            <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                <img src={`https://via.placeholder.com/300x400/0f172a/ffffff?text=Item+${index+1}`} alt="" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{prod.title}</h4>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-gray-900">{prod.price}</span>
                <span className="text-gray-400 line-through text-[10px]">{prod.original}</span>
                <span className="bg-red-500 text-white text-[9px] font-bold px-1 rounded">{prod.discount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Chart Modal Component */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
            <div className="bg-purple-900 text-white px-5 py-3 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Size Chart
              </h3>
              <button onClick={() => setIsSizeChartOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-purple-50 text-purple-900 font-bold border-b border-purple-100">
                    <th className="p-2 border border-gray-200">Size</th>
                    <th className="p-2 border border-gray-200">Waist (ইঞ্চি)</th>
                    <th className="p-2 border border-gray-200">Hips (ইঞ্চি)</th>
                    <th className="p-2 border border-gray-200">Length (ইঞ্চি)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="p-2 font-bold border border-gray-200">{row.size}</td>
                      <td className="p-2 border border-gray-200">{row.waist}</td>
                      <td className="p-2 border border-gray-200">{row.hips}</td>
                      <td className="p-2 border border-gray-200">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;