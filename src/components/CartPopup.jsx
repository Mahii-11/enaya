import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function CartPopup({ popup, onClose }) {
  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          initial={{ x: 120, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 120, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="
          fixed 
          top-4 right-3
          sm:right-5 sm:top-6
          w-[260px] sm:w-[320px]
          bg-white/95 backdrop-blur-md
          border border-gray-100
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          rounded-xl
          p-3 sm:p-4
          z-[9999]
          "
        >

          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>

          {/* product info */}
          <div className="flex items-center gap-3">

            <img
              src={popup.image}
              alt="product"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border"
            />

            <div className="flex flex-col leading-tight">

              <p className="text-red-600 text-xs font-medium">
                Added to Cart
              </p>

              {popup.name && (
                <p className="text-sm font-medium text-gray-700 line-clamp-1">
                  {popup.name}
                </p>
              )}

              <p className="text-sm font-semibold text-gray-900">
                ৳{popup.price}
              </p>

            </div>

          </div>

          {/* buttons */}
          <div className="flex gap-2 mt-3">

            <button
              onClick={onClose}
              className="
              flex-1
              text-xs sm:text-sm
              border border-gray-200
              rounded-lg
              py-1.5 sm:py-2
              hover:bg-gray-50
              transition
              "
            >
              Close
            </button>

            <Link
              to="/cart"
              className="
              flex-1
              text-center
              text-xs sm:text-sm
              bg-black
              text-white
              rounded-lg
              py-1.5 sm:py-2
              transition
              "
            >
              View Cart
            </Link>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}