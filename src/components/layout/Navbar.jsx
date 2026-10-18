import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SpecialMenuBar from './SpecialMenuBar';

const NAV_ITEMS = [
  { label: 'Home', href: '#' },
  {
    label: 'Presets',
    href: '#presets',
    hasDropdown: true,
    items: [
      { name: 'Minimal Glow', href: '#glow' },
      { name: 'Pure Hydration', href: '#hydration' },
      { name: 'Radiance Boost', href: '#radiance' },
      { name: 'Night Repair', href: '#repair', badge: 'New' },
    ],
  },
  {
    label: 'Shop',
    href: '#shop',
    hasDropdown: true,
    items: [
      { name: 'All Products', href: '#all' },
      { name: 'Cleansers & Toners', href: '#cleansers' },
      { name: 'Active Serums', href: '#serums', badge: 'Popular' },
      { name: 'Moisturizers & Creams', href: '#moisturizers' },
      { name: 'Sun Protection (SPF)', href: '#spf' },
    ],
  },
  {
    label: 'Collections',
    href: '#collections',
    hasDropdown: true,
    items: [
      { name: 'Botanical Essentials', href: '#essentials' },
      { name: 'Ceramide Recovery', href: '#ceramide' },
      { name: 'Vitamin C Radiance', href: '#vitaminc' },
      { name: 'Travel Minis Kit', href: '#travel' },
    ],
  },
  {
    label: 'Pages',
    href: '#pages',
    hasDropdown: true,
    items: [
      { name: 'Our Philosophy', href: '#about' },
      { name: 'Clinical Studies', href: '#clinical' },
      { name: 'Ingredient Glossary', href: '#ingredients' },
      { name: 'Sustainability', href: '#sustainability' },
    ],
  },
  { label: 'Contact', href: '#contact' },
];

