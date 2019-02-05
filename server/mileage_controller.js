module.exports = {
    getMileage: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params

        dbInstance.get_mileage([sub, id])
            .then(response => res.status(200).send(response))
    },

    updateMileage: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { mileage_id, amount, date, description } = req.body.mileage

        dbInstance.update_mileage([sub, mileage_id, amount, date, description])
            .then(() => res.sendStatus(200))
    },

    saveMileage: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { amount, date, description, clientId } = req.body

        dbInstance.save_mileage([sub, clientId, amount, date, description]).then(response => {
            res.status(200).send(response)
        })
    },

    deleteMileage: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params
        dbInstance.delete_mileage([sub, id]).then(() => res.sendStatus(200))
    }
}