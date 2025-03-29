import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Bell, Settings, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './auth/AuthModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/73e4c415-eb5f-48db-a438-94ea38c84838.png" 
            alt="Flex Logo" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-flex-gradient">
            Flex
          </span>
        </Link>

        {/* Streak Tracker */}
        <div className="hidden md:flex items-center space-x-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <Flame className="h-5 w-5 text-flex-orange" />
          <span className="text-sm font-semibold text-flex-text">
            5 Day Streak
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8">
          <Link to="/" className="nav-link hover:text-flex-green transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="nav-link hover:text-flex-green transition-colors">
            Dashboard
          </Link>
          <Link to="/ai-planner" className="nav-link flex items-center gap-2 hover:text-flex-green transition-colors">
            <Sparkles className="h-4 w-4 text-flex-yellow-dark" />
            Flexy
          </Link>
          <Link to="/goals" className="nav-link flex items-center gap-2 hover:text-flex-green transition-colors">
            <Target className="h-4 w-4 text-flex-orange" />
            Goals
          </Link>
          <Link to="/todo" className="nav-link hover:text-flex-green transition-colors">
            Tasks
          </Link>
          <Link to="/focus" className="nav-link hover:text-flex-green transition-colors">
            Focus
          </Link>
          <Link to="/blog" className="nav-link hover:text-flex-green transition-colors">
            Blog
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          {/* Notification Icon */}
          <button 
            onClick={toggleNotifications} 
            className="p-2 rounded-full hover:bg-gray-100 text-foreground/80 hover:text-foreground transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 bg-flex-orange w-2 h-2 rounded-full"></span>
          </button>
          
          {/* Settings Icon */}
          <Link to="/settings" className="p-2 rounded-full hover:bg-gray-100 text-foreground/80 hover:text-foreground transition-colors">
            <Settings size={20} />
          </Link>
          
          <button 
            onClick={openAuthModal}
            className="px-4 py-2 rounded-full text-foreground/80 hover:text-foreground transition-colors"
          >
            Login
          </button>
          <Link
            to="/onboarding"
            className="cta-button"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Notification Icon */}
          <button 
            onClick={toggleNotifications} 
            className="p-2 rounded-full hover:bg-gray-100 text-foreground/80 hover:text-foreground transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 bg-flex-orange w-2 h-2 rounded-full"></span>
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-foreground focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="animate-scale" />
            ) : (
              <Menu size={24} className="animate-scale" />
            )}
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-4 md:right-40 top-20 z-50 bg-white rounded-xl shadow-lg w-80 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-flex-text">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-flex-green/10 rounded-full">
                  <Flame className="h-5 w-5 text-flex-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-flex-text">5 Day Streak!</p>
                  <p className="text-xs text-gray-500 mt-1">You're on fire! Keep up the great work.</p>
                  <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-flex-yellow/10 rounded-full">
                  <Sparkles className="h-5 w-5 text-flex-yellow" />
                </div>
                <div>
                  <p className="text-sm font-medium text-flex-text">New AI Plan Ready</p>
                  <p className="text-xs text-gray-500 mt-1">Your customized productivity plan is ready to view.</p>
                  <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-flex-orange/10 rounded-full">
                  <Bell className="h-5 w-5 text-flex-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-flex-text">Task Reminder</p>
                  <p className="text-xs text-gray-500 mt-1">Complete your morning routine tasks.</p>
                  <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 text-center">
            <button className="text-sm text-flex-green hover:underline">Mark all as read</button>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transform ${
          isMenuOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        } transition-all duration-300 ease-in-out pt-20`}
      >
        <nav className="flex flex-col items-center space-y-6 p-8">
          <Link 
            to="/" 
            className="text-xl nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-xl nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/ai-planner" 
            className="text-xl nav-link flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Sparkles className="h-5 w-5 text-flex-yellow-dark" />
            AI Agent
          </Link>
          <Link 
            to="/todo" 
            className="text-xl nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Tasks
          </Link>
          <Link 
            to="/goals" 
            className="text-xl nav-link flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Target className="h-5 w-5 text-flex-orange" />
            Goals
          </Link>
          <Link 
            to="/focus" 
            className="text-xl nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Focus
          </Link>
          <Link 
            to="/blog" 
            className="text-xl nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/settings" 
            className="text-xl nav-link flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <div className="flex flex-col items-center space-y-4 pt-6 w-full">
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                openAuthModal();
              }}
              className="w-full text-center px-4 py-2 rounded-full text-foreground/80 hover:text-foreground transition-colors"
            >
              Login
            </button>
            <Link
              to="/ai-planner"
              className="w-full text-center cta-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Your Journey
            </Link>
          </div>
        </nav>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;