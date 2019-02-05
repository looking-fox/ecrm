module.exports = {
    getPayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params

        dbInstance.get_payments([sub, id])
            .then(response => res.status(200).send(response))
    },

    savePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { amount, date, description, clientId } = req.body

        dbInstance.save_payment([sub, clientId, amount, date, description]).then(response => {
            res.status(200).send(response)
        })
    },

    updatePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { payment_id, amount, date, description } = req.body.payment

        dbInstance.update_payment([sub, payment_id, amount, date, description])
            .then(() => res.sendStatus(200))
    },

    deletePayment: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params
        dbInstance.delete_payment([sub, id]).then(() => res.sendStatus(200))
    },

    yearlyPayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { year } = req.params
        dbInstance.get_yearly_payments([sub, year]).then(response => {
            let monthlyPayments = response
            dbInstance.get_yearly_macro([sub, year]).then(macro => {
                res.status(200).send({ monthlyPayments, macro })
            })
        })
    }
}