import React from "react";
import { FaFileContract, FaUserCheck, FaBan } from "react-icons/fa";
import LegalLayout from "./LegalLayout";
import { COMPANY_NAME, BRAND_COLOR } from "../config/brand";
import useSEO from "../hooks/useSEO";

const Section = ({ icon, title, children }) => (
  <div className="flex gap-4 items-start">
    <div
      className="p-3 rounded-xl text-white text-xl"
      style={{ backgroundColor: BRAND_COLOR }}
    >
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 leading-relaxed">
        {children}
      </p>
    </div>
  </div>
);

const TermsAndConditions = () => {
    useSEO({
    title: `Terms & Conditions | ${COMPANY_NAME}`,
    description: "Read the terms and conditions governing use of our services.",
  });
  return (
    <LegalLayout
      title="Terms & Conditions"
      description={`Terms and conditions governing use of ${COMPANY_NAME}`}
    >
      <Section icon={<FaFileContract />} title="Acceptance of Terms">
        By accessing or using {COMPANY_NAME}, you agree to comply with these terms.
      </Section>

      <Section icon={<FaUserCheck />} title="User Responsibilities">
        Users must provide accurate information and maintain account security.
      </Section>

      <Section icon={<FaBan />} title="Prohibited Activities">
        Fraud, abuse, or illegal use of the platform is strictly prohibited.
      </Section>
    </LegalLayout>
  );
};

export default TermsAndConditions;
