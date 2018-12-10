const stripe = require('stripe')(process.env.STRIPE_KEY)
  
module.exports = {
  addPayment: (req, res) => {
      const {email, name, sub} = req.session.user
      
          //Create Customer on Stripe
          var customer_id;
          const customer = stripe.customers.create({
              description: name, 
              email: email  
          })
          .then( response => {
          const dbInstance = req.app.get('db')
              //add Stripe Customer ID to DB
                customer_id = response.id
          dbInstance.stripe_add_customer([sub, customer_id])
          
          .then( user => {
              //create source 
              stripe.customers.createSource(
                  customer_id,
                  {source: req.body.token.id, }).then( () => {
              //create subscription
                      stripe.subscriptions.create({
                          customer: customer_id,
                          items: [
                            {
                              plan: process.env.PLAN_ID,
                            },
                          ]
                        }).catch(error => {
                            console.log('sub-error: ', error.message)
                        })
                              
                         
                       }).catch(error => {
                           //Insufficient funds || Card Declines
                           console.log('error: ', error.message)
                           res.sendStatus(402)
                           
                       })
                       
                  }).catch(error => {
                      console.log('addstripeid-error: ', error)
                  })
                  
              })
             
          }
      }



  //Grab Stripe ID using Google Sub

//    dbInstance.get_stripe(sub).then(customer => {
       
//     if (customer[0].customer_id){

//         const {customer_id} = customer[0]
//     stripe.customers.retrieve(customer_id).then(customer => {
      
//         const {total_count} = customer.subscriptions
       
//         if (total_count === 1){
//             res.status(200).send('active')
//         }
//         else {
//             res.status(200).send('notactive')
//                       }
//                 })
//              }
//       else {
//           res.status(200).send('noaccount')
//             } 
//          })
//      }
          
//     })

// app.get('/api/customerid', (req, res) => {
//     //get the Customer ID from DB
//     const {sub} = req.session.user

//     const dbInstance = req.app.get('db');

//     dbInstance.get_stripe(sub).then(customer => {
        
//     const {customer_id} = customer[0]

//     //retrieve a Customer
//     stripe.customers.retrieve(customer_id).then(stripecust => {
        
//         res.status(200).send({stripecust: stripecust, name: req.session.user})
//          })  
//     })

    
// app.post('/api/customersub', (req, res) => {
// const {id, default_source} = req.body.customer

// // retrieve a Customer's card

//     stripe.customers.retrieveCard(
//     id,
//     default_source,
//     ).then(card => {
//         const {brand, last4} = card
//         res.status(200).send({brand: brand, last4: last4})
//     })
// }),

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

    
// })


// })