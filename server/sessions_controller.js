module.exports = {

    getsessions: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        dbInstance.get_sessions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    getsessiontypes: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        dbInstance.get_sessiontypes(sub).then(response => {
            res.status(200).send(response)
        })
    },

    getactions: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user

        dbInstance.get_actions(sub).then(response => {
            res.status(200).send(response)
        })
    },

    storesession: (req, res) => {
        const dbInstance = req.app.get('db')
        const {name, price, color, actionList} = req.body.sessionInfo
        const {sub} = req.session.user

        dbInstance.store_session([name, color, price, actionList, sub])
        .then( (response) => {
            const {session_id} = response[0]
            const {actionList} = req.body.sessionInfo
            const {sub} = req.session.user
            console.log('actionList: ', actionList)
            // actionList.forEach(e => {
            //     console.log('item: ', e)
            //     const {name} = e
            //     dbInstance.create_default_actions([name, session_id, sub]).then( (response) => {
            //         if(response){
            //             return
            //         }
            //     })
            // })
            for(let i = 0; i < actionList.length; i++){
                console.log('item: ', actionList[i])
                const {name} = actionList[i]
                dbInstance.create_default_actions([name, session_id, sub])
            }

            res.sendStatus(200) 
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

