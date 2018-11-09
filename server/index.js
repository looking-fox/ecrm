const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const massive = require('massive')
const axios = require('axios')
require('dotenv').config()
var sessionId = 54;
const path = require('path');
var proxy = require('http-proxy-middleware')
const sessions = require('./sessions_controller')
const clients = require('./clients_controller')
const sessionActions = require('./sessionActions.controller')

const app = express()



//-----PROXY-------//
app.use( express.static( `${__dirname}/../build` ) );

app.use(proxy('/api', { target: `${process.env.PROTOCOL}://${process.env.HOSTED}:3051/`, changeOrigin: true }))

app.use(proxy('/auth/callback', { target: 'http://www.lookingfox.com', changeOrigin: true }))

app.use(bodyParser.json())
//-----PROXY-------//

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

app.get('/api/user-info', (req, res) => {
    const {name, email, sub, picture} = req.session.user
    
    const dbInstance = req.app.get('db')
    dbInstance.get_client_lists(sub).then(response => {

        res.status(200).send({
            name,
            email,
            sub,
            picture,
            lists: response
        })
    })
})

app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.send()
})


//===============DB==================//


//===============SESSIONS==================//

app.get('/api/getsessions', sessions.getsessions)

app.get('/api/getsessiontypes', sessions.getsessiontypes)

app.post('/api/storesession', sessions.storesession)

app.delete('/api/deletesession/:id', sessions.deletesession)

app.get('/api/getactions', sessions.getactions)

//===============SESSIONS==================//



//===============ACTIONS==================//

app.put('/api/updateaction', sessionActions.putaction)



//===============ACTIONS==================//



//===============CLIENTS==================//

app.get('/api/getclients', clients.getclients)

app.post('/api/addclient', clients.addclient)

app.get('/api/getclientlists', clients.getClientLists)

app.post('/api/addlist', clients.addClientList)


//===============CLIENTS==================//

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
});


const SERVER_PORT = process.env.SERVER_PORT || 3051

app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on ${SERVER_PORT}`)
})

