module.exports = {
    getPayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params

        dbInstance.get_payments([sub, id])
        .then(response => res.status(200).send(response))
    },
    
    savePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {amount, date, description, clientId} = req.body

        dbInstance.save_payment([sub, clientId, amount, date, description]).then(response => {
            res.status(200).send(response)
        })
    }, 

    updatePayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {updates} = req.body
       
        var arrayIDs = Object.keys(updates)
        var length = arrayIDs.length -1 
        var currentIndex = 0
        
        function storeUpdates(){
            let index = arrayIDs[currentIndex]
            const {payment_id, amount, date, description} = updates[index]
            dbInstance.update_payment([sub, payment_id, amount, date, description]).then(() => {
                currentIndex++

                if(currentIndex <= length) storeUpdates()
                else res.sendStatus(200)
            })
        }

        storeUpdates()
    },

    deletePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params
        dbInstance.delete_payment([sub, id]).then(() => {
            res.sendStatus(200)
        })
    },

    yearlyPayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {year} = req.params
        dbInstance.get_yearly_payments([sub, year]).then(response => {
            res.status(200).send(response)
        })
    }
}