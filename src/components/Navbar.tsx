
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Command, Cpu, Calendar, Layout, Settings, Clock, GitMerge, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <Layout className="h-5 w-5" /> },
    { name: 'Tasks', href: '/todo', icon: <Calendar className="h-5 w-5" /> },
    { name: 'AI Planner', href: '/ai-planner', icon: <Command className="h-5 w-5" /> },
    { name: 'Pomodoro', href: '/pomodoro', icon: <Clock className="h-5 w-5" /> },
    { name: 'Eisenhower', href: '/eisenhower', icon: <GitMerge className="h-5 w-5" /> },
    { name: 'Focus', href: '/focus', icon: <Cpu className="h-5 w-5" /> },
    { name: 'Blog', href: '/blog', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'About', href: '/about', icon: <Users className="h-5 w-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">FlexTask</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      isActive(item.href)
                        ? "border-b-2 border-indigo-500 text-gray-900"
                        : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Right side actions (desktop) */}
          {!isMobile && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/onboarding">
                <Button variant="outline" size="sm" className="ml-4 flex items-center">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-base font-medium",
                isActive(item.href)
                  ? "bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700"
                  : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <div className="px-4 py-3">
            <Link to="/onboarding" onClick={() => setIsOpen(false)}>
              <Button className="w-full">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
