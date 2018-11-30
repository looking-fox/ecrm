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

    updatePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {amount, date, description, client_id, payment_id} = req.body
        dbInstance.update_payment([sub, client_id, payment_id, amount, date, description]).then(() => res.sendStatus(200) )
    }
}