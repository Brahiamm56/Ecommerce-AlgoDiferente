import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';

const Footer = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '541112345678';
    const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';

    return (
        <footer className="bg-gray-900 text-white footer-main">
            {/* Sección principal */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Columna 1: Logo e info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{storeName}</h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            Tu tienda de confianza con los mejores productos y precios.
                            ¡Compra fácil y seguro!
                        </p>

                        {/* Redes sociales */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Enlaces rápidos */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/" className="hover:text-white transition-colors">
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="/favoritos" className="hover:text-white transition-colors">
                                    Mis Favoritos
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Términos y Condiciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Política de Privacidad
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-green-500" />
                                <a
                                    href={`tel:+${whatsappNumber}`}
                                    className="hover:text-white transition-colors"
                                >
                                    +{whatsappNumber}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <a
                                    href="mailto:algodiferente@gmail.com"
                                    className="hover:text-white transition-colors"
                                >
                                    algodiferente@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span>Av. 9 de Julio 1777, Resistencia Chaco</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright y Créditos */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 pt-8 pb-32 md:pb-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {storeName}. Todos los derechos reservados.
                    </p>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 text-sm font-medium">
                            Desarrollado por Iserre Solutions
                        </p>
                        {/* Placeholder para el logo de Iserre Solutions */}
                        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity mt-1">
                            {/* Si tienes el logo, descomenta y ajusta la ruta: 
                            <img src="/iserre-logo.png" alt="Iserre Solutions" className="h-8" /> 
                            */}
                            <span className="text-cyan-400 font-bold tracking-wider text-sm border border-cyan-400 px-2 py-0.5 rounded">
                                ISERRE SOLUTIONS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
