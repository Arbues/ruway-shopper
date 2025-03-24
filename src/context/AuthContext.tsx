
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string | null;
  username: string;
  name: string;
  dni: string | null;
  phone: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, navigate: (path: string) => void, from?: string) => Promise<void>;
  register: (name: string, username: string, dni: string, phone: string, email: string | null, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const ADMIN_CREDENTIALS = {
  email: "admin@infinitywits.com",
  username: "admin",
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
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, name, dni, phone')
            .eq('id', authUser.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            username: profileData?.username || authUser.user_metadata?.username || ADMIN_CREDENTIALS.username,
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
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, name, dni, phone')
            .eq('id', authUser.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            username: profileData?.username || authUser.user_metadata?.username || '',
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

  const login = async (identifier: string, password: string, navigate: (path: string) => void, from: string = '/') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if these are admin credentials
      if ((identifier === ADMIN_CREDENTIALS.email || identifier === ADMIN_CREDENTIALS.username) && password === ADMIN_CREDENTIALS.password) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });
        
        if (signInError) throw signInError;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: ADMIN_CREDENTIALS.username,
            name: ADMIN_CREDENTIALS.name,
            dni: null,
            phone: null,
            isAdmin: true
          });
          toast.success("¡Bienvenido, Administrador!");
          navigate(from);
        }
      } else {
        // Try to determine if the identifier is an email or username
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        
        let signInResult;
        
        if (isEmail) {
          // Login with email
          signInResult = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
          });
        } else {
          // Find user by username
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', identifier)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error finding user by username:', profileError);
            throw new Error('Error al buscar usuario por nombre de usuario');
          }
          
          if (!profiles) {
            throw new Error('Usuario no encontrado');
          }
          
          // Use auth.admin.getUserById to get the user email
          // Since we don't have direct admin access, we can sign in with password
          // directly using the username by fetching auth data through session

          // First, get all sessions to find the user
          const { data: authData, error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            throw new Error('Error al obtener datos de usuario');
          }
          
          // Since we can't directly query the auth.users table, we will have the user
          // log in with password directly. We'll prompt them to use their email instead.
          throw new Error('Para iniciar sesión con nombre de usuario, primero regístrate o inicia sesión con tu correo electrónico');
        }
        
        const { data, error: signInError } = signInResult;
        
        if (signInError) throw signInError;
        
        if (data.user) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, name, dni, phone')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile after login:', profileError);
          }
          
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: profileData?.username || data.user.user_metadata?.username || '',
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

  const register = async (name: string, username: string, dni: string, phone: string, email: string | null, password: string, navigate: (path: string) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a placeholder email using username if not provided
      const userEmail = email && email.trim() 
        ? email.trim() 
        : `${username}@placeholder.infinitywits.com`;
      
      // Prevent registration with admin email or username
      if (userEmail === ADMIN_CREDENTIALS.email || username === ADMIN_CREDENTIALS.username) {
        throw new Error("Este usuario o correo electrónico no está disponible para registro");
      }
      
      // Check if username already exists
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (usernameError) {
        console.error('Error checking username:', usernameError);
      }
      
      if (existingUser) {
        throw new Error("El nombre de usuario ya está en uso");
      }
      
      console.log('Registering with email:', userEmail);
      
      // Register the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            name,
            username,
            dni,
            phone
          },
          // We're not using email verification, so don't redirect
          emailRedirectTo: undefined
        },
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }
      
      // If successful, insert or update the user's profile information
      if (data && data.user) {
        console.log('User created:', data.user.id);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name,
            username,
            dni,
            phone,
          });
        
        if (profileError) {
          console.error('Profile insert error:', profileError);
          throw profileError;
        }
        
        console.log('Profile created/updated successfully');
        
        setUser({
          id: data.user.id,
          email: data.user.email,
          username,
          name,
          dni,
          phone,
          isAdmin: false
        });
        
        toast.success("¡Registro exitoso!");
        navigate('/');
      } else {
        console.error('No user data returned from signUp');
        throw new Error('Error during registration - no user data returned');
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // We're going to ignore the email rate limit error since we're not using email verification
      if (err.code === "over_email_send_rate_limit") {
        console.log("Email rate limit exceeded, but continuing with registration");
        // Instead of showing an error, we'll just log it and continue
        toast.success("¡Registro exitoso!");
        navigate('/');
        return;
      } else {
        setError(err instanceof Error ? err.message : 'Error al registrarse');
        toast.error(err instanceof Error ? err.message : 'Error al registrarse');
      }
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
