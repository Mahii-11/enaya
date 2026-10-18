import { ShoppingCart, Trash2 } from "lucide-react";

export default function Wishlist() {
   const wishlistItems = [
    { id: 1, name: "Sony WH-1000XM4 Headphones", price: "$349.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", status: "In Stock" },
    { id: 2, name: "Apple Magic Keyboard", price: "$299.00", image: "/images/samsung.png", status: "In Stock" },
    { id: 3, name: "Logitech MX Master 3S", price: "$99.99", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop", status: "In Stock" },
    { id: 4, name: "Dell Ultrasharp Monitor", price: "$799.99", image: "/images/laptop.png", status: "Out of Stock" },
    { id: 5, name: "Herman Miller Aeron Chair", price: "$1,395.00", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&h=200&fit=crop", status: "In Stock" },
    { id: 6, name: "Mechanical Keyboard RGB", price: "$179.99", image: "/images/ipad.png", status: "In Stock" },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Wishlist</h1>
        <p className="text-slate-500 mt-1">{wishlistItems.length} items saved for later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">{item.name}</h3>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div>
                  <p className="text-lg font-bold text-slate-900">{item.price}</p>
                  <p className={`text-xs font-medium ${item.status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                    {item.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.status === "In Stock" && (
                    <button className="p-2 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4A2EE0] transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}