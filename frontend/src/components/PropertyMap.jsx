import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for featured properties
const featuredIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PropertyMap = ({ properties, center, zoom = 13 }) => {
  const [mapCenter, setMapCenter] = useState(center || [-6.2, 106.8]);

  // Fit bounds to show all markers
  const FitBounds = ({ properties }) => {
    const map = useMap();
    useEffect(() => {
      if (properties && properties.length > 0) {
        const bounds = L.latLngBounds(
          properties.map((p) => [p.location?.coordinates?.lat || -6.2, p.location?.coordinates?.lng || 106.8])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [properties, map]);
    return null;
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties && properties.length > 0 && (
          <>
            <FitBounds properties={properties} />
            {properties.map((property) => {
              const lat = property.location?.coordinates?.lat;
              const lng = property.location?.coordinates?.lng;
              if (!lat || !lng) return null;

              return (
                <Marker
                  key={property._id}
                  position={[lat, lng]}
                  icon={property.featured ? featuredIcon : undefined}
                >
                  <Popup>
                    <div className="min-w-[200px] max-w-[250px]">
                      <img
                        src={property.images?.[0] || '/images/placeholder.jpg'}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                        {property.title}
                      </h4>
                      <p className="text-primary-500 font-bold text-sm">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {property.location?.address}
                      </p>
                      <a
                        href={`/properties/${property._id}`}
                        className="mt-2 inline-block text-xs text-primary-500 hover:underline"
                      >
                        Lihat Detail →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;