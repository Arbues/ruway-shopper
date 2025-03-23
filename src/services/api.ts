// API service for Supabase integration
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
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

export interface Settings {
  id: string;
  company_name: string;
  company_slogan?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  yape_qr?: string;
}

// API functions
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      price, 
      original_price, 
      image, 
      images, 
      stock_status, 
      sku, 
      specs, 
      features,
      category_id,
      categories(name, slug)
    `);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    original_price: product.original_price ? Number(product.original_price) : undefined,
    image: product.image || '/placeholder.svg',
    images: product.images || [],
    category: product.categories?.slug || '',
    stockStatus: product.stock_status as 'En Stock' | 'Agotado',
    sku: product.sku,
    specs: product.specs ? parseSpecs(product.specs) : {},
    features: product.features || []
  }));
};

// Helper function to parse and convert specs to the correct format
const parseSpecs = (specs: Json): { [key: string]: string } => {
  if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
    const result: { [key: string]: string } = {};
    Object.entries(specs).forEach(([key, value]) => {
      result[key] = String(value);
    });
    return result;
  }
  return {};
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  // First try to find by UUID
  let { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      price, 
      original_price, 
      image, 
      images, 
      stock_status, 
      sku, 
      specs, 
      features,
      category_id,
      categories(name, slug)
    `)
    .eq('id', id)
    .maybeSingle();

  // If not found by UUID, try to find by SKU
  if (!data && !error) {
    const response = await supabase
      .from('products')
      .select(`
        id, 
        name, 
        description, 
        price, 
        original_price, 
        image, 
        images, 
        stock_status, 
        sku, 
        specs, 
        features,
        category_id,
        categories(name, slug)
      `)
      .eq('sku', id)
      .maybeSingle();
    
    data = response.data;
    error = response.error;
  }

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    price: Number(data.price),
    original_price: data.original_price ? Number(data.original_price) : undefined,
    image: data.image || '/placeholder.svg',
    images: data.images || [],
    category: data.categories?.slug || '',
    stockStatus: data.stock_status as 'En Stock' | 'Agotado',
    sku: data.sku,
    specs: data.specs ? parseSpecs(data.specs) : {},
    features: data.features || []
  };
};

export const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      price, 
      original_price, 
      image, 
      images, 
      stock_status, 
      sku, 
      specs, 
      features,
      category_id,
      categories(name, slug)
    `)
    .eq('categories.slug', categorySlug);

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    original_price: product.original_price ? Number(product.original_price) : undefined,
    image: product.image || '/placeholder.svg',
    images: product.images || [],
    category: product.categories?.slug || '',
    stockStatus: product.stock_status as 'En Stock' | 'Agotado',
    sku: product.sku,
    specs: product.specs ? parseSpecs(product.specs) : {},
    features: product.features || []
  }));
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, image, slug');

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data || []).map(category => ({
    id: category.id,
    name: category.name,
    image: category.image || '/placeholder.svg',
    slug: category.slug
  }));
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const lowercaseQuery = query.toLowerCase();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      price, 
      original_price, 
      image, 
      images, 
      stock_status, 
      sku, 
      specs, 
      features,
      category_id,
      categories(name, slug)
    `)
    .or(`name.ilike.%${lowercaseQuery}%,description.ilike.%${lowercaseQuery}%`);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    original_price: product.original_price ? Number(product.original_price) : undefined,
    image: product.image || '/placeholder.svg',
    images: product.images || [],
    category: product.categories?.slug || '',
    stockStatus: product.stock_status as 'En Stock' | 'Agotado',
    sku: product.sku,
    specs: product.specs ? parseSpecs(product.specs) : {},
    features: product.features || []
  }));
};

// Settings API Functions
export const fetchSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error("Error fetching settings:", error);
    return null;
  }

  return data;
};

export const updateSettings = async (settings: Partial<Settings>): Promise<boolean> => {
  // Check if settings already exist
  const { data: existingSettings } = await supabase
    .from('settings')
    .select('id')
    .limit(1);

  let result;
  
  if (existingSettings && existingSettings.length > 0) {
    // Update existing settings
    result = await supabase
      .from('settings')
      .update(settings)
      .eq('id', existingSettings[0].id);
  } else {
    // Create new settings
    result = await supabase
      .from('settings')
      .insert(settings);
  }

  if (result.error) {
    console.error("Error updating settings:", result.error);
    return false;
  }

  return true;
};

export const uploadSettingsImage = async (file: File, path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('settings')
    .upload(path, file, {
      upsert: true
    });

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('settings')
    .getPublicUrl(path);

  return urlData.publicUrl;
};
