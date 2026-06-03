import { Mail, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact Us - Lawn Mower Directory',
  description: 'Get in touch with Lawn Mower Directory. Have questions, suggestions, or want to list your business? Contact our team today.',
}

export default function ContactPage() {
 
 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            </div>
          </div>
          
          {/* Contact Info Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div>
                   
                  </div>
                </div>
                
                
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Email Us</p>
                    <p className="text-gray-600 text-sm">
                      <a href="mailto:info@lawnmowingnearme.org" className="hover:text-green-600">
                        info@lawnmowingnearme.org
                      </a>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Support: support@lawnmowingnearme.org</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Business Hours</p>
                    <p className="text-gray-600 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Preview */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Frequently Asked</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm">How do I list my business?</p>
                  <p className="text-gray-600 text-sm mt-1">Click "List Your Business" in the navbar and fill out our simple form.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Is listing free?</p>
                  <p className="text-gray-600 text-sm mt-1">Yes! Basic listings are completely free.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">How long until my listing appears?</p>
                  <p className="text-gray-600 text-sm mt-1">Most listings are approved within 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  )
}