import React from "react";
import { FaBullseye, FaRegSmile, FaUsers, FaTshirt } from "react-icons/fa";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
  return (
    <section className="mt-12 w-full bg-gradient-to-b from-gray-50 to-white py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About <span className="text-blue-600">Our Store</span>
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Welcome to our fashion world! We blend creativity, quality, and comfort
          to bring you the latest trends that help you express your true self.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <img
            src={logo}
            alt="About our brand"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Who We Are
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We’re a passionate team of designers and creators dedicated to
            redefining online fashion. Our journey began with a simple goal —
            make stylish, premium-quality clothing accessible to everyone. From
            comfy casuals to elegant formals, we ensure every outfit speaks
            confidence.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Every product is crafted with care and delivered with love. We
            believe in sustainability, authenticity, and empowering our
            customers to look and feel their best every day.
          </p>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 shadow-md rounded-2xl text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <FaBullseye className="text-blue-600 text-4xl mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h4>
          <p className="text-gray-600 leading-relaxed">
            To deliver high-quality, sustainable fashion that inspires confidence
            and self-expression in everyone.
          </p>
        </div>

        <div className="bg-white p-8 shadow-md rounded-2xl text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <FaUsers className="text-green-600 text-4xl mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h4>
          <p className="text-gray-600 leading-relaxed">
            To be a globally recognized fashion brand that values creativity,
            inclusivity, and customer satisfaction above all.
          </p>
        </div>

        <div className="bg-white p-8 shadow-md rounded-2xl text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <FaRegSmile className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Promise</h4>
          <p className="text-gray-600 leading-relaxed">
            Style meets comfort — every piece we make is designed to make you
            feel good inside and out.
          </p>
        </div>
      </div>

      {/* Brand Highlight */}
      <div className="max-w-6xl mx-auto mt-20 bg-blue-600 rounded-2xl shadow-lg p-10 text-center text-white">
        <FaTshirt className="text-5xl mx-auto mb-4" />
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          Made with Love. Worn with Pride.
        </h3>
        <p className="max-w-2xl mx-auto text-blue-100">
          Each piece tells a story — of craftsmanship, creativity, and care.  
          Join us in celebrating fashion that makes a difference.
        </p>
         <button
    className="m-2 bg-white text-blue-600 cursor-pointer font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors duration-300"
    onClick={() => navigate('/contactus')}
  >
    Get a Quote
  </button>
      </div>
    </section>
  );
};

export default About;
