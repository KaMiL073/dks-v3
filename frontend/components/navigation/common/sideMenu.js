import Link from 'next/link';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function SideMenu({ elements, title, template }) {
  const classes = {
    bright: {
      li: 'border-dks-light-gray',
      nav: '',
    },
    dark: {
      li: 'border-black',
      nav: 'bg-dks-light-gray',
    },
  };

  const links = elements.map((link, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <li className={`mx-2 py-4 border-solid border-b hover:text-dks-red ${classes[template].li}`} key={`serviceNav_${i}`}>
      <Link href={link.href}>
        <a href={link.href}>
          <ArrowForwardIosIcon className="h-3 text-dks-red" />
          {link.text}
        </a>
      </Link>
    </li>
  ));

  return (
    <>
      {title && <h6 className="uppercase font-bold">{title}</h6>}
      <nav className={`text-sm pt-2 pb-4 ${classes[template].nav}`}>
        <ul>
          {links}
        </ul>
      </nav>
    </>
  );
}

SideMenu.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  template: PropTypes.string, // bright or dark
};

SideMenu.defaultProps = {
  template: 'dark',
  title: false,
};
