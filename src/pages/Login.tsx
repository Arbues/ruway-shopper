
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { fadeIn } from "@/utils/animations";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Get the redirect path from the location state or use "/"
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to the original page
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(identifier, password, navigate, from);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className={fadeIn({ direction: 'up' })}>
            <Card className="shadow-md border-gray-200">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-infinitywits-light flex items-center justify-center">
                    <User className="h-6 w-6 text-infinitywits-navy" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                  Ingresa tus credenciales para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-1">
                    <Label htmlFor="identifier">Usuario o Correo Electrónico</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-infinitywits-gray" />
                      </div>
                      <Input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="usuario o correo"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link to="/recuperar-password" className="text-xs text-infinitywits-blue hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-infinitywits-gray" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-infinitywits-gray cursor-pointer"
                    >
                      Recordarme
                    </Label>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                  <div className="text-center text-sm text-infinitywits-gray">
                    ¿No tienes una cuenta?{" "}
                    <Link 
                      to="/registro" 
                      state={{ from: location.state?.from }} 
                      className="text-infinitywits-blue hover:underline"
                    >
                      Regístrate
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
            
            <div className="mt-6 text-center">
              <div className="text-xs text-infinitywits-gray">
                Para pruebas, puedes iniciar sesión con:<br />
                Usuario: <span className="font-medium">demo</span><br />
                Contraseña: <span className="font-medium">password</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
