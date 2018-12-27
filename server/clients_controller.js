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
        const {name, date, location, list_id, session_name, session_color, client_email, actions, session_price, clientState, clientCountry} = req.body.clientInfo
         
        dbInstance
        .store_session([session_name, session_color, session_price, actions, sub, false]).then(response => {
            const {session_id} = response[0]
        
        dbInstance
        .add_client([sub, name, session_id, client_email, date, location, list_id, clientState, clientCountry])
        .then( client => res.status(200).send(client) )
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
        const {name, session_id, client_email, date, location, client_id, session_price, clientState, clientCountry, actions, list_id} = req.body.clientInfo
        
        dbInstance.update_client([sub, client_id, name, client_email, session_id, date, location, session_price, clientState, clientCountry, actions, list_id])
        .then(() => res.sendStatus(200) )
    },

    deleteClient: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {id} = req.params
        
        dbInstance.delete_client([sub, id]).then(() => {
            res.sendStatus(200)
        })
        
    },

    moveClients: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {deleteId, moveId} = req.body
        dbInstance.move_clients([sub, deleteId, moveId]).then(() => {
            res.sendStatus(200)
        })
    },

    clientComplete: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {clientId, check} = req.body
        
        dbInstance.complete_client([sub, clientId, check])
        .then( () => res.sendStatus(200) )
    }

}