import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  decreaseItemQuantity,
  deleteItem,
  getCart,
  getShowCartPopup,
  getTotalCartPrice,
  getTotalCartQuantity,
  hideCartPopup,
  increaseItemQuantity,
} from '../cart/cartSlice';

const formatPrice = (value) => `৳${Number(value || 0).toLocaleString('en-US')}`;

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(getShowCartPopup);
  const items = useSelector(getCart);
  const totalQty = useSelector(getTotalCartQuantity);
  const subtotal = useSelector(getTotalCartPrice);

  const close = () => dispatch(hideCartPopup());

  // Esc দিয়ে বন্ধ + খোলা থাকলে পেছনের পেজ স্ক্রল লক
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dispatch(hideCartPopup());
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[1px]"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            className="fixed top-0 right-0 z-[9999] h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <h2 className="text-base font-semibold text-neutral-900">
                Your Bag <span className="text-neutral-500 font-normal">({totalQty})</span>
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-neutral-400" />
                </div>
                <p className="font-medium text-neutral-900">Your bag is empty</p>
                <p className="text-sm text-neutral-500">Add something you love to get started.</p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 overflow-y-auto divide-y divide-stone-100 px-5">
                  {items.map((item) => {
                    const ref = { slug: item.slug, variant_id: item.variant_id };
                    const variantText = [
                      item.size_name && `Size: ${item.size_name}`,
                      item.color_name && `Color: ${item.color_name}`,
                    ]
                      .filter(Boolean)
                      .join(' | ');

                    return (
                      <li key={`${item.slug}-${item.variant_id}`} className="flex gap-3 py-4">
                        <Link
                          to={`/product-details/${item.slug}`}
                          onClick={close}
                          className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-stone-100"
                        >
                          <img
                            src={item.image || '/images/motorola.png'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/motorola.png';
                            }}
                          />
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product-details/${item.slug}`}
                              onClick={close}
                              className="text-sm font-medium text-neutral-900 line-clamp-2 hover:text-[#C8795A] transition-colors"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => dispatch(deleteItem(ref))}
                              aria-label={`Remove ${item.name}`}
                              className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {variantText && (
                            <p className="text-xs text-neutral-500 mt-1">{variantText}</p>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => dispatch(decreaseItemQuantity(ref))}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="p-1.5 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => dispatch(increaseItemQuantity(ref))}
                                aria-label="Increase quantity"
                                className="p-1.5 hover:bg-stone-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-neutral-900">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Footer */}
                <div className="border-t border-stone-200 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Subtotal</span>
                    <span className="text-lg font-bold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">Delivery charge is calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="block text-center py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
