import { Menu, Search, Bell } from "lucide-react";


const baseURL = "https://backend.gadgetglobe.com.bd/";

export default function Header({ setSidebarOpen, setActiveTab, user }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      {/* Left: Menu & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setSidebarOpen(true)}
          data-testid="button-open-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="hidden sm:flex items-center bg-slate-100 px-3 py-2 rounded-lg w-64 border border-transparent focus-within:border-[#5B3DF5] focus-within:bg-white transition-all focus-within:ring-4 focus-within:ring-[#5B3DF5]/10">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" data-testid="button-notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile */}
        <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 cursor-pointer group" data-testid="button-profile-menu">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-[#5B3DF5] transition-colors" data-testid="text-username"> {user?.name || "Guest"}</p>
            <p className="text-xs text-slate-500">Customer</p>
          </div>
          <img 
            src={user?.image ? baseURL + user.image : "/default-avatar.png"}
            alt="User avatar" 
            className="w-9 h-9 rounded-full ring-2 ring-slate-100 group-hover:ring-[#5B3DF5]/30 transition-all object-cover" 
            data-testid="img-avatar-header" 
          />
        </div>
      </div>
    </header>
  );
}