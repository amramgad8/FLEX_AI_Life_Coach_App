
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: June 1, 2023
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                At Flex, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Collection of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We may collect information about you in a variety of ways. The information we may collect via the Application includes:
              </p>
              
              <h3>Personal Data</h3>
              <p>
                Personally identifiable information, such as your name, email address, and demographic information that you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Application.
              </p>
              
              <h3>Derivative Data</h3>
              <p>
                Information our servers automatically collect when you access the Application, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Application.
              </p>
              
              <h3>Financial Data</h3>
              <p>
                Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Application. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
              </p>
              
              <h3>Data From Social Networks</h3>
              <p>
                User information from social networking sites, such as Apple's Game Center, Facebook, Google+, Instagram, Pinterest, Twitter, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
              </p>
              
              <h3>Mobile Device Data</h3>
              <p>
                Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Application from a mobile device.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Use of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
              </p>
              
              <ul>
                <li>Create and manage your account.</li>
                <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Application to you.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
                <li>Generate a personal profile about you to make future visits to the Application more personalized.</li>
                <li>Increase the efficiency and operation of the Application.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                <li>Notify you of updates to the Application.</li>
                <li>Offer new products, services, mobile applications, and/or recommendations to you.</li>
                <li>Perform other business activities as needed.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                <li>Process payments and refunds.</li>
                <li>Request feedback and contact you about your use of the Application.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
                <li>Respond to product and customer service requests.</li>
                <li>Send you a newsletter.</li>
                <li>Solicit support for the Application.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Disclosure of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              
              <h3>By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
              </p>
              
              <h3>Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
              </p>
              
              <h3>Marketing Communications</h3>
              <p>
                With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
              </p>
              
              <h3>Interactions with Other Users</h3>
              <p>
                If you interact with other users of the Application, those users may see your name, profile photo, and descriptions of your activity.
              </p>
              
              <h3>Online Postings</h3>
              <p>
                When you post comments, contributions or other content to the Application, your posts may be viewed by all users and may be publicly distributed outside the Application in perpetuity.
              </p>
              
              <h3>Business Transfers</h3>
              <p>
                We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Security of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p className="font-medium">
                Flex, Inc.<br />
                1234 Innovation Way<br />
                San Francisco, CA 94103<br />
                privacy@flexapp.com<br />
                (555) 123-4567
              </p>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Button>Contact Us</Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;