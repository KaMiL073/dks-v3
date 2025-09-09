var axios = require("axios").default;

module.exports = ({ schedule }, { services, exceptions, getSchema }) => {
  const { MailService } = services;
  const { ServiceUnavailableException } = exceptions;
  const dt = new Date();
        dt.setDate( dt.getDate() - 1);

  const date = dt.toLocaleString("pl-PL", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const departments = {
      'pomorskie': 'j.czarnecki@dks.pl',
      'mazowieckie': 'r.ossowski@dks.pl',
      'śląskie': 'a.gajda@dks.pl',
      'wielkopolskie': 'm.gorski@dks.pl',
      'lódzkie': 'info.lodz@dks.pl',
      'malopolskie': 'm.zelichowski@dks.pl',
      'zachodniopomorskie': 'a.wachalski@dks.pl',
      'kujawsko-pomorskie': '	d.krysiak@dks.pl',
      'warminsko-mazurskie': 'j.czarnecki@dks.pl',
      'podkarpackie': 'm.fracz@dks.pl',
      'podlaskie': 'a.michalski@dks.pl',
      'dolnośląskie': 'm.zelichowski@dks.pl',
      'świętokrzyskie': 'a.gajda@dks.pl',
      'lubuskie': 'a.wachalski@dks.pl',
      'opolskie': 'm.zelichowski@dks.pl',
      'lubelskie': 'm.fracz@dks.pl',
      'brak': 'k.esmund@dks.pl'
  };
  
  schedule('00 08 * * *', async () => { 

      var options = {
        method: 'POST',
        url: 'https://app.marketizer.pl/api/auth/login',
        headers: {'content-type': 'multipart/form-data; boundary=---011000010111000001101001'},
        data: '-----011000010111000001101001\r\nContent-Disposition: form-data; name="email"\r\n\r\nk.esmund@dks.pl\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="password"\r\n\r\nfu96t2dw\r\n-----011000010111000001101001--\r\n'
      };
      
      await axios.request(options).then(function (response) {
        const token = response.data.token;

        var options = {
          method: 'GET',
          url: 'http://app.marketizer.pl/api/report/629e55d47878',
          params: {limit: '100', page: '1'},
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
          }
        };
        axios.request(options).then(async function (response) {
          const res = response.data.data;
          for (const [key, value] of Object.entries(departments)) {
            await sleep(6000);

            const result = res.filter( function(e) {
              const lastVisit = new Date(e.last_visit_datetime);
                  const province = (e.companies[0].province !== null) ? e.companies[0].province.province_name : 'brak';
                  if(dt.getMonth() === lastVisit.getMonth() && dt.getDate() === lastVisit.getDate() && province === key) {  
                    return e;
                  } 
              }
            
            );
            console.log(result);

            const mailService = new MailService({ schema:getSchema });
            if ( result !== 'undefined' && result.length > 0) {
                try {
                  await mailService.send({
                    from: 'www@dks.pl',
                    subject: 'Raport Dzienny - Odwiedziny na stronie',
                    to: value,
                    template: {
                      name: "marketizer",
                      data: {
                        data: result,
                        date: date,
                        departments: key,
                      },
                    },
                  });
                } catch (error) {
                  throw new ServiceUnavailableException(error);
                }
              }
          }
          
        }).catch(function (error) {
          console.error(error);
        });

      }).catch(function (error) {
        console.error(error);
      });
  });
};