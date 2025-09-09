import PropTypes from 'prop-types';

export default function pageDataProps() {
  return PropTypes.shape({
    url: PropTypes.string,
    text_fields: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      content: PropTypes.string,
    })),
  });
}
