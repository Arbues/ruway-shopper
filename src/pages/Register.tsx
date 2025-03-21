
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, AlertCircle } from "lucide-react";
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

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [passwordError, setPasswordError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Correo electrónico inválido";
      isValid = false;
    }

    if (!password) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    if (!acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos y condiciones";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(name, email, password);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
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
                  <div className="w-12 h-12 rounded-full bg-ruway-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-ruway-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
                <CardDescription className="text-center">
                  Regístrate para empezar a comprar en Ruway
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
                    <Label htmlFor="name">Nombre Completo</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-ruway-gray" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan Pérez"
                        className="pl-10"
                        required
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-ruway-gray" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="pl-10"
                        required
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-destructive mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-ruway-gray" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(
                            e.target.value.length < 6
                              ? "La contraseña debe tener al menos 6 caracteres"
                              : ""
                          );
                        }}
                        placeholder="********"
                        className="pl-10"
                        required
                      />
                    </div>
                    {formErrors.password && (
                      <p className="text-xs text-destructive mt-1">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-ruway-gray" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className="pl-10"
                        required
                      />
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                      className="mt-1"
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm text-ruway-gray cursor-pointer"
                    >
                      Acepto los{" "}
                      <Link to="/terminos-condiciones" className="text-ruway-primary hover:underline">
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link to="/privacidad" className="text-ruway-primary hover:underline">
                        Política de Privacidad
                      </Link>
                    </Label>
                  </div>
                  {formErrors.acceptTerms && (
                    <p className="text-xs text-destructive">{formErrors.acceptTerms}</p>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                  <div className="text-center text-sm text-ruway-gray">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-ruway-primary hover:underline">
                      Iniciar Sesión
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
