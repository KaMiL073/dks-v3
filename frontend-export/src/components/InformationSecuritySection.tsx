import RichContentStatic from "@/components/RichContentStatic";

export default function InformationSecuritySection() {
  return (
    <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
      <RichContentStatic
        title="INFORMATION SECURITY"
        header_type="h2"
        heading_styles="h6_semibold"
        image="/images/information-security.png"
        layout="text_left"
        content={`
          <div class="text-Text-body text-base font-normal leading-tight">
            We are proud to introduce our comprehensive IT hardware protection
            policy. We understand the critical importance of data security. That&apos;s why
            all our IT hardware, photocopiers and printers undergoes rigorous data
            cleansing procedures before recycling. This ensures that sensitive
            information stored on devices, such as hard drives (HDD), is completely
            wiped to industry standards.<br/><br/>
            We adhere strictly to ISO 14001 guidelines for recycling, guaranteeing
            responsible disposal practices.<br/><br/>
            The Blanko series, known for its efficiency, also comes with a
            commitment to data security. When it&apos;s time for disposal or recycling,
            rest assured that every Blanko HDD undergoes thorough deletion
            processes. Your confidential information remains safe in our hands.<br/><br/>
            Beyond data security, we prioritize environmental sustainability. Our
            recycling practices comply with ISO 14001 standards, minimizing our
            ecological footprint. By responsibly managing electronic waste (WEE), we
            contribute to a greener, healthier planet for future generations. Contact
            us to learn more about our IT hardware protection policy and
            sustainability initiatives.
          </div>
        `}
      />
    </section>
  );
}
