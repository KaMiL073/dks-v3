import RichContentStatic from "@/components/RichContentStatic";

const leftHtml = ``;

const rightHtml = ``;

export default function CompanyAboutSection() {
  return (
    <section className="px-6 xl:px-28 py-20 bg-surface-page flex flex-col gap-8">
      <RichContentStatic
        image="/images/headquarters.jpg"
        layout="text_left"
        content={`
          <div class="flex-1 text-Text-body text-base font-normal leading-tight">
            Our main export activity is trading used photocopiers of top major
            brands such as Konica Minolta, Ricoh, Canon, Xerox, Kyocera Mita,
            Sharp, HP, Brother &amp; Lexmark. Also we can offer a wide range of
            original supplies and spare parts for regular copiers, production
            and printing systems, faxes, printers and wide format machines.<br/><br/>
            All our used copiers are stored in one central warehouse located in
            North Poland - Gdansk with an capacity of 5.500m2 were we storage
            around 10,000 used copiers &amp; printers. This great location allows
            us to deliver sea containers in just 20 minutes to the port of Gdansk
            or Gdynia and arrive our warehouse in just 10 minutes from Gdansk
            Airport.<br/><br/>
            Our advantages<br/><br/>
            &nbsp;&nbsp;·&nbsp; complex offer<br/>
            &nbsp;&nbsp;·&nbsp; professional team of employees<br/>
            &nbsp;&nbsp;·&nbsp; over 30 years of experience
          </div>
        `}
        expanded_columns={2}
        expand_left={leftHtml}
        expand_right={rightHtml}
      />
    </section>
  );
}
