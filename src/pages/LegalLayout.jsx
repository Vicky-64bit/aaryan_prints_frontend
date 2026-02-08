import React from "react";
import useSEO from "../hooks/useSEO";



import { BRAND_COLOR, COMPANY_NAME } from "../config/brand";

const LegalLayout = ({ title, description, children }) => {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
useSEO({
  title: `Legal Layouts | ${COMPANY_NAME}`,
  description: "Read our privacy practices and data protection policies",
});
  return (
    <>
      <div className="min-h-screen mt-14 bg-gradient-to-b from-orange-50 via-white to-white px-4 py-16">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ color: BRAND_COLOR }}
            >
              {title}
            </h1>
            <p className="text-gray-500 mt-3">
              Last updated on {lastUpdated}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-10">
            {children}
          </div>

          <p className="text-center text-gray-400 text-sm mt-12">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LegalLayout;
