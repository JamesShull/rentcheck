const SES = require("aws-sdk").SES;
const fs = require("fs");
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));

const account = settings.account;
const password = settings.password;

exports.handler =  (event, context) => {
    if (!event.email.match(/^[^@]+@[^@]+$/)) {
        console.log('Not sending: invalid email address', event);
        context.done(null, "Failed on email address");
        return;
    }
    const replyAddress = event.email;
    
    const name = event.name.substr(0, 50).replace(/[^\w\s]/g, '');
    //const name = 'James'
    
    
    const htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
          </head>
          <body>
            <p>From: `+ name + `</p>
            <p>`+ event.content +`</p>
            <p>...</p>
          </body>
        </html>
    `;

    const textBody = 'Hi from' + name + ', ' + event.content;

    // Create sendEmail params
    const params = {
      Destination: {
        ToAddresses: ['james.shull@gmail.com']
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
          Data: "rentcheck feedback - " + event.name
        }
      },
      Source: "Feedback <rentcheck.ninja@gmail.com>",
      ReplyToAddresses: [replyAddress]
    };
  
    // Create the promise and SES service object
    const sendPromise = new SES({ apiVersion: "2010-12-01", region: 'us-west-2' })
        .sendEmail(params)
        .promise();

    // Handle promise's fulfilled/rejected states
    var response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://rentcheck.ninja/*'},
        //headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        body: 'A ninja will answer as soon as possible!'
    };
    
    sendPromise
        .then(data => {
            console.log(data.MessageId);
            context.done(null, response);
        })
        .catch(err => {
          console.error(err, err.stack);
          response.statusCode = 500;
          response.body = JSON.stringify('Something went wrong');
          context.done(null, response);
    });
  // Add callback as a matter of style callback(null, response)
  // then change lambda function to exports.handler =  (event, context, callback) => {
};