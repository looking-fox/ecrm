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
        const {name, session_id, date, location, listId, client_price} = req.body.clientInfo
        
        dbInstance
        .add_client([sub, name, session_id, date, location, listId, client_price])
        .then((response) => {
            var client = response

            const {session_id} = req.body.clientInfo
            const {sub} = req.session.user
            var clientId = response[0].client_id
            var actionItems = response[0]["actions"]
            var itemIndex = 0

            function addActions(){
                //Recursively add items in order and avoid async issues
                let e = JSON.parse(actionItems[itemIndex])
                const {name} = e

                dbInstance.create_actions([name, session_id, sub, clientId]).then(() => {
                    itemIndex++
                    if(itemIndex <= actionItems.length-1){
                        addActions()
                    }
                })
            }
            
            addActions()

            dbInstance.get_new_client_actions(sub).then(resp => {
                res.status(200).send({
                    client: client,
                    actions: resp
                })
            })

        })
    },

    addClientList: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {listName} = req.body
        
        dbInstance.store_client_list([sub, listName]).then( (response) => {
            res.status(200).send(response)
        })
    },

    getClientLists: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        
        dbInstance.get_client_lists(sub).then(response => {
            res.status(200).send(response)
        })
    },

    updateClient: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {name, session_id, date, location, client_id, client_price} = req.body.clientInfo
        
        dbInstance.update_client([sub, client_id, name, session_id, date, location, client_price])
        .then(() => {
            res.sendStatus(200)
        })
    },

    deleteClient: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params

        dbInstance.delete_client([sub, id]).then(() => {
            res.sendStatus(200)
        })
        
    },

    clientComplete: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {clientId, completed} = req.body
        dbInstance.complete_client([sub, clientId, completed])
        .then(() => {
            res.sendStatus(200)
        })

    }

}