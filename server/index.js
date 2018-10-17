const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const massive = require('massive')
const axios = require('axios')
require('dotenv').config()
var sessionId = 54;

const app = express()

app.use(bodyParser.json())

massive(process.env.CONNECTION_STRING).then(db => {
    app.set('db', db)
}).catch(error => {
    console.log(`Massive error is ${error}`)
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))



//========Auth0==========//

app.get('/auth/callback', async (req, res) => {
    const {PROTOCOL} = process.env
        const payload = {
            client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: `${PROTOCOL}://${req.headers.host}/auth/callback`
        };
    //----get token---//
    
        let receiveToken = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
    
    //----exchange token---//
    
    let receiveUser = await axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${receiveToken.data.access_token}`)
    
    //-----user data-----//
    req.session.user = receiveUser.data;
    req.session.user.id = sessionId;
    sessionId++
    

    const {sub, name, email} = req.session.user
   
    const dbInstance = req.app.get('db')

    //If already in DB, redirect to dashboard.
    //If not, add them to DB first before redirecting.
    
    dbInstance.check_user(sub).then((response) => {
        if(response[0]){
            res.redirect('/#/dashboard')
        }
        else {
            dbInstance.store_user([sub, name, email]).then( () => {
                res.redirect('/')
            })
        }
    })


    

})

//========Auth0==========//



//===============DB==================//



//===============DB==================//


const SERVER_PORT = process.env.SERVER_PORT || 3050
app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on ${SERVER_PORT}`)
})

