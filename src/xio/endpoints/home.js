const bot = require("../../bot")
const map = require("../map")

module.exports = {

    get(req,res){
        let response = {
            protocol: "xio",
            date: new Date(),
            app: req.xio.appname,
            user: map.smallMember(bot.client.user)
        }

        res.json(response)
    }

}