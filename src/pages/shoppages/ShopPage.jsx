import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { FaBolt, FaCartPlus } from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const abayaProducts = [
  {
    id: 1,
    name: "Premium Dubai Cherry Silk Abaya",
    price: 1450,
    oldPrice: 1700,
    discount: "15% OFF",
    image: "/images/burka-1.jpg",
  },
  {
    id: 2,
    name: "Luxurious Kaftan Style Abaya Set",
    price: 1840,
    oldPrice: 2300,
    discount: "20% OFF",
    image: "/images/burka-2.jpg",
  },
  {
    id: 3,
    name: "Classic Black Umbrella Cut Abaya",
    price: 1200,
    oldPrice: 1600,
    discount: "25% OFF",
    image: "/images/burka-4.jpg",
  },
  {
    id: 4,
    name: "Designer Butterfly Layered Hijab Set",
    price: 1920,
    oldPrice: 2400,
    discount: "20% OFF",
    image: "/images/burka-5.jpg",
  },
];

const products = [...abayaProducts, ...abayaProducts.map((p) => ({ ...p, id: p.id + 100 }))];

const categories = [
  { id: 1, name: "Smartphones", active: true },
  { id: 2, name: "Laptops", active: false },
  { id: 3, name: "Headphones", active: false },
  { id: 4, name: "Smart Watch", active: false },
  { id: 5, name: "Gaming", active: false },
  { id: 6, name: "Cameras", active: false },
  { id: 7, name: "Accessories", active: false },
];


const colors = [
  { id: 1, name: "Black", hex: "#000000" },
  { id: 2, name: "Gray", hex: "#808080" },
  { id: 3, name: "Green", hex: "#4ade80" },
  { id: 4, name: "Red", hex: "#f87171" },
  { id: 5, name: "Orange", hex: "#fb923c" },
  { id: 6, name: "Blue", hex: "#60a5fa" },
  { id: 7, name: "Pink", hex: "#f472b6" },
  { id: 8, name: "White", hex: "#ffffff", border: true },
];

const sizes = [
  { id: 1, name: "64GB" },
  { id: 2, name: "128GB" },
  { id: 3, name: "256GB" },
  { id: 4, name: "512GB" },
  { id: 5, name: "1TB" },
  { id: 6, name: "2TB" },
];



