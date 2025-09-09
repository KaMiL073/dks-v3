var axios = require("axios").default;

module.exports = ({ action }, { services, exceptions }) => {
  const { MailService } = services;
  const { ServiceUnavailableException } = exceptions;

  action('events.items.create', async ({ payload }, { schema }) => {
   
    var options = {
      method: 'GET',
      url: 'https://dks.pl/backend/items/events_create',
      params: {'': ''},
      headers: {
        'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
        // Authorization: `Bearer 89xxkKXkc9`
        Authorization: `Bearer ${process.env.SERVICE_USER_TOKEN}`,


      }
    };

    axios.request(options).then(function (response) {
      const mailService = new MailService({ schema });
      const res = response.data.data.find((element) => element.slug === payload.event.split("#")[0]);
      
      try {
        mailService.send({
          from: 'www@dks.pl',
          subject: res.name,
          to: payload.email,
          template: {
            name: 'event',
            data: {
              data: res,
            },
          },
        });
        } catch (error) {
          throw new ServiceUnavailableException(error);
        }
    }).catch(function (error) {
      console.error(error);
    });

  });
};
