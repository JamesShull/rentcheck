const SES = require("aws-sdk").SES;
const account = 'james.shull@gmail.com';
const password = 'i<3wileen';

exports.handler =  (event, context) => {
    // TODO implement
    //if (!event.email.match(/^[^@]+@[^@]+$/)) {
    //    console.log('Not sending: invalid email address', event);
    //    context.done(null, "Failed");
    //    return;
    //}
    //
    //const name = event.name.substr(0, 40).replace(/[^\w\s]/g, '');
    
    const name = 'Mr. RentCheck';
    
    const htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
          </head>
          <body>
            <p>Hi `+ name + `,</p>
            <p>...</p>
          </body>
        </html>
    `;

    const textBody = 'Hi ' + name + ', here is some email content.';

    // Create sendEmail params
    const params = {
      Destination: {
        ToAddresses: ['rentcheck.ninja@gmail.com']
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlBody
          },
          Text: {
            Charset: "UTF-8",
            Data: textBody
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Test Email"
        }
      },
      Source: "Tester <james.shull@gmail.com>"
    };
  
    // Create the promise and SES service object
    const sendPromise = new SES({ apiVersion: "2010-12-01" })
        .sendEmail(params)
        .promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
        .then(data => {
            console.log(data.MessageId);
            context.done(null, "Success");
        })
        .catch(err => {
          console.error(err, err.stack);
          context.done(null, "Failed");
    });
    
    /*
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!')
    };
    return response;
    */
};