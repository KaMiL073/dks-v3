import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './styles/Breadcrumb.module.scss';

export default function Breadcrumb() {
  const router = useRouter();
  const linkPath = router.asPath.split('?')[0].split('/');
  linkPath.shift();

  const paths = linkPath.map((path, i) => ({ breadcrumb: path.replaceAll('-', ' '), href: `/${linkPath.slice(0, i + 1).join('/')}` }));

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className="inline-flex space-x-1 md:space-x-3">
        <li>
          <a href="/" className="text-sm">Home</a>
        </li>
        {paths.length > 0 && paths.map((path) => (
          <li key={path.breadcrumb}>
            <span>/</span>
            <Link href={path.href}><a href={path.href} className="ml-1 md:ml-2 text-sm">{path.breadcrumb.replace(/\?(.*)/, ' ')}</a></Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
