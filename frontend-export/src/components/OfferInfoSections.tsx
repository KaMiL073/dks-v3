import RichContentStatic from "@/components/RichContentStatic";
import InformationSecuritySection from "@/components/InformationSecuritySection";

export default function OfferInfoSections() {
  return (
    <>
      <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
        <RichContentStatic
          title="WAREHOUSE & PACKAGING"
          header_type="h2"
          heading_styles="h6_semibold"
          image="/images/security.jpg"
          layout="text_right"
          content={`
            <div class="text-Text-body text-base font-normal leading-tight">
              On arrival each copier &amp; printer is tested by our high qualified technicians
              to check and provide best possible quality and to eliminate technical
              problems. Each copier &amp; printer get it&apos;s own individual passport with data
              as copy counter, equipment, accessories and condition. Machines which
              leave our warehouse to their destination always contain any kind of
              possible test page / counter list.<br/><br/>
              DKS has dedicated logistics department which can organize transport via
              single pallets up to full truck or loads 20ft or 40ft containers depending
              on the destination and number of machines you require.
            </div>
          `}
        />
      </section>

      <InformationSecuritySection />
    </>
  );
}
