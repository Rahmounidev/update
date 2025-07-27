import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Download } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/images/droovo-logo.png" alt="Droovo" width={120} height={35} className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-gray-400">
              Droovo est votre plateforme de commande en ligne qui connecte les clients aux meilleurs restaurants locaux
              au Maroc. Commandez facilement et suivez votre livraison en temps réel.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <span>contact@droovo.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <span>+212 5 22 11 22 33</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span>Casablanca, Maroc</span>
              </li>
              <li className="pt-2">
                <h4 className="text-sm font-medium mb-2 text-white">Téléchargez notre application</h4>
                <div className="flex space-x-2">
                  <Link
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>App Store</span>
                  </Link>
                  <Link
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Google Play</span>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2024 Droovo. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Mentions légales
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Confidentialité
            </Link>
            <Link href="/sitemap" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Plan du site
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
