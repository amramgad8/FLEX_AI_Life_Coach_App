
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, VideoIcon, HelpCircle, FileText, MessageCircle, LifeBuoy, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
              Help Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find the resources you need to get the most out of Flex.
            </p>
          </div>
          
          {/* Search Banner */}
          <div className="relative mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  How can we help you today?
                </h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input 
                    type="text" 
                    placeholder="Search for help articles, tutorials, and more..." 
                    className="pl-12 py-6 text-lg bg-white dark:bg-gray-800"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help Resources */}
          <Tabs defaultValue="guides" className="w-full mb-16">
            <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="guides">
                <BookOpen className="mr-2 h-4 w-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="videos">
                <VideoIcon className="mr-2 h-4 w-4" />
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="docs">
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guides">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started Guide</CardTitle>
                    <CardDescription>Learn the basics of Flex</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      A comprehensive guide to setting up your Flex account and navigating the platform.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Task Management</CardTitle>
                    <CardDescription>Master your task workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Learn how to create, organize, and prioritize tasks for maximum productivity.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Focus Timer Guide</CardTitle>
                    <CardDescription>Boost your concentration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      How to use the Pomodoro technique and focus timer to improve your work sessions.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Planner Tutorial</CardTitle>
                    <CardDescription>Let AI optimize your schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Discover how to leverage our AI planning features to create balanced, achievable schedules.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Setting Framework</CardTitle>
                    <CardDescription>Achieve your ambitions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Our step-by-step approach to setting and achieving meaningful personal and professional goals.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Eisenhower Matrix Guide</CardTitle>
                    <CardDescription>Prioritize effectively</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Learn how to use the Eisenhower matrix to categorize and prioritize your tasks.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-0">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-md aspect-video flex items-center justify-center mb-4">
                      <VideoIcon size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <CardTitle>Flex Basics Tutorial</CardTitle>
                    <CardDescription>5:25 mins</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      A quick overview of the main features and navigation in Flex.
                    </p>
                    <Button variant="outline" className="w-full">Watch Video</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-0">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-md aspect-video flex items-center justify-center mb-4">
                      <VideoIcon size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <CardTitle>Focus Techniques</CardTitle>
                    <CardDescription>8:12 mins</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Learn various focus techniques and how to implement them with Flex.
                    </p>
                    <Button variant="outline" className="w-full">Watch Video</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-0">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-md aspect-video flex items-center justify-center mb-4">
                      <VideoIcon size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <CardTitle>Goal Setting Masterclass</CardTitle>
                    <CardDescription>12:45 mins</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      A comprehensive guide to setting achievable goals in Flex.
                    </p>
                    <Button variant="outline" className="w-full">Watch Video</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="faq">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Frequently Asked Questions</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse our comprehensive FAQ section for quick answers to common questions.
                </p>
                <div className="mt-6">
                  <Link to="/faq">
                    <Button size="lg">
                      View All FAQs
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="docs">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Technical Documentation</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed technical documentation for developers and advanced users.
                </p>
                <div className="mt-6">
                  <Button size="lg">
                    View Documentation
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Contact Options */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
              Need More Help?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Chat with our support team in real-time during business hours.
                  </p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <LifeBuoy className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                  </div>
                  <CardTitle>Submit a Ticket</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create a support ticket and we'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" className="w-full">Create Ticket</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <UsersIcon className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle>Community Forum</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect with other users and share tips in our community.
                  </p>
                  <Link to="/community">
                    <Button variant="outline" className="w-full">Join Community</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;