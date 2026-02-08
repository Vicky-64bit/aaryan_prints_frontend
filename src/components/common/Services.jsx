import React from "react";
import {
  FaPaintBrush,
  FaTshirt,
  FaIndustry,
  FaTruck,
  FaHandshake,
} from "react-icons/fa";


const Services = () => {
  return (
    <section className="mt-12 w-full bg-gradient-to-b from-white to-gray-50 py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our <span className="text-blue-600">Services</span>
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Based in the heart of <strong>Jaipur, Rajasthan</strong>, we’ve been
          turning creativity into craft for years. From premium fabric printing
          to large-scale garment manufacturing — we bring tradition and
          technology together for perfect results.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Service 1 - Printing */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 text-center">
          <FaPaintBrush className="text-pink-500 text-5xl mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Custom Fabric Printing
          </h3>
          <p className="text-gray-600 leading-relaxed">
            With decades of experience in <strong>textile printing</strong>, we
            offer high-quality screen, digital, and sublimation printing on all
            types of fabrics — giving your brand colors that truly last.
          </p>
        </div>

        {/* Service 2 - Clothing Manufacturing */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 text-center">
          <FaTshirt className="text-blue-600 text-5xl mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Clothing Manufacturing
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Expanding beyond printing, we now manufacture high-quality apparel —
            from t-shirts and hoodies to custom uniforms — under one roof in
            Jaipur’s industrial hub.
          </p>
        </div>

        {/* Service 3 - Bulk Production */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 text-center">
          <FaIndustry className="text-indigo-500 text-5xl mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Bulk & Corporate Orders
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We specialize in large-volume orders for corporate clients, events,
            and resellers — ensuring consistency, quality, and timely delivery
            every time.
          </p>
        </div>

        {/* Service 4 - Delivery */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 text-center">
          <FaTruck className="text-green-500 text-5xl mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Nationwide Delivery
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our reliable logistics partners ensure your products reach every
            corner of India safely and on time — directly from our Jaipur
            facility.
          </p>
        </div>

        {/* Service 5 - B2B Partnerships */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 text-center">
          <FaHandshake className="text-yellow-500 text-5xl mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            B2B Collaborations
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We proudly collaborate with local brands, boutiques, and designers
            to bring custom designs to life — building long-term business
            relationships rooted in trust.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto mt-20 bg-blue-600 rounded-2xl shadow-lg p-10 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">
          Bringing Jaipur’s Craftsmanship to Modern Fashion
        </h3>
        <p className="max-w-2xl mx-auto text-blue-100 mb-6">
          From vibrant prints to complete clothing lines — we deliver style,
          quality, and authenticity that represent Jaipur’s timeless artistry.
        </p>
        <a
          href="/contactus"
          className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
        >
          Get a Quote
        </a>
      </div>
    </section>
  );
};

export default Services;
