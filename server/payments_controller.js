module.exports = {
    getPayments: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params

        dbInstance.get_payments([sub, id])
        .then(response => res.status(200).send(response))
    }
}