module.exports = {

    getsessions: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        dbInstance.get_sessions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    storesession: (req, res) => {
        const dbInstance = req.app.get('db')
        const {name, price, color, actionList} = req.body.sessionInfo
        const {sub} = req.session.user
        dbInstance.store_session([name, color, price, actionList, sub])
        .then(response => {res.sendStatus(200)
        }).catch(error => {
            console.log('StoreSession Error: ', error)
        })
    },

    deletesession: (req, res) => {
        const dbInstance = req.app.get('db')
        const {id} = req.params

        dbInstance.delete_session(id).then(() => {
            res.sendStatus(200)
        })
    }

}

