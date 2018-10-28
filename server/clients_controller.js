module.exports = {

    getclients: (req, res) => {
        const dbInstance = req.app.get('db')
        const {sub} = req.sesion.user;
        console.log(sub)
    }

}