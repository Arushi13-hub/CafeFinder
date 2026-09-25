import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  Footprints, 
  Coffee,
  X,
  Plus,
  ShoppingBag,
  Home as HomeIcon,
  Map as MapIcon,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check,
  Navigation,
  ExternalLink,
  Users,
  Sun,
  CloudSun,
  Volume2,
  User,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

import MapView from './components/MapView';
import DribbbleDrawerCard from './components/DribbbleDrawerCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import LocationModal from './components/LocationModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { 
  BrewingProgressBar, 
  BrewingBanner, 
  CafeGridSkeleton, 
  useBrewingTicker 
} from './components/BrewingLoader';
import { 
  fetchNearbyCafes, 
  getCachedCafes,
  fetchWalkingRoute,
  getBestUserLocation, 
  POPULAR_LOCATIONS,
  calculateDistance,
  formatDistance,
  estimateWalkTime,
  estimateDriveTime,
  fetchWeatherData,
  getOpeningStatus,
  getCafeVibeIndex,
  getCafePriceTier
} from './utils/geo';

// Lightweight SVG fallback for coffee imagery
const FALLBACK_COFFEE_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20fill%3D%22%23FAF7EE%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23FAF7EE%22%2F%3E%3Cpath%20d%3D%22M50%2075h70v40a35%2035%200%200%201-35%2035H85a35%2035%200%200%201-35-35V75zm70%2015h12a15%2015%200%200%201%200%2030h-12V90z%22%20fill%3D%22%238B5E3C%22%20opacity%3D%220.8%22%2F%3E%3Cpath%20d%3D%22M70%2055c0-8%206-12%206-20m18%2020c0-8%206-12%206-20m18%2020c0-8%206-12%206-20%22%20stroke%3D%22%238B5E3C%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.6%22%2F%3E%3C%2Fsvg%3E";

// UIX-Maruf Curated Coffee Products paired with artisan roasters
const COFFEE_MENU_ITEMS = [
  {
    id: 'c-1',
    name: 'Caramel Macchiato',
    cafeName: 'Roastery Coffee House',
    category: 'Machiato',
    descriptor: 'Deep Foam & Caramel',
    price: '₹240',
    priceNumber: 240,
    rating: '4.8',
    walkTime: '6 min',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and finished with a rich caramel drizzle.',
    roast: 'Medium Roast',
  },
  {
    id: 'c-2',
    name: 'Hazelnut Oat Latte',
    cafeName: 'Blue Tokai Roasters',
    category: 'Latte',
    descriptor: 'Rich Oat Milk & Nutty',
    price: '₹260',
    priceNumber: 260,
    rating: '4.9',
    walkTime: '8 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: 'Creamy barista oat milk paired with roasted hazelnut syrup and our signature artisan espresso roast.',
    roast: 'Dark Roast',
  },
  {
    id: 'c-3',
    name: 'Classic Americano',
    cafeName: 'Indian Coffee House',
    category: 'Americano',
    descriptor: 'Bold Espresso & Crema',
    price: '₹180',
    priceNumber: 180,
    rating: '4.7',
    walkTime: '4 min',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    description: 'Double shots of European-style espresso poured over hot water for a crisp, nuanced layer of golden crema.',
    roast: 'Artisan Blonde',
  },
  {
    id: 'c-4',
    name: 'Vanilla Nitro Cold Brew',
    cafeName: 'Third Wave Coffee',
    category: 'Cold Brew',
    descriptor: 'Slow-Steeped & Velvety',
    price: '₹280',
    priceNumber: 280,
    rating: '4.9',
    walkTime: '11 min',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-extracted for 18 hours in cold filtered water, infused with Madagascar vanilla bean extract.',
    roast: 'Single Origin',
  },
  {
    id: 'c-5',
    name: 'Almond Croissant & Brew',
    cafeName: 'The French Loaf Bakery',
    category: 'Bakery',
    descriptor: 'Flaky Pastry & Frangipane',
    price: '₹220',
    priceNumber: 220,
    rating: '4.8',
    walkTime: '7 min',
    image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-laminated golden butter croissant filled with almond frangipane cream and toasted sliced almonds.',
    roast: 'Bakery Special',
  },
  {
    id: 'c-6',
    name: 'Espresso Macchiato',
    cafeName: 'Cafe Mocha Lounge',
    category: 'Machiato',
    descriptor: 'Double Shot & Dollop Foam',
    price: '₹190',
    priceNumber: 190,
    rating: '4.6',
    walkTime: '5 min',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
    description: 'An intense double ristretto cut with a touch of dense, velvety milk froth.',
    roast: 'Signature Roast',
  },
  {
    id: 'c-7',
    name: 'Iced Spanish Latte',
    cafeName: 'The Beans & Leaves',
    category: 'Latte',
    descriptor: 'Condensed Milk & Cinnamon',
    price: '₹270',
    priceNumber: 270,
    rating: '4.9',
    walkTime: '9 min',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Sweetened condensed milk poured over ice, layered with creamy chilled milk and dark roast espresso.',
    roast: 'Sweet Blend',
  },
  {
    id: 'c-8',
    name: 'Artisan Cinnamon Roll',
    cafeName: 'Little Oven Patisserie',
    category: 'Bakery',
    descriptor: 'Warm Cream Cheese Glaze',
    price: '₹195',
    priceNumber: 195,
    rating: '4.8',
    walkTime: '6 min',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
    description: 'Warm spiral brioche baked with spicy Korintje cinnamon butter and smothered in cream cheese frosting.',
    roast: 'Bakery Special',
  },
  {
    id: 'c-9',
    name: 'Pour-Over V60 Special',
    cafeName: 'Single Origin Lab',
    category: 'All Coffee',
    descriptor: 'Floral Jasmine & Peach',
    price: '₹290',
    priceNumber: 290,
    rating: '4.9',
    walkTime: '12 min',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-poured filter coffee using light roast Ethiopian Yirgacheffe beans with jasmine blossoms and peach sweetness.',
    roast: 'Light Roast',
  },
  {
    id: 'c-10',
    name: 'Dark Mocha Cappuccino',
    cafeName: 'Espresso Alchemy',
    category: 'Latte',
    descriptor: 'Belgian Chocolate & Cocoa',
    price: '₹250',
    priceNumber: 250,
    rating: '4.8',
    walkTime: '8 min',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    description: 'Rich bittersweet chocolate sauce and espresso mixed with steamed milk and topped with cocoa dusting.',
    roast: 'Dark Roast',
  },
  {
    id: 'c-11',
    name: 'Pistachio Cold Foam Brew',
    cafeName: 'Artisan Roastery Hub',
    category: 'Cold Brew',
    descriptor: 'Salted Pistachio Cream',
    price: '₹310',
    priceNumber: 310,
    rating: '4.9',
    walkTime: '10 min',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    description: 'Signature cold brew coffee sweetened with vanilla and crowned with silky salted pistachio cream cold foam.',
    roast: 'Medium Dark',
  },
  {
    id: 'c-12',
    name: 'Blueberry Danish Pastry',
    cafeName: 'Corner Bakery & Cafe',
    category: 'Bakery',
    descriptor: 'Wild Blueberries & Cream',
    price: '₹210',
    priceNumber: 210,
    rating: '4.7',
    walkTime: '5 min',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Buttery puff pastry topped with vanilla bean pastry cream and sweet compote of whole wild blueberries.',
    roast: 'Bakery Special',
  }
];

