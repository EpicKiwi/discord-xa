const bot = require("../../bot")
const map = require("../map")
const logger = require("../../logger")

module.exports = {
    get(req,res){
        let guild = bot.client.guilds.get(req.params.guildId)
        let channel = guild.channels.get(req.params.channelId)
        channel.fetchMessages({limit: 20}).then(() =>{
            let lastMessages = channel.messages.last(50).map(map.smallMessage);
            res.json(lastMessages)
        }).catch((e)=>{
            logger.error(e)
            res.status(500)
            res.json({error:"Internal server error"})
        })
    },

    getOne(req,res){
        let guild = bot.client.guilds.get(req.params.guildId)
        let channel = guild.channels.get(req.params.channelId)
        channel.fetchMessage(req.params.id).then(message =>{
            let fetchedMessage = map.smallMessage(message);
            res.json(fetchedMessage)
        }).catch((e)=>{
            logger.error(e)
            res.status(500)
            res.json({error:"Internal server error"})
        })
    },

    post(req,res){
        let guild = bot.client.guilds.get(req.params.guildId)
        let channel = guild.channels.get(req.params.channelId)
        let message = req.body
        if(!message || !message.content){
            req.status(400)
            req.json({error:"Message must contain a content"})
            return;
        }
        channel.send(message.content).then(message=>{
            logger.info(`sended message '${message.content}' via xio from app '${req.xio.appname}'`)
            res.json({
                sended: true,
                message: map.fullMessage(message),
            })
        }).catch(e=>{
            logger.error(e)
            res.json({
                sended: false,
                message: message,
                error: "Internale server error"
            })
        })
    }
}