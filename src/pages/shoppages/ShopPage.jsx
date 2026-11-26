import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getShopProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import ProductCard from "../../components/ProductCard";
import SelectOptionsPopup from "../../components/SelectOptionsPopup";
import useProductCardCart from "../../hooks/useProductCardCart";
import { formatPrice } from "../../utils/productPrice";

// URL-er ei param gulo-i API-te pathano hoy
const API_PARAMS = [
  "category", "sub_category", "child_category", "color", "size",
  "min_price", "max_price", "sort", "search", "page",
];

// Menu-r purono link (?sort=new, ?sort=best) ke API-r sort value-te bodlay
const SORT_ALIASES = { new: "newest", best: "popular" };

const CATEGORY_KEYS = ["category", "sub_category", "child_category"];

// "red,blue" -> ["red", "blue"]
const toList = (value) => (value ? value.split(",").filter(Boolean) : []);

const childrenOf = (item) => item.sub_categories || item.child_categories || [];

// Category tree-te selected slug khuje ber kore (category > sub > child)
function findCategory(items = [], key, slug, level = 0) {
  for (const item of items) {
    if (CATEGORY_KEYS[level] === key && item.slug === slug) return item;
    const found = findCategory(childrenOf(item), key, slug, level + 1);
    if (found) return found;
  }
  return null;
}

// Ei item ba tar nicher kono item URL-e selected kina (tree khola rakhar jonno)
function isInSelection(item, level, params) {
  if (params.get(CATEGORY_KEYS[level]) === item.slug) return true;
  return childrenOf(item).some((child) => isInSelection(child, level + 1, params));
}

// Slider chharle (release) tobei filter apply hoy, jate protita pixel-e API call na hoy
function PriceRange({ bounds, min, max, onApply, dark }) {
  const [range, setRange] = useState({ min, max });
  const apply = () => {
    if (range.min !== min || range.max !== max) onApply(range.min, range.max);
  };
  const common = {
    type: "range",
    min: bounds.min,
    max: bounds.max,
    onPointerUp: apply,
    onKeyUp: apply,
  };
  const accent = dark ? "accent-[#E7C9A0]" : "accent-black";

  return (
    <div className="px-2">
      <input
        {...common}
        aria-label="Minimum price"
        value={range.min}
        onChange={(e) => {
          const value = Number(e.target.value);
          setRange((r) => ({ ...r, min: Math.min(value, r.max) }));
        }}
        className={`w-full ${accent}`}
      />
      <input
        {...common}
        aria-label="Maximum price"
        value={range.max}
        onChange={(e) => {
          const value = Number(e.target.value);
          setRange((r) => ({ ...r, max: Math.max(value, r.min) }));
        }}
        className={`w-full ${accent} mt-2`}
      />
      <div className={`mt-4 text-sm font-medium ${dark ? "text-[#E7C9A0]/80" : "text-gray-600"}`}>
        {formatPrice(range.min)} - {formatPrice(range.max)}
      </div>
    </div>
  );
}

