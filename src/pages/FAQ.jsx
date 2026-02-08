import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "How do I place an order on Aaryan Prints?",
    answer:
      "Browse our products, select your preferred size and color, add them to your cart, and proceed to checkout. You can place an order as a guest or by logging into your account.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "No, you can place an order as a guest. However, creating an account allows you to track orders, save addresses, and enjoy a faster checkout experience.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Credit Cards, Debit Cards, Net Banking, and Cash on Delivery (COD) on selected orders.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days depending on your location. Estimated delivery dates are shown during checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you’ll receive a tracking link via email or SMS. You can also track orders from your account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer easy returns within 7 days of delivery for unused and unwashed products. The item must be in original condition with tags intact.",
  },
  {
    question: "How do I cancel or modify my order?",
    answer:
      "Orders can be canceled or modified before they are shipped. Please contact our support team as soon as possible.",
  },
  {
    question: "What if I receive a damaged or wrong product?",
    answer:
      "If you receive a damaged or incorrect product, contact us immediately with photos. We’ll arrange a replacement or refund.",
  },
  {
    question: "Are your products true to size?",
    answer:
      "Yes, our products follow standard sizing. Please refer to the size chart available on each product page for accurate measurements.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via the Contact Us page, email, or by calling our support number mentioned in the footer.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500">
          Find answers to common questions about orders, shipping, and more.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
            >
              <span className="text-lg font-semibold text-gray-800">
                {faq.question}
              </span>
              <FiChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeIndex === index && (
              <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
