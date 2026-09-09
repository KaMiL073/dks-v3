export default ({ action }, { services, env }) => {
  const { MailService } = services;

  action('events.items.create', async (meta, { schema }) => {
    try {
      const token = env.SERVICE_USER_TOKEN || process.env.SERVICE_USER_TOKEN;
      if (!token) {
        console.warn('Missing SERVICE_USER_TOKEN');
        return;
      }

      async function readItems(path) {
        const response = await fetch(`http://directus:8055${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Event mail lookup failed: HTTP ${response.status}`);
        }
        return (await response.json()).data;
      }

      let formData = meta.payload || {};
      if ((!formData.email || !formData.event) && meta.key) {
        formData = (await readItems(`/items/events/${encodeURIComponent(meta.key)}`)) || formData;
      }
      if (!formData.email) {
        console.warn('Missing recipient email for event registration', meta.key);
        return;
      }
      const slug = String(formData.event || '').split('#')[0];
      if (!slug) {
        console.warn('Missing event slug for event registration', meta.key);
        return;
      }

      const query = new URLSearchParams({
        'filter[slug][_eq]': slug,
        limit: '1',
      });
      const events = await readItems(`/items/events_create?${query}`);
      const eventData = events?.[0];
      if (!eventData) {
        console.warn(`Event not found for slug: ${slug}`);
        return;
      }

      const mailService = new MailService({ schema });
      await mailService.send({
        from: 'www@dks.com.pl',
        subject: eventData.name,
        to: formData.email,
        template: {
          name: 'event',
          data: { data: { ...formData, eventData } },
        },
      });
      console.log('Event email sent for registration', meta.key);
    } catch (error) {
      console.error('events.items.create mail hook error:', error);
    }
  });
};