function FilterPanel({
  dark = false,
  showHeading = true,
  filters,
  params,
  onSelectCategory,
  onToggle,
  onPrice,
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

  const renderCheck = (label, active, onClick) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="flex items-center group w-full text-left"
    >
      <span className={`${boxBase} ${boxState(active)}`}>
        {active && <Check className={`w-2 h-2 ${dark ? "text-black" : "text-white"}`} />}
      </span>
      <span className={`transition-colors ${labelState(active)}`}>{label}</span>
    </button>
  );

  // Selected category-r niche tar sub / child category khule jay
  const renderCategories = (items, level, parentPath) => (
    <ul className="space-y-2">
      {items.map((item) => {
        const key = CATEGORY_KEYS[level];
        const path = { ...parentPath, [key]: item.slug };
        const active = params.get(key) === item.slug;
        const deeperSelected = CATEGORY_KEYS.slice(level + 1).some((k) => params.get(k));
        const children = childrenOf(item);

        return (
          <li key={item.slug} className="text-sm">
            {renderCheck(item.name, active, () =>
              // selected item-e abar click korle ek dhap upore fire jay
              onSelectCategory(active && !deeperSelected ? parentPath : path)
            )}
            {children.length > 0 && isInSelection(item, level, params) && (
              <div className="ml-5 mt-2">{renderCategories(children, level + 1, path)}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const selectedColors = toList(params.get("color"));
  const selectedSizes = toList(params.get("size"));

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

      {!filters ? (
        <p className={`text-sm ${dark ? "text-[#E7C9A0]/80" : "text-gray-500"}`}>
          Filters not available yet.
        </p>
      ) : (
        <>
          {filters.categories?.length > 0 && (
            <div>
              <h3 className={heading}>Category</h3>
              {renderCategories(filters.categories, 0, {})}
            </div>
          )}

          {filters.price && filters.price.max > filters.price.min && (
            <div>
              <h3 className={heading.replace("mb-3", "mb-4")}>Price</h3>
              <PriceRange
                key={`${params.get("min_price")}-${params.get("max_price")}`}
                bounds={filters.price}
                min={Number(params.get("min_price") || filters.price.min)}
                max={Number(params.get("max_price") || filters.price.max)}
                onApply={onPrice}
                dark={dark}
              />
            </div>
          )}

          {filters.colors?.length > 0 && (
            <div>
              <h3 className={heading}>Color</h3>
              <ul className="space-y-2.5">
                {filters.colors.map((col) => {
                  const active = selectedColors.includes(col.slug);
                  return (
                    <li key={col.slug} className="flex items-center text-sm">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => onToggle("color", col.slug)}
                        className="flex items-center group"
                      >
                        <span
                          className={`relative w-4 h-4 rounded-full mr-3 shrink-0 border ${
                            dark ? "border-white/30" : "border-gray-300"
                          }`}
                          style={{ background: col.code }}
                        >
                          {active && (
                            <span
                              className={`absolute -inset-1 border rounded-full ${
                                dark ? "border-white/60" : "border-gray-400"
                              }`}
                            ></span>
                          )}
                        </span>
                        <span className={`capitalize transition-colors ${labelState(active)}`}>
                          {col.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {filters.sizes?.length > 0 && (
            <div>
              <h3 className={heading}>Size</h3>
              <ul className="space-y-2">
                {filters.sizes.map((size) => (
                  <li key={size.slug} className="flex items-center text-sm">
                    {renderCheck(size.name, selectedSizes.includes(size.slug), () =>
                      onToggle("size", size.slug)
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const PAGE_BUTTON =
  "px-4 py-2 rounded-md border border-[#C8795A] text-[#C8795A] text-sm font-medium disabled:opacity-40";

export default function ShopPage() {
  const { addToCart, buyNow, optionsProduct, closeOptions, goToDetails } = useProductCardCart();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // Filter-er shob state URL-e thake, tai link share / back button kaj kore
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [filters, setFilters] = useState(null);

  const apiParams = new URLSearchParams();
  API_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) apiParams.set(key, key === "sort" ? SORT_ALIASES[value] || value : value);
  });
  const query = apiParams.toString();

  useEffect(() => {
    let cancelled = false;
    getShopProducts(query)
      .then((data) => {
        if (cancelled) return;
        setResult({ query, ...data });
        if (data.filters) setFilters(data.filters);
      })
      .catch(() => {
        if (!cancelled) setResult({ query, failed: true, products: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loading = result?.query !== query;
  const meta = loading ? null : result.meta;
  const page = Number(params.get("page")) || 1;
  const sort = apiParams.get("sort") || filters?.sort_options?.[0]?.value || "";

  // Filter bodlale page 1-e fire jay
  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next);
  };

  const selectCategory = (path) =>
    updateParams({ category: null, sub_category: null, child_category: null, ...path });

  const toggleValue = (key, slug) => {
    const list = toList(params.get(key));
    const next = list.includes(slug) ? list.filter((v) => v !== slug) : [...list, slug];
    updateParams({ [key]: next.join(",") });
  };

  // Slider ekdom shesh prante thakle param pathano hoy na, jate kono product bad na pore
  const applyPrice = (min, max) =>
    updateParams({
      min_price: min > filters.price.min ? String(min) : null,
      max_price: max < filters.price.max ? String(max) : null,
    });

  const goToPage = (next) => {
    const updated = new URLSearchParams(params);
    if (next > 1) updated.set("page", String(next));
    else updated.delete("page");
    setParams(updated);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Active filter chips
  const chips = [];

  const categoryKey = [...CATEGORY_KEYS].reverse().find((key) => params.get(key));
  if (categoryKey) {
    const slug = params.get(categoryKey);
    chips.push({
      id: "category",
      label: findCategory(filters?.categories, categoryKey, slug)?.name || slug,
      remove: () => selectCategory({}),
    });
  }

  [
    ["color", filters?.colors, ""],
    ["size", filters?.sizes, "Size: "],
  ].forEach(([key, options, prefix]) => {
    toList(params.get(key)).forEach((slug) => {
      chips.push({
        id: `${key}-${slug}`,
        label: prefix + (options?.find((item) => item.slug === slug)?.name || slug),
        remove: () => toggleValue(key, slug),
      });
    });
  });

  if (params.get("min_price") || params.get("max_price")) {
    const min = params.get("min_price") || filters?.price?.min || 0;
    const max = params.get("max_price") || filters?.price?.max || 0;
    chips.push({
      id: "price",
      label: `Price: ${formatPrice(min)} - ${formatPrice(max)}`,
      remove: () => updateParams({ min_price: null, max_price: null }),
    });
  }

  if (params.get("search"))
    chips.push({
      id: "search",
      label: `Search: ${params.get("search")}`,
      remove: () => updateParams({ search: null }),
    });

  const clearAll = () => setParams({});

  const panelProps = {
    filters,
    params,
    onSelectCategory: selectCategory,
    onToggle: toggleValue,
    onPrice: applyPrice,
  };

  const renderProducts = () => {
    if (loading) return <Loader type="dealofday" count={4} />;

    if (result.failed) {
      return (
        <p className="text-center py-16 text-gray-500">
          Could not load products. Please try again.
        </p>
      );
    }

    if (result.products.length === 0) {
      return <p className="text-center py-16 text-gray-500">No products found.</p>;
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {result.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={buyNow}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    );
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
            <FilterPanel {...panelProps} />
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
                  <FilterPanel dark showHeading={false} {...panelProps} />
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
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {loading
                ? "Loading..."
                : meta?.total
                ? `Showing ${meta.from}-${meta.to} of ${meta.total} results`
                : "0 results"}
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-2 md:justify-center">
              {chips.length > 0 && (
                <>
                  <span className="text-sm font-medium text-gray-700 mr-1">Active Filter</span>
                  {chips.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center bg-accent text-white px-3 py-1 rounded-md text-sm font-medium capitalize"
                    >
                      {item.label}
                      <button
                        type="button"
                        aria-label={`Remove ${item.label}`}
                        onClick={item.remove}
                        className="ml-1.5 hover:text-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-gray-500 underline ml-2 hover:text-gray-900 transition-colors"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-sm text-gray-600">Sort By:</span>
              <div className="relative">
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="appearance-none border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  {filters?.sort_options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {renderProducts()}

          {meta?.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className={PAGE_BUTTON}>
                Previous
              </button>
              <span className="text-sm text-gray-600">
                {meta.current_page} / {meta.last_page}
              </span>
              <button type="button" disabled={page >= meta.last_page} onClick={() => goToPage(page + 1)} className={PAGE_BUTTON}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <SelectOptionsPopup
        product={optionsProduct}
        onClose={closeOptions}
        onSelectOptions={goToDetails}
      />
    </div>
  );
}
