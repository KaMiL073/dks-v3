# GetResponse Directus hook

The hook listens for `contact_forms.items.create`. When the submission contains
an explicit marketing consent, it creates the contact in the configured
GetResponse list or updates the name of a contact already present on that list.

Required backend environment variables:

- `GETRESPONSE_API_KEY` - GetResponse API key
- `GETRESPONSE_LIST_ID` - alphanumeric list token (`campaignId`), not the numeric list ID

Optional:

- `GETRESPONSE_API_URL` - defaults to `https://api.getresponse.com/v3`

The integration is fail-open: a GetResponse outage is logged but does not reject
or remove the submitted contact form.
