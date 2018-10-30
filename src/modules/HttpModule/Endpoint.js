const Injectable = require("../../core/Injectable")
const HttpServer = require("./HttpServer")
const {Inject} = require("injection-js")
const Logger = require("../../core/Logger")

module.exports = class Endpoint extends Injectable {

    static get url(){
        throw new Error(`Please override 'url' static getter in your endpoints`)
    }

    get url(){
        return this.constructor.url
    }
    
    static get parameters(){
        return [new Inject(HttpServer)]
    }

    async init(){
        let verbs = ["get","post","head","put","opts"]
        verbs.forEach((verb) => {
            if(this[verb] && typeof this[verb] == "function"){
                Logger.log(`${verb.toUpperCase()} ${this.url}`)
                this.httpServer.server[verb](this.url,this[verb].bind(this))
            }
        })
    }

}