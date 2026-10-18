import { LayoutDashboard, ShoppingBag, Heart, Settings, LifeBuoy, LogOut, Package, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/api";

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await loginApi();
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }



  const navItemClass = (tabName) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
    activeTab === tabName 
      ? "bg-[#5B3DF5]/10 text-[#5B3DF5]" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50  md:z-50 lg:z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-[#5B3DF5] font-bold text-xl tracking-tight cursor-pointer hover:opacity-80"
          >
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            <span>ShopDash</span>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)} data-testid="button-close-sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          
          <div onClick={() => setActiveTab('dashboard')} className={navItemClass('dashboard')} data-testid="tab-dashboard">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </div>
          
          <div onClick={() => setActiveTab('orders')} className={navItemClass('orders')} data-testid="tab-orders">
            <Package className="w-5 h-5" />
            Orders
          </div>
          
          <div onClick={() => setActiveTab('wishlist')} className={navItemClass('wishlist')} data-testid="tab-wishlist">
            <Heart className="w-5 h-5" />
            Wishlist
          </div>
          
          <div onClick={() => setActiveTab('profile')} className={navItemClass('profile')} data-testid="tab-settings">
            <Settings className="w-5 h-5" />
            Account Settings
          </div>
          
          <div className="pt-6 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Help</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors" data-testid="link-support">
            <LifeBuoy className="w-5 h-5" />
            Support
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors" data-testid="button-logout">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}