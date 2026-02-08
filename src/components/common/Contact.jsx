import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "sonner"; // optional: if you want toast notifications

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:9000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 w-full bg-gradient-to-b from-white to-gray-50 py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* Left - Contact Info */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Have questions, feedback, or partnership inquiries? Fill out the form
            or reach us using the information below. We’ll get back to you soon.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <FaEnvelope size={20} />
              </div>
              <p className="text-gray-800">support@aaryan_prints.com</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FaPhoneAlt size={20} />
              </div>
              <p className="text-gray-800">+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <FaMapMarkerAlt size={20} />
              </div>
              <p className="text-gray-800">Jaipur, Rajasthan, India</p>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
