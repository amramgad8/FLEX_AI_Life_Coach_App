
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="section bg-flex-light py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-flex-gradient opacity-90"></div>
          
          {/* Content */}
          <div className="relative z-10 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 reveal">
              Ready to Transform Your Habits?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 reveal" style={{ animationDelay: '100ms' }}>
              Join thousands of users who have already started their journey 
              to better habits and more productive lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 reveal" style={{ animationDelay: '200ms' }}>
              <Link
                to="/onboarding"
                className="px-8 py-4 bg-white rounded-full font-medium text-flex-green-dark shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/todo"
                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/10"
              >
                Try Task Tracker
              </Link>
            </div>
            
            {/* Testimonial */}
            <div className="mt-16 max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 reveal" style={{ animationDelay: '300ms' }}>
              <p className="italic text-white/90 mb-4">
                "Flex has completely transformed how I approach my daily routines. 
                The adaptive system makes habit building feel natural and sustainable."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div className="ml-3 text-left">
                  <p className="font-medium text-white">Sarah J.</p>
                  <p className="text-sm text-white/70">User for 6 months</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white/10 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
          
          {/* Added Flex branding element */}
          <div className="absolute bottom-12 left-12 w-24 h-24">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
              <path 
                fill="#FFFFFF" 
                d="M45.3,-75.3C58.3,-67.9,68.4,-54.3,76,-38.9C83.6,-23.5,88.8,-6.2,86.7,10.3C84.6,26.7,75.1,42.3,61.8,52.2C48.4,62.1,31.1,66.2,14.5,68.5C-2.1,70.7,-18.1,71.1,-33.8,67C-49.5,62.9,-64.9,54.3,-72.8,41.1C-80.8,27.9,-81.3,10.1,-78.1,-6.3C-75,-22.7,-68.3,-37.7,-57.7,-47.9C-47.1,-58,-32.7,-63.3,-18.4,-69.6C-4.1,-75.9,10.2,-83.3,25.7,-83.1C41.3,-82.9,58.1,-75.2,45.3,-75.3Z" 
                transform="translate(100 100)" 
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
