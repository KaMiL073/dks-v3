module.exports = ({ action }, { services, exceptions }) => {
  const { MailService } = services;
  const { ServiceUnavailableException } = exceptions;

  action('contact_forms.items.create', async ({ payload }, { schema }) => {
    const formsMap = {
      ServiceCallFormClientZone: 'ServiceCallForm',
      ServiceCallFormAlternative: 'ServiceCallForm',
      ServiceCallClientZone: 'ServiceCallForm',
      ServiceCallForm: 'ServiceCallForm',
      ContactForm: 'ContactForm',
      CountersForm: 'CountersForm',
      ConsumablesOrderForm: 'ConsumablesOrderForm',
      DebtCollectionForm: 'DebtCollectionForm',
    };

    const mailerMap = {
      ContactForm: {
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
      },
      ServiceCallForm: {
        pomorskie: 'serwis.gdansk@dks.pl',
        mazowieckie: 'serwis.warszawa@dks.pl',
        slaskie: 'serwis.katowice@dks.pl',
        wielkopolskie: 'serwis.poznan@dks.pl',
        lodzkie: 'serwis.lodz@dks.pl',
        malopolskie: 'serwis.krakow@dks.pl',
        zachodniopomorskie: 'serwis.szczecin@dks.pl',
        'kujawsko-pomorskie': 'serwis.bydgoszcz@dks.pl',
        'warminsko-mazurskie': 'serwis.olsztyn@dks.pl',
        podkarpackie: 'serwis.rzeszow@dks.pl',
        podlaskie: 'serwis.bialystko@dks.pl',
        dolnoslaskie: 'serwis.wroclaw@dks.pl',
      },
      CountersForm: {
        pomorskie: 'liczniki.gdansk@dks.pl',
        mazowieckie: 'liczniki.warszawa@dks.pl',
        slaskie: 'liczniki.katowice@dks.pl',
        wielkopolskie: 'liczniki.poznan@dks.pl',
        lodzkie: 'liczniki.lodz@dks.pl',
        malopolskie: 'liczniki.krakow@dks.pl',
        zachodniopomorskie: 'liczniki.szczecin@dks.pl',
        'kujawsko-pomorskie': 'liczniki.bydgoszcz@dks.pl',
        'warminsko-mazurskie': 'liczniki.olsztyn@dks.pl',
        podkarpackie: 'liczniki.rzeszow@dks.pl',
        podlaskie: 'liczniki.bialystko@dks.pl',
        dolnoslaskie: 'liczniki.wroclaw@dks.pl',
      },
      DebtCollectionForm: {
        pomorskie: 'windykacja@dks.pl',

      }
    };
    
    const subjectMap = {
      ServiceCallFormClientZone: 'Zgłoszenie ze strony dks.pl',
      ServiceCallFormAlternative: 'Zgłoszenie ze strony dks.pl',
      ServiceCallClientZone: 'Zgłoszenie ze strony dks.pl',
      ServiceCallForm: 'Zgłoszenie ze strony dks.pl',
      ContactForm: 'Wiadmość DKS',
      CountersForm: 'Liczniki ze strony dks.pl',
      ConsumablesOrderForm: 'Zamówienie ze strony dks.pl',
      DebtCollectionForm: 'Zgłoszenie z kontaktu',
    };
    const subjectClientMap = {
      ServiceCallFormClientZone: 'Zgłoszenie ze strony dks.pl',
      ServiceCallFormAlternative: 'Zgłoszenie ze strony dks.pl',
      ServiceCallClientZone: 'Zgłoszenie ze strony dks.pl',
      ServiceCallForm: 'Zgłoszenie ze strony dks.pl',
      ContactForm: 'Wiadmość DKS',
      CountersForm: 'Liczniki DKS',
      ConsumablesOrderForm: 'Zgłoszenie DKS',
      DebtCollectionForm: 'DKS - Twoje zgłoszenie jest w trakcie realizacji',
    };
    

    mailerMap.ConsumablesOrderForm = mailerMap.ServiceCallForm;

    const formType = formsMap[payload.form_name];

    const mailService = new MailService({ schema });
    try {
      await mailService.send({
        from: 'www@dks.pl',
        subject: subjectMap[formType],
        to: mailerMap[formType][payload.form_data.province],
        template: {
          name: formType,
          data: {
            data: payload.form_data,
          },
        },
      });
      await mailService.send({
        from: 'www@dks.pl',
        subject: subjectClientMap[formType],
        to: payload.email,
        template: {
          name: `${formType}Client`,
          data: {
            data: payload.form_data,
          },
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }

    return payload;
  });
};