/* Reusable underline-hover link */
function UnderlineLink({ href, className = '', children, onClick }) {
  return (
    <a href={href} onClick={onClick} className={`relative inline-block group/link ${className}`}>
      {children}
      <span
        className="pointer-events-none absolute left-0 -bottom-0.5 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100"
      />
    </a>
  );
}

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky navbar listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile menu drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileSub = (label) => {
    setMobileSubOpen((prev) => (prev === label ? null : label));
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#FAF7F5] border-b transition-shadow duration-300 ${
        isScrolled ? 'shadow-sm border-[#F0EAE4]' : 'border-[#F0EAE4]/80'
      }`}
    >
      <nav
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-20 sm:h-22 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <div className="flex items-center">
          <a
            href="#"
            id="brand-logo"
            className="font-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 transition-opacity hover:opacity-80 flex items-center gap-1"
          >
            <span className="italic font-serif">Sleek</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] inline-block mb-1"></span>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[15px] font-normal text-neutral-800">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <UnderlineLink
                href={item.href}
                className="flex items-center gap-1.5 py-2 text-neutral-800 hover:text-[#C8795A] font-medium tracking-normal transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-neutral-500 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </span>
              </UnderlineLink>

              {/* Dropdown Menu */}
              {item.hasDropdown && item.items && (
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-0 w-60 py-2.5 bg-white rounded-2xl shadow-xl shadow-stone-900/5 border border-stone-200/80 z-50 overflow-hidden"
                    >
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:text-neutral-950 hover:bg-[#F9F5F1] transition-colors group/child"
                        >
                          <UnderlineLink href={undefined} className="text-neutral-700 group-hover/child:text-[#C8795A] transition-colors">
                            {subItem.name}
                          </UnderlineLink>
                          {subItem.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAD2C1] text-neutral-800 font-semibold uppercase tracking-wider">
                              {subItem.badge}
                            </span>
                          )}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        {/* Right Header Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-neutral-800">
          
          {/* সার্চ বাটন (শুধু মোবাইল/ট্যাবলেটের জন্য যেখানে সার্চ বার নিচে ওপেন হবে) */}
          <button
            id="header-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 hover:text-neutral-500 transition-colors cursor-pointer md:hidden"
            aria-label="Search"
            title="Search products"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* বড় স্ক্রিনের জন্য (md থেকে শুরু করে উপরে) ফিক্সড সার্চ বার */}
          <div className="hidden md:flex items-center bg-white shadow-sm rounded-full border border-stone-200 px-3 py-1.5 md:w-[200px] lg:w-[240px]">
            <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search your products..."
              className="w-full text-xs text-stone-900 focus:outline-none bg-transparent"
            />
          </div>

          {/* User Profile */}
          <button
            id="header-account-btn"
            className="p-1.5 hover:text-neutral-500 transition-colors cursor-pointer"
            aria-label="Account"
            title="My Account"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Heart */}
          <button
            id="header-wishlist-btn"
            className="p-1.5 hover:text-neutral-500 transition-colors cursor-pointer relative"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C8795A]"></span>
          </button>

          {/* Shopping Bag / Cart */}
          <button
            id="header-cart-btn"
            className="p-1.5 hover:text-neutral-500 transition-colors cursor-pointer relative"
            aria-label="Shopping Cart"
            title="Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#C8795A] text-white text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 lg:hidden text-neutral-900"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Special / promo menu bar (Wholesale, Discount, Exclusive ...) */}
      <SpecialMenuBar />

      {/* মোবাইল ভিউর জন্য মেইন নেভবারের একদম নিচে আলাদা রো বা বারে ওপেন হওয়া সার্চ বার */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-[#FAF7F5] border-t border-[#F0EAE4] px-4 py-3 md:hidden"
          >
            <div className="max-w-[1600px] mx-auto bg-white shadow-md rounded-full border border-stone-200 flex items-center px-4 py-2">
              <Search className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search your products..."
                autoFocus
                className="w-full text-sm text-stone-900 focus:outline-none bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-stone-700 ml-2 p-1"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Half-Page Drawer + Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/25 lg:hidden"
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm bg-black/55 backdrop-blur-[2px] text-[#E7C9A0] flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <span className="text-lg font-semibold tracking-wide text-[#E7C9A0]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full bg-white/5 text-[#E7C9A0] hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-3">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="border-b border-white/10">
                    <button
                      onClick={() =>
                        item.hasDropdown ? toggleMobileSub(item.label) : setMobileMenuOpen(false)
                      }
                      className="w-full flex items-center justify-between py-3.5 text-[15px] font-medium text-left"
                    >
                      <UnderlineLink
                        href={item.hasDropdown ? undefined : item.href}
                        onClick={(e) => {
                          if (item.hasDropdown) e.preventDefault();
                        }}
                        className="text-[#E7C9A0] hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </UnderlineLink>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 text-[#E7C9A0]/70 transition-transform duration-200 ${
                            mobileSubOpen === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {item.hasDropdown && (
                      <AnimatePresence initial={false}>
                        {mobileSubOpen === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 pb-2"
                          >
                            {item.items.map((sub) => (
                              <a
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2 text-sm text-[#E7C9A0]/80"
                              >
                                <UnderlineLink
                                  href={undefined}
                                  className="text-[#E7C9A0]/80 hover:text-white transition-colors duration-200"
                                >
                                  {sub.name}
                                </UnderlineLink>
                                {sub.badge && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#E7C9A0]/15 text-[#E7C9A0] font-semibold uppercase tracking-wider">
                                    {sub.badge}
                                  </span>
                                )}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-5 py-5 space-y-4">
                <a href="tel:+8801999080846" className="flex items-center gap-2 text-sm text-white">
                  <Phone className="w-4 h-4" />
                  Call: (+880) 01999080846
                </a>
                <a href="#wishlist" className="flex items-center gap-2 text-sm text-white">
                  <Heart className="w-4 h-4" />
                  My wishlist
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}