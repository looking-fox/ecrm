const stripe = require('stripe')(process.env.STRIPE_KEY)
  
module.exports = {

  getInfo: (req, res) => {
    const dbInstance = req.app.get('db')
    const {sub} = req.session.user

    dbInstance.stripe_check_status(sub).then(response => {
        //User has lifetime access. Other checks are in place to verify user has subscription or has lifetime access. No response means user has lifetime access. 
        if(response.length === 0 ){
            res.status(200).send('lifetime')
        }
        else {
        //Regular user
        const {customer_id} = response[0]
        //Use cust_id to get customer object
        stripe.customers.retrieve(customer_id).then(customer => {
        const {default_source} = customer
        const {current_period_end, cancel_at_period_end} = customer.subscriptions.data[0]
        let nextPayment = new Date(current_period_end * 1000).toDateString()
            //Retrieve Card & Subscription Info
            stripe.customers.retrieveCard(
                customer_id,
                default_source,
                ).then(card => {
                    const {brand, last4} = card
                    let intLast4 = parseInt(last4)
                    res.status(200).send({
                        brand, 
                        last4: intLast4,
                        nextPayment,
                        canceledSub: cancel_at_period_end
                    })
                })
            })
        }
    })
    
  },

  addPayment: (req, res) => {
      
      //Cannot make payment if not logged in.
      if(!req.session.user) res.redirect('/')

      const {email, name, sub} = req.session.user
      const dbInstance = req.app.get('db')
      const {token} = req.body.token
      var customer_id;

        //Check for Previous Account
       dbInstance.stripe_check_status(sub).then(resp => {
           //Has Account
           if(resp.length){
            customer_id = resp[0].customer_id
            
            //Add New Card
            stripe.customers.createSource(customer_id,
            {source: token.id })
            .then(() => {
                //Grab Customer Object
                stripe.customers.retrieve(customer_id)
                .then( customer  => {
                //Set New Card to Default Source
                    let defaultSrc = customer.sources.data[1].id
                    stripe.customers.update(customer_id, {
                    default_source: defaultSrc })
                    .then( cust => {  
                        // Add Subscription
                        const {total_count} = cust.subscriptions

                        if(total_count === 1){
                            //Don't Cancel Subscription at MO end
                            //This is an edge case where a user comes to this page
                            //when they really shouldn't. Only updates subscription.
                            const {id} = cust.subscriptions.data[0] 
                            stripe.subscriptions.update(customer_id, {
                                cancel_at_period_end: false,
                                items: [{ id, plan: process.env.PLAN_ID }]
                            })
                        }
                        else {
                            //Brand New Subscription
                            stripe.subscriptions.create({
                                customer: customer_id,
                                items: [ { plan: process.env.PLAN_ID } ]
                              }).then( () => res.status(200).send('previous'))
                        } 
                    })
                })
            })
           }
       
          //Create Customer on Stripe
          else {
          
          var customer_id;
          const customer = stripe.customers.create({
              description: name, 
              email: email  
          })
          .then( response => {
          const dbInstance = req.app.get('db')
              //add Stripe Customer ID to DB
                customer_id = response.id
          dbInstance.stripe_add_customer([sub, customer_id]).then( () => {
              //Create Source 
              stripe.customers.createSource(
                  customer_id,
                  {source: token.id }).then( () => {
              // Add Subscription
                      stripe.subscriptions.create({
                          customer: customer_id,
                          items: [ { plan: process.env.PLAN_ID } ]
                        })
                        .then( () => {
                            //Agreed to Terms of Service
                            dbInstance.agreed_terms(sub).then(() => {
                                res.status(200).send('new')
                            })
                        })
                        .catch(error => { console.log('sub-error: ', error.message) })         
                  })

         }).catch(error => console.log('addstripeid-error: ', error) )
         
                 })          
            }     
       })     
    },
    
    renewSub: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user

        dbInstance.stripe_check_status(sub).then(customer => {
            const {customer_id} = customer[0]
    
            stripe.customers.retrieve(customer_id)
            .then(customer => {
                const {id} = customer.subscriptions.data[0]

                stripe.subscriptions.retrieve(id).then(response => {

                    stripe.subscriptions.update(id, {
                        cancel_at_period_end: false,
                        items: [{
                          id: response.items.data[0].id,
                          plan: process.env.PLAN_ID,
                        }]
                      }).then( () => res.sendStatus(200) )     
                })         
            }) 
        })
    },


    updateCard: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {token} = req.body.token
        var customer_id;
        var defaultSrc;
        //Grab Customer ID
        dbInstance.stripe_check_status(sub).then(resp => {
             customer_id = resp[0].customer_id
             
             //Add New Card
             stripe.customers.createSource(customer_id,
             {source: token.id })
             .then(() => {
                 //Grab Customer Object
                 stripe.customers.retrieve(customer_id)
                 .then( customer  => {
                 //Set New Card to Default Source
                     defaultSrc = customer.sources.data[1].id
                     stripe.customers.update(customer_id, {
                     default_source: defaultSrc })
                     .then( customer => {
                        
                    stripe.customers.retrieveCard(
                    customer_id, defaultSrc)
                    .then(card => {
                        const {brand, last4} = card
                        let intLast4 = parseInt(last4)
                        res.status(200).send({
                            brand,
                            last4: intLast4
                        })
                    })
                        
                    })
                 })
             })
        })
    },

    cancelSub: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user

        dbInstance.stripe_check_status(sub).then(customer => {
            const {customer_id} = customer[0]
    
            stripe.customers.retrieve(customer_id)
            .then(customer => {
                const {id} = customer.subscriptions.data[0]
                   
                stripe.subscriptions
                .update(id, {cancel_at_period_end: true})
                .then(() => res.sendStatus(200) )
            }) 
        })
    }


}

    


// app.put('/api/renewsubscription', (req, res, next) => {
// const {customer} = req.body;
// const {id} = customer.stripecust.subscriptions.data[0]

// stripe.subscriptions.retrieve(id).then(response => {

//     stripe.subscriptions.update(id, {
//         cancel_at_period_end: false,
//         items: [{
//           id: response.items.data[0].id,
//           plan: process.env.PLAN_ID,
//         }]
//       }).then(customer => {
//           res.status(200).send(customer)
//       })
