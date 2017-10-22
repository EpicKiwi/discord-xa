const bot = require("../../bot")
const map = require("../map")
const logger = require("../../logger")

module.exports = {

    get(req,res){
        let guild = bot.client.guilds.get(req.params.guildId)
        let fullChannels = guild.channels.map(map.smallChannel)
        res.json(fullChannels)
    },

    getOne(req,res){
        let guild = bot.client.guilds.get(req.params.guildId)
        let channel = guild.channels.get(req.params.id)
        channel.fetchMessages({limit: 20}).then(() =>{
            let fullChannel = map.fullChannel(channel)
            res.json(fullChannel)
        }).catch((e)=>{
            logger.error(e)
            res.status(500)
            res.json({error:"Internal server error"})
        })
    }

}