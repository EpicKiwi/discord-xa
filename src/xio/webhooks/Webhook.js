const logger = require("../../logger")
const request = require("request")

module.exports = class Webhook {

    constructor(app,channels,callback){
        this.type = "basic"
        this.app = app
        this.callback = callback
        this.channels = channels
        this.id = -1
    }

    call(body,callback){
        request.post({
            uri: this.callback,
            json: true,
            body: body
        },(err,res,body)=>{
            if(err){
                if(callback)
                    callback(err)
                logger.warn(`Error while performing webhook to app '${this.app}' on '${this.callback}' : ${err}`)
                return;
            }
            logger.info(`Performed webhook to app '${this.app}' on '${this.callback}'`)
            if(callback)
                callback();
        })
    }

}