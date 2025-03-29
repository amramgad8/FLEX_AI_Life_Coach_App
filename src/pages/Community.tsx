
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MessageSquare, Users as UsersIcon, Award, Bookmark, Heart, MessageCircle, Share2, TrendingUp, Calendar, Star } from 'lucide-react';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock forum posts
  const posts = [
    {
      id: 1,
      title: "How I used Flex to increase my productivity by 35%",
      author: {
        name: "Sarah Johnson",
        avatar: "SJ",
        role: "Member"
      },
      category: "Success Stories",
      replies: 24,
      views: 342,
      likes: 67,
      createdAt: "2 days ago",
      featured: true,
      trending: true
    },
    {
      id: 2,
      title: "Best way to organize your tasks for the week?",
      author: {
        name: "David Chen",
        avatar: "DC",
        role: "Moderator"
      },
      category: "Tips & Tricks",
      replies: 35,
      views: 289,
      likes: 43,
      createdAt: "5 days ago",
      featured: false,
      trending: true
    },
    {
      id: 3,
      title: "Feature request: Integrating with Google Calendar",
      author: {
        name: "Emma Wilson",
        avatar: "EW",
        role: "Member"
      },
      category: "Feature Requests",
      replies: 18,
      views: 134,
      likes: 29,
      createdAt: "1 week ago",
      featured: false,
      trending: false
    },
    {
      id: 4,
      title: "Bug: Focus timer doesn't send notifications properly",
      author: {
        name: "Michael Brown",
        avatar: "MB",
        role: "Member"
      },
      category: "Troubleshooting",
      replies: 7,
      views: 86,
      likes: 5,
      createdAt: "3 days ago",
      featured: false,
      trending: false
    },
    {
      id: 5,
      title: "Monthly habit tracker template (Free download)",
      author: {
        name: "Jessica Lee",
        avatar: "JL",
        role: "Contributor"
      },
      category: "Resources",
      replies: 42,
      views: 512,
      likes: 93,
      createdAt: "2 weeks ago",
      featured: true,
      trending: true
    }
  ];
  
  // Mock upcoming events
  const events = [
    {
      id: 1,
      title: "Productivity Masterclass Webinar",
      date: "June 15, 2023",
      time: "2:00 PM - 3:30 PM EST",
      host: "Dr. James Peterson",
      attendees: 145
    },
    {
      id: 2,
      title: "Goal Setting Workshop",
      date: "June 22, 2023",
      time: "1:00 PM - 2:00 PM EST",
      host: "Michelle Rivera",
      attendees: 89
    },
    {
      id: 3,
      title: "New Feature Demo: AI Planner",
      date: "June 28, 2023",
      time: "11:00 AM - 12:00 PM EST",
      host: "Flex Product Team",
      attendees: 213
    }
  ];
  
  // Filter posts based on search query
  const filteredPosts = searchQuery === '' 
    ? posts 
    : posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
              Flex Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with other Flex users, share tips, ask questions, and participate in discussions.
            </p>
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <UsersIcon className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold dark:text-white">12,548</p>
                <p className="text-gray-500 dark:text-gray-400">Members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold dark:text-white">32,915</p>
                <p className="text-gray-500 dark:text-gray-400">Posts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-2xl font-bold dark:text-white">894</p>
                <p className="text-gray-500 dark:text-gray-400">Online Now</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Award className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-2xl font-bold dark:text-white">145</p>
                <p className="text-gray-500 dark:text-gray-400">Contributors</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Community Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Trending Topics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Bookmarked
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Events
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Award className="mr-2 h-4 w-4" />
                    Top Contributors
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    My Posts
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium dark:text-white">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {event.date}, {event.time}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Hosted by {event.host}
                        </span>
                        <Badge variant="outline">{event.attendees} attending</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Events</Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Forum Content */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Discussion Forum</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                          type="text"
                          placeholder="Search posts..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button>New Post</Button>
                    </div>
                  </div>
                </CardHeader>
                
                <Tabs defaultValue="all" className="w-full">
                  <div className="px-6">
                    <TabsList className="grid grid-cols-5 w-full mb-6">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
                      <TabsTrigger value="success">Success Stories</TabsTrigger>
                      <TabsTrigger value="help">Help & Support</TabsTrigger>
                      <TabsTrigger value="features">Feature Requests</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    <CardContent className="p-0">
                      {filteredPosts.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredPosts.map(post => (
                            <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    {post.featured && (
                                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                        Featured
                                      </Badge>
                                    )}
                                    {post.trending && (
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Trending
                                      </Badge>
                                    )}
                                    <Badge variant="outline">{post.category}</Badge>
                                  </div>
                                  <h3 className="font-medium text-lg dark:text-white">{post.title}</h3>
                                  <div className="flex items-center mt-2">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarFallback>{post.author.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {post.author.name} • {post.createdAt}
                                    </span>
                                  </div>
                                </div>
                                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.replies}
                                  </div>
                                  <div className="flex items-center">
                                    <Heart className="h-4 w-4 mr-1" />
                                    {post.likes}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-4 md:hidden text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {post.replies}
                                </div>
                                <div className="flex items-center">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {post.likes}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 dark:text-gray-400">
                            No results found for "{searchQuery}". Please try another search term.
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Previous</Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Page 1 of 12</span>
                      </div>
                      <Button variant="outline">Next</Button>
                    </CardFooter>
                  </TabsContent>
                  
                  <TabsContent value="tips" className="mt-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        View all tips and tricks shared by the community.
                      </p>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="success" className="mt-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Read inspiring success stories from other Flex users.
                      </p>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="help" className="mt-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Ask questions and get help from the community.
                      </p>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Suggest new features and vote on existing requests.
                      </p>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Community;