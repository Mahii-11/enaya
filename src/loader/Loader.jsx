
/* ------------------ HERO SECTION LOADER ------------------ */export const HeroLoader = () => (
  <div className="w-full h-[420px] lg:h-[420px] flex flex-col lg:flex-row gap-6 animate-pulse md:py-10">
    <div className="lg:flex-1 bg-gray-200 rounded-xl"></div>
    <div className="lg:w-[300px] flex flex-col gap-6">
      <div className="bg-gray-200 h-[200px] rounded-xl"></div>
      <div className="bg-gray-200 h-[200px] rounded-xl"></div>
    </div>
  </div>
);

/* ------------------ WHY CHOOSE US LOADER ------------------ */
export const WhyChooseUsLoader = () => (
  <section className="w-full py-24">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-50 p-8 rounded-2xl animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-6"></div>
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------ CATEGORIES LOADER ------------------ */
export const CategoriesLoader = () => (
  <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="flex gap-16 overflow-hidden pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0 flex flex-col items-center animate-pulse">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 rounded-full p-[4px]">
              <div className="w-full h-full bg-white rounded-full shadow-xl"></div>
            </div>
            <div className="h-4 w-20 bg-gray-300 rounded mt-5"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------ PRODUCTS LOADER ------------------ */
export const ProductsLoader = () => (
  <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {Array.from({ length: 3 }).map((_, sectionIdx) => (
          <div key={sectionIdx}>
            <div className="h-8 w-1/2 bg-gray-300 rounded mb-8 animate-pulse"></div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow-md animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------ MOST VIEWED PRODUCTS LOADER ------------------ */
export const MostViewedLoader = () => (
  <section className="w-full py-24 bg-gradient-to-b from-white to-purple-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="flex gap-10 overflow-hidden pb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-52 sm:w-64 animate-pulse">
            <div className="relative h-[230px] sm:h-[280px] bg-gray-200 rounded-xl mb-3"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------ DEAL OF DAY LOADER ------------------ */
export const DealOfDayLoader = ({ count = 5 }) => (
  <section className="bg-[#f3f3f3] py-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <div className="h-6 w-1/3 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-3 rounded-md border animate-pulse flex flex-col h-[300px] relative">
            <div className="h-28 sm:h-40 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2 mx-auto"></div>
            <div className="flex items-center gap-2 mt-auto justify-center">
              <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded mt-3 w-full mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


/* ------------------ PRODUCT DETAILS LOADER ------------------ */
export const ProductDetailsLoader = () => (
  <div className="bg-gray-100 min-h-screen py-6 md:py-10 px-4">
    <div className="max-w-6xl mx-auto bg-white p-4 md:p-6 rounded-md shadow-sm animate-pulse">

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

        {/* LEFT SIDE - Image */}
        <div className="w-full lg:w-2/5 h-80 lg:h-[400px] bg-gray-200 rounded-md"></div>

        {/* RIGHT SIDE - Details */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4">

          {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>

          {/* Brand */}
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>

          {/* Status */}
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>

          {/* Price */}
          <div className="flex gap-4 items-center">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Colors */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-12 h-6 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Quantity */}
          <div className="flex gap-2">
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Description */}
          <div className="space-y-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

/* ------------------ SINGLE TYPE-BASED LOADER ------------------ */
const Loader = ({ type, count }) => {
  switch (type) {
    case "hero":
      return <HeroLoader />;
    case "whychooseus":
      return <WhyChooseUsLoader />;
    case "categories":
      return <CategoriesLoader />;
    case "products":
      return <ProductsLoader />;
    case "mostviewed":
      return <MostViewedLoader />;
    case "dealofday":
      return <DealOfDayLoader count={count} />;
         case "productdetails":
      return <ProductDetailsLoader />;
    default:
      return null;
  }
};

export default Loader;