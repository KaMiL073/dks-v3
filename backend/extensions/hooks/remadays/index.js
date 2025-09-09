module.exports = ({ action }, { services, exceptions }) => {
    const { MailService } = services;
    const { ServiceUnavailableException } = exceptions;
  
    action('remadays.items.create', async ({ payload }, { schema }) => {
      const mailService = new MailService({ schema });
      try {
        await mailService.send({
          from: 'www@dks.pl',
          subject: 'RemaDays - Dziękujemy za rejestracje',
          to: payload.email,
          template: {
            name: 'RemadaysClient',
            data: {
            //   data: payload.email,
                data: payload,
            //   departments: key,
            },
          },
        });
        await mailService.send({
            from: 'www@dks.pl',
            subject: 'RemaDays - Nowa rejestracja',
            to: 'a.cwiklinski@dks.pl',
            template: {
              name: 'Remadays',
              data: {
                data: payload,
                //   date: date,
                //   departments: key,
              },
            },
          });
      } catch (error) {
        throw new ServiceUnavailableException(error);
      }
  
      return payload;
    });
  };
  