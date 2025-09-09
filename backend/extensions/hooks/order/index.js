module.exports = ({ action }, { services, exceptions }) => {
    const { MailService } = services;
    const { ServiceUnavailableException } = exceptions;
  
    action('order.items.create', async ({ payload }, { schema }) => {
      const ContactForm = {
          pomorskie: 'info.gdansk@dks.pl',
          mazowieckie: 'info.warszawa@dks.pl',
          slaskie: 'info.katowice@dks.pl',
          wielkopolskie: 'info.poznan@dks.pl',
          lodzkie: 'info.lodz@dks.pl',
          malopolskie: 'info.krakow@dks.pl',
          zachodniopomorskie: 'info.szczecin@dks.pl',
          'kujawsko-pomorskie': 'info.bydgoszcz@dks.pl',
          'warminsko-mazurskie': 'info.olsztyn@dks.pl',
          podkarpackie: 'info.rzeszow@dks.pl',
          podlaskie: 'info.bialystko@dks.pl',
          dolnoslaskie: 'info.wroclaw@dks.pl',
        };
      const email = ContactForm[payload.province];

      const mailService = new MailService({ schema });
      try {
        await mailService.send({
          from: 'www@dks.pl',
          subject: 'Zamówienie - DKS',
          to: email,
          template: {
            name: 'Order',
            data: {
              data: payload,
            },
          },
        });
        await mailService.send({
          from: 'www@dks.pl',
          subject: 'Zamówienie - DKS',
          to: payload.email,
          template: {
            name: 'OrderClient',
            data: {
              data: payload,
            },
          },
        });
      } catch (error) {
        throw new ServiceUnavailableException(error);
      }
  
      return payload;
    });
  };
  