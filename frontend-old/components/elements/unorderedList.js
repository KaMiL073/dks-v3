import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import PropTypes from 'prop-types';

export default function UnorderedList({ items }) {
  const liElements = items.map((item, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <li className="mb-4 text-sm" key={`${item.text.slice(0, 6)}_${i}`}>
      <CheckSharpIcon className="mr-3 text-dks-red" />
      {item.text}
    </li>
  ));
  return (
    <ul>
      {liElements}
    </ul>
  );
}

UnorderedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