const CATEGORIES = [
  'All Coffee',
  'Machiato',
  'Latte',
  'Americano',
  'Cold Brew',
  'Bakery'
];

export default function App() {
  // Location coordinates (Raipur, India by default)
  const [coords, setCoords] = useState({ lat: 21.2514, lon: 81.6296 });
  const [locationName, setLocationName] = useState('Raipur, India 📍');
  const [radius, setRadius] = useState(3000);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active in-app walking route state
  const [activeRoute, setActiveRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Dynamic Step-by-Step Brewing Status Ticker Hook
  const { step: loadingStep, tickerMessage, progressPercent } = useBrewingTicker(loading);

  // Active view: 'home' | 'map' | 'saved'
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All Coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCafeId, setActiveCafeId] = useState(null);

  // Feature 1: "Search this area" floating pill state
  const [mapCenter, setMapCenter] = useState({ lat: 21.2514, lon: 81.6296 });
  const [showSearchArea, setShowSearchArea] = useState(false);

  // Feature 2: Open-Meteo Weather state
  const [weather, setWeather] = useState(null);

  // Feature 4: Crowd & Noise Level Community Votes
  const [userVibeVotes, setUserVibeVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('cafe_vibe_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Feature 5: Budget / Price Tier filter
  const [selectedPriceTier, setSelectedPriceTier] = useState('All'); // 'All' | '$' | '$$' | '$$$'

  // Feature 6: Ephemeral toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Interactive vibe popover state for desktop left list
  const [vibeVoteTargetId, setVibeVoteTargetId] = useState(null);

  // Cart & Promo
  const [cartItems, setCartItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoClaimed, setPromoClaimed] = useState(false);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorite_coffee_items') || localStorage.getItem('favorite_cafes');
      return saved ? JSON.parse(saved) : ['c-1', 'c-2'];
    } catch {
      return ['c-1', 'c-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favorite_coffee_items', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const drawerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Current User (Session persistence in 'vibecafe_user' with legacy fallback)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vibecafe_user') || localStorage.getItem('cafefinder_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper: Show Ephemeral Toast
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Session Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('vibecafe_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    setIsAuthModalOpen(false);
    showToast(`Welcome back! You are now signed in. ☕`);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('vibecafe_user');
      localStorage.removeItem('cafefinder_user');
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    showToast('You have been signed out.');
  };

  /**
   * Feature 2: Fetch Live Weather from Open-Meteo API
   */
  useEffect(() => {
    let isMounted = true;
    fetchWeatherData(coords.lat, coords.lon).then((data) => {
      if (isMounted && data) {
        setWeather(data);
      }
    });
    return () => { isMounted = false; };
  }, [coords.lat, coords.lon]);

  /**
   * Load live cafes from Overpass API with instant sessionStorage caching
   */
  const loadCafes = useCallback(async (lat, lon, r = 3000, label = '') => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Reset active route & search area pill when query location changes
    setActiveRoute(null);
    setShowSearchArea(false);

    // Check instant cache first (0ms response)
    const cached = getCachedCafes(lat, lon, r);
    if (cached && cached.length > 0) {
      setCafes(cached);
      setCoords({ lat, lon });
      setMapCenter({ lat, lon });
      if (label) setLocationName(label);
      if (cached.length > 0) setActiveCafeId(cached[0].id);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchNearbyCafes(lat, lon, r, controller.signal);
      setCafes(results);
      setCoords({ lat, lon });
      setMapCenter({ lat, lon });
      if (label) setLocationName(label);
      if (results.length > 0) setActiveCafeId(results[0].id);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Overpass fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCafes(21.2514, 81.6296, 3000, 'Raipur, India 📍');
  }, [loadCafes]);

  // Handle Tab Switch with dynamic resize invalidation to ensure Leaflet recalculates correctly
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'map') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 250);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }
  };

  // Handle Location Switch
  const handleSelectLocation = (loc) => {
    setLocationName(loc.label);
    setCoords({ lat: loc.lat, lon: loc.lon });
    setMapCenter({ lat: loc.lat, lon: loc.lon });
    loadCafes(loc.lat, loc.lon, 3000, loc.label);
  };

  // Handle GPS detection with safe geolocation fallback
  const handleUseGps = async () => {
    setLoading(true);
    try {
      const loc = await getBestUserLocation();
      const targetLat = loc?.lat || coords?.lat || 21.2514;
      const targetLon = loc?.lon || coords?.lon || 81.6296;
      setCoords({ lat: targetLat, lon: targetLon });
      setMapCenter({ lat: targetLat, lon: targetLon });
      const name = `${loc?.cityName || 'My Location'} 📍`;
      setLocationName(name);
      await loadCafes(targetLat, targetLon, 3000, name);
    } catch (err) {
      console.warn('Geolocation fallback triggered:', err);
      // Safe fallback coordinates so map renders immediately without stuck loading state
      const fallbackLat = coords?.lat || 21.2514;
      const fallbackLon = coords?.lon || 81.6296;
      setCoords({ lat: fallbackLat, lon: fallbackLon });
      setMapCenter({ lat: fallbackLat, lon: fallbackLon });
      await loadCafes(fallbackLat, fallbackLon, 3000, locationName || 'Raipur, India 📍');
      showToast('GPS unavailable. Using default location 📍');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Feature 1: "Search this area" Handler
   * Triggered when user clicks the floating search pill after panning
   */
  const handleSearchThisArea = () => {
    if (!mapCenter) return;
    setShowSearchArea(false);
    loadCafes(mapCenter.lat, mapCenter.lon, radius, 'Explored Area 📍');
    showToast('Searching cafes in this area... 🔍');
  };

  // Claim Promo Deal (Confetti + BOGO 50% discount)
  const handleClaimPromo = () => {
    setDiscountPercent(50);
    setPromoClaimed(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => setPromoClaimed(false), 4000);
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    showToast(`Added ${product.name} to bag! ☕`);
  };

  /**
   * Direct "Navigate / Get Directions" Handler
   * Fetches real street geometry from OSRM and activates route polyline on Leaflet
   */
  const handleGetDirections = useCallback(async (cafe) => {
    if (!cafe || !coords) return;
    setActiveCafeId(cafe.id);
    setRouteLoading(true);

    if (activeTab !== 'map') {
      setActiveTab('map');
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 250);
    }

    const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    const mapsUrl = isApple
      ? `https://maps.apple.com/?saddr=${coords.lat},${coords.lon}&daddr=${cafe.lat},${cafe.lon}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lon}&destination=${cafe.lat},${cafe.lon}&travelmode=walking`;

    try {
      const routeData = await fetchWalkingRoute(coords.lat, coords.lon, cafe.lat, cafe.lon);
      if (routeData) {
        setActiveRoute({
          cafe,
          coordinates: routeData.coordinates,
          distanceFormatted: routeData.distanceFormatted || cafe.formattedDistance,
          walkMins: routeData.walkMins || parseInt(cafe.walkTime) || 5,
          googleMapsUrl: mapsUrl,
        });
        showToast(`Route plotted: ${routeData.distanceFormatted} walk`);
      }
    } catch (err) {
      console.warn('Failed to calculate route:', err);
    } finally {
      setRouteLoading(false);
    }
  }, [coords, activeTab, showToast]);

  // Clear active route from map and HUD
  const handleClearRoute = () => {
    setActiveRoute(null);
  };

  /**
   * Feature 4: Interactive Vibe Rating Community Voting
   */
  const handleVoteVibe = (cafeId, vibeLevel) => {
    setUserVibeVotes((prev) => {
      const next = { ...prev, [cafeId]: vibeLevel };
      try {
        localStorage.setItem('cafe_vibe_ratings', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    setVibeVoteTargetId(null);
    const text = vibeLevel === 'quiet' ? 'Quiet & Focused 🟢' : vibeLevel === 'buzz' ? 'Medium Buzz 🟡' : 'Lively & Social 🟠';
    showToast(`Vibe rated as ${text}! Thanks for contributing 🙌`);
  };

  /**
   * Feature 6: "Meet Here 👥" / Share Route Meetup Generator
   */
  const handleMeetHere = async (cafe) => {
    if (!cafe) return;
    const dist = cafe.formattedDistance || `${estimateWalkTime(cafe.distanceKm)}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lon}`;
    const inviteText = `Hey! Let's meet at ${cafe.name}. It's about ${dist} away. Here's the route & location: ${mapsUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Meet at ${cafe.name}`,
          text: inviteText,
          url: mapsUrl,
        });
        showToast('Meetup invite shared! 👥');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(inviteText);
        showToast('Meetup invite copied to clipboard! 👥');
        return;
      } catch {
        // ignore
      }
    }

    showToast(`Route link ready: ${mapsUrl}`);
  };

  /**
   * Feature 5: Filtered Cafes by Price Tier
   */
  const filteredCafes = useMemo(() => {
    if (selectedPriceTier === 'All') return cafes;
    return cafes.filter((c) => getCafePriceTier(c) === selectedPriceTier);
  }, [cafes, selectedPriceTier]);

  /**
   * Combine live cafes with curated coffee items + Price tier filtering
   */
  const displayItems = useMemo(() => {
    let items = COFFEE_MENU_ITEMS;

    // Filter by category
    if (selectedCategory !== 'All Coffee') {
      items = items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by favorites if on saved tab
    if (activeTab === 'saved') {
      items = items.filter((item) => favorites.includes(item.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.descriptor.toLowerCase().includes(q) ||
          item.cafeName.toLowerCase().includes(q)
      );
    }

    // Feature 5: Filter curated items by Price Tier
    if (selectedPriceTier !== 'All') {
      items = items.filter((item) => {
        if (selectedPriceTier === '$') return item.priceNumber < 210;
        if (selectedPriceTier === '$$') return item.priceNumber >= 210 && item.priceNumber <= 260;
        return item.priceNumber > 260;
      });
    }

    // Dynamically attach nearest live cafe coordinates and ETAs
    return items.map((item, idx) => {
      const matchedCafe = cafes[idx % (cafes.length || 1)];
      const distM = matchedCafe ? (matchedCafe.distanceKm * 1000) : ((idx + 1) * 350);
      const walkMins = Math.max(1, Math.round(distM / 80));
      const driveMins = Math.max(1, Math.round(distM / 416));

      return {
        ...item,
        lat: matchedCafe?.lat || coords.lat,
        lon: matchedCafe?.lon || coords.lon,
        address: matchedCafe?.address || 'Near City Center, Raipur',
        cafeName: matchedCafe?.name || item.cafeName,
        distance: matchedCafe?.formattedDistance ? `🚶 ${matchedCafe.formattedDistance}` : item.walkTime,
        walkMins,
        driveMins,
      };
    });
  }, [selectedCategory, activeTab, favorites, searchQuery, cafes, coords, selectedPriceTier]);

  // Sync drawer card scroll when user clicks a marker pin on map
  const handleSelectCafeFromMap = useCallback((cafe) => {
    setActiveCafeId(cafe.id);
    const cardEl = document.getElementById(`drawer-card-${cafe.id}`);
    if (cardEl && drawerRef.current) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const desktopItem = document.getElementById(`desktop-cafe-item-${cafe.id}`);
    if (desktopItem) {
      desktopItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#FAF7EE] text-[#0A2947] flex flex-col font-sans selection:bg-[#8B5E3C]/30 selection:text-[#0A2947]">
      
      {/* ===================================================================== */}
      {/* 0. INDETERMINATE PROGRESS BAR (TOP VIEWPORT)                          */}
      {/* ===================================================================== */}
      <BrewingProgressBar loading={loading || routeLoading} />

      {/* ===================================================================== */}
      {/* 1. DESKTOP / TABLET WIDE TOP NAVIGATION BAR (>= 768px: md:flex)        */}
      {/* ===================================================================== */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-xl border-b border-[#D3D4C0]/70">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => handleTabSwitch('home')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#0A2947] text-[#F3E4C9] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-[#8B5E3C]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#0A2947] block leading-none">
                  VibeCafe
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] font-semibold">
                  Artisan Coffee Co.
                </span>
              </div>
            </div>

            {/* Feature 1: Location Geocoding Selector Pill */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] text-xs font-semibold text-[#0A2947] transition-all shadow-sm group"
              title="Change city or search area with OpenStreetMap Nominatim"
            >
              <MapPin className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>{locationName}</span>
              <ChevronDown className="w-3 h-3 text-[#0A2947]/50 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Centered Navigation Links Dock */}
          <nav className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#D3D4C0]/70 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabSwitch('home')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-[#0A2947] text-[#FAF7EE] shadow-sm'
                  : 'text-[#0A2947]/70 hover:text-[#0A2947] hover:bg-[#FAF7EE]'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('map')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-[#0A2947] text-[#FAF7EE] shadow-sm'
                  : 'text-[#0A2947]/70 hover:text-[#0A2947] hover:bg-[#FAF7EE]'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Explore Map</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('saved')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'saved'
                  ? 'bg-[#0A2947] text-[#FAF7EE] shadow-sm'
                  : 'text-[#0A2947]/70 hover:text-[#0A2947] hover:bg-[#FAF7EE]'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
              <span>Saved</span>
              {favorites.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#8B5E3C] text-white font-bold ml-0.5">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: Weather Pill, Live GPS, Surprise Me, Cart & Bag */}
          <div className="flex items-center gap-3">
            
            {/* Feature 2: Free Open-Meteo Weather Pill */}
            {weather && (
              <div 
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D3D4C0]/80 text-xs font-mono text-[#0A2947] shadow-sm"
                title={`${weather.condition}: ${weather.recommendation}`}
              >
                <span className="text-sm">{weather.icon}</span>
                <span className="font-bold">{weather.temp}°C</span>
                <span className="text-[#0A2947]/30">•</span>
                <span className="text-[#8B5E3C] font-semibold truncate max-w-[140px]">
                  {weather.isPatioWeather ? 'Patio Weather 🌿' : weather.condition}
                </span>
              </div>
            )}

            {/* Live GPS badge */}
            <button
              type="button"
              onClick={handleUseGps}
              disabled={loading}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D3D4C0]/70 text-xs font-mono text-[#0A2947]/80 hover:text-[#0A2947] transition-all"
              title="Detect real-time GPS location"
            >
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-600'}`} />
              <span>{loading ? 'Locating...' : 'GPS Active'}</span>
            </button>

            {/* "Surprise Me 🎲" button */}
            <button
              type="button"
              onClick={() => {
                const rand = displayItems[Math.floor(Math.random() * displayItems.length)];
                if (rand) setSelectedProduct(rand);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-white border border-[#D3D4C0]/80 text-xs font-bold text-[#0A2947] flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>Surprise Me 🎲</span>
            </button>

            {/* Coffee Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartModalOpen(true)}
              className="h-10 px-4 rounded-full bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 relative"
            >
              <ShoppingBag className="w-4 h-4 text-[#F3E4C9]" />
              <span>Bag</span>
              {cartItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#8B5E3C] text-white text-[10px] font-mono font-bold animate-pop">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            {!currentUser ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-4 rounded-full bg-white hover:bg-[#FAF7EE] border border-[#D3D4C0] hover:border-[#8B5E3C] text-xs font-bold text-[#0A2947] flex items-center gap-2 shadow-sm transition-all active:scale-95"
                title="Sign In to VibeCafe"
              >
                <User className="w-4 h-4 text-[#8B5E3C]" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="h-10 pl-2.5 pr-3.5 rounded-full bg-white hover:bg-[#FAF7EE] border border-[#D3D4C0] hover:border-[#8B5E3C] text-xs font-bold text-[#0A2947] flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  title="View account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center text-[11px] font-bold uppercase shadow-sm">
                    {currentUser.avatarInitial || (currentUser.name ? currentUser.name.charAt(0) : 'C')}
                  </div>
                  <span className="truncate max-w-[120px]">
                    Hi, {currentUser.name ? currentUser.name.split(' ')[0] : 'Alex'} ☕
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#0A2947]/50 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mini Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#FAF7EE] border border-[#D3D4C0] rounded-2xl shadow-xl py-2 z-50 animate-pop">
                    <div className="px-3.5 py-2 border-b border-[#D3D4C0]/60">
                      <p className="text-xs font-bold text-[#0A2947] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-[#0A2947]/60 truncate font-mono">{currentUser.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleTabSwitch('saved');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#0A2947] hover:bg-[#F3E4C9] flex items-center gap-2 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>My Saved Cafes</span>
                      {favorites.length > 0 && (
                        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#8B5E3C] text-white font-bold">
                          {favorites.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLocationModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#0A2947] hover:bg-[#F3E4C9] flex items-center gap-2 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>Preferences</span>
                    </button>

                    <div className="border-t border-[#D3D4C0]/60 my-1" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-3.5 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MOBILE TOP BAR (< 768px: md:hidden)                                 */}
      {/* ===================================================================== */}
      <div className="md:hidden px-4 pt-3 pb-2 space-y-3">
        {/* Top Location + Weather + Bag + User Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0A2947]/50 block">
              Location
            </span>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0A2947] hover:text-[#8B5E3C] transition-colors group"
            >
              <span>{locationName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5E3C] group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Feature 2: Mobile Weather Pill */}
            {weather && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#D3D4C0]/70 text-[11px] font-mono text-[#8B5E3C] font-semibold shadow-sm">
                <span>{weather.icon}</span>
                <span>{weather.temp}°C</span>
                {weather.isPatioWeather && <span>🌿</span>}
              </div>
            )}

            {/* Mobile User / Sign In Button */}
            {!currentUser ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-3 rounded-2xl bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] text-xs font-bold text-[#0A2947] flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Sign In"
              >
                <User className="w-4 h-4 text-[#8B5E3C]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-2.5 rounded-2xl bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] text-xs font-bold text-[#0A2947] flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Account Settings"
              >
                <div className="w-5 h-5 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {currentUser.avatarInitial || (currentUser.name ? currentUser.name.charAt(0) : 'C')}
                </div>
                <span className="truncate max-w-[60px] text-[11px]">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
                </span>
              </button>
            )}

            {/* Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartModalOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white border border-[#D3D4C0]/70 flex items-center justify-center text-[#0A2947] hover:border-[#8B5E3C] transition-all shadow-sm relative active:scale-95"
              title="View Coffee Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItems.length > 0 ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5E3C] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-sm animate-pop">
                  {cartItems.length}
                </span>
              ) : (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8B5E3C] shadow-sm" />
              )}
            </button>
          </div>
        </div>

        {/* User Greeting Headline */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0A2947] leading-tight">
            Find the best<br />coffee for you
          </h1>
        </div>

        {/* Search & Dedicated Filter Toggle */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, blend, spot..."
              className="w-full h-11 pl-10 pr-9 bg-white border border-[#D3D4C0]/70 focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 rounded-2xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/40 focus:outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#0A2947]/40 hover:text-[#0A2947]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-[#0A2947] text-[#F3E4C9] flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
            title="Filter by City or Location"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#F3E4C9]" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. FLUID MAIN CONTENT AREA (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)   */}
      {/* ===================================================================== */}
      <div className={`w-full max-w-7xl mx-auto flex-1 flex flex-col ${
        activeTab === 'map'
          ? 'px-2 sm:px-6 lg:px-8 pt-2 pb-16 md:py-6 md:pb-12'
          : 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-12'
      }`}>
        
        {/* =================================================================== */}
        {/* VIEW 1: HOME (Editorial Coffeehouse Discovery)                     */}
        {/* =================================================================== */}
        {activeTab === 'home' && (
          <main className="space-y-6 sm:space-y-8 animate-fadeIn">
            
            {/* 3.1 FEATURED PROMO HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0A2947] text-[#FAF7EE] shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A2947] via-[#0A2947]/90 to-transparent" />

              <div className="relative p-6 sm:p-8 lg:p-12 md:grid md:grid-cols-12 md:gap-8 md:items-center">
                
                {/* Left Column (7 cols): Editorial Typography & CTAs */}
                <div className="md:col-span-7 space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5E3C] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#F3E4C9]" />
                    <span>Promo • Curated Specialty Roasts</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Buy one get one <span className="text-[#F3E4C9]">FREE</span><br className="hidden sm:inline" />
                    on all artisan brews
                  </h2>

                  <p className="text-xs sm:text-sm text-[#D3D4C0] font-normal leading-relaxed max-w-xl">
                    Discover live artisan roasters and specialty coffee bars in {locationName.replace('📍', '')}.
                    Handcrafted pour-overs, nitro cold brews, and cozy quiet study nooks.
                  </p>

                  <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClaimPromo}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#F3E4C9] hover:bg-white text-[#0A2947] text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      {discountPercent > 0 ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>50% BOGO Deal Applied!</span>
                        </>
                      ) : (
                        <>
                          <span>Claim Deal</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch('map')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>Explore on Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Column (5 cols, Desktop only): Showcase Card */}
                <div className="hidden md:block md:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[4/3] group">
                    <img
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                      alt="Featured Roast"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_COFFEE_SVG;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0A2947]/90 backdrop-blur-md border border-white/20 text-[#FAF7EE] text-xs font-mono font-bold shadow-md">
                      ★ 4.9 Specialty Grade
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] font-mono uppercase text-[#F3E4C9] font-bold">Featured Roast of the Week</p>
                      <h4 className="text-sm lg:text-base font-bold">Ethiopian Guji Natural Pour-Over</h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Promo Claimed Toast Notification */}
            {promoClaimed && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs sm:text-sm text-emerald-800 shadow-sm animate-pop">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-semibold">
                  50% BOGO discount added! Applied automatically to your bag.
                </p>
              </div>
            )}

            {/* 3.2 REAL-TIME BREWING TICKER */}
            {loading && (
              <BrewingBanner
                step={loadingStep}
                tickerMessage={tickerMessage}
                progressPercent={progressPercent}
              />
            )}

            {/* 3.3 HORIZONTAL CATEGORY & PRICE FILTER CAROUSEL */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2947]/60 font-mono">
                  Browse by Category & Budget
                </h3>
                {(selectedCategory !== 'All Coffee' || selectedPriceTier !== 'All') && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All Coffee');
                      setSelectedPriceTier('All');
                    }}
                    className="text-xs text-[#8B5E3C] font-semibold hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Category Pills Row */}
              <div className="flex items-center gap-2 overflow-x-auto snap-x no-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`h-9 px-4 sm:px-5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 snap-start active:scale-95 ${
                        isActive
                          ? 'bg-[#0A2947] text-[#FAF7EE] shadow-md shadow-[#0A2947]/20 font-bold'
                          : 'bg-white text-[#0A2947]/70 border border-[#D3D4C0]/80 hover:bg-[#FAF7EE] hover:text-[#0A2947]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

                {/* Feature 5: Budget / Price Tier Strip in Category Row */}
                <div className="h-6 w-px bg-[#D3D4C0] mx-1 shrink-0" />
                {['All', '$', '$$', '$$$'].map((tier) => (
                  <button
                    key={`price-${tier}`}
                    type="button"
                    onClick={() => setSelectedPriceTier(tier)}
                    className={`h-9 px-3.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 shrink-0 snap-start active:scale-95 ${
                      selectedPriceTier === tier
                        ? 'bg-[#8B5E3C] text-white shadow-md'
                        : 'bg-white text-[#0A2947]/70 border border-[#D3D4C0]/80 hover:border-[#8B5E3C]'
                    }`}
                    title={`Filter by budget: ${tier}`}
                  >
                    {tier === 'All' ? 'All Prices' : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* 3.4 RESPONSIVE ADAPTIVE CARD GRID */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-xl font-bold tracking-tight text-[#0A2947]">
                    Popular Near You
                  </h3>
                  <p className="text-xs text-[#0A2947]/60 font-mono">
                    {displayItems.length} artisan roasters & drinks ready for pickup
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabSwitch('map')}
                  className="text-xs font-bold text-[#8B5E3C] hover:text-[#724c30] flex items-center gap-1 transition-colors"
                >
                  <span>Explore on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Show Shimmer Skeleton while loading initial cafes, or Grid when loaded */}
              {loading && cafes.length === 0 ? (
                <CafeGridSkeleton count={8} />
              ) : displayItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6 animate-fadeIn">
                  {displayItems.map((item, index) => {
                    const isFav = favorites.includes(item.id);
                    const animationDelay = `${index * 45}ms`;

                    return (
                      <div
                        key={item.id}
                        style={{ animationDelay }}
                        onClick={() => setSelectedProduct(item)}
                        className="card-cascade-enter bg-white rounded-2xl p-3 sm:p-4 border border-[#D3D4C0]/60 shadow-md shadow-[#0A2947]/05 hover:shadow-xl hover:border-[#8B5E3C]/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
                      >
                        <div>
                          {/* Image Header with Floating Rating and Favorite Heart */}
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#0A2947]/08">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_COFFEE_SVG;
                              }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Floating Rating Tag in top-left: ★ 4.8 */}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0A2947]/85 backdrop-blur-sm text-[#FAF7EE] text-[10px] sm:text-xs font-mono font-bold flex items-center gap-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-[#8B5E3C] text-[#8B5E3C]" />
                              <span>{item.rating}</span>
                            </div>

                            {/* Favorite Heart Button in top-right */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#0A2947] hover:text-[#8B5E3C] shadow-sm transition-transform active:scale-90"
                              title={isFav ? 'Remove from favorites' : 'Save favorite'}
                            >
                              <Heart className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
                            </button>
                          </div>

                          {/* Card Body: Cafe/Drink Name, Descriptor, ETAs */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] font-semibold truncate">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-mono text-[#0A2947]/50 truncate">
                                {item.cafeName}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-[#0A2947] tracking-tight truncate group-hover:text-[#8B5E3C] transition-colors">
                              {item.name}
                            </h4>

                            <p className="text-[11px] sm:text-xs text-[#0A2947]/65 truncate font-medium">
                              {item.descriptor}
                            </p>

                            {/* Walking & Driving Dynamic ETA Badges */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-[10px] font-semibold">
                                🚶 {item.walkMins}m
                              </span>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0A2947]/08 text-[#0A2947] text-[10px] font-medium">
                                🚗 {item.driveMins}m
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Price on left, Circular "+" in #8B5E3C on right */}
                        <div className="mt-3.5 pt-2.5 border-t border-[#D3D4C0]/50 flex items-center justify-between">
                          <span className="text-sm sm:text-base font-extrabold text-[#0A2947] font-mono">
                            {item.price}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B5E3C] hover:bg-[#724c30] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                            title="Add to coffee bag"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#D3D4C0]/60 space-y-2">
                  <Coffee className="w-8 h-8 text-[#8B5E3C] mx-auto opacity-50" />
                  <p className="text-xs font-bold text-[#0A2947]">No drinks match your filter</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Coffee');
                      setSelectedPriceTier('All');
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#8B5E3C] underline font-semibold"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Editorial Boutique Footer */}
            <Footer
              onSurpriseMe={() => {
                const rand = displayItems[Math.floor(Math.random() * displayItems.length)];
                if (rand) setSelectedProduct(rand);
              }}
              onUseGps={handleUseGps}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onTabSwitch={handleTabSwitch}
              onShowToast={showToast}
            />
          </main>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: EXPLORE MAP (Responsive Split Layout with 6 Features)        */}
        {/* =================================================================== */}
        {activeTab === 'map' && (
          <div className="w-full flex-1 flex flex-col h-[calc(100dvh-80px)] md:h-[calc(100vh-90px)] relative">
            <div className="w-full h-full md:grid md:grid-cols-12 md:gap-6 relative">
              
              {/* Desktop Left Column (5 cols md, 4 cols lg): Scrollable Cafe List with Features 3, 4, 5, 6 */}
              <div className="hidden md:flex md:col-span-5 lg:col-span-4 bg-white rounded-3xl border border-[#D3D4C0]/80 shadow-xl flex-col h-full overflow-hidden">
                
                {/* Search & Radius Header */}
                <div className="p-4 border-b border-[#D3D4C0]/70 space-y-3 shrink-0 bg-[#FAF7EE]/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#0A2947]">
                        Roasteries in {locationName.replace('📍', '').trim()}
                      </h2>
                      <p className="text-xs text-[#0A2947]/60 font-mono">
                        {filteredCafes.length} places discovered nearby
                      </p>
                    </div>

                    {/* Radius quick selector */}
                    <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-white border border-[#D3D4C0]/70 text-xs font-mono">
                      {[1000, 3000, 5000].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setRadius(r);
                            loadCafes(coords.lat, coords.lon, r, locationName);
                          }}
                          className={`h-6 px-2.5 rounded-full text-[11px] font-mono transition-all ${
                            radius === r
                              ? 'bg-[#0A2947] text-[#FAF7EE] font-bold shadow-sm'
                              : 'text-[#0A2947]/70 hover:bg-[#0A2947]/08'
                          }`}
                        >
                          {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature 5: Budget / Price Tier Strip in Left Panel */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-[#0A2947]/60 font-semibold uppercase tracking-wider">
                      Price Filter:
                    </span>
                    <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-white border border-[#D3D4C0]/80 shadow-sm">
                      {['All', '$', '$$', '$$$'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setSelectedPriceTier(tier)}
                          className={`h-5 px-2.5 rounded-full text-[11px] font-mono transition-all ${
                            selectedPriceTier === tier
                              ? 'bg-[#0A2947] text-[#FAF7EE] font-bold shadow-sm'
                              : 'text-[#0A2947]/70 hover:bg-[#0A2947]/08'
                          }`}
                        >
                          {tier === 'All' ? 'All Prices' : tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vertical Scrollable List of Cafes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {loading && cafes.length === 0 ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`left-skel-${i}`} className="p-3.5 rounded-2xl border border-[#D3D4C0]/50 flex gap-3.5 items-center">
                          <div className="w-16 h-16 rounded-xl skeleton-shimmer shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                            <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                            <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredCafes.length > 0 ? (
                    filteredCafes.map((cafe, index) => {
                      const isActive = activeCafeId === cafe.id;
                      const isRouteActive = activeRoute?.cafe?.id === cafe.id;
                      const rating = (4.6 + (index % 4) * 0.1).toFixed(1);
                      const distM = (cafe.distanceKm ? cafe.distanceKm * 1000 : (index + 1) * 350);
                      const walkMins = Math.max(1, Math.round(distM / 80));
                      const driveMins = Math.max(1, Math.round(distM / 416));

                      // Feature 3: Live opening hours status
                      const opening = getOpeningStatus(cafe.rawTags?.opening_hours || cafe.opening_hours, cafe.id);

                      // Feature 4: Crowd & Noise Level
                      const vibe = getCafeVibeIndex(cafe, userVibeVotes);

                      // Feature 5: Budget Price Tier
                      const priceTier = getCafePriceTier(cafe);

                      // Feature 2: Patio Recommender
                      const isPatioRec = weather?.isPatioWeather && cafe.outdoorSeating;

                      const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
                      const directMapsUrl = isApple
                        ? `https://maps.apple.com/?saddr=${coords.lat},${coords.lon}&daddr=${cafe.lat},${cafe.lon}&dirflg=w`
                        : `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lon}&destination=${cafe.lat},${cafe.lon}&travelmode=walking`;

                      return (
                        <div
                          key={cafe.id}
                          id={`desktop-cafe-item-${cafe.id}`}
                          onClick={() => {
                            setActiveCafeId(cafe.id);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2.5 relative ${
                            isActive
                              ? 'bg-[#F3E4C9] border-[#8B5E3C] shadow-md -translate-y-0.5'
                              : 'bg-[#FAF7EE] border-[#D3D4C0]/60 hover:bg-white hover:border-[#8B5E3C]/60 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex gap-3.5 items-start">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0A2947]/10 shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80"
                                alt={cafe.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = FALLBACK_COFFEE_SVG;
                                }}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 left-1 px-1 rounded bg-[#0A2947]/85 text-[#FAF7EE] text-[9px] font-mono font-bold">
                                {priceTier}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-sm font-bold text-[#0A2947] truncate">
                                  {cafe.name}
                                </h4>
                                <span className="text-xs font-mono font-bold text-[#8B5E3C] flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-[#8B5E3C]" />
                                  {rating}
                                </span>
                              </div>

                              {/* Dynamic ETA badges */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold mt-1">
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C]">
                                  🚶 {walkMins}m
                                </span>
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0A2947]/08 text-[#0A2947]">
                                  🚗 {driveMins}m
                                </span>
                                <span className="font-mono text-[#0A2947]/60 font-normal">
                                  {cafe.formattedDistance}
                                </span>
                              </div>

                              {/* Feature 3: Live Status + Feature 2: Patio Day Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#D3D4C0]/80 text-[#0A2947]">
                                  <span className={`w-1.5 h-1.5 rounded-full ${opening.dotColor} ${opening.isOpen ? 'animate-pulse' : ''}`} />
                                  <span>{opening.text}</span>
                                </span>

                                {isPatioRec && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    🌿 Patio Day
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Feature 4: Vibe Index Meter with Community Voting */}
                          <div className="pt-1 flex items-center justify-between">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVibeVoteTargetId(vibeVoteTargetId === cafe.id ? null : cafe.id);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${vibe.badgeClass}`}
                                title="Click to vote crowd & noise level"
                              >
                                <span>{vibe.label}</span>
                                <span className="text-[9px] opacity-70 underline ml-0.5">Vote</span>
                              </button>

                              {/* Interactive Vibe Voting Popover */}
                              {vibeVoteTargetId === cafe.id && (
                                <div 
                                  onClick={(e) => e.stopPropagation()} 
                                  className="absolute left-0 bottom-full mb-1 z-30 bg-[#0A2947] text-white p-2 rounded-xl shadow-xl border border-white/20 space-y-1 w-44 animate-pop"
                                >
                                  <div className="text-[10px] font-mono text-[#F3E4C9] font-bold pb-1 border-b border-white/10">
                                    Current Vibe?
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteVibe(cafe.id, 'quiet')}
                                    className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                                  >
                                    <span>🟢 Quiet & Focused</span>
                                    {userVibeVotes[cafe.id] === 'quiet' && <Check className="w-3 h-3 text-emerald-400" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteVibe(cafe.id, 'buzz')}
                                    className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                                  >
                                    <span>🟡 Medium Buzz</span>
                                    {userVibeVotes[cafe.id] === 'buzz' && <Check className="w-3 h-3 text-amber-400" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVoteVibe(cafe.id, 'lively')}
                                    className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                                  >
                                    <span>🟠 Lively & Social</span>
                                    {userVibeVotes[cafe.id] === 'lively' && <Check className="w-3 h-3 text-orange-400" />}
                                  </button>
                                </div>
                              )}
                            </div>

                            <span className="text-[11px] text-[#0A2947]/50 font-mono truncate max-w-[120px]">
                              {cafe.address || 'Espresso Bar'}
                            </span>
                          </div>

                          {/* CTAs: Directions + Meet Here 👥 + External Map */}
                          <div className="pt-2 border-t border-[#D3D4C0]/50 flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {/* Directions Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetDirections(cafe);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 ${
                                  isRouteActive
                                    ? 'bg-[#0A2947] text-[#FAF7EE]'
                                    : 'bg-[#8B5E3C] hover:bg-[#724c30] text-white'
                                }`}
                                title="Show in-app walking route"
                              >
                                <Navigation className="w-3.5 h-3.5 fill-current" />
                                <span>{isRouteActive ? 'Route Active' : 'Directions'}</span>
                              </button>

                              {/* Feature 6: Meet Here 👥 Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMeetHere(cafe);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-white border border-[#D3D4C0]/90 hover:border-[#8B5E3C] text-[#0A2947] hover:text-[#8B5E3C] text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                                title="Share meetup invite with friends"
                              >
                                <Users className="w-3.5 h-3.5 text-[#8B5E3C]" />
                                <span>Meet 👥</span>
                              </button>
                            </div>

                            {/* External Maps Launcher */}
                            <a
                              href={directMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Open turn-by-turn navigation in Google / Apple Maps"
                              className="px-2 py-1.5 rounded-xl bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] hover:text-[#8B5E3C] text-[#0A2947] text-xs font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                            >
                              <span>Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center bg-[#FAF7EE] rounded-2xl border border-[#D3D4C0]/70 space-y-2">
                      <Coffee className="w-7 h-7 text-[#8B5E3C] mx-auto opacity-40" />
                      <p className="text-xs font-bold text-[#0A2947]">No cafes match price {selectedPriceTier}</p>
                      <button
                        onClick={() => setSelectedPriceTier('All')}
                        className="text-xs text-[#8B5E3C] underline font-semibold"
                      >
                        Reset Price Filter
                      </button>
                    </div>
                  )}

                  {/* Compact Footer at end of Explore Map Cafe List */}
                  <Footer
                    compact={true}
                    onTabSwitch={handleTabSwitch}
                    onShowToast={showToast}
                  />
                </div>
              </div>

              {/* Map Column (Mobile: Fullscreen col-span-12, Desktop: md:col-span-7 lg:col-span-8) */}
              <div className="col-span-12 md:col-span-7 lg:col-span-8 relative w-full h-[calc(100dvh-80px)] md:h-full rounded-2xl md:rounded-3xl border border-[#D3D4C0]/80 overflow-hidden shadow-xl bg-[#E8E2D8] z-0">
                <MapView
                  userCoords={coords}
                  cafes={filteredCafes}
                  activeCafeId={activeCafeId}
                  onSelectCafe={(c) => {
                    handleSelectCafeFromMap(c);
                  }}
                  isLoading={loading || routeLoading}
                  radius={radius}
                  activeTab={activeTab}
                  routeCoordinates={activeRoute?.coordinates || null}
                  onMapMoveEnd={(newCenter) => {
                    setMapCenter(newCenter);
                    const dist = calculateDistance(coords.lat, coords.lon, newCenter.lat, newCenter.lon);
                    if (dist > 0.5) {
                      setShowSearchArea(true);
                    }
                  }}
                />

                {/* Floating Overlays Layer (Top Controls & Bottom Drawer) */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                  {/* Top Floating Controls */}
                  <div className="w-full p-3 sm:p-4 space-y-2 pointer-events-none">
                    {/* FEATURE 1: FLOATING "SEARCH THIS AREA" PILL BUTTON */}
                    {showSearchArea && (
                      <div className="flex justify-center pointer-events-none animate-pop">
                        <button
                          type="button"
                          onClick={handleSearchThisArea}
                          className="pointer-events-auto px-4 py-2 rounded-full bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-bold flex items-center gap-2 shadow-2xl border border-[#F3E4C9]/40 active:scale-95 transition-all"
                        >
                          <Search className="w-3.5 h-3.5 text-[#F3E4C9]" />
                          <span>Search this area</span>
                        </button>
                      </div>
                    )}

                    {/* ACTIVE NAVIGATION HUD ON THE MAP WITH FEATURE 6 MEET HERE */}
                    {activeRoute && (
                      <div className="pointer-events-auto max-w-xl mx-auto">
                        <div className="bg-[#0A2947]/95 backdrop-blur-2xl border border-[#F3E4C9]/25 text-[#FAF7EE] rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-[#0A2947]/40 animate-fadeIn">
                          <div className="flex items-start justify-between gap-3">
                            
                            {/* Destination info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-2xl bg-[#8B5E3C] text-white flex items-center justify-center shrink-0 shadow-md">
                                <Navigation className="w-5 h-5 fill-current animate-pulse" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#F3E4C9] font-bold">
                                    Active Walking Route
                                  </span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                </div>
                                <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                                  {activeRoute.cafe.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-[#D3D4C0] font-medium mt-0.5">
                                  <span className="flex items-center gap-1 text-[#F3E4C9] font-bold">
                                    <Footprints className="w-3.5 h-3.5" />
                                    {activeRoute.walkMins} min walk
                                  </span>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] text-white/80">
                                    {activeRoute.distanceFormatted}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Clear Route Button */}
                            <button
                              type="button"
                              onClick={handleClearRoute}
                              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF7EE] text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0"
                              title="Clear route from map"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Clear Route</span>
                            </button>
                          </div>

                          {/* Turn-by-Turn in Google Maps CTA + Feature 6 Meet Here CTA */}
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] text-[#D3D4C0] truncate hidden sm:block">
                              {activeRoute.cafe.address || 'Turn-by-turn route ready in your maps app'}
                            </p>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {/* Feature 6: Meet Here in HUD */}
                              <button
                                type="button"
                                onClick={() => handleMeetHere(activeRoute.cafe)}
                                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-[#FAF7EE] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                              >
                                <Users className="w-3.5 h-3.5 text-[#F3E4C9]" />
                                <span>Meet Here 👥</span>
                              </button>

                              <a
                                href={activeRoute.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                              >
                                <Navigation className="w-3.5 h-3.5 fill-current" />
                                <span>Start Navigation</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Floating Mini Capsule for Mobile Map (hidden when HUD is active) */}
                    {!activeRoute && (
                      <div className="md:hidden pointer-events-auto">
                        <div className="bg-[#FAF7EE]/95 backdrop-blur-xl border border-[#D3D4C0]/80 rounded-2xl p-2.5 shadow-xl flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleTabSwitch('home')}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#0A2947]"
                          >
                            <Coffee className="w-4 h-4 text-[#8B5E3C]" />
                            <span className="truncate max-w-[130px]">{locationName}</span>
                          </button>

                          <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-white border border-[#D3D4C0]/70 text-[11px] font-mono">
                            {[1000, 3000, 5000].map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => {
                                  setRadius(r);
                                  loadCafes(coords.lat, coords.lon, r, locationName);
                                }}
                                className={`h-5 px-2 rounded-full transition-all ${
                                  radius === r
                                    ? 'bg-[#0A2947] text-[#FAF7EE] font-bold'
                                    : 'text-[#0A2947]/70 hover:bg-[#0A2947]/08'
                                }`}
                              >
                                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Snapping Horizontal Card Drawer for Mobile */}
                  <div className="md:hidden pointer-events-auto pb-20">
                    <div
                      ref={drawerRef}
                      className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory px-4 pb-1 no-scrollbar scroll-smooth"
                    >
                      {filteredCafes.map((cafe, index) => (
                        <div key={cafe.id} id={`drawer-card-${cafe.id}`} className="snap-center shrink-0">
                          <DribbbleDrawerCard
                            cafe={cafe}
                            index={index}
                            isActive={activeCafeId === cafe.id}
                            isFavorite={favorites.includes(cafe.id)}
                            onToggleFavorite={toggleFavorite}
                            onSelect={(c) => {
                              setActiveCafeId(c.id);
                              setSelectedProduct({
                                id: c.id,
                                name: c.name,
                                cafeName: c.name,
                                category: 'Artisan Cafe',
                                price: '₹220',
                                priceNumber: 220,
                                rating: '4.8',
                                walkTime: c.walkTime,
                                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
                                description: c.address || 'Specialty espresso bar and roastery in Raipur.',
                                lat: c.lat,
                                lon: c.lon,
                              });
                            }}
                            onGetDirections={handleGetDirections}
                            userCoords={coords}
                            weather={weather}
                            userVotes={userVibeVotes}
                            onVoteVibe={handleVoteVibe}
                            onMeetHere={handleMeetHere}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: SAVED FAVORITES                                            */}
        {/* =================================================================== */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3D4C0]/70">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2947] flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-[#8B5E3C] text-[#8B5E3C]" />
                  <span>Curated Favorites</span>
                </h2>
                <p className="text-xs text-[#0A2947]/60 font-mono">
                  {displayItems.length} handcrafted drinks and spots saved
                </p>
              </div>

              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFavorites([])}
                  className="text-xs text-[#8B5E3C] hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {displayItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="bg-white rounded-2xl p-3 sm:p-4 border border-[#D3D4C0]/60 shadow-md hover:shadow-xl hover:border-[#8B5E3C]/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#0A2947]/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_COFFEE_SVG;
                          }}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#8B5E3C] shadow-sm active:scale-90"
                          title="Remove from saved"
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#8B5E3C]" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#8B5E3C] uppercase font-semibold">
                          {item.category}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#0A2947] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#0A2947]/65 truncate">
                          {item.descriptor}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B5E3C] pt-0.5">
                          <Footprints className="w-3.5 h-3.5" />
                          <span>{item.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#D3D4C0]/50 flex items-center justify-between">
                      <span className="text-sm sm:text-base font-extrabold text-[#0A2947] font-mono">
                        {item.price}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="w-8 h-8 rounded-full bg-[#8B5E3C] hover:bg-[#724c30] text-white flex items-center justify-center shadow-md active:scale-90"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#D3D4C0]/70 max-w-md mx-auto space-y-3">
                <Heart className="w-10 h-10 text-[#8B5E3C] mx-auto opacity-40" />
                <h3 className="text-base font-bold text-[#0A2947]">No saved items yet</h3>
                <p className="text-xs text-[#0A2947]/60">
                  Tap the heart icon on any coffee item on the homepage to curate your personal coffee collection.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('home')}
                  className="px-4 py-2 rounded-full bg-[#0A2947] text-[#FAF7EE] text-xs font-bold shadow-md hover:bg-[#113c66]"
                >
                  Explore Drinks
                </button>
              </div>
            )}

            {/* Editorial Boutique Footer */}
            <Footer
              onSurpriseMe={() => {
                const rand = displayItems[Math.floor(Math.random() * displayItems.length)];
                if (rand) setSelectedProduct(rand);
              }}
              onUseGps={handleUseGps}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onTabSwitch={handleTabSwitch}
              onShowToast={showToast}
            />
          </div>
        )}

      </div>

      {/* ===================================================================== */}
      {/* 4. MOBILE FLOATING BOTTOM DOCK (< 768px: md:hidden)                   */}
      {/* ===================================================================== */}
      <div className="md:hidden fixed bottom-3 inset-x-0 mx-auto w-fit z-40 px-3 pointer-events-auto">
        <nav 
          aria-label="Bottom Navigation"
          className="bg-[#FAF7EE]/95 backdrop-blur-2xl border border-[#D3D4C0]/80 shadow-2xl shadow-[#0A2947]/20 rounded-full px-5 py-2 flex items-center gap-7 transition-all duration-300"
        >
          {/* Home Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('home')}
            className={`flex flex-col items-center gap-0.5 transition-all active:scale-90 ${
              activeTab === 'home' ? 'text-[#8B5E3C]' : 'text-[#0A2947]/50 hover:text-[#0A2947]'
            }`}
            title="Home"
          >
            <HomeIcon className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] shadow-sm animate-pop" />
            )}
          </button>

          {/* Map Explore Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('map')}
            className={`flex flex-col items-center gap-0.5 transition-all active:scale-90 ${
              activeTab === 'map' ? 'text-[#8B5E3C]' : 'text-[#0A2947]/50 hover:text-[#0A2947]'
            }`}
            title="Map Explore"
          >
            <MapIcon className="w-5 h-5" />
            {activeTab === 'map' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] shadow-sm animate-pop" />
            )}
          </button>

          {/* Favorites Heart Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('saved')}
            className={`flex flex-col items-center gap-0.5 transition-all active:scale-90 relative ${
              activeTab === 'saved' ? 'text-[#8B5E3C]' : 'text-[#0A2947]/50 hover:text-[#0A2947]'
            }`}
            title="Favorites"
          >
            <Heart className={`w-5 h-5 ${activeTab === 'saved' ? 'fill-[#8B5E3C]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#8B5E3C] text-white text-[8px] font-mono font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
            {activeTab === 'saved' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] shadow-sm animate-pop" />
            )}
          </button>

          {/* Profile / Cart Tab */}
          <button
            type="button"
            onClick={() => setIsCartModalOpen(true)}
            className="flex flex-col items-center gap-0.5 transition-all active:scale-90 relative text-[#0A2947]/50 hover:text-[#0A2947]"
            title="Coffee Bag & Order"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#8B5E3C] text-white text-[8px] font-mono font-bold flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 5. FLOATING EPHEMERAL TOAST FEEDBACK                                  */}
      {/* ===================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-[#0A2947] text-[#FAF7EE] border border-[#F3E4C9]/30 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-pop">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. INTERACTIVE MODALS                                                 */}
      {/* ===================================================================== */}
      
      {/* Drink Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={toggleFavorite}
          onAddToCart={handleAddToCart}
          userCoords={coords}
        />
      )}

      {/* Cart / Coffee Bag Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onClearCart={() => setCartItems([])}
        discountPercent={discountPercent}
      />

      {/* Feature 1: Location Dropdown Modal with OSM Nominatim Geocoding */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={locationName}
        onSelectLocation={handleSelectLocation}
        onUseGps={handleUseGps}
        isLoading={loading}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

    </div>
  );
}
