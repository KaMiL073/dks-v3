import RichContentStatic from "@/components/RichContentStatic";

const leftHtml = ``;

const rightHtml = ``;

export default function AboutSection() {
  return (
    <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
      <RichContentStatic
        image="/images/world-map.png"
        layout="text_right"
        content={`
          <div class="flex-1 text-Text-body text-base font-normal leading-tight">
            On arrival each copier &amp; printer is tested by our high qualified technicians
            to check and provide best possible quality and to eliminate technical
            problems. Each copier &amp; printer get it&apos;s own individual passport with data
            as copy counter, equipment, accessories and condition. Machines which
            leave our warehouse to their destination always contain any kind of
            possible test page / counter list.<br/><br/>
            We can ship single pallets up to full truck or loads 20FT or 40FT containers
            depending on the destination and number of machines you require.
          </div>
        `}
        expanded_columns={2}
        expand_left={leftHtml}
        expand_right={rightHtml}
      />
    </section>
  );
}
