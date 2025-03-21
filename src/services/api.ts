
// Base API service for all API requests

const API_URL = 'https://api.ruway.com'; // Replace with your actual API URL

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stockStatus: 'En Stock' | 'Agotado';
  sku: string;
  specs?: {
    [key: string]: string;
  };
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
}

// API functions
export const fetchProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an actual API call
  // For the MVP, we'll mock this with demo data
  return MOCK_PRODUCTS;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  return product || null;
};

export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return MOCK_PRODUCTS.filter(p => p.category === categoryId);
};

export const fetchCategories = async (): Promise<Category[]> => {
  return MOCK_CATEGORIES;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) || 
    p.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Mock data for the MVP
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'microcontroladores',
    name: 'Microcontroladores',
    image: '/placeholder.svg',
    slug: 'microcontroladores'
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    image: '/placeholder.svg',
    slug: 'herramientas'
  },
  {
    id: 'fuentes',
    name: 'Fuentes y Reguladores',
    image: '/placeholder.svg',
    slug: 'fuentes-reguladores'
  },
  {
    id: 'accesorios',
    name: 'Accesorios y Prototipado',
    image: '/placeholder.svg',
    slug: 'accesorios-prototipado'
  },
  {
    id: 'energia',
    name: 'Energía Solar',
    image: '/placeholder.svg',
    slug: 'energia-solar'
  },
  {
    id: 'sbc',
    name: 'SBC Placa Computadora',
    image: '/placeholder.svg',
    slug: 'sbc-placa-computadora'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '001011',
    name: 'ESP32-DevKitC V4 - 38-Pin ESP32 WiFi Micro-USB',
    description: 'Tarjeta de desarrollo ESP32-DevKitC V4 (NodeMCU-32 38-Pin) perfecta para prototipar rápidamente proyectos IoT con la plataforma ESP32. Posee conectividad WiFi y Bluetooth, además de un poderoso CPU 32-bit de doble núcleo Tensilica Xtensa LX6. Dispones de todos los pines del ESP-WROOM-32D. Con conector micro-USB.',
    price: 55.00,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'microcontroladores',
    stockStatus: 'En Stock',
    sku: '001011',
    specs: {
      'Voltaje de Alimentación (micro-USB)': '5V DC',
      'Voltaje de Alimentación (VIN)': '4V-12V DC (5V-9V recomendado)'
    },
    features: [
      'CPU 32-bit de doble núcleo Tensilica Xtensa LX6',
      'Conectividad WiFi y Bluetooth',
      'Todos los pines del ESP-WROOM-32D',
      'Conector micro-USB'
    ]
  },
  {
    id: '001249',
    name: 'ESP32-WROVER - ESP32 WiFi',
    description: 'El ESP32-WROVER es un módulo potente basado en el SoC ESP32 con WiFi y Bluetooth integrados. Ideal para aplicaciones IoT que requieren mayor capacidad de memoria y procesamiento.',
    price: 65.00,
    image: '/placeholder.svg',
    category: 'microcontroladores',
    stockStatus: 'En Stock',
    sku: '001249'
  },
  {
    id: '001206',
    name: 'ESP32-S3-DevKitC-1 - ESP32-S3 WiFi USB-C',
    description: 'El ESP32-S3 es la nueva generación de chips ESP32 con capacidades mejoradas para IA y machine learning, además de conectividad WiFi y Bluetooth LE 5.',
    price: 75.00,
    image: '/placeholder.svg',
    category: 'microcontroladores',
    stockStatus: 'En Stock',
    sku: '001206'
  },
  {
    id: '002001',
    name: 'Kit Arduino UNO R3 + Cables + Caja',
    description: 'Kit completo de Arduino UNO R3 con cables, sensores y caja organizadora. Perfecto para principiantes y proyectos de electrónica.',
    price: 85.00,
    image: '/placeholder.svg',
    category: 'microcontroladores',
    stockStatus: 'En Stock',
    sku: '002001'
  },
  {
    id: '003001',
    name: 'Raspberry Pi 4 Modelo B - 4GB RAM',
    description: 'La Raspberry Pi 4 Modelo B es una poderosa computadora de placa única con 4GB de RAM, perfecta para proyectos que requieren mayor capacidad de procesamiento.',
    price: 150.00,
    image: '/placeholder.svg',
    category: 'sbc',
    stockStatus: 'Agotado',
    sku: '003001'
  },
  {
    id: '004001',
    name: 'Kit de Sensores 37 en 1 para Arduino',
    description: 'Kit completo con 37 sensores diferentes compatibles con Arduino. Incluye sensores de temperatura, humedad, luz, movimiento y más.',
    price: 45.00,
    image: '/placeholder.svg',
    category: 'accesorios',
    stockStatus: 'En Stock',
    sku: '004001'
  }
];
