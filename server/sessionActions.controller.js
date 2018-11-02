module.exports = {
    putaction: (req, res) => {
        const dbInstance = req.app.get('db')
        const {id, status} = req.body
        
        dbInstance.put_action([status, id]).then( () => {
            res.sendStatus(200)
        })
    }
}