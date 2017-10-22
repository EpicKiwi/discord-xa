const bot = require("../../bot")
const map = require("../map")
const webhooks = require("../webhooks/webhooks")
const logger = require("../../logger")
const MessageWebhook = require("../webhooks/MessageWebhook")

module.exports = {

    get(req,res){
        let response = {
            active: webhooks.active.filter(el => req.xio.appname == el.app).map(map.smallWebhook),
            inactive: webhooks.inactive.filter(el => req.xio.appname == el.app).map(map.smallWebhook)
        }
        res.json(response)
    },

    post(req,res){
        if(!req.body.callback || !req.body.channels || req.body.channels.length < 1 || !req.body.type ){
            req.status(400)
            res.json({error:"Field required : callback, channels, type"})
            return;
        }
        let channels = []
        let allguilds = bot.client.guilds.array()
        for(let guildI in allguilds){
            let guild = allguilds[guildI]
            let allchannels = guild.channels.array()
            for(let channelI in allchannels) {
                let channel = allchannels[channelI]
                if(req.body.channels.find(el => channel.id == el)){
                    channels.push(channel)
                }
            }
        }
        let response = {registered: false}
        switch(req.body.type){
            case "message" :
                let webhook = webhooks.addWebhook(new MessageWebhook(req.xio.appname,channels,req.body.callback))
                response.registered = true
                response.webhook = map.smallWebhook(webhook)
                break;
            default:
                req.status(400)
                response = {error:"This type of webhook is not allowed"}
                break;
        }
        res.json(response)
    },

    delete(req,res){
        webhooks.active = webhooks.active.filter((el => req.xio.appname != el.app))
        webhooks.inactive = webhooks.inactive.filter((el => req.xio.appname != el.app))
        module.exports.get(req,res)
    }

}