import { FileNode } from "./vscode/index";

export const frontendFiles: FileNode = {
  name: "FRONTEND",
  language: "json",
  isOpen: true,
  children: [
    {
      name: "FeaturedListings.tsx",
      language: "typescript",
      content: `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGasPump, FaRoad, FaCalendarAlt } from 'react-icons/fa';
import api from '../../services/api';

const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/listings/featured');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching featured:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {listings.map((listing, index) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow hover:shadow-xl"
            >
              <Link to={\`/listing/\${listing._id}\`}>
                <div className="relative h-48">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
                <p className="text-xl font-bold text-blue-600 my-2">
                  {listing.price} {listing.currency}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;`,
    },
    {
      name: "ImageGallery.tsx",
      language: "typescript",
      content: `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface GalleryProps {
  images: string[];
}

const ImageGallery: React.FC<GalleryProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden group">
      <AnimatePresence mode='wait'>
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full object-contain"
        />
      </AnimatePresence>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100">
        <FaChevronLeft />
      </button>
      
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100">
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ImageGallery;`,
    },
    {
      name: "ListingDetails.tsx",
      language: "typescript",
      content: `import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ImageGallery from './ImageGallery';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    api.get(\`/listings/\${id}\`).then(res => setListing(res.data));
  }, [id]);

  if (!listing) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={listing.images} />
          
          <div className="bg-white p-6 rounded shadow">
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-2xl font-bold text-blue-600">
              {listing.price} {listing.currency}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-500 block">Rok</span>
                <b>{listing.technicalDetails.productionYear}</b>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-500 block">Przebieg</span>
                <b>{listing.technicalDetails.mileage} km</b>
              </div>
            </div>

            <div className="prose">
              <h3>Opis</h3>
              <p>{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded shadow sticky top-24">
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {listing.sellerInfo.name?.[0]}
              </div>
              <div>
                <p className="font-bold">{listing.sellerInfo.name}</p>
                <p className="text-sm text-gray-500">{listing.sellerInfo.location.city}</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">
              Pokaż numer telefonu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;`,
    },
    {
      name: "NotificationContext.tsx",
      language: "typescript",
      content: `import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_API_URL!, {
        auth: { token }
      });

      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        toast.info(notification.message);
      });

      setSocket(newSocket);
      return () => { newSocket.close(); };
    }
  }, [user, token]);

  return (
    <NotificationContext.Provider value={{ socket, notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};`,
    },
    {
      name: "SearchFormUpdated.tsx",
      language: "typescript",
      content: `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';

const SearchForm = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: ''
  });

  useEffect(() => {
    api.get('/listings/brands').then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (filters.brand) {
      api.get(\`/listings/models/\${filters.brand}\`).then(res => setModels(res.data));
    } else {
      setModels([]);
    }
  }, [filters.brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(filters as any);
    navigate(\`/szukaj?\${params.toString()}\`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg -mt-16 relative z-10 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.brand}
          onChange={e => setFilters({...filters, brand: e.target.value})}
          className="p-3 border rounded"
        >
          <option value="">Marka</option>
          {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
        </select>

        <select
          value={filters.model}
          onChange={e => setFilters({...filters, model: e.target.value})}
          disabled={!filters.brand}
          className="p-3 border rounded disabled:bg-gray-100"
        >
          <option value="">Model</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <div className="flex gap-2">
          <input 
            placeholder="Cena od" 
            className="w-1/2 p-3 border rounded"
            onChange={e => setFilters({...filters, priceMin: e.target.value})}
          />
          <input 
            placeholder="do" 
            className="w-1/2 p-3 border rounded"
            onChange={e => setFilters({...filters, priceMax: e.target.value})}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white font-bold rounded flex items-center justify-center gap-2">
          <FaSearch /> Szukaj
        </button>
      </form>
    </div>
  );
};

export default SearchForm;`,
    },
  ],
};
