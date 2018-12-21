module.exports = {
    putaction: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.session.user
        const {sessionId, actionItems} = req.body
        
        dbInstance.put_action([sub, sessionId, actionItems]).then( () => {
            res.sendStatus(200)
        })
    }
}