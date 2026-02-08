import React from "react";
import{
  FaUserShield,
  FaDatabase,
  FaShieldAlt,
  FaCookieBite,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

import LegalLayout from "./LegalLayout";
import { COMPANY_NAME, SUPPORT_EMAIL, BRAND_COLOR } from "../config/brand";
import useSEO from "../hooks/useSEO";


const Section = ({ icon, title, children }) => (
  <div className="flex gap-4 items-start">
    <div
      className="p-3 rounded-xl text-xl text-white"
      style={{ backgroundColor: BRAND_COLOR }}
    >
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const PrivacyPolicy = () => {
  useSEO({
    title: `Privacy Policy | ${COMPANY_NAME}`,
    description: "Learn how we collect, use, and protect your personal data.",
  });
  return (
    <LegalLayout
      title="Privacy Policy"
      description={`Privacy Policy of ${COMPANY_NAME} explaining data collection, usage, and protection.`}
    >
      <Section icon={<FaUserShield />} title="Information We Collect">
        Personal details such as name, email, mobile number, login credentials,
        and order history.
      </Section>

      <Section icon={<FaDatabase />} title="How We Use Your Information">
        To process orders, manage accounts, provide customer support, and
        improve our services.
      </Section>

      <Section icon={<FaShieldAlt />} title="Data Sharing">
        We do not sell your personal data. Information is shared only with
        trusted service providers or when legally required.
      </Section>

      <Section icon={<FaCookieBite />} title="Cookies">
        Cookies help us personalize your experience and analyze website usage.
      </Section>

      <Section icon={<FaLock />} title="Security Measures">
        Industry-standard encryption and secure servers are used to protect
        your data.
      </Section>

      <Section icon={<FaEnvelope />} title="Contact Information">
        For privacy concerns, contact us at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-medium hover:underline"
          style={{ color: BRAND_COLOR }}
        >
          {SUPPORT_EMAIL}
        </a>
      </Section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
