module.exports = {
    getExpenses: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params

        dbInstance.get_expenses([sub, id])
            .then(response => res.status(200).send(response))
    },

    updateExpense: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { expense_id, amount, date, description } = req.body.expense

        dbInstance.update_expense([sub, expense_id, amount, date, description])
            .then(() => res.sendStatus(200))
    },

    saveExpense: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { amount, date, description, clientId } = req.body

        dbInstance.save_expense([sub, clientId, amount, date, description]).then(response => {
            res.status(200).send(response)
        })
    },

    deleteExpense: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        const { id } = req.params
        dbInstance.delete_expense([sub, id]).then(() => res.sendStatus(200))
    }
}