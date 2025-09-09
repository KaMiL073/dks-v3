module.exports = ({ action }, { services, exceptions }) => {
  const axios = require('axios');

  const { ServiceUnavailableException } = exceptions;
  const GETRESPONSE_API_URL = 'https://api.getresponse.com/v3/contacts';
  const GETRESPONSE_API_KEY = process.env.GETRESPONSE_API_KEY;
  const GETRESPONSE_LIST_ID = process.env.GETRESPONSE_LIST_ID;

  action('contact_forms.items.create', async ({ payload }) => {

      // Funkcja sprawdzająca, czy kontakt już istnieje
      async function checkIfContactExists(email) {
          try {
              const response = await axios.get(`${GETRESPONSE_API_URL}?query[email]=${encodeURIComponent(email)}`, {
                  headers: {
                      'X-Auth-Token': `api-key ${GETRESPONSE_API_KEY}`,
                  },
              });

              if (response.data.length > 0) {
                  return response.data[0].contactId; // Zwracamy ID istniejącego kontaktu
              }
              return null;
          } catch (error) {
              console.error('Błąd sprawdzania kontaktu:', error.response?.data || error.message);
              return null;
          }
      }

      // Funkcja do dodania lub aktualizacji kontaktu
      async function upsertContact(email, name) {
          try {
              const contactId = await checkIfContactExists(email);

              if (contactId) {
                  // Jeśli kontakt istnieje, aktualizujemy go
                  await axios.post(`${GETRESPONSE_API_URL}/${contactId}`, 
                      { name }, 
                      {
                          headers: {
                              'X-Auth-Token': `api-key ${GETRESPONSE_API_KEY}`,
                              'Content-Type': 'application/json',
                          },
                      }
                  );
                  console.log(`Kontakt ${email} został zaktualizowany.`);
              } else {
                  // Jeśli kontakt nie istnieje, dodajemy nowy
                  await axios.post(GETRESPONSE_API_URL, 
                      {
                          email,
                          name,
                          campaign: { campaignId: GETRESPONSE_LIST_ID },
                      }, 
                      {
                          headers: {
                              'X-Auth-Token': `api-key ${GETRESPONSE_API_KEY}`,
                              'Content-Type': 'application/json',
                          },
                      }
                  );
                  console.log(`Nowy kontakt ${email} został dodany.`);
              }
          } catch (error) {
              console.error('Błąd operacji na kontakcie:', error.response?.data || error.message);
          }
      }

      try {
          const { clause, email, name } = payload; // Upewnienie się, że `payload` jest prawidłowy

          if (!email || !name) {
              console.error('Brak wymaganych danych (email lub name).');
              return;
          }

          if (clause) {
              await upsertContact(email, name);
          } else {
              console.log('Pole clause nie jest zaznaczone – kontakt nie został dodany.');
          }
      } catch (error) {
          console.error('Błąd webhooka:', error.message);
      }

      return payload;
  });
};
