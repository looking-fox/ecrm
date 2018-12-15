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
            "template_id": "d-fbd3f49297cb441eaf9ea3888eb63d85"
          }

        sgMail.send(msg).then(() => {
            res.sendStatus(200)
        })
    }
}