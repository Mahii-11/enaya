// Home page-er shob component-er data ekta JSON-e (Navbar ar Footer baad).
// Ei structure-ta backend API response hishebe use kora jabe: GET /api/home
// Section order = Home.jsx er render order.

export const HOME_DATA = {
  categoryAndBanner: {
    categories: {
      title: 'All Categories',
      items: [
        { id: 1, name: 'Abaya Sets', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300&auto=format&fit=crop' },
        { id: 2, name: 'Kaftan', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=300&auto=format&fit=crop' },
        { id: 3, name: 'Hijab', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop' },
        { id: 4, name: 'Georgette', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop' },
        { id: 5, name: 'Party Wear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300&auto=format&fit=crop' },
        { id: 6, name: 'Khimar', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop' },
        { id: 7, name: 'Cardigan', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=300&auto=format&fit=crop' },
        { id: 8, name: 'Accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=300&auto=format&fit=crop' },
        { id: 9, name: 'Georgette', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop' },
        { id: 15, name: 'Party Wear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300&auto=format&fit=crop' },
        { id: 16, name: 'Khimar', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop' },
      ],
    },

    flashSale: {
      enabled: true,
      badgeText: '☪ EID SPECIAL • UP TO 70% OFF',
      title: 'Flash Sale',
      description:
        "Celebrate Eid with premium picks at all-time-low prices. New items added every hour—once they're gone, they're gone.",
      // Backend-e ekta endsAt (ISO date) dile frontend nijei countdown hisab korte parbe
      endsAt: null,
      timeLeft: { hours: 0, minutes: 59, seconds: 28 },
      buttonText: 'View all',
      buttonLink: '#flash-sale',
    },
  },

  xiaomiProductsSection: {
    title: 'Borka',
    viewAllLink: '#',
    products: [
      { id: 1, title: 'Premium Dubai Cherry Silk Abaya', discount: '15% OFF', currentPrice: 1450, originalPrice: 1700, image: '/images/burka-1.jpg' },
      { id: 2, title: 'Luxurious Kaftan Style Abaya Set', discount: '20% OFF', currentPrice: 1840, originalPrice: 2300, image: '/images/burka-2.jpg' },
      { id: 4, title: 'Classic Black Umbrella Cut Abaya', discount: '25% OFF', currentPrice: 1200, originalPrice: 1600, image: '/images/burka-4.jpg' },
      { id: 5, title: 'Designer Butterfly Layered Hijab Set', discount: '20% OFF', currentPrice: 1920, originalPrice: 2400, image: '/images/burka-5.jpg' },
      { id: 6, title: 'Turkish Cardigan Style Modest Abaya', discount: '15% OFF', currentPrice: 1530, originalPrice: 1800, image: '/images/burka-6.jpg' },
    ],
  },

  thinImageBanner: {
    banners: [
      {
        id: 1,
        title: 'Super Sale Strip Banner',
        imageUrl: '/images/Untitled design.png',
        link: '#',
      },
    ],
  },

  hijabSection: {
    title: 'Georgette',
    viewAllLink: '#',
    products: [
      { id: 1, title: 'Premium Chiffon Instant Hijab', category: 'Chiffon Hijab', discount: '15% OFF', currentPrice: 380, originalPrice: 450, image: '/images/hijab-1.jpg' },
      { id: 2, title: 'Luxury Turkish Silk Satin Hijab', category: 'Silk Hijab', discount: '20% OFF', currentPrice: 520, originalPrice: 650, image: '/images/hijab-2.jpg' },
      { id: 3, title: 'Breathable Jersey Everyday Hijab', category: 'Jersey Hijab', discount: '10% OFF', currentPrice: 315, originalPrice: 350, image: '/images/hijab-3.jpg' },
      { id: 4, title: 'Crinkle Crimp Cotton Scarf Hijab', category: 'Cotton Hijab', discount: '25% OFF', currentPrice: 270, originalPrice: 360, image: '/images/hijab-4.jpg' },
      { id: 5, title: '3-Layer Niqab & Khimar Hijab Set', category: 'Khimar & Niqab', discount: '20% OFF', currentPrice: 760, originalPrice: 950, image: '/images/hijab-5.jpg' },
    ],
  },

  watchAndShop: {
    title: 'Watch & Shop',
    subtitle: 'Watch our products in action and shop your favorites',
    duration: 40, // seconds for one full marquee loop
    products: [
      { id: 1, title: 'Premium Cotton Panjabi', embed: 'https://www.youtube.com/embed/kpbAT4zVzSQ', orientation: 'portrait', discount: '20% OFF', currentPrice: 1200, originalPrice: 1500 },
      { id: 2, title: 'Handcrafted Leather Wallet', embed: 'https://www.youtube.com/embed/kpbAT4zVzSQ', orientation: 'portrait', discount: '15% OFF', currentPrice: 850, originalPrice: 1000 },
      { id: 3, title: 'Classic Analog Watch', embed: 'https://www.youtube.com/embed/huG2oyrfCBY', orientation: 'portrait', discount: '30% OFF', currentPrice: 2450, originalPrice: 3500 },
      { id: 4, title: 'Comfort Fit Sneakers', embed: 'https://www.youtube.com/embed/neW6kWd4aHw', orientation: 'portrait', discount: '10% OFF', currentPrice: 1890, originalPrice: 2100 },
      { id: 5, title: 'Everyday Canvas Backpack', embed: 'https://www.youtube.com/embed/La4IHVe4U64', orientation: 'portrait', discount: '25% OFF', currentPrice: 1350, originalPrice: 1800 },
    ],
  },
};

export default HOME_DATA;
