import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Overview from "../components/dashboard/Overview";
import Orders from "../components/dashboard/Orders";
import Wishlist from "../components/dashboard/Wishlist";
import AccountSettings from "../components/dashboard/AccountSettings";
import { getUserProfile } from "../services/api";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user safely
    useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await getUserProfile();

      console.log("PROFILE RES:", res);

      if (res?.succcess === true && res?.data) {
        setUser(res.data); // 👈 IMPORTANT
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  // 🔵 LOADING STATE (IMPORTANT)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  // 🔴 NO USER STATE
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found / Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 sm:mt-6 md:mt-8 lg:mt-16">
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 🔥 SAFE USER PASS */}
        <Header
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          user={user}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {activeTab === "dashboard" && (
              <Overview user={user} setActiveTab={setActiveTab} />
            )}

            {activeTab === "orders" && <Orders />}

            {activeTab === "wishlist" && <Wishlist />}

            {activeTab === "profile" && (
              <AccountSettings user={user} setUser={setUser} />
            )}

          </div>
        </div>

      </main>
    </div>
  );
}