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
        .then((response) => {
            
            const {sessionId} = req.body.clientObj
            const {sub} = req.session.user
            var clientId = response[0].client_id
            var actionItems = response[0]["array_agg"][0]
            
            actionItems.forEach(e => {
                const {name} = JSON.parse(e)
                dbInstance.create_actions([name, sessionId, sub, clientId])
            })

            // for(let i = 0; i<actionItems.length; i++){
            //     const {name} = JSON.parse(actionItems[i])
            //     dbInstance.create_actions([name, sessionId, sub, clientId])
            // }
            

            res.sendStatus(200) 
        })
    }

}