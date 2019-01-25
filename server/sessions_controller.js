module.exports = {


    getDefaultSessions: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        dbInstance.get_default_sessions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    getsessions: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        dbInstance.get_sessions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    getsessiontypes: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user
        dbInstance.get_sessiontypes(sub).then(response => {
            res.status(200).send(response)
        })
    },

    getactions: (req, res) => {
        const dbInstance = req.app.get('db')
        const { sub } = req.session.user

        dbInstance.get_actions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    storeSession: (req, res) => {
        const dbInstance = req.app.get('db')
        const { session_name, session_price, session_color, actionList } = req.body.sessionInfo
        const { sub } = req.session.user

        dbInstance.store_session_template([session_name, session_color, session_price, actionList, sub, true])
            .then(response => res.status(200).send(response))
    },

    updateSession: (req, res) => {
        const dbInstance = req.app.get('db')
        const { session_name, session_price, session_color, actionList, session_id } = req.body.sessionInfo
        const { sub } = req.session.user

        dbInstance.update_session([sub, session_id, session_name, session_color, session_price, actionList, true])
            .then(() => res.sendStatus(200))
    },

    deletesession: (req, res) => {
        const dbInstance = req.app.get('db')
        const { id } = req.params

        dbInstance.delete_session(id).then(() => {
            res.sendStatus(200)
        })
    },

    updateProgress: (req, res) => {
        const dbInstance = req.app.get('db');
        const { index, session_id, isFinalItem } = req.body;

        dbInstance.update_progress(session_id, index)
            .then(() => {
                dbInstance.update_client_progress(session_id, isFinalItem)
                    .then(() => res.sendStatus(200))
            })
            .catch(err => console.log('error: ', err))
    }

}

