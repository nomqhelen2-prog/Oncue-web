export default PrivacyPage;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-[0.25em] mb-3">{title}</h2>
      <div className="space-y-4 text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.3em] font-bold mb-4">Legal</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">Privacy<br />Policy</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">

        <p className="text-white/50 text-xs uppercase tracking-widest mb-12">
          Last updated: August 2026
        </p>

        <Section title="1. Introduction">
          <p>
            OnCue Marketing ("we", "us" or "our") is committed to protecting the personal information
            of every individual who interacts with our business, whether as a visitor to our website,
            a prospective client, a client or a member of staff. This Privacy Policy sets out how we
            collect, use, store and protect your personal information in accordance with the Protection
            of Personal Information Act 4 of 2013 ("POPIA") and all applicable South African law.
          </p>
          <p>
            By accessing our website at <span className="text-white">oncuemarketing.co.za</span> or
            submitting any information to us, you acknowledge that you have read and understood this
            Privacy Policy and consent to the processing of your personal information as described herein.
          </p>
        </Section>

        <Section title="2. Who We Are">
          <p>
            OnCue Marketing is an experiential and promotional marketing agency operating across
            Johannesburg, Cape Town and Durban, South Africa. We are the responsible party in respect
            of personal information processed through this website and our business operations.
          </p>
          <p>
            Our designated Information Officer can be reached at{" "}
            <a href="mailto:admin@oncuemarketing.info" className="text-white underline underline-offset-2">
              admin@oncuemarketing.info
            </a>
            . Any queries, requests or complaints relating to the processing of your personal information
            should be directed to this address.
          </p>
        </Section>

        <Section title="3. Personal Information We Collect">
          <p>We may collect the following categories of personal information:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "Contact details such as your name, email address and telephone number when you submit an enquiry through our website.",
              "Business information such as your company name and industry sector when you engage with us as a prospective or existing client.",
              "Staff and contractor information including banking details, identity numbers, tax information and payroll records where you are engaged to provide services to or through OnCue Marketing.",
              "Technical information such as your IP address, browser type and browsing behaviour collected automatically when you visit our website.",
              "Any other information you voluntarily provide to us in the course of our business relationship.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            We do not intentionally collect the personal information of persons under the age of 18
            without the prior verifiable consent of a competent person as defined in POPIA.
          </p>
        </Section>

        <Section title="4. Lawful Grounds for Processing">
          <p>
            We process your personal information only where we have a lawful basis to do so under
            section 11 of POPIA. The applicable grounds include the following:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "You have given us your consent to process your information for a specific purpose.",
              "Processing is necessary to enter into or perform a contract with you.",
              "Processing is necessary to comply with a legal obligation imposed on us.",
              "Processing is necessary to protect your legitimate interests or those of a third party.",
              "Processing is necessary for pursuing our legitimate business interests, provided those interests are not overridden by your right to privacy.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. How We Use Your Personal Information">
          <p>We use your personal information for the following purposes:</p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "To respond to enquiries and communicate with you about our services.",
              "To enter into and manage contractual relationships with clients and service providers.",
              "To process payroll and remunerate staff and contractors.",
              "To comply with our legal and regulatory obligations.",
              "To improve our website and services through anonymised analytics.",
              "To send you relevant marketing communications where you have consented to receive them.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            We will not use your personal information for any purpose incompatible with the purpose
            for which it was collected without your prior consent.
          </p>
        </Section>

        <Section title="6. Sharing of Personal Information">
          <p>
            We do not sell, rent or trade your personal information to third parties. We may share
            your information in the following limited circumstances:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "With service providers who assist us in operating our business, such as email delivery platforms, payment processors and cloud storage providers, subject to appropriate data processing agreements.",
              "With clients and event partners to the extent necessary to deliver our services.",
              "With government authorities, regulators or law enforcement agencies where required by law or a court order.",
              "In connection with a merger, acquisition or sale of our business, provided that the receiving party agrees to be bound by privacy obligations no less protective than those set out in this policy.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Where we transfer personal information to third parties outside of South Africa, we
            ensure that such transfers comply with section 72 of POPIA and that the recipient country
            or organisation provides an adequate level of protection.
          </p>
        </Section>

        <Section title="7. Retention of Personal Information">
          <p>
            We retain your personal information only for as long as is necessary to fulfil the
            purposes for which it was collected or as required by applicable law. In general:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "Enquiry and communication records are retained for a period of three years from the date of last contact.",
              "Contractual and financial records are retained for a minimum of five years in accordance with South African tax and accounting legislation.",
              "Staff and payroll records are retained for the period required under the Basic Conditions of Employment Act and applicable tax legislation.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Once the applicable retention period has lapsed, we will destroy or de-identify your
            personal information in a secure manner.
          </p>
        </Section>

        <Section title="8. Security Safeguards">
          <p>
            We implement reasonable technical and organisational measures to protect your personal
            information against unauthorised access, loss, destruction, disclosure or alteration.
            These measures include secure server infrastructure, encrypted data transmission and
            access controls limited to authorised personnel.
          </p>
          <p>
            Notwithstanding the above, no method of transmission over the internet or electronic
            storage is entirely secure. We cannot guarantee absolute security and you transmit
            information to us at your own risk. In the event of a security compromise that is likely
            to prejudice you, we will notify you and the Information Regulator as required by POPIA.
          </p>
        </Section>

        <Section title="9. Your Rights as a Data Subject">
          <p>
            Under POPIA you have the following rights in relation to your personal information:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "The right to be notified that your personal information is being collected and the purposes for which it is being processed.",
              "The right to access the personal information we hold about you.",
              "The right to request the correction or deletion of inaccurate, incomplete, misleading or outdated information.",
              "The right to object to the processing of your personal information on reasonable grounds.",
              "The right to submit a complaint to the Information Regulator of South Africa at inforeg@justice.gov.za or by visiting www.inforegulator.org.za.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            To exercise any of these rights please contact our Information Officer at{" "}
            <a href="mailto:admin@oncuemarketing.info" className="text-white underline underline-offset-2">
              admin@oncuemarketing.info
            </a>
            . We will respond to your request within a reasonable time and no later than as required by law.
          </p>
        </Section>

        <Section title="10. Cookies and Website Analytics">
          <p>
            Our website may use cookies and similar tracking technologies to enhance your browsing
            experience and collect anonymised analytics data. Cookies are small text files stored on
            your device. You may configure your browser to refuse cookies; however, doing so may
            affect the functionality of certain areas of our website.
          </p>
          <p>
            We do not use cookies to collect personally identifiable information without your
            knowledge and consent.
          </p>
        </Section>

        <Section title="11. Links to Third-Party Websites">
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            privacy practices or content of those websites. We encourage you to review the privacy
            policies of any third-party sites you visit.
          </p>
        </Section>

        <Section title="12. Amendments to This Policy">
          <p>
            We reserve the right to amend this Privacy Policy at any time. Any material changes will
            be communicated by updating the "Last updated" date at the top of this page. We encourage
            you to review this policy periodically. Your continued use of our website after any
            amendments constitutes your acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            If you have any questions, concerns or requests regarding this Privacy Policy or the
            processing of your personal information, please contact us at:
          </p>
          <div className="mt-4 border-l-2 border-[var(--color-gold)] pl-5 space-y-1">
            <p className="text-white font-bold">OnCue Marketing</p>
            <p>Information Officer</p>
            <a href="mailto:admin@oncuemarketing.info" className="text-white underline underline-offset-2 block">
              admin@oncuemarketing.info
            </a>
            <p>oncuemarketing.co.za</p>
          </div>
        </Section>

      </section>
    </div>
  );
}
