import React from "react";
import { FaUndo, FaMoneyBillWave, FaTimesCircle } from "react-icons/fa";
import LegalLayout from "./LegalLayout";
import { COMPANY_NAME, BRAND_COLOR } from "../config/brand";
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  </div>
);

const RefundPolicy = () => (
    
  <LegalLayout
    title="Refund & Cancellation Policy"
    description={`Refund and cancellation policy of ${COMPANY_NAME}.`}
  >
    <Section icon={<FaUndo />} title="Refund Eligibility">
      Refunds are applicable only for damaged or incorrect products.
    </Section>

    <Section icon={<FaMoneyBillWave />} title="Refund Process">
      Approved refunds are processed within 7–10 business days.
    </Section>

    <Section icon={<FaTimesCircle />} title="Non-Refundable Items">
      Customized or discounted items are non-refundable.
    </Section>
  </LegalLayout>
);

export default RefundPolicy;
