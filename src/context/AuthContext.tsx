
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string | null;
  name: string;
  dni: string | null;
  phone: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, navigate: (path: string) => void, from?: string) => Promise<void>;
  register: (name: string, dni: string, phone: string, email: string | null, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const ADMIN_CREDENTIALS = {
  email: "admin@infinitywits.com",
  password: "987 762 577",
  name: "Jose Muñoz"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: authUser } = session;
          
          // Check if this is the admin user
          const isAdmin = authUser.email === ADMIN_CREDENTIALS.email;
          
          // Get user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, dni, phone')
            .eq('id', authUser.id)
            .single();
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: profileData?.name || authUser.user_metadata?.name || ADMIN_CREDENTIALS.name,
            dni: profileData?.dni || authUser.user_metadata?.dni || null,
            phone: profileData?.phone || authUser.user_metadata?.phone || null,
            isAdmin
          });
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const authUser = session.user;
          const isAdmin = authUser.email === ADMIN_CREDENTIALS.email;
          
          // Get user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, dni, phone')
            .eq('id', authUser.id)
            .single();
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: profileData?.name || authUser.user_metadata?.name || '',
            dni: profileData?.dni || authUser.user_metadata?.dni || null,
            phone: profileData?.phone || authUser.user_metadata?.phone || null,
            isAdmin
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, navigate: (path: string) => void, from: string = '/') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if these are admin credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });
        
        if (signInError) throw signInError;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: ADMIN_CREDENTIALS.name,
            dni: null,
            phone: null,
            isAdmin: true
          });
          toast.success("¡Bienvenido, Administrador!");
          navigate(from);
        }
      } else {
        // Regular user login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        if (data.user) {
          // Get user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, dni, phone')
            .eq('id', data.user.id)
            .single();
          
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: profileData?.name || data.user.user_metadata?.name || '',
            dni: profileData?.dni || data.user.user_metadata?.dni || null,
            phone: profileData?.phone || data.user.user_metadata?.phone || null,
            isAdmin: false
          });
          toast.success("¡Inicio de sesión exitoso!");
          navigate(from);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      toast.error(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, dni: string, phone: string, email: string | null, password: string, navigate: (path: string) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if email is provided (optional)
      if (!email) {
        // Generate a placeholder email using dni
        email = `user_${dni}@placeholder.com`;
      }
      
      // Prevent registration with admin email
      if (email === ADMIN_CREDENTIALS.email) {
        throw new Error("Este correo electrónico no está disponible para registro");
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            dni,
            phone
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: name,
          dni: dni,
          phone: phone,
          isAdmin: false
        });
        toast.success("¡Registro exitoso!");
        navigate('/');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      toast.error(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info("Sesión cerrada");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
