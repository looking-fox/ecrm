const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const massive = require('massive')
const axios = require('axios')
require('dotenv').config()
var sessionId = 54;
const path = require('path');
const sessions = require('./sessions_controller')
const clients = require('./clients_controller')
const sessionActions = require('./sessionActions.controller')

const app = express()


//----------- MIDDLEWARE -----------//

app.use( express.static( `${__dirname}/../build` ) );

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

//----------- MIDDLEWARE -----------//



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
    
    dbInstance.check_user(sub).then( response => {
        if(response[0]){
            res.redirect('/#/dashboard')
        }
        else {
            dbInstance.store_user([sub, name, email]).then( () => {
                res.redirect('/#/dashboard/welcome')
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
        var lists = response
        res.status(200).send({
            name,
            email,
            sub,
            picture,
            lists
        })
    })
})

app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.send()
})


//===============DB==================//


//===============SESSIONS==================//

app.get('/api/getdefaultsessions', sessions.getDefaultSessions)

app.get('/api/getsessions', sessions.getsessions)

app.get('/api/getsessiontypes', sessions.getsessiontypes)

app.post('/api/storesession', sessions.storesession)

app.put('/api/updatesession', sessions.updateSession)

app.delete('/api/deletesession/:id', sessions.deletesession)


//===============SESSIONS==================//



//===============ACTIONS==================//

app.get('/api/getactions', sessions.getactions)

app.put('/api/updateaction', sessionActions.putaction)



//===============ACTIONS==================//

app.post('/api/changelistorder', (req, res) => {
    //Swaps Index Ids to swap list order.
    const dbInstance = req.app.get('db')
    const { dragId, hoverId, dragIndex, hoverIndex} = req.body.swap
     
    dbInstance.swap_lists([hoverIndex, dragId]).then(() => {

        dbInstance.swap_lists([dragIndex, hoverId]).then(() => {
            res.sendStatus(200)
        })
    })
  
})

app.put('/api/updatelist', (req, res) => {
    const dbInstance = req.app.get('db')
    const {list_id, listName} = req.body
    const {sub} = req.session.user
    dbInstance.update_list([sub, list_id, listName]).then(() => {
        res.sendStatus(200)
    })
})

app.delete('/api/deletelist/:id', (req, res) => {
    const dbInstance = req.app.get('db')
    const {id} = req.params
    const {sub} = req.session.user
    dbInstance.delete_client_list([sub, id]).then(() => {
        res.sendStatus(200)
    })
})

//===============CLIENTS==================//

app.get('/api/getclients', clients.getclients)

app.post('/api/addclient', clients.addclient)

app.get('/api/getclientlists', clients.getClientLists)

app.post('/api/addlist', clients.addClientList)

app.put('/api/updateclient', clients.updateClient)

app.put('/api/updatefullclient', clients.updateFullClient)

app.put('/api/clientcomplete', clients.clientComplete)

app.delete('/api/deleteclient/:id', clients.deleteClient)

//===============CLIENTS==================//


//============SENDGRID==================//

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/sendcontactemail', (req, res) => {
    const {name, email, inputMessage} = req.body.message
    const msg = {
        to: 'lookingfoxco@gmail.com',
        from: email,
        subject: `Contact Submission from ${name}`,
        text: inputMessage
    }
    sgMail.send(msg).then(() => {
        res.sendStatus(200)
    })

})

// sgMail.send(msg);

//============SENDGRID==================//



app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
});


const SERVER_PORT = process.env.SERVER_PORT || 3051

app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on ${SERVER_PORT}`)
})

