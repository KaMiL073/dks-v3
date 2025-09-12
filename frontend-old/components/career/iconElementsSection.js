import PropTypes from 'prop-types';
import IconElement from '../elements/iconElement';

export default function IconElementsSection({ title, titleClass, elements }) {
  const items = elements.map(({ icon, name, subtitle }) => (
    <IconElement icon={icon} name={name} subtitle={subtitle} key={name} />
  ));

  return (
    <section className="w-full md:max-w-screen-xl mx-2 md:m-auto py-28">
      <h2 className={`text-5xl font-bold mb-32 ${titleClass}`}>{title}</h2>
      <div className="grid md:grid-cols-4 justify-between w-full my-16 text-center sm:space-y-6 md:space-x-4 md-h-64">
        {items}
      </div>
    </section>
  );
}

IconElementsSection.propTypes = {
  title: PropTypes.string.isRequired,
  titleClass: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

IconElementsSection.defaultProps = {
  titleClass: '',
};
