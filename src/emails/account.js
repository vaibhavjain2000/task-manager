const sgMail = require('@sendgrid/mail')
// const sendgridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name) => {
    sgMail.send({
        to : email,
        from : 'vivek.gugnani04@gmail.com',
        subject : 'Thanks for joining in!',
        text : `Welcome to the app , ${name}. Let me know how you get along with the app.`
    })
}

const cancelEmail = (email , name) => {
    sgMail.send({
        to : email,
        from : 'vivek.gugnani04@gmail.com',
        subject : 'Sorry to see you go!',
        text : `Goodbye , ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
     sendWelcomeEmail,
     cancelEmail
}
// ZKJ80O91U4YuoPb8
