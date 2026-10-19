import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem, createCartLine, openCartPopup } from '../cart/cartSlice';

// Product card-এর Add to Cart / Buy Now লজিক:
//  - variable product (Size/Color আছে) → "Select Options" পপআপ → details পেজ
//  - simple product → Add to Cart-এ cart-এ ঢোকে ও drawer খোলে; Buy Now-এ কার্ট ছাড়াই সরাসরি checkout-এ
export default function useProductCardCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [optionsProduct, setOptionsProduct] = useState(null);

  const closeOptions = useCallback(() => setOptionsProduct(null), []);

  const goToDetails = useCallback(
    (product) => {
      setOptionsProduct(null);
      navigate(`/product-details/${product.slug}`);
    },
    [navigate]
  );

  const buildPayload = (product, extra = {}) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumb_image: product.image,
    quantity: 1,
    price: product.price,
    offer_price: product.offer_price,
    min_price: product.min_price,
    has_variants: false,
    variant_id: 0,
    ...extra,
  });

  const addToCart = useCallback(
    (product) => {
      if (product.type === 'variable') {
        setOptionsProduct(product);
        return;
      }
      dispatch(addItem(buildPayload(product)));
      dispatch(openCartPopup());
    },
    [dispatch]
  );

  const buyNow = useCallback(
    (product) => {
      if (product.type === 'variable') {
        setOptionsProduct(product);
        return;
      }
      // Buy Now: কার্টে add হয় না, সরাসরি checkout-এ যায়
      navigate('/checkout', { state: { buyNowItem: createCartLine(buildPayload(product)) } });
    },
    [dispatch, navigate]
  );

  return { addToCart, buyNow, optionsProduct, closeOptions, goToDetails };
}
