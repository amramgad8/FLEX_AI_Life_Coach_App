
import { useState } from 'react';
import { X, Mail, Lock, Apple, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Authentication submitted:', { email, password, isLogin });
    // Here you would handle authentication logic
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 border-none max-w-4xl overflow-hidden rounded-2xl">
        <div className="flex flex-col md:flex-row h-full min-h-[600px]">
          {/* Left panel - Illustration */}
          <div className="md:w-1/2 bg-gradient-to-br from-flex-green/20 to-flex-yellow/20 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute h-full w-full opacity-20">
                <path 
                  fill="#4CAF50" 
                  d="M40,-51.2C50.8,-43.1,58.2,-29.7,62.8,-14.9C67.5,-0.1,69.3,16.2,63.4,28.8C57.5,41.5,43.8,50.6,29.4,55.5C15,60.5,-0.1,61.4,-14.4,57.7C-28.7,54,-42.1,45.7,-50.8,33.8C-59.5,21.9,-63.5,6.5,-62.5,-9.8C-61.5,-26.1,-55.5,-43.2,-43.4,-51.4C-31.4,-59.6,-13.5,-58.9,1.1,-60.2C15.7,-61.5,29.3,-59.3,40,-51.2Z" 
                  transform="translate(100 100) scale(1.5)" 
                />
              </svg>
            </div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="/lovable-uploads/73e4c415-eb5f-48db-a438-94ea38c84838.png" 
                  alt="Flex Logo" 
                  className="h-20 w-auto mx-auto mb-6"
                />
                <h2 className="text-2xl md:text-3xl font-bold text-flex-text mb-4">
                  Welcome to Flex
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? "Sign in to continue your journey towards better productivity." 
                    : "Create an account to start your productivity journey."}
                </p>
              </motion.div>
            </div>
            
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-flex-yellow/15 rounded-full filter blur-xl" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-flex-green/15 rounded-full filter blur-xl" />
          </div>
          
          {/* Right panel - Auth form */}
          <div className="md:w-1/2 bg-white p-8 md:p-10 relative">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-flex-text mb-2">
                  {isLogin ? "Sign In" : "Create Account"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isLogin 
                    ? "Enter your credentials to access your account" 
                    : "Fill in the details to create your new account"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-5 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="password"
                        type="password" 
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 py-5 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  
                  {isLogin && (
                    <div className="text-right">
                      <button 
                        type="button" 
                        className="text-sm text-flex-green hover:text-flex-green-dark"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-flex-gradient hover:opacity-90 text-white font-semibold rounded-xl"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center justify-center py-5 rounded-xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                      </svg>
                      <span className="ml-2">Google</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="ml-1 text-flex-green font-semibold hover:text-flex-green-dark"
                    >
                      {isLogin ? "Create account" : "Sign in"}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
