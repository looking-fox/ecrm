module.exports = {

    getclients: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user;
        dbInstance.get_clients([sub]).then(response => {
            res.status(200).send(response)
        })
    },

    addclient: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {name, sessionId, date, location} = req.body.clientObj
        dbInstance
        .add_client([sub, name, sessionId, date, location])
        .then(() => res.sendStatus(200) )
    }

}