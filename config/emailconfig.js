const nodemailer = require ('nodemailer')

transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'plataformaleiloesleilon@outlook.com',
        pass: 'projetotis5' 
    }
});


module.exports = transporter