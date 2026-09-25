import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ 
  userCoords, 
  cafes = [], 
  activeCafeId, 
  onSelectCafe, 
  isLoading,
  radius = 3000,
  activeTab,
  routeCoordinates = null,
  onMapMoveEnd,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const searchCircleRef = useRef(null);
  const routePolylineRef = useRef(null);
  const routeCasingRef = useRef(null);
  const prevCoordsRef = useRef(null);
  const onMapMoveEndRef = useRef(onMapMoveEnd);
  onMapMoveEndRef.current = onMapMoveEnd;

  // 1. External Leaflet CSS Injection Safeguard
  useEffect(() => {
    const existingLink = document.querySelector('link[href*="leaflet"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }, []);

  // 2. Safe Initialization & Cleanup (Fixes "Map container already initialized" crash)
  useEffect(() => {
    if (activeTab !== 'map') return;
    if (!mapContainerRef.current) return;

    // If map already initialized, just invalidate size
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }

    // Guard against stale Leaflet container id if previously mounted
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const initialLat = userCoords?.lat || 21.2514;
    const initialLon = userCoords?.lon || 81.6296;

    // Create Leaflet map instance with tap: false for smooth mobile touch (prevents iOS touch freeze)
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 15,
      zoomControl: false,
      tap: false, // Prevents iOS Safari touch delay and freezing
      touchZoom: true,
      dragging: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // OpenStreetMap standard public tiles (free, reliable)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors',
      crossOrigin: true,
    }).addTo(map);

    // Zoom controls on desktop / tablets
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Listen to map panning/dragging to show "Search this area"
    map.on('moveend', () => {
      const center = map.getCenter();
      if (onMapMoveEndRef.current) {
        onMapMoveEndRef.current({ lat: center.lat, lon: center.lng });
      }
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, [activeTab]);

  // 3. Dynamic Size Invalidation on Tab Switch (Fixes blank / grey map)
  useEffect(() => {
    if (activeTab === 'map' && mapInstanceRef.current) {
      const timer1 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 100);
      const timer2 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 250);
      const timer3 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [activeTab]);

  // 4. Update User Location Pin & Radiating Acoustic Radar Pulse
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    // Pan map to new coordinates when user location shifts
    const coordsChanged = 
      !prevCoordsRef.current || 
      prevCoordsRef.current.lat !== userCoords.lat || 
      prevCoordsRef.current.lon !== userCoords.lon;

    if (coordsChanged && userCoords.lat && userCoords.lon) {
      prevCoordsRef.current = { lat: userCoords.lat, lon: userCoords.lon };
      map.flyTo([userCoords.lat, userCoords.lon], 15, { duration: 1.2 });
    }

    // Invalidate size to guarantee crisp rendering
    map.invalidateSize();

    // Clean up previous marker and circle
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    if (searchCircleRef.current) {
      map.removeLayer(searchCircleRef.current);
    }

    // User GPS Location: A pulsating dot in #0A2947 with an animated expanding aura in #8B5E3C
    const userIcon = L.divIcon({
      className: 'user-pin-wrapper',
      html: `
        <div class="user-pulse-marker">
          <div class="user-center-dot"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lon], {
      icon: userIcon,
      zIndexOffset: 1200,
    }).addTo(map);
    userMarkerRef.current = userMarker;

    // Concentric search radius ring radiating from user coordinates
    const searchCircle = L.circle([userCoords.lat, userCoords.lon], {
      radius: radius,
      color: '#0A2947',
      weight: 1.5,
      opacity: 0.35,
      fillColor: '#8B5E3C',
      fillOpacity: isLoading ? 0.12 : 0.04,
      dashArray: isLoading ? '6, 8' : undefined,
    }).addTo(map);
    searchCircleRef.current = searchCircle;

  }, [userCoords, radius, isLoading, activeTab]);

  // 5. Update Nearby Cafe Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    cafes.forEach((cafe) => {
      const isActive = activeCafeId === cafe.id;
      
      const pinIcon = L.divIcon({
        className: 'custom-cafe-marker-wrapper',
        html: `
          <div class="leaflet-custom-pin ${isActive ? 'is-active' : ''}">
            <svg class="cafe-pin-svg" viewBox="0 0 24 24" width="14" height="14" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
              <line x1="6" y1="2" x2="6" y2="4"></line>
              <line x1="10" y1="2" x2="10" y2="4"></line>
              <line x1="14" y1="2" x2="14" y2="4"></line>
            </svg>
            ${isActive ? '<span class="pin-active-beacon"></span>' : ''}
          </div>
        `,
        iconSize: isActive ? [40, 40] : [32, 32],
        iconAnchor: isActive ? [20, 20] : [16, 16],
      });

      const marker = L.marker([cafe.lat, cafe.lon], {
        icon: pinIcon,
        title: cafe.name,
        zIndexOffset: isActive ? 900 : 100,
      });

      marker.on('click', () => {
        onSelectCafe(cafe);
      });

      markersLayer.addLayer(marker);
    });
  }, [cafes, activeCafeId, onSelectCafe, activeTab]);

  // 6. Smoothly pan map when activeCafeId changes (only if not actively viewing a full route)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeCafeId) return;
    if (routeCoordinates && routeCoordinates.length > 0) return;

    const target = cafes.find((c) => c.id === activeCafeId);
    if (target && target.lat && target.lon) {
      map.flyTo([target.lat, target.lon], 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [activeCafeId, cafes, routeCoordinates]);

  // 7. In-App Route Line on Leaflet Map (Visual Directions via OSRM)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous route polylines
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routeCasingRef.current) {
      map.removeLayer(routeCasingRef.current);
      routeCasingRef.current = null;
    }

    if (!routeCoordinates || routeCoordinates.length === 0) return;

    // Subtle dark underlay casing for high visual contrast
    const casing = L.polyline(routeCoordinates, {
      color: '#0A2947',
      weight: 8,
      opacity: 0.3,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map);
    routeCasingRef.current = casing;

    // Warm artisan accent #8B5E3C polyline: weight 5, opacity 0.95
    const polyline = L.polyline(routeCoordinates, {
      color: '#8B5E3C',
      weight: 5,
      opacity: 0.95,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Automatically fit map bounds to comfortably show both user location and target cafe along route
    try {
      const bounds = polyline.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 1,
        });
      }
    } catch (err) {
      console.warn('fitBounds error:', err);
    }
  }, [routeCoordinates, activeTab]);

  return (
    <div 
      id="map" 
      ref={mapContainerRef} 
      style={{ filter: 'saturate(0.88) contrast(1.04) brightness(0.98)' }}
      className="w-full h-full relative z-0 pointer-events-auto overflow-hidden bg-[#E8E2D8] leaflet-map-muted touch-pan-x touch-pan-y" 
    />
  );
}
