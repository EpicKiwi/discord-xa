const Module = require("../../core/Module")
const HttpServer = require("./HttpServer")
const {Inject,Injector} = require("injection-js")
const GetAuthKeyCommand = require("./commands/GetAuthKeyCommand")
const Endpoint = require("./Endpoint")
const HomepageEndpoint = require("./endpoints/HomepageEndpoint")
const Logger = require("../../core/Logger")

module.exports = class HttpModule extends Module {

    static get moduleName(){
        return 'Http module'
    }

    static get description(){
        return 'Module permettant d\'exposer un serveur web'
    }

    static get provides(){
        return [
            HttpServer,
            GetAuthKeyCommand,
            HomepageEndpoint
        ]
    }

    static get parameters(){
        return [
            new Inject(HttpServer),
            new Inject(Injector)
        ]
    }

    async init(){

        for(let provider of this.injector._providers){
            let token = provider.key.token
            if(token.prototype instanceof Endpoint){
                let obj = this.injector.get(token)
                await this.httpServer.addEndpoint(obj)
                Logger.info(`Loaded endpoint ${token.name}`)
            }
        }

        await this.httpServer.listen()
    }

}