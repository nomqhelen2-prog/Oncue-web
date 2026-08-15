export default TermsPage;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-[0.25em] mb-3">{title}</h2>
      <div className="space-y-4 text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.3em] font-bold mb-4">Legal</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">Terms<br />of Use</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">

        <p className="text-white/50 text-xs uppercase tracking-widest mb-12">
          Last updated: August 2026
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Use ("Terms") govern your access to and use of the OnCue Marketing website
            located at <span className="text-white">oncuemarketing.co.za</span> ("the Website"). By
            accessing or using the Website you agree to be bound by these Terms in full. If you do
            not agree with any part of these Terms you must immediately cease using the Website.
          </p>
          <p>
            These Terms constitute a binding agreement between you and OnCue Marketing and are
            enforceable in terms of the Electronic Communications and Transactions Act 25 of 2002
            ("ECTA") and applicable South African law.
          </p>
        </Section>

        <Section title="2. About OnCue Marketing">
          <p>
            OnCue Marketing is an experiential and promotional marketing agency providing services
            that include brand activations, promotional staffing, product launches, event coordination
            and campaign support across South Africa. The Website is an informational platform
            intended to present our services and facilitate enquiries from prospective and existing clients.
          </p>
        </Section>

        <Section title="3. Use of the Website">
          <p>
            You may use the Website solely for lawful purposes and in accordance with these Terms.
            You agree not to:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "Use the Website in any manner that violates any applicable South African or international law or regulation.",
              "Transmit any unsolicited or unauthorised advertising or promotional material.",
              "Introduce any viruses, trojans, worms or other malicious or technologically harmful material to the Website.",
              "Attempt to gain unauthorised access to any part of the Website or its underlying systems.",
              "Use the Website to collect or harvest personal information of other users.",
              "Reproduce, duplicate, copy or resell any part of the Website in contravention of these Terms.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            OnCue Marketing reserves the right to restrict or terminate your access to the Website
            at any time and without notice if we reasonably believe you are in breach of these Terms.
          </p>
        </Section>

        <Section title="4. Intellectual Property">
          <p>
            All content on the Website, including but not limited to text, graphics, logos, images,
            audio clips, digital downloads and software, is the property of OnCue Marketing or its
            content suppliers and is protected by South African and international copyright and
            intellectual property law.
          </p>
          <p>
            You are granted a limited, non-exclusive and non-transferable licence to access and use
            the Website for your personal and non-commercial purposes. You may not copy, reproduce,
            modify, distribute, publish, display, transmit or create derivative works from any content
            on the Website without our prior written consent.
          </p>
          <p>
            Third-party brand names and logos displayed on the Website are the property of their
            respective owners. Their appearance on this Website does not imply any endorsement of
            OnCue Marketing by those brands and does not grant you any rights in respect of those marks.
          </p>
        </Section>

        <Section title="5. Accuracy of Information">
          <p>
            The content on this Website is provided for general informational purposes only. While we
            endeavour to keep the information accurate and up to date, we make no representations or
            warranties of any kind, express or implied, regarding the completeness, accuracy,
            reliability or suitability of the information for any particular purpose.
          </p>
          <p>
            Nothing on this Website constitutes professional legal, financial, tax or business advice.
            You should seek appropriate professional guidance before making any business decision
            based on information obtained from this Website.
          </p>
        </Section>

        <Section title="6. Services and No Guarantee of Results">
          <p>
            Descriptions of our services on this Website are provided for illustrative purposes and
            do not constitute a binding offer or guarantee of specific outcomes. The results of any
            marketing campaign, brand activation or promotional initiative are inherently variable
            and depend on numerous factors outside our reasonable control, including market conditions,
            audience behaviour and client-side execution.
          </p>
          <p>
            OnCue Marketing does not warrant or guarantee any specific commercial result, return on
            investment or level of brand engagement arising from the use of our services.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable South African law, OnCue Marketing, its
            directors, employees, agents and contractors shall not be liable for any direct, indirect,
            incidental, consequential, special or punitive loss or damage arising from:
          </p>
          <ul className="list-none space-y-2 mt-2">
            {[
              "Your access to or use of, or inability to access or use, the Website.",
              "Any reliance placed on content appearing on the Website.",
              "Unauthorised access to or alteration of your transmissions or data.",
              "Any interruption, suspension or termination of the Website.",
              "Errors, omissions or inaccuracies in the content of the Website.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Where our liability cannot be excluded by law, our total aggregate liability to you shall
            not exceed the amount paid by you to OnCue Marketing in the three months immediately
            preceding the event giving rise to the claim.
          </p>
          <p>
            This limitation of liability applies regardless of the form of action and whether the
            claim arises in contract, delict or otherwise.
          </p>
        </Section>

        <Section title="8. Indemnification">
          <p>
            You agree to indemnify, defend and hold harmless OnCue Marketing and its directors,
            employees, agents and contractors from and against any claims, damages, losses, costs and
            expenses (including reasonable legal fees) arising out of or relating to your use of the
            Website, your breach of these Terms or your violation of any applicable law or the rights
            of any third party.
          </p>
        </Section>

        <Section title="9. Third-Party Links and Content">
          <p>
            The Website may contain hyperlinks to third-party websites. These links are provided for
            your convenience only. OnCue Marketing does not endorse, control or accept responsibility
            for the content, privacy practices or availability of those websites. You access
            third-party websites entirely at your own risk.
          </p>
        </Section>

        <Section title="10. Privacy">
          <p>
            Your use of the Website is also governed by our Privacy Policy, which is incorporated
            into these Terms by reference. We encourage you to review our Privacy Policy to understand
            how we collect, use and protect your personal information.
          </p>
        </Section>

        <Section title="11. Enquiries and Communications">
          <p>
            When you submit an enquiry through our Website you acknowledge that the information
            provided is accurate and that you are authorised to make such enquiry. OnCue Marketing
            will use your information solely to respond to your enquiry and, where you have consented,
            to send you relevant marketing communications. We do not accept unsolicited bulk messages
            or spam and reserve the right to disregard any such communications.
          </p>
        </Section>

        <Section title="12. Amendments">
          <p>
            OnCue Marketing reserves the right to amend these Terms at any time by updating this
            page. The amended Terms will take effect upon posting. Your continued use of the Website
            after any changes have been posted constitutes your acceptance of the revised Terms. It
            is your responsibility to review these Terms periodically.
          </p>
        </Section>

        <Section title="13. Availability of the Website">
          <p>
            We do not guarantee that the Website will be available at all times or that it will be
            free from errors, interruptions or viruses. We reserve the right to withdraw, modify or
            suspend the Website or any part thereof at any time without notice and without incurring
            any liability to you.
          </p>
        </Section>

        <Section title="14. Governing Law and Jurisdiction">
          <p>
            These Terms are governed by and construed in accordance with the laws of the Republic of
            South Africa. Any dispute arising out of or in connection with these Terms or the Website
            shall be subject to the exclusive jurisdiction of the courts of the Republic of South
            Africa, and you consent to the jurisdiction of such courts.
          </p>
          <p>
            In the event of a dispute you agree to first attempt to resolve the matter amicably by
            notifying OnCue Marketing in writing at{" "}
            <a href="mailto:admin@oncuemarketing.info" className="text-white underline underline-offset-2">
              admin@oncuemarketing.info
            </a>{" "}
            and allowing us a reasonable period of not less than 14 business days to respond before
            commencing any formal proceedings.
          </p>
        </Section>

        <Section title="15. Severability">
          <p>
            If any provision of these Terms is found by a court of competent jurisdiction to be
            invalid, unlawful or unenforceable, that provision shall be severed from the remaining
            Terms, which shall continue in full force and effect.
          </p>
        </Section>

        <Section title="16. No Waiver">
          <p>
            No failure or delay by OnCue Marketing in exercising any right under these Terms shall
            operate as a waiver of that right, nor shall any single or partial exercise of any right
            preclude any further exercise of that right or any other right.
          </p>
        </Section>

        <Section title="17. Entire Agreement">
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between
            you and OnCue Marketing with respect to your use of the Website and supersede all prior
            and contemporaneous understandings, agreements, representations and warranties relating
            to the Website.
          </p>
        </Section>

        <Section title="18. Contact Us">
          <p>
            If you have any questions about these Terms please contact us at:
          </p>
          <div className="mt-4 border-l-2 border-[var(--color-gold)] pl-5 space-y-1">
            <p className="text-white font-bold">OnCue Marketing</p>
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
