
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: June 1, 2023
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                By accessing and using the Flex application and service (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Flex provides users with an adaptive habit building platform that includes task management, focus tools, and AI-powered planning ("Service"). The Service is provided "as is" and on an "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of title or implied warranties of merchantability or fitness for a particular purpose.
              </p>
              <p>
                Flex reserves the right to change, modify, suspend, or discontinue the Service or any part thereof with or without notice at any time. Flex shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                In order to use certain features of the Service, you must register for an account with Flex and provide certain information as prompted by the registration form. You represent and warrant that:
              </p>
              <ol>
                <li>All required registration information you submit is truthful and accurate;</li>
                <li>You will maintain the accuracy of such information;</li>
                <li>You are at least 13 years of age or have the permission of a legal guardian;</li>
                <li>Your use of the Service does not violate any applicable law or regulation.</li>
              </ol>
              <p>
                You are responsible for maintaining the confidentiality of your account password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Subscription Terms and Payment</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Some aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the terms of sale and payment terms as displayed during the purchase process.
              </p>
              <p>
                Flex may modify the price of any products or services offered through the Service at any time. Flex will notify you of any such price changes by publishing the new prices on the applicable Service listing or by sending notice to the email address associated with your account.
              </p>
              <p>
                Subscriptions automatically renew for the same subscription term at the then-current rate posted on the Service, unless you cancel your subscription before the renewal date. You can cancel your subscription at any time through your account settings or by contacting customer support.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. User Content</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                The Service allows you to create, post, store and share content, including but not limited to text, comments, images, and other materials (collectively, "User Content"). You retain any copyright that you may hold in the User Content that you post to Flex.
              </p>
              <p>
                By posting or submitting User Content to the Service, you grant Flex a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content in any and all media or distribution methods. This license authorizes us to make your User Content available to the rest of the world and to let others do the same.
              </p>
              <p>
                You agree that this license includes the right for Flex to provide, promote, and improve the Service and to make content submitted to or through the Service available to other companies, organizations or individuals for the syndication, broadcast, distribution, promotion or publication of such content on other media and services, subject to our terms and conditions for such content use.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Prohibited Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                You agree not to use the Service to:
              </p>
              <ul>
                <li>Violate any applicable law or regulation;</li>
                <li>Infringe the rights of any third party, including but not limited to intellectual property rights, privacy rights, or rights of publicity;</li>
                <li>Upload or transmit viruses, malware, or other types of malicious software, or intentionally impair the operation of the Service;</li>
                <li>Harass, abuse, or harm another person, or to impersonate or attempt to impersonate any person or entity;</li>
                <li>Attempt to gain unauthorized access to the Service, other accounts, computer systems or networks connected to the Service;</li>
                <li>Collect or track the personal information of others;</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service;</li>
                <li>Use any robot, spider or other automatic device, process or means to access the Service for any purpose, including monitoring or copying any of the material on the Service;</li>
                <li>Introduce any material that is harmful, threatening, abusive, vulgar, obscene, defamatory, or otherwise objectionable;</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Service.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                In no event shall Flex, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ol>
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="font-medium">
                Flex, Inc.<br />
                1234 Innovation Way<br />
                San Francisco, CA 94103<br />
                legal@flexapp.com<br />
                (555) 123-4567
              </p>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Button>Contact Us</Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;