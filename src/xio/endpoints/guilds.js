const bot = require("../../bot")
const map = require("../map")

module.exports = {

    get(req,res){
        let guildsSymplified = bot.client.guilds.map(map.smallGuild)
        res.json(guildsSymplified)
    },

    getOne(req,res){
        let guild = bot.client.guilds.get(req.params.id)
        let fullGuild = map.fullGuild(guild)
        res.json(fullGuild)
    }
}