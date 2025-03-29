
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

const faqCategories = [
  { name: 'Getting Started', id: 'getting-started' },
  { name: 'Account', id: 'account' },
  { name: 'Features', id: 'features' },
  { name: 'Billing', id: 'billing' },
  { name: 'Troubleshooting', id: 'troubleshooting' },
];

const faqItems = [
  {
    question: 'What is Flex?',
    answer: 'Flex is an adaptive habit building platform that evolves with you, helping you transform your routines and achieve your goals. It combines task management, focus tools, and AI-powered planning to create a personalized productivity experience.',
    category: 'getting-started',
  },
  {
    question: 'How do I get started with Flex?',
    answer: 'To get started with Flex, simply create an account and complete the onboarding process. This will help us understand your goals and customize the experience for you. After that, you can start adding tasks, setting up focus sessions, and exploring all the features Flex has to offer.',
    category: 'getting-started',
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Yes, Flex is available as a web application and has mobile apps for both iOS and Android. You can synchronize your data across all your devices for a seamless experience.',
    category: 'features',
  },
  {
    question: 'How do I change my password?',
    answer: 'You can change your password in the Settings page under the Account tab. Click on "Change Password", enter your current password and your new password, then confirm the changes.',
    category: 'account',
  },
  {
    question: 'Can I integrate Flex with other tools?',
    answer: 'Yes, Flex offers integrations with popular productivity tools like Google Calendar, Notion, Todoist, and more. You can set up these integrations in the Settings page under the Integrations tab.',
    category: 'features',
  },
  {
    question: 'How does the Pomodoro timer work?',
    answer: 'The Pomodoro timer in Flex helps you work in focused intervals. By default, it\'s set to 25-minute focus sessions followed by 5-minute breaks. After four focus sessions, you get a longer 15-minute break. You can customize these durations in the Focus page settings.',
    category: 'features',
  },
  {
    question: 'What is the Eisenhower Matrix?',
    answer: 'The Eisenhower Matrix is a productivity framework that helps you prioritize tasks based on their urgency and importance. It divides tasks into four quadrants: Do (important and urgent), Schedule (important but not urgent), Delegate (urgent but not important), and Eliminate (neither important nor urgent).',
    category: 'features',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription in the Settings page under the Account tab. Click on "Manage Subscription" and select the option to cancel. Your access will continue until the end of your current billing cycle.',
    category: 'billing',
  },
  {
    question: 'What is the difference between the free and paid plans?',
    answer: 'The free plan includes basic task management, limited focus sessions, and core features. Paid plans offer unlimited tasks, advanced analytics, AI-powered planning, goal tracking, data export, and priority support.',
    category: 'billing',
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regular security audits to ensure your information is protected. You can also enable two-factor authentication for added security.',
    category: 'account',
  },
  {
    question: 'The app is not working properly. What should I do?',
    answer: 'First, try refreshing the page or restarting the app. Clear your browser cache if using the web version. If problems persist, check our status page for any ongoing issues, or contact our support team for assistance.',
    category: 'troubleshooting',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export your data in various formats (CSV, JSON) from the Settings page under the Privacy tab. This allows you to backup your information or transfer it to other systems if needed.',
    category: 'account',
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter FAQ items based on search query and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about Flex. If you can't find what you're looking for, feel free to contact our support team.
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search for questions..."
                className="pl-10 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className="mb-2"
            >
              All
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* FAQ Accordion */}
          <Card className="max-w-3xl mx-auto p-6 mb-8">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No results found for "{searchQuery}". Please try another search term.
                </p>
              </div>
            )}
          </Card>
          
          {/* Contact Support */}
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Still have questions?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              If you couldn't find the answer you were looking for, our support team is here to help.
            </p>
            <Button>Contact Support</Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;