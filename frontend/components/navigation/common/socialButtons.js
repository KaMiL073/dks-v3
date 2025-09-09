import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF, faTwitter, faLinkedinIn, faInstagram, faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import {
  faMap,
} from '@fortawesome/free-solid-svg-icons';

import icons from '../../../styles/Icons.module.scss';

const socials = [{
  id: 'faFacebookF',
  icon: faFacebookF,
  href: 'https://www.facebook.com/DKScentrala/',
},
{
  id: 'faTwitter',
  icon: faTwitter,
  href: 'https://twitter.com/dks_pl',
},
{
  id: 'faLinkedinIn',
  icon: faLinkedinIn,
  href: 'https://pl.linkedin.com/company/dks-sp-z-o-o',
},
{
  id: 'faInstagram',
  icon: faInstagram,
  href: 'https://www.instagram.com/dks_odkryj_potencjal_druku_/',
},
{
  id: 'faYoutube',
  icon: faYoutube,
  href: 'https://www.youtube.com/channel/UCT-p3WEwV5hw5PHQXb7batg',
},
{
  id: 'faMap',
  icon: faMap,
  href: 'https://www.google.com/maps/place/DKS/@54.3167915,18.5506992,17z/data=!3m1!4b1!4m5!3m4!1s0x46fd7698ecd15635:0x182c8a3dd7d6abd!8m2!3d54.3167915!4d18.5506992',
},
].map(({ icon, href, id }) => (
  <div key={`socialsHeader_${id}`} className={`flex-auto ${icons.socials}`}>
    <Link href={href}>
      {/* csocial-link - class is needed for WeNet audit */}
      <a className="csocial-link" href={href}>
        <FontAwesomeIcon icon={icon} />
      </a>
    </Link>
  </div>
));

export default function SocialButtons() {
  return (
    <>
      {socials}
    </>
  );
}
