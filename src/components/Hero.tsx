
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 py-28 md:py-40 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-flex-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Adapt, Evolve, <br/>
              <span className="bg-clip-text text-transparent bg-flex-gradient">
                Flourish.
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The AI-powered productivity app that adapts to your workflow and helps you achieve your goals through personalized task management.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/onboarding" className="cta-button">
                Start Your Journey
              </Link>
              <Link to="/flow-tasks" className="flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-300">
                Try Flow Tasks
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2 relative">
            <motion.div
              className="relative z-10 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Larger Chameleon Image with Enhanced Shadow */}
              <motion.div 
                className="w-full max-w-[120%] md:max-w-[130%] -mr-8 md:-mr-16"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
              >
                <img 
                  src="/lovable-uploads/e1cb6a1f-60f1-4bb8-8d81-cf7ad0476d86.png" 
                  alt="Flex Chameleon" 
                  className="w-full h-auto" 
                  style={{ 
                    filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.25))",
                  }}
                />
              </motion.div>
            </motion.div>
            
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-flex-orange/15 rounded-full filter blur-3xl" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-flex-green/15 rounded-full filter blur-3xl" />
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/4 right-10 w-24 h-24 bg-flex-yellow/25 rounded-full filter blur-xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-36 h-36 bg-flex-green/25 rounded-full filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-flex-orange/25 rounded-full filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Hero;
