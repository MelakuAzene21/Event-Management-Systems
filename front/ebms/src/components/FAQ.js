import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ContactSupportModal from './ContactSupportModal'; // Adjust path if needed

const faqData = [
  {
    question: "How can I view my purchased tickets?",
    answer: "Once logged in, go to your profile dashboard and select the 'My Tickets' section. There you can view, download, or reprint any tickets you've purchased. Each ticket includes a unique QR code for event entry."
  },
  {
    question: "Can I edit my profile information after registration?",
    answer: "Yes. After logging in, click on your profile icon and choose 'Edit Profile.' You can update personal information, contact details, and payment preferences."
  },
  {
    question: "How do I register or book a ticket for an event?",
    answer: "Browse available events from the event list or use the search bar. Select an event, click 'Register' or 'Purchase Ticket,' choose your ticket type (e.g., VIP, Regular), and proceed to payment."
  },
  {
    question: "Where can I find event updates or notifications?",
    answer: "After logging in, check the 'Notifications' tab on your dashboard. You'll receive updates like schedule changes, event reminders, and organizer announcements via email or in-app alerts."
  },
  {
    question: "What should I do if my payment fails during ticket booking?",
    answer: "If your payment fails, the transaction will not be processed and no ticket will be issued. You can try again or check with your payment provider. For assistance, use the 'Contact Support'."
  },
  {
    question: "How can I provide feedback after attending an event?",
    answer: "Go to 'My Events' in your dashboard, select the event you attended, and click on 'Give Feedback.' You can rate the event and leave comments for organizers to review."
  }
];



export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqData.map((faq, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg px-6 py-4 cursor-pointer shadow-sm transition hover:shadow-md"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{faq.question}</h3>
              <ChevronDown
                className={`h-5 w-5 text-blue-500 transform transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </div>
            {openIndex === idx && (
              <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Need more help?
        </button>
      </div>

      {/* Modal */}
      {showModal && <ContactSupportModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
