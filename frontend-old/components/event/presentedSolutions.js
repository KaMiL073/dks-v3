import PropTypes from 'prop-types';
import Image from 'next/image';

export default function presentedSolutions({ id, title, presentedSolutionItems }) {
  const elements = presentedSolutionItems.map(({
    img, imgAlt, imgHeight, imgWidth, titleItem, textItem, styleItem,
  }) => (
    <div className={`w-72	p-4 rounded-lg ${styleItem || ''}`}>
      <div>
        <div className="flex relative" style={{ height: imgHeight, width: imgWidth }}>
          <Image
            src={img}
            alt={imgAlt}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div>
        <br />
        <h3 className="font-bold pb-2 text-xl">{titleItem}</h3>
        <p>{textItem}</p>
      </div>
    </div>
  ));
  return (
    <div id={id} className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
      <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6 mt-5">{title}</h2>
      <div className="flex sm:flex-col md:flex-row sm:items-center md:items-start justify-between">
        {elements}
      </div>
    </div>
  );
}

presentedSolutions.propTypes = {
  bgImg: PropTypes.string.isRequired,
};
