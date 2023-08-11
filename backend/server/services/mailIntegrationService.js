var promise = require('bluebird');
var db = require('../../dbDeclarations').url;
const nodemailer = require('nodemailer');

const mailStartTemplate = `<h1>Test Sage Report Status Mail</h1>`
const mailBodyTemplate = `<h2>Hi, Thanks For using Test Sage<h2>`
const mailEndTemplate = `<h3>Thank You</h3><br>
<h4>For Support Please Conatct:</h4>
<h5>Email:<a>info@testsage.com</a></h5>
`

class EmailService {

  sendEmail(doc, emailBody, emailMessage) {
    console.log('sendEmailsendEmailsendEmailsendEmailsendEmail1')
    return new promise((resolve, reject) => {
      emailConfiguration(doc.emailArray, emailBody, emailMessage)
    })
  }

}

function emailConfiguration(toEmail, emailBody, emailMessage) {
  console.log(toEmail)
  const transport = {
    host: "testsage.com",
    // host:"45.116.122.166",
    // port:26,
    // port: 587,
    port:465,
    secure: true,
    // secureConnection: true,

    auth: {
      user: "reports@testsage.com",
      pass: "Smart@122$"
    },
    tls: {
      rejectUnauthorized: false
    }

  }

  const smtpTransport = nodemailer.createTransport(transport);



  const options = {
    from: "Testsage Report <reports@testsage.com>",
    to: toEmail,
    subject: emailMessage,
    html: `
      ${mailStartTemplate}
      ${mailBodyTemplate} <h3> ${emailBody}.</h3>
      ${mailEndTemplate}`
  }
  smtpTransport.sendMail(options, (err, info) => {
    err ? console.log(err) : console.log(info);
  })
}




module.exports = EmailService;