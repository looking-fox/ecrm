const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    subscribed: (req, res) =>  {
      const { given_name, email } = req.session.user
       var msg = {
            "personalizations": [
              {
                "to": [
                  {
                    "email": email,
                    "name": given_name
                  }
                ],
                "dynamic_template_data": {
                  "name": given_name
                }
              }
            ],
            "from": {
              "email": "lookingfoxco@gmail.com",
              "name": "Looking Fox"
            },
            "reply_to": {
              "email": "lookingfoxco@gmail.com",
              "name": "Looking Fox"
            },
            "template_id": "d-59c8ff0327f74630913bb01beef55d0a"
          }

        sgMail.send(msg).then(() => {
            res.sendStatus(200)
        })
    }
}