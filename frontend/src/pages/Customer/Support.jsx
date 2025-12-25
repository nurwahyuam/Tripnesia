// src/pages/Guest/Support.jsx
import React, { useEffect, useState } from "react";
import GuestLayout from "../../layouts/GuestLayout";
import SupportCard from "../../components/SupportCard";
import ContactSection from "../../components/ContactSection";
import Breadcrumb from "../../components/Breadcrumb";
import { MessagesSquare, Search, ChevronDown, ChevronUp } from "lucide-react";
import CustomerLayout from "../../layouts/CustomerLayout";

const Support = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const steps = [
    {
      id: 1,
      title: "How to book a boat",
      list: [
        {
          id: 1,
          name: "How to book a boat",
          content: (
            <>
              <p className="mb-4">Booking your first trip with KapalSantai is straightforward. You can choose between a Private Trip or an Open Trip. Here’s how:</p>
              <h3 className="font-semibold mt-6 mb-3">Private Trip</h3>
              <ol className="list-decimal pl-5 space-y-4 mb-6">
                <li>
                  <strong>Log In or Sign Up</strong>
                  <p className="ml-6 mt-1">Go to tripnesia.com and create a new account, or log in if you already have one.</p>
                </li>
                <li>
                  <strong>Browse Boats</strong>
                  <p className="ml-6 mt-1">Select the “List of Boats” menu to view all available vessels.</p>
                </li>
                <li>
                  <strong>View Boat Details</strong>
                  <p className="ml-6 mt-1">Click on any boat to see:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Amenities and guest capacity</li>
                    <li>Route information</li>
                    <li>Rental price (for a private charter)</li>
                  </ul>
                </li>
                <li>
                  <strong>Fill Out the Booking Form</strong>
                  <p className="ml-6 mt-1">Click the “Book Now” button and fill in:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Full name</li>
                    <li>Preferred departure date</li>
                    <li>Number of guests</li>
                  </ul>
                </li>
                <li>
                  <strong>Complete Payment or Send Request via WhatsApp</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Online Payment: After submitting the form, you will be redirected to the payment page. Follow the instructions to complete the transaction.</li>
                    <li>WhatsApp Request: If you prefer to be assisted directly, click the WhatsApp button on the confirmation page and send your booking details via chat.</li>
                  </ul>
                </li>
              </ol>
              <p className="my-2">
                <strong>Tip: </strong> Double-check your personal data and travel date before payment. Our team will reconfirm via WhatsApp if any details are unclear.
              </p>
              <h3 className="font-semibold mt-6 mb-3">Open Trip</h3>
              <ol className="list-decimal pl-5 space-y-4 mb-6">
                <li>
                  <strong>Log In or Sign Up</strong>
                  <p className="ml-6 mt-1">Go to tripnesia.com and create a new account, or log in if you already have one.</p>
                </li>
                <li>
                  <strong>Find Open Trip Schedules </strong>
                  <p className="ml-6 mt-1">On the “List of Boats” page, use the “Open Trip” filter to see boats with shared-trip schedules.</p>
                </li>
                <li>
                  <strong>View Details & Open Trip Schedule</strong>
                  <p className="ml-6 mt-1">Click on a boat to check:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Participant quota (minimum number of travelers)</li>
                    <li>Price per person</li>
                    <li>Amenities (e.g., cabins, snorkeling gear, meals)</li>
                  </ul>
                </li>
                <li>
                  <strong>Fill Out the Booking Form</strong>
                  <p className="ml-6 mt-1">Click the “Book Now” button and fill in:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Full name</li>
                    <li>Chosen trip date</li>
                    <li>Number of guests</li>
                    <li>Cabin preference</li>
                  </ul>
                </li>
                <li>
                  <strong>Complete Payment or Send Request via WhatsApp</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Online Payment: Follow the payment instructions on the confirmation page.</li>
                    <li>WhatsApp: Click the WhatsApp button to send your booking details and get direct assistance from our team.</li>
                  </ul>
                </li>
              </ol>
              <p className="my-2">
                <strong>Note: </strong> Open Trips require a minimum number of participants; make sure your booking meets the requirement to guarantee departure.
              </p>
            </>
          ),
        },
        {
          id: 2,
          name: "Steps to choose the right boat type",
          content: (
            <>
              <h3 className="font-semibold mt-6 mb-3">1. Define Your Needs & Budget</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Number of guests? (solo, family, group)</li>
                <li>Full privacy (Private Trip) or cost-sharing (Open Trip)?</li>
              </ul>

              <h3 className="font-semibold mt-6 mb-3">2. Select Duration & Route</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>2D1N / 3D2N / 4D3N</li>
                <li>North Corridor (Rinca–Gili Lawa) or South Corridor (Padar–Pink Beach)</li>
              </ul>

              <h3 className="font-semibold mt-6 mb-3">3. Check Cabin Type & Amenities</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Master, Deluxe, Superior, or Sharing</li>
              </ul>

              <h3 className="font-semibold mt-6 mb-3">4. Compare Boats</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Match vessel capacity and facilities to your requirements</li>
                <li>Review photos, guest reviews, and boat details</li>
              </ul>
              <h3 className="font-semibold mt-6 mb-3">5. Consult via WhatsApp</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>On the Kapalsantai website, click the WhatsApp button</li>
                <li>Chat with our team for personalized recommendations and best offers</li>
              </ul>
            </>
          ),
        },
        {
          id: 3,
          name: "Private Trip or Open Trip, which one should I pick?",
          content: (
            <>
              <p className="mb-4">
                When choosing between a Private Trip and an Open Trip with KapalSantai, consider your needs, budget, and the type of experience you want. Here’s a breakdown of differences, benefits, and some extra points to help you decide:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Feature</th>
                      <th className="border p-2 text-left">Private Trip</th>
                      <th className="border p-2 text-left">Open Trip</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Dates</td>
                      <td className="border p-2">Flexible: You choose any available date</td>
                      <td className="border p-2">Fixed Schedule: Follows available open-trip dates</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Route</td>
                      <td className="border p-2">You are given the option to choose available routes</td>
                      <td className="border p-2">Route is all set</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Privacy</td>
                      <td className="border p-2">Full: Only your group on board</td>
                      <td className="border p-2">Shared: You join other participants</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Amenities & Service</td>
                      <td className="border p-2">Personalized: Adjust snorkeling times, meal schedule, and menus</td>
                      <td className="border p-2">Similar to private, but dorm cabins might be shared</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Pricing</td>
                      <td className="border p-2">Boat-rate: Higher per person but exclusive</td>
                      <td className="border p-2">Per-person: More budget-friendly since costs are shared</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Minimum Quota</td>
                      <td className="border p-2">None—only your group</td>
                      <td className="border p-2">Often 6–8 pax minimum; trip may cancel or reschedule if quota isn't met</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Advantages</td>
                      <td className="border p-2">Privacy, full flexibility, ideal for families or special groups</td>
                      <td className="border p-2">Cost-effective, no planning needed, opportunity to meet new people</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          id: 4,
          name: "After full payment, the Boat is unavailable, Refund or Replacement?",
          content: (
            <>
              <h3 className="font-semibold mt-6 mb-3">Double Booking</h3>
              <p className="mb-4">Scheduling error by the boat's admin → they’ll source an alternative boat matching your trip type (Private/Open). KapalSantai will confirm within 2×24 hours; if no response, auto refund.</p>

              <h3 className="font-semibold mt-6 mb-3">Overbook</h3>
              <p className="mb-2">Your slot is overbooked → you’ll be moved to another partner boat.</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>We will arrange a replacement vessel with equivalent specifications.</li>
                <li>If upgraded to a higher-rate boat, the difference will be charged to you.</li>
              </ul>

              <h3 className="font-semibold mt-6 mb-3">Force Majeure</h3>
              <p>Uncontrollable events (severe weather, sailing ban) → full refund automatically.</p>
            </>
          ),
        },
        {
          id: 5,
          name: "Adding guests after reservation is confirmed",
          content: (
            <>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Once your reservation is confirmed, contact KapalSantai’s admin via WhatsApp or email to request adding more guests.</li>
                <li>Our admin will forward your request to the boat operator.</li>
                <li>The boat operator decides whether to approve extra guests, including any additional fees.</li>
                <li>If approved, the admin will send payment instructions for the extra charges and send you an updated confirmation.</li>
              </ul>
            </>
          ),
        },
        {
          id: 6,
          name: "Book a last-minute trip",
          content: (
            <>
              <p className="mb-2">Yes, you can book a last-minute trip:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>As long as a boat and slots are available, you can book even at the last minute.</li>
                <li>It’s recommended to contact KapalSantai’s admin via WhatsApp to check availability and expedite the process.</li>
                <li>Payment must be made immediately to secure your spot.</li>
              </ul>
            </>
          ),
        },
      ],
    },
    {
      id: 2,
      title: "Fees & Payments",
      list: [
        { id: 1, name: "Payment methods we accept" },
        { id: 2, name: "How to pay using an international debit/credit card" },
        { id: 3, name: "Pay by local bank transfer" },
      ],
    },
    {
      id: 3,
      title: "Reschedule & Cancellation",
      list: [
        { id: 1, name: "Flexible rescheduling up to 30 days before departure" },
        { id: 2, name: "Extending or shortening your trip duration" },
        { id: 3, name: "Cancellation policy & refund" },
        { id: 4, name: "Procedure for canceling some guests in one booking" },
      ],
    },
    {
      id: 4,
      title: "Refund Policy",
      list: [
        { id: 1, name: "Refund policy" },
        { id: 2, name: "How to request a refund via WhatsApp Customer Service" },
        { id: 3, name: "How long does the refund process take?" },
        { id: 4, name: "Guide to refunds for partial guest cancellations within one booking" },
      ],
    },
    {
      id: 5,
      title: "Itinerary & Destination",
      list: [
        { id: 1, name: "Standard routes 2D1N, 3D2N, and 4D3N" },
        { id: 2, name: "Customizing a private itinerary" },
        { id: 3, name: "Kids’ activity recommendations onboard" },
      ],
    },
    {
      id: 6,
      title: "Accommodation & Boat Facilities",
      list: [
        { id: 1, name: "Onboard facilities" },
        { id: 2, name: "Cabin types & bed configurations" },
        { id: 3, name: "Meal menu & dietary preferences (vegan, halal, allergies)" },
        { id: 4, name: "Wi-Fi and electricity access at sea" },
        { id: 5, name: "Use of Kayak, Paddle Board & Snorkeling Equipment" },
        { id: 6, name: "Alcohol policy onboard" },
        { id: 7, name: "Additional services during the trip" },
      ],
    },
    {
      id: 7,
      title: "Safety & Health",
      list: [
        { id: 1, name: "Safety briefing before departure" },
        { id: 2, name: "Medical emergency procedure at sea" },
        { id: 3, name: "Age limit & guest health conditions" },
      ],
    },
    {
      id: 8,
      title: "Travel Preparation & Luggage",
      list: [
        { id: 1, name: "Essential packing checklist" },
        { id: 2, name: "Seasonal weather guide for Labuan Bajo" },
        { id: 3, name: "Storing valuables in your cabin" },
        { id: 4, name: "Luggage limit & personal diving gear" },
        { id: 5, name: "Local etiquette & cultural awareness" },
        { id: 6, name: "Airport–Harbor transportation we provide" },
      ],
    },
    {
      id: 9,
      title: "Policy & Documents",
      list: [
        { id: 1, name: "Required identification documents at check-in" },
        { id: 2, name: "Drone usage policy" },
        { id: 3, name: "Smoking policy onboard" },
        { id: 4, name: "Personal speaker & music policy" },
      ],
    },
    {
      id: 10,
      title: "Account & Privacy",
      list: [
        { id: 1, name: "Creating an account & email verification" },
        { id: 2, name: "How to sign in with Google" },
        { id: 3, name: "Changing password & phone number" },
        { id: 4, name: "Deleting your account & personal data" },
        { id: 5, name: "Saving 'Favorite' boats for later" },
        { id: 6, name: "Booking history & how to download invoice" },
      ],
    },
    {
      id: 11,
      title: "Support & Contact",
      list: [
        { id: 1, name: "Emergency hotline number during trip" },
        { id: 2, name: "How to report items left behind on the boat" },
      ],
    },
    {
      id: 12,
      title: "Becoming a Boat Partner",
      list: [
        { id: 1, name: "Requirements to join as a Kapalsantai boat partner" },
        { id: 2, name: "How to register your boat" },
        { id: 3, name: "Boat safety standards" },
      ],
    },
  ];

  const filteredSteps = steps.filter((step) => {
    const matchesTitle = step.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAnyItem = step.list?.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTitle || matchesAnyItem;
  });

  const visibleSteps = showAll ? filteredSteps : filteredSteps.slice(0, 9);

  useEffect(() => {
    setShowAll(false);
  }, [searchQuery]);

  return (
    <CustomerLayout>
      <Breadcrumb />
      {/* Hero Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-lg md:text-4xl font-[625] text-gray-800 mb-6">Welcome to the Help Center</h1>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 w-6 h-6 text-gray-400" />
            <input type="text" id="search" name="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-gray-400 w-full px-4 pl-12 py-2.5 rounded-xl" placeholder="How can we help you?" />
          </div>
        </div>
      </section>

      {/* Booking Steps Grid */}
      <div className="container mx-auto px-4">
        {filteredSteps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No results found for "{searchQuery}"</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
              {visibleSteps.map((step) => (
                <SupportCard key={step.id} icon={<MessagesSquare className="text-primary w-12 h-12" />} title={step.title} list={step.list} />
              ))}
            </div>

            {/* Tampilkan "Show more/less" HANYA jika hasil > 9 */}
            {filteredSteps.length > 9 && (
              <div className="relative my-12">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400"></div>
                <div className="relative z-10 text-center">
                  <button onClick={() => setShowAll(!showAll)} className="inline-block bg-white px-4 text-md font-semibold text-gray-800 border border-white py-2 hover:cursor-pointer">
                    <span className="border border-gray-400 px-20 py-3 rounded-4xl">{showAll ? <>Show less</> : <>Show more</>}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Section */}
        <div className="mt-12">
          <ContactSection />
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Support;
