const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const massive = require('massive')
const axios = require('axios')
require('dotenv').config()
var sessionId = 54;
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const sessions = require('./sessions_controller')
const clients = require('./clients_controller')
const sessionActions = require('./sessionActions.controller')
const payments = require('./payments_controller')
const subscription = require('./stripe_controller')

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
    
    //If user 
        //If subscription => Go to Dashboard
        //No subscription => Go to SignUp

    //If no user
        // => Go to SignUp

    dbInstance.check_user(sub).then( response => {
        // Previous User
        if(response[0]){
            // Check Subscription
            dbInstance.stripe_check_status(sub).then(resp => {
                
                if(resp.length){
                    const {customer_id} = resp[0]
                    stripe.customers.retrieve(customer_id)
                    .then(customer => {
                    const {total_count} = customer.subscriptions
                    
                    // Active Subscription
                    if (total_count === 1){
                        res.redirect('/#/dashboard')
                    }
                    // Not Active
                    else {
                        res.redirect('/#/signup') 
                    }  
                    })
                }
                
                else {
                    res.redirect('/#/signup')
                }
            })

        }
        // New User
        else {
            dbInstance.store_user([sub, name, email]).then( () => {
                res.redirect('/#/signup')
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

app.put('/api/moveclients', clients.moveClients)

//===============CLIENTS==================//



//===============PAYMENTS==================//

app.get('/api/getpayments/:id', payments.getPayments)

app.post('/api/savepayment', payments.savePayment)

app.put('/api/updatepayments', payments.updatePayments)

app.delete('/api/deletepayment/:id', payments.deletePayment)

app.get('/api/yearlypayments/:year', payments.yearlyPayments)

app.get('/api/yearlymacro/:year', payments.yearlyMacro)

//===============PAYMENTS==================//



//===============STRIPE==================//

app.get('/api/stripe/subinfo', subscription.getInfo)

app.post('/api/stripe/addpayment', subscription.addPayment)

//===============STRIPE==================//




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

