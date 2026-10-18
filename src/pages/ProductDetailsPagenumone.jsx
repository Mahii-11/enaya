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
  MessageCircle
} from 'lucide-react';

const ProductDetailsPagenumone = () => {
  // Backend dynamic control: Enable or Disable Custom Size Feature
  const isCustomSizeEnabled = true;

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isCustomSizeActive, setIsCustomSizeActive] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);

  // Custom Measurement Form State
  const [customMeasurements, setCustomMeasurements] = useState({
    length: '',
    body: '',
    color: '',
    sleeve: '',
    orderType: 'Full Set',
    note: ''
  });

  const productImages = [
    { type: 'image', url: 'https://via.placeholder.com/600x800/1e293b/ffffff?text=Main+Image+1' },
    { type: 'video', url: 'https://via.placeholder.com/600x800/334155/ffffff?text=Product+Video' },
    { type: 'image', url: 'https://via.placeholder.com/600x800/475569/ffffff?text=Angle+2' },
    { type: 'image', url: 'https://via.placeholder.com/600x800/64748b/ffffff?text=Angle+3' },
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans bg-gray-50 text-gray-800">
      {/* Main Grid: Left Gallery (5 Cols), Right Content + Custom Side Form (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl shadow-sm">
        
        {/* Left Gallery (Thumbnails + Main Image/Video) */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-3">
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
            {productImages.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-14 h-18 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                  selectedImage === idx ? 'border-purple-700 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={item.url} alt="" className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="relative flex-1 order-1 md:order-2 bg-gray-100 rounded-xl overflow-hidden border">
            {productImages[selectedImage].type === 'video' ? (
              <div className="w-full h-[420px] bg-black flex items-center justify-center relative">
                <Play className="w-14 h-14 text-white cursor-pointer hover:scale-110 transition-transform" />
                <span className="absolute bottom-3 left-3 text-[11px] text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                  ভিডিও দেখুন
                </span>
              </div>
            ) : (
              <img 
                src={productImages[selectedImage].url} 
                alt="Product Main" 
                className="w-full h-[420px] object-cover"
              />
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Dynamic Custom Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Snug Fit Active Ankle Length Tights in Black
            </h1>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-extrabold text-purple-800">৳529</span>
              <span className="text-xs text-gray-400 line-through">৳1,599</span>
              <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full">66% OFF</span>
            </div>

            <p className="text-[11px] text-gray-400 mb-3">(Inclusive of all taxes) <span className="ml-3">SKU: 235940063_BD-1179245663</span></p>

            <div className="bg-purple-50 px-3 py-2 rounded-lg border border-purple-100 mb-4 text-xs text-purple-900">
              <span className="font-semibold">Delivery Type:</span> Cash On Delivery (সারাদেশে হোম ডেলিভারি)
            </div>

            {/* Sizes Selection */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-gray-700 uppercase">Available Sizes</span>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs text-purple-700 font-bold underline hover:text-purple-900"
                >
                  Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => { setSelectedSize(sz); setIsCustomSizeActive(false); }}
                    className={`w-9 h-9 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === sz && !isCustomSizeActive 
                        ? 'border-purple-800 bg-purple-800 text-white shadow-sm' 
                        : 'border-gray-300 text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}

                {/* Custom Size Toggle Button (Controlled by Backend Config) */}
                {isCustomSizeEnabled && (
                  <button
                    onClick={() => setIsCustomSizeActive(!isCustomSizeActive)}
                    className={`px-3 h-9 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all ${
                      isCustomSizeActive 
                        ? 'border-purple-800 bg-purple-100 text-purple-900 font-bold ring-2 ring-purple-600' 
                        : 'border-purple-300 text-purple-800 bg-purple-50 hover:bg-purple-100'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Custom Size
                  </button>
                )}
              </div>
            </div>

            {/* Colors Selection */}
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Colors</span>
              <div className="flex gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === c.id ? 'ring-2 ring-offset-2 ring-purple-800 scale-110' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Custom Measurement Side Panel (Opens seamlessly inside right column) */}
            {isCustomSizeEnabled && isCustomSizeActive && (
              <div className="mb-4 bg-purple-50/50 p-4 rounded-xl border border-purple-200 transition-all animate-fadeIn">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-purple-800" />
                    <h3 className="font-bold text-gray-900 text-xs">Please give your measurement</h3>
                  </div>
                  <span className="text-[10px] text-purple-700 font-medium bg-purple-100 px-2 py-0.5 rounded-full">
                    সঠিক মাপ দিন, পারফেক্ট ফিট নিশ্চিত করুন
                  </span>
                </div>

                {/* Compact Field Layout for Fitting Right Panel */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Length (লম্বা)</label>
                    <input 
                      type="text" 
                      placeholder="ইঞ্চি / সেমি" 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white"
                      value={customMeasurements.length}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, length: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Body / Waist (বডি)</label>
                    <input 
                      type="text" 
                      placeholder="ইঞ্চি / সেমি" 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white"
                      value={customMeasurements.body}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, body: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Color (কালার)</label>
                    <select 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white"
                      value={customMeasurements.color}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, color: e.target.value})}
                    >
                      <option value="">কালার নির্বাচন করুন</option>
                      {colors.map(c => <option key={c.id} value={c.id}>{c.id.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Quantity (পরিমাণ)</label>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white h-[26px]">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 bg-gray-100 text-gray-700 hover:bg-gray-200 h-full text-xs"
                      >-</button>
                      <span className="flex-1 text-center font-semibold text-xs">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 bg-gray-100 text-gray-700 hover:bg-gray-200 h-full text-xs"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Sleeve (হাতা)</label>
                    <input 
                      type="text" 
                      placeholder="ইঞ্চি / সেমি" 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white"
                      value={customMeasurements.sleeve}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, sleeve: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-0.5 font-medium">Order Type</label>
                    <select 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white"
                      value={customMeasurements.orderType}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, orderType: e.target.value})}
                    >
                      <option value="Full Set">Full Set</option>
                      <option value="Single Top">Single Top</option>
                      <option value="Single Bottom">Single Bottom</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-600 mb-0.5 font-medium">Note (অতিরিক্ত নোট)</label>
                    <textarea 
                      rows="2" 
                      placeholder="এখানে লিখুন..." 
                      className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white text-xs"
                      value={customMeasurements.note}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, note: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <button className="flex-1 min-w-[120px] bg-purple-900 hover:bg-purple-950 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
              </button>
              <button className="flex-1 min-w-[120px] border border-purple-900 text-purple-900 hover:bg-purple-50 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
              <button className="px-3 border border-green-600 text-green-700 hover:bg-green-50 rounded-xl font-semibold text-xs flex items-center gap-1 transition-all">
                Whatsapp
              </button>
              <button className="px-3 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-xs flex items-center gap-1 transition-all">
                <MessageCircle className="w-3.5 h-3.5" /> Messenger
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assurance Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <ShieldCheck className="w-7 h-7 text-green-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">100% Original Product</h4>
            <p className="text-[10px] text-gray-500">অরিজিনাল পণ্য</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <RotateCcw className="w-7 h-7 text-purple-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Easy Return Policy</h4>
            <p className="text-[10px] text-gray-500">সহজ রিটার্ন সুবিধা</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
          <CheckCircle className="w-7 h-7 text-blue-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Secure Payment</h4>
            <p className="text-[10px] text-gray-500">নিরাপদ পেমেন্ট</p>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b mb-3">
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-2 px-3 text-xs font-bold transition-all ${
              activeTab === 'details' ? 'border-b-2 border-purple-800 text-purple-800' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Product Details
          </button>
          <button 
            onClick={() => setActiveTab('exchange')}
            className={`pb-2 px-3 text-xs font-bold transition-all ${
              activeTab === 'exchange' ? 'border-b-2 border-purple-800 text-purple-800' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Exchange Guidelines
          </button>
        </div>

        {activeTab === 'details' ? (
          <ul className="space-y-1.5 text-xs text-gray-700">
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

      {/* Related Products Carousel */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 text-xs">Related Products</h3>
          <div className="flex gap-1.5">
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {relatedProducts.map((prod, index) => (
            <div key={index} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-36 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img src={`https://via.placeholder.com/300x400/0f172a/ffffff?text=Item+${index+1}`} alt="" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[11px] font-medium text-gray-800 line-clamp-2 mb-1">{prod.title}</h4>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-bold text-gray-900">{prod.price}</span>
                <span className="text-gray-400 line-through text-[9px]">{prod.original}</span>
                <span className="bg-red-500 text-white text-[8px] font-bold px-1 rounded">{prod.discount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Chart Modal Component */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-purple-900 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold text-xs flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Size Chart
              </h3>
              <button onClick={() => setIsSizeChartOpen(false)} className="hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-purple-50 text-purple-900 font-bold border-b border-purple-100">
                    <th className="p-1.5 border border-gray-200">Size</th>
                    <th className="p-1.5 border border-gray-200">Waist (ইঞ্চি)</th>
                    <th className="p-1.5 border border-gray-200">Hips (ইঞ্চি)</th>
                    <th className="p-1.5 border border-gray-200">Length (ইঞ্চি)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="p-1.5 font-bold border border-gray-200">{row.size}</td>
                      <td className="p-1.5 border border-gray-200">{row.waist}</td>
                      <td className="p-1.5 border border-gray-200">{row.hips}</td>
                      <td className="p-1.5 border border-gray-200">{row.length}</td>
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

export default ProductDetailsPagenumone;