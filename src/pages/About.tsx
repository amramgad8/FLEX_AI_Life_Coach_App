
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Users, Heart, Zap, Award, Terminal } from 'lucide-react';

const About = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-br from-white to-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-flex-text">
              About <span className="bg-clip-text text-transparent bg-flex-gradient">Flex</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to help you build better habits, become more productive, and achieve your goals—all while adapting to your unique needs and workflows.
            </p>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/e1cb6a1f-60f1-4bb8-8d81-cf7ad0476d86.png" 
                alt="Flex Chameleon" 
                className="w-40 h-40 object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="mission" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="mission">Our Mission</TabsTrigger>
              <TabsTrigger value="values">Our Values</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mission" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-flex-text">Why We Created Flex</h2>
                <p className="text-gray-600 mb-6">
                  In today's fast-paced world, it's easier than ever to feel overwhelmed by competing priorities, endless to-do lists, and the pressure to constantly achieve more. We built Flex because we believe there's a better way to approach productivity—one that adapts to you, rather than forcing you to adapt to it.
                </p>
                <p className="text-gray-600 mb-6">
                  Our founder, after struggling with burnout from rigid productivity systems that didn't account for the natural ebbs and flows of human energy and motivation, set out to create a solution that would flex and adapt with users, just like a chameleon adapts to its environment.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-flex-green/5 to-flex-yellow/5 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-flex-text">Our Philosophy</h3>
                <p className="text-gray-600 mb-6">
                  We believe that productivity isn't about forcing yourself to stick to rigid systems. It's about creating environments and habits that work with your natural tendencies, not against them.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-flex-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-flex-text mb-1">Adapt</h4>
                      <p className="text-sm text-gray-600">
                        Systems should adapt to your needs, not the other way around.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-flex-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-flex-text mb-1">Evolve</h4>
                      <p className="text-sm text-gray-600">
                        As you change and grow, your productivity system should evolve with you.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-flex-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-flex-text mb-1">Flourish</h4>
                      <p className="text-sm text-gray-600">
                        The goal isn't just to get things done, but to thrive in all areas of life.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-flex-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-flex-text mb-1">Balance</h4>
                      <p className="text-sm text-gray-600">
                        Productivity should enhance your life, not consume it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-flex-text">Our Impact</h3>
                <p className="text-gray-600 mb-6">
                  Since launching in 2023, Flex has helped over 50,000 users across 60+ countries improve their productivity, build better habits, and achieve their personal and professional goals.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-flex-green mb-1">50K+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-flex-yellow mb-1">60+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-flex-orange mb-1">1.2M+</div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-flex-green mb-1">4.8</div>
                    <div className="text-sm text-gray-600">App Store Rating</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="values" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-flex-text">Our Core Values</h2>
                <p className="text-gray-600 mb-6">
                  At Flex, our values guide everything we do—from the features we develop to how we interact with our users and each other.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-flex-green/10 p-3 rounded-full mr-4">
                      <Users className="h-6 w-6 text-flex-green" />
                    </div>
                    <h3 className="text-xl font-bold text-flex-text">User-Centered</h3>
                  </div>
                  <p className="text-gray-600">
                    We put our users at the center of everything we do. Every feature, design decision, and update is made with your needs in mind.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-flex-yellow/10 p-3 rounded-full mr-4">
                      <Heart className="h-6 w-6 text-flex-yellow-dark" />
                    </div>
                    <h3 className="text-xl font-bold text-flex-text">Compassionate</h3>
                  </div>
                  <p className="text-gray-600">
                    We recognize that productivity isn't about pushing yourself to burnout. We approach our work and our users with empathy and understanding.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-flex-orange/10 p-3 rounded-full mr-4">
                      <Zap className="h-6 w-6 text-flex-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-flex-text">Innovative</h3>
                  </div>
                  <p className="text-gray-600">
                    We're not afraid to challenge conventional wisdom about productivity. We continually explore new ideas and approaches to help you work smarter, not harder.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-flex-green/10 p-3 rounded-full mr-4">
                      <Award className="h-6 w-6 text-flex-green" />
                    </div>
                    <h3 className="text-xl font-bold text-flex-text">Excellence</h3>
                  </div>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, from the quality of our code to the user experience of our app. We're always looking for ways to improve.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-flex-green/5 to-flex-yellow/5 rounded-2xl p-8 mt-12">
                <h3 className="text-2xl font-bold mb-6 text-flex-text">Our Commitment to You</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-flex-green mr-3" />
                    <p className="text-gray-700">We will always respect your privacy and data.</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-flex-green mr-3" />
                    <p className="text-gray-700">We will continually improve and evolve our product based on your feedback.</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-flex-green mr-3" />
                    <p className="text-gray-700">We will provide transparent and helpful support when you need it.</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-flex-green mr-3" />
                    <p className="text-gray-700">We will build tools that adapt to your needs, not the other way around.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-flex-text">The Team Behind Flex</h2>
                <p className="text-gray-600 mb-6">
                  We're a diverse team of designers, developers, productivity enthusiasts, and lifelong learners based around the world but united by our mission to help people adapt, evolve, and flourish.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Founder */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                      alt="Alex Morgan - Founder & CEO" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-flex-text">Alex Morgan</h3>
                    <p className="text-sm text-flex-green mb-2">Founder & CEO</p>
                    <p className="text-sm text-gray-600">
                      Former productivity coach and software engineer with a passion for helping people achieve their potential.
                    </p>
                  </div>
                </div>
                
                {/* Head of Product */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                      alt="Jamie Chen - Head of Product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-flex-text">Jamie Chen</h3>
                    <p className="text-sm text-flex-green mb-2">Head of Product</p>
                    <p className="text-sm text-gray-600">
                      User-centered product designer with experience at leading tech companies and a psychology background.
                    </p>
                  </div>
                </div>
                
                {/* Lead Developer */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                      alt="Sam Wilson - Lead Developer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-flex-text">Sam Wilson</h3>
                    <p className="text-sm text-flex-green mb-2">Lead Developer</p>
                    <p className="text-sm text-gray-600">
                      Full-stack developer with a focus on creating intuitive, performant applications that solve real-world problems.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-flex-text text-center">Join Our Team</h3>
                <div className="bg-gradient-to-r from-flex-green/5 to-flex-yellow/5 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                      <h4 className="text-xl font-bold text-flex-text mb-3">We're Growing!</h4>
                      <p className="text-gray-600 mb-4">
                        We're always looking for talented individuals who are passionate about productivity, technology, and making a positive impact on people's lives.
                      </p>
                      <div className="flex items-center">
                        <Terminal className="h-5 w-5 text-flex-green mr-2" />
                        <span className="text-sm text-gray-700">Check out our open positions on our careers page.</span>
                      </div>
                    </div>
                    <div className="md:w-1/3 text-center">
                      <button className="cta-button">
                        View Open Positions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-br from-white to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-flex-text">Ready to Transform Your Productivity?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are already using Flex to build better habits, get more done, and achieve their goals.
          </p>
          <a href="/onboarding" className="cta-button inline-block">
            Start Your Journey
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
