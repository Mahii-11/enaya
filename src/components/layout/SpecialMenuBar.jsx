import { Link, useLocation } from 'react-router-dom';
import { Flame } from 'lucide-react';

/*
 * Special / promo menu bar – main navbar-er thik niche boshe.
 * Notun link add korte shudhu ei array-te ekta object add korun.
 *   highlight: true  -> accent pill (Clovia-r "MEN'S / EXCLUSIVE" er moto)
 *   icon             -> optional lucide icon
 */
const SPECIAL_LINKS = [
  { label: 'Flash Sale', to: '/online-sale', highlight: true, icon: Flame },
  { label: 'Wholesale', to: '/shop-page?type=wholesale' },
  { label: 'Discount', to: '/shop-page?type=discount' },
  { label: 'New Arrivals', to: '/shop-page?sort=new' },
  { label: 'Best Sellers', to: '/shop-page?sort=best' },
  { label: 'Combo @999', to: '/shop-page?type=combo' },
  { label: 'Exclusive Offer', to: '/shop-page?type=exclusive', highlight: true },
  { label: 'Our Stores', to: '/our-location' },
];

// Pathname + link-er shob query param mille active dhora hobe
function isLinkActive(to, location) {
  const [path, query = ''] = to.split('?');
  if (location.pathname !== path) return false;
  const current = new URLSearchParams(location.search);
  const wanted = new URLSearchParams(query);
  if ([...wanted.keys()].length === 0) return current.toString() === '';
  return [...wanted.entries()].every(([key, value]) => current.get(key) === value);
}

export default function SpecialMenuBar() {
  const location = useLocation();

  return (
    <div className="bg-[#e89a7b]">
      <nav
        aria-label="Special offers"
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12"
      >
        <ul className="flex items-center gap-1 sm:gap-2 h-11 overflow-x-auto no-scrollbar whitespace-nowrap lg:justify-center">
          {SPECIAL_LINKS.map(({ label, to, highlight, icon: Icon }) => {
            const active = isLinkActive(to, location);

            const base =
              'group relative inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200';

            const style = highlight
              ? `rounded-full ${
                  active
                    ? 'bg-[#FFF5F5] text-black'
                    : 'bg-[#FFF5F5] hover:bg-[#FCF8F8] text-[#EF6905]'
                }`
              : active
                ? 'text-[#E7C9A0]'
                : 'text-white';

            return (
              <li key={label} className="shrink-0">
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={`${base} ${style}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {label}
                  {!highlight && (
                    <span
                      className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[1.5px] origin-left bg-white transition-transform duration-300 ease-out ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
