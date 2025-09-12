import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

import Schema from '../components/elements/schema';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pl-PL">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}

          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
              let _mzid = '629e55d47878';
                      (function(s, o, g) {
                        a = s.createElement(o);
                        m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m);
                      })(document, 'script', '//mzer.pl/mz.js');
            `,
            }}
          />
          <Schema />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
