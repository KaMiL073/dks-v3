import PropTypes from 'prop-types';
import Image from 'next/image';

export default function organizers({ organizers, title, id }) {
  const logos = organizers.map(({
    src, alt, width, height,
  }) => (
    <div className="px-4 mx-8 sm:pb-6">
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  ));

  return (
    <div id={id} className="flex flex-col items-center py-16" style={{ scrollMarginTop: '200px' }}>
      {title ? (
        <div className="px-4 mx-8 font-bold uppercase">
          <h2 className="sm:text-2xl text-5xl sm:text-center sm:pb-6 mb-8">{title}</h2>
        </div>
      ) : (
        <></>
      )}
      <div className="flex sm:flex-wrap md:flex-row">
        {logos}
      </div>
    </div>
  );
}

organizers.propTypes = {
  bgImg: PropTypes.string.isRequired,
};