function FilterPanel({
  dark = false,
  showHeading = true,
  activeCategory,
  setActiveCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  activeColor,
  setActiveColor,
  activeSize,
  setActiveSize,
}) {
  const heading = dark
    ? "text-sm font-bold uppercase tracking-wider text-[#E7C9A0] mb-3"
    : "text-sm font-bold uppercase tracking-wider text-gray-900 mb-3";

  const boxBase = dark
    ? "w-3 h-3 border rounded-sm mr-3 shrink-0 flex items-center justify-center transition-colors"
    : "w-3 h-3 border border-gray-300 rounded-sm mr-3 shrink-0 flex items-center justify-center transition-colors";

  const boxState = (active) =>
    dark
      ? active
        ? "bg-[#E7C9A0] border-[#E7C9A0]"
        : "border-white/30 group-hover:border-white"
      : active
      ? "bg-gray-900 border-gray-900"
      : "group-hover:border-accent";

  const labelState = (active) =>
    dark
      ? active
        ? "font-medium text-white"
        : "text-[#E7C9A0]/80 group-hover:text-white"
      : active
      ? "font-medium text-gray-900"
      : "text-gray-600 group-hover:text-accent";

  return (
    <div className="space-y-8">
      {showHeading && (
        <div>
          <h2
            className={`text-lg font-bold font-serif mb-4 ${
              dark ? "text-white" : ""
            }`}
          >
            Filter Option
          </h2>
        </div>
      )}
      <div>
        <h3 className={heading}>Category</h3>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center text-sm">
              <button
                onClick={() => setActiveCategory(cat.name)}
                className="flex items-center group w-full text-left"
              >
                <span className={`${boxBase} ${boxState(activeCategory === cat.name)}`}>
                  {activeCategory === cat.name && (
                    <Check className={`w-2 h-2 ${dark ? "text-black" : "text-white"}`} />
                  )}
                </span>

                <span className={`transition-colors ${labelState(activeCategory === cat.name)}`}>
                  {cat.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={heading.replace("mb-3", "mb-4")}>Price</h3>

        <div className="px-2">
          <input
            type="range"
            min="0"
            max="500"
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))}
            className={`w-full ${dark ? "accent-[#E7C9A0]" : "accent-black"}`}
          />

          <input
            type="range"
            min="0"
            max="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))}
            className={`w-full ${dark ? "accent-[#E7C9A0]" : "accent-black"} mt-2`}
          />

          <div className={`mt-4 text-sm font-medium ${dark ? "text-[#E7C9A0]/80" : "text-gray-600"}`}>
            ${minPrice}.00 - ${maxPrice}.00
          </div>
        </div>
      </div>

      <div>
        <h3 className={heading}>Color</h3>

        <ul className="space-y-2.5">
          {colors.map((col) => (
            <li key={col.id} className="flex items-center text-sm">
              <button onClick={() => setActiveColor(col.name)} className="flex items-center group">
                <span
                  className={`relative w-4 h-4 rounded-full mr-3 shrink-0 ${
                    col.border ? (dark ? "border border-white/30" : "border border-gray-300") : ""
                  }`}
                  style={{ background: col.hex }}
                >
                  {activeColor === col.name && (
                    <span
                      className={`absolute -inset-1 border rounded-full ${
                        dark ? "border-white/60" : "border-gray-400"
                      }`}
                    ></span>
                  )}
                </span>
                <span className={`transition-colors ${labelState(activeColor === col.name)}`}>
                  {col.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={heading}>Size</h3>

        <ul className="space-y-2">
          {sizes.map((size) => (
            <li key={size.id} className="flex items-center text-sm">
              <button
                onClick={() => setActiveSize(size.name)}
                className="flex items-center group w-full text-left"
              >
                <span className={`${boxBase} ${boxState(activeSize === size.name)}`}>
                  {activeSize === size.name && (
                    <Check className={`w-2 h-2 ${dark ? "text-black" : "text-white"}`} />
                  )}
                </span>

                <span className={`transition-colors ${labelState(activeSize === size.name)}`}>
                  {size.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ShopPage() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Smartphones");
    const [minPrice, setMinPrice] = useState(25);
    const [maxPrice, setMaxPrice] = useState(125);
    const [activeColor, setActiveColor] = useState("Black");
    const [activeSize, setActiveSize] = useState("64GB");


const filters = [];

if (activeCategory)
  filters.push({
    type: "category",
    label: activeCategory,
  });

if (activeColor)
  filters.push({
    type: "color",
    label: activeColor,
  });

if (activeSize)
  filters.push({
    type: "size",
    label: activeSize,
  });

if (minPrice !== 0 || maxPrice !== 500)
  filters.push({
    type: "price",
    label: `Price: $${minPrice} - $${maxPrice}`,
  });
    
  const removeFilter = (type) => {
  if (type === "category") setActiveCategory("");
  if (type === "color") setActiveColor("");
  if (type === "size") setActiveSize("");
  if (type === "price") {
    setMinPrice(0);
    setMaxPrice(500);
  }
};


const clearAll = () => {
  setActiveCategory("");
  setActiveColor("");
  setActiveSize("");
  setMinPrice(0);
  setMaxPrice(500);
};


  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Single designer-provided banner image — replace src with the final asset */}
      <img
        src="/images/pexels-pnw-prod-8995939.jpg"
        alt="Shop banner"
        className="w-full h-auto aspect-[16/5] sm:aspect-[21/6] object-cover block"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-8 flex flex-col lg:flex-row">
  {/* Left side */}

        <div className="hidden lg:block lg:w-64 shrink-0 lg:self-start lg:sticky lg:top-4">
            <div className="lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
              <FilterPanel
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                activeColor={activeColor}
                setActiveColor={setActiveColor}
                activeSize={activeSize}
                setActiveSize={setActiveSize}
              />
            </div>
        </div>

        {/* Mobile filter drawer — same glass style as the Navbar's mobile menu */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                key="filter-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 z-[60] bg-black/25 lg:hidden"
              />

              <motion.div
                key="filter-drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 z-[70] h-full w-[85%] max-w-sm bg-black/55 backdrop-blur-[2px] text-[#E7C9A0] flex flex-col lg:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                  <span className="text-lg font-semibold tracking-wide text-[#E7C9A0]">
                    Filter Option
                  </span>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                    className="p-2 rounded-full bg-white/5 text-[#E7C9A0] hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <FilterPanel
                    dark
                    showHeading={false}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    activeColor={activeColor}
                    setActiveColor={setActiveColor}
                    activeSize={activeSize}
                    setActiveSize={setActiveSize}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>


        {/* Right side */}

        <div className="flex-1">
            <div className="lg:hidden mb-4">
                <button
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
                className="flex items-center gap-2 text-gray-900 font-medium border border-gray-200 px-4 py-2.5 rounded-md"
                >
                    <SlidersHorizontal className="w-4 h-4"/>
                    <span>Filters</span>
                </button>
            </div>


            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    Showing 1-12 of 240 results
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-2 md:justify-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">
                        Active Filter
                    </span>
                    {filters.map((item) => (
                        <div
                         key={item.type}
                         className="flex items-center bg-accent text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {item.label}

                          <button 
                          onClick={() => removeFilter(item.type)}
                          className="ml-1.5 hover:text-gray-200 transition-colors">
                          <X className="w-3 h-3" />
                           </button>
                        </div>
                    ))}
                     <button 
                     onClick={clearAll}
                     className="text-sm text-gray-500 underline ml-2 hover:text-gray-900 transition-colors">
                       Clear All
                    </button>
                </div>

                <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                        Sort By:
                    </span>

                    <div className="relative">
                        <select className="appearance-none border border-gray-200 rounded-md py-1.5  pl-3 pr-8 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent">
                            <option>Default Sorting</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                           <ChevronDown className="w-4 h-4" />
                         </div>
                    </div>
                </div>
            </div>


              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gray-50">
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-[#C8795A] text-white text-[10px] font-bold uppercase z-10 shadow-sm pl-2.5 pr-4 py-1 tracking-wider">
                      {product.discount}
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h4
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-extrabold text-gray-900">
                      ৳{product.price}
                    </span>

                    <span className="text-sm text-[#C8795A] line-through">
                      ৳{product.oldPrice}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="relative overflow-hidden group/btn bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-300"
                    >
                      <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out" />
                      <FaBolt className="text-xs shrink-0 relative z-10" />
                      <span className="text-[8px] sm:text-[11px] font-bold whitespace-nowrap relative z-10">Buy Now</span>
                    </button>

                    <button
                      type="button"
                      className="relative overflow-hidden group/btn bg-white border border-[#C8795A] text-[#C8795A] hover:text-white font-medium py-2 px-1 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-300"
                    >
                      <span className="absolute inset-0 bg-[#C8795A] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out" />
                      <FaCartPlus className="text-xs shrink-0 relative z-10" />
                      <span className="text-[8px] sm:text-[11px] font-bold whitespace-nowrap relative z-10">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>




        </div>











      </div>
    </div>
  )
}
