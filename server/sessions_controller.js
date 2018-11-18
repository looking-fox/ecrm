module.exports = {


    getDefaultSessions: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        dbInstance.get_default_sessions(sub).then(response => {
            res.status(200).send(response)
        })
    },

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

        dbInstance.store_session([name, color, price, actionList, sub, true])
        .then( (response) => {
            const {session_id} = response[0]
            const {actionList} = req.body.sessionInfo
            const {sub} = req.session.user
            var itemIndex = 0
            
            function addDefaultActions(){
    //Recursively add items in order and avoid async issues
                const {name} = actionList[itemIndex]
                dbInstance.create_default_actions([name, session_id, sub, true]).then(() => {
                    itemIndex++
                    if(itemIndex <= actionList.length-1){
                        addDefaultActions()
                    }
                })
            }
            addDefaultActions()
            dbInstance.get_new_session(sub).then(response => {
                res.status(200).send(response)
            })
            
            
        })
    },

    updateSession: (req, res) => {
        const dbInstance = req.app.get('db')
        const {name, price, color, actionList, session_id} = req.body.sessionInfo
        const {sub} = req.session.user

        dbInstance.update_session([sub, session_id, name, color, price, actionList, true])
        .then( () => {
            
            var itemIndex = 0
            
            function addDefaultActions(){
    //Recursively add items in order and avoid async issues
                const {name} = actionList[itemIndex]
                dbInstance.create_default_actions([name, session_id, sub, true]).then(() => {
                    itemIndex++
                    if(itemIndex <= actionList.length-1){
                        addDefaultActions()
                    }
                })
            }
            addDefaultActions()
            
            dbInstance.get_new_session(sub).then(response => {
                res.status(200).send(response)
            })   
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

