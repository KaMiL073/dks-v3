# DKS Export

Next.js website for `https://dks.com.pl`, based on the supplied Figma export.

## Routes

- `/` — home
- `/offer` — export offer and process
- `/about-us` — company history
- `/contact` — export contacts and enquiry form

## Directus

The application uses the existing Directus instance. It remains fully usable
with its built-in fallback content before the CMS collections are created.

Create an `export_pages` collection with:

- `status` — status (`draft`, `published`)
- `slug` — string, unique (`home`, `offer`, `about-us`, `contact`)
- `title` — string
- `hero_title` — string
- `hero_text` — text
- `hero_image` — file
- `seo_title` — string
- `seo_description` — text

Create an `export_contact_messages` collection with:

- `status` — string, default `new`
- `name`, `company`, `email`, `phone`, `country`, `interest` — strings
- `message` — text
- `date_created` — date created

Use a dedicated static Directus token with read access to `export_pages` and
create access to `export_contact_messages`.

## Environment

Copy `.env.example` to `.env.local` and provide the server-only Directus token.
Never expose it through a `NEXT_PUBLIC_` variable.

## Deployment

Build the `frontend-export` image and route `dks.com.pl` to port 3001. A safe
Nginx template is available in `proxy/dks-com-pl.conf.example`; install the
real TLS certificate before enabling it.
