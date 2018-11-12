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
        const {name, sessionId, date, location, listId} = req.body.clientObj
        
        dbInstance
        .add_client([sub, name, sessionId, date, location, listId])
        .then((response) => {
            
            const {sessionId} = req.body.clientObj
            const {sub} = req.session.user
            var clientId = response[0].client_id
            var actionItems = response[0]["array_agg"][0]
            var itemIndex = 0

            function addActions(){
                //Recursively add items in order and avoid async issues
                let e = JSON.parse(actionItems[itemIndex])
                const {name} = e

                dbInstance.create_actions([name, sessionId, sub, clientId]).then(() => {
                    itemIndex++
                    if(itemIndex <= actionItems.length-1){
                        addActions()
                    }
                })
            }
            
            addActions()

            res.sendStatus(200) 
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

    deleteClient: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params

        dbInstance.delete_client([sub, id]).then(() => {
            res.sendStatus(200)
        })
        
    }

}