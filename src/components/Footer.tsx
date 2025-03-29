
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Send, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/73e4c415-eb5f-48db-a438-94ea38c84838.png" 
                alt="Flex Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-flex-gradient">
                Flex
              </span>
            </Link>
            <p className="text-foreground/70 dark:text-gray-400">
              Adaptive habit building platform that evolves with you, helping you transform your routines and achieve your goals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-flex-green/10 text-flex-green hover:bg-flex-green/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-flex-green/10 text-flex-green hover:bg-flex-green/20 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-flex-green/10 text-flex-green hover:bg-flex-green/20 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-flex-green/10 text-flex-green hover:bg-flex-green/20 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-flex-text dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/"
                  onClick={scrollToTop}
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/focus"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Focus Mode
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-flex-text dark:text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/blog"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/help-center"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/community"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms"
                  className="text-foreground/70 dark:text-gray-400 hover:text-flex-green transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-flex-text dark:text-white">Newsletter</h3>
            <p className="text-foreground/70 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for tips, updates, and exclusive content.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-l-lg border border-border dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-flex-green dark:bg-gray-800"
              />
              <button className="bg-flex-green text-white px-4 py-2 rounded-r-lg hover:bg-flex-green-dark transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 dark:text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Flex. All rights reserved.
          </p>
          <div className="flex items-center">
            <p className="text-foreground/60 dark:text-gray-500 text-sm flex items-center">
              Made with <Heart size={14} className="mx-1 text-flex-green" /> by the Flex Team
            </p>
            <button 
              onClick={scrollToTop} 
              className="ml-6 p-2 rounded-full bg-flex-green/10 text-flex-green hover:bg-flex-green/20 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;