
import { Link } from "react-router-dom";
import { 
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-infinitywits-navy pt-12 pb-6 mt-20 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-infinitywits-cream">
                Infinity<span className="text-infinitywits-lightblue">Wits</span>
              </h2>
            </Link>
            <p className="text-infinitywits-lightblue text-sm">
              Somos una empresa especializada en electrónica, IoT y desarrollo de soluciones tecnológicas para proyectos de todas las escalas.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                className="text-infinitywits-lightblue hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                className="text-infinitywits-lightblue hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-infinitywits-lightblue hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                className="text-infinitywits-lightblue hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/productos" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  to="/categoria/microcontroladores" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Microcontroladores
                </Link>
              </li>
              <li>
                <Link 
                  to="/categoria/accesorios-prototipado" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Accesorios y Prototipado
                </Link>
              </li>
              <li>
                <Link 
                  to="/ofertas" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-white">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/como-comprar" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Cómo Comprar
                </Link>
              </li>
              <li>
                <Link 
                  to="/envios" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link 
                  to="/devoluciones" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/preguntas-frecuentes" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon size={18} className="text-infinitywits-lightblue mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-infinitywits-lightblue text-sm">
                  Av. La Marina 123, San Miguel, Lima, Perú
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={18} className="text-infinitywits-lightblue mr-2 flex-shrink-0" />
                <a 
                  href="tel:+51987654321" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  +51 987 654 321
                </a>
              </li>
              <li className="flex items-center">
                <MailIcon size={18} className="text-infinitywits-lightblue mr-2 flex-shrink-0" />
                <a 
                  href="mailto:info@infinitywits.com" 
                  className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
                >
                  info@infinitywits.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-infinitywits-blue mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-infinitywits-lightblue text-sm">
              &copy; {new Date().getFullYear()} InfinityWits. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link 
                to="/terminos-condiciones" 
                className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
              >
                Términos y Condiciones
              </Link>
              <Link 
                to="/privacidad" 
                className="text-infinitywits-lightblue hover:text-white transition-colors text-sm"
              >
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>

        {/* Free shipping banner */}
        <div className="mt-6 bg-infinitywits-blue text-white text-center py-2 rounded-md">
          <p className="text-sm font-medium">ENVÍO GRATIS A TODO EL PERÚ POR COMPRAS MAYORES A S/200 [CONDICIONES]</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
