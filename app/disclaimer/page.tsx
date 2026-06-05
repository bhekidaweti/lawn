import { Metadata } from 'next'



export const metadata: Metadata = {
  title: 'Disclaimer - Lawn Mowing Directory',
  description: 'Read our disclaimer regarding the use of Lawn Mowing Directory - your trusted source for finding professional lawn mowing services across the country.',
  keywords: 'lawn mowing directory disclaimer, lawn mowing services, lawn care platform',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">   
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12"> 
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
                <p className="text-xl max-w-3xl mx-auto">
                    The information provided on our directory is for general informational purposes only.
                    We strive to keep the information up to date and correct, but we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
                </p>
            </div>
        </div>  
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-4">Use at Your Own Risk</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
                By using our directory, you acknowledge and agree that you are solely responsible for any decisions or actions taken based on the information provided. We do not endorse or guarantee the quality of services listed on our Directory, and we are not liable for any damages or losses arising from your use of the Directory. Always conduct your own research and due diligence before hiring any service provider.
            </p>
        </div>
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-4">Ratings and Reviews</h2>       
            <p className="text-gray-600 leading-relaxed mb-4">
                The ratings and reviews on our directory are sourced from Google reviews and are for informational purposes only. We do not verify the authenticity of reviews or the accuracy of ratings, and we are not responsible for any discrepancies or inaccuracies in the ratings. Always read multiple reviews and use your judgment when evaluating service providers.
            </p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md mt-8">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
                If you have any questions or concerns about our disclaimer, please contact us at        

                <a href="mailto:info@lawnmowingnearme.org" className="text-green-600 hover:underline">
                    info@lawnmowingnearme.org
                </a>
            </p>
        </div>
    </div>
  )
}