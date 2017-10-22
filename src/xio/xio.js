const settings = require("../settings")
const express = require("express")
const logger = require("../logger")
const Webhook = require("./webhooks/Webhook")

module.exports = {

    /**
     * Express app
     */
    app: null,
    urlPrefix: "",
    webhooks: require("./webhooks/webhooks"),

    /**
     * Initialize the xio server
     */
    init(){

        this.urlPrefix = settings.xio["url-prefix"]

        this.app = express()
        this.app.use(`/${this.urlPrefix}`,this.xioInit)
        this.app.use(`/${this.urlPrefix}`,this.authenticationMiddleware)
        this.app.use(`/${this.urlPrefix}`,this.xioRequestLog)
        this.app.use(`/${this.urlPrefix}`,express.json())

        this.app.get(`/${this.urlPrefix}`,require("./endpoints/home").get)
        this.app.get(`/${this.urlPrefix}/guilds`,require("./endpoints/guilds").get)
        this.app.get(`/${this.urlPrefix}/guilds/:id`,require("./endpoints/guilds").getOne)
        this.app.get(`/${this.urlPrefix}/guilds/:guildId/channels`,require("./endpoints/channels").get)
        this.app.get(`/${this.urlPrefix}/guilds/:guildId/channels/:id`,require("./endpoints/channels").getOne)
        this.app.get(`/${this.urlPrefix}/guilds/:guildId/channels/:channelId/messages`,require("./endpoints/messages").get)
        this.app.post(`/${this.urlPrefix}/guilds/:guildId/channels/:channelId/messages`,require("./endpoints/messages").post)
        this.app.get(`/${this.urlPrefix}/guilds/:guildId/channels/:channelId/messages/:id`,require("./endpoints/messages").getOne)
        this.app.get(`/${this.urlPrefix}/webhooks`,require("./endpoints/webhooks").get)
        this.app.post(`/${this.urlPrefix}/webhooks`,require("./endpoints/webhooks").post)
        this.app.delete(`/${this.urlPrefix}/webhooks`,require("./endpoints/webhooks").delete)
    },

    xioInit: function (req,res,next) {
        res.type("json")
        req.xio = {}
        req.xio.authorized = false
        next();
    },

    authenticationMiddleware(req,res,next){
        let auth = req.get("x-xio-key")
        req.xio.key = auth;
        if(!auth){
            res.status(401)
            res.json({error:"You need to specify the key in the 'x-xio-key' header property"})
            return;
        }
        for(let key in settings.xio.apps){
            if(settings.xio.apps[key] == auth){
                req.xio.appname = key
                req.xio.authorized = true
                break;
            }
        }
        if(req.xio.authorized)
            next()
        else{
            res.status(401)
            res.json({error:"Your key doesn't allow you to use the xio API"})
            return;
        }
    },

    xioRequestLog: function (req,res,next) {
        logger.info(`xio request on '${req.originalUrl}' by app '${req.xio.appname}'`)
        next();
    },

    /**
     * Start the xio server
     */
    start(callback){
        this.app.listen(settings.xio.port,settings.xio.hostname,()=>{
            if(callback)
                callback(settings.xio.port,settings.xio.hostname)
        })
    }

}