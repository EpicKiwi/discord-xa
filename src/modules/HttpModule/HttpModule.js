const Module = require("../../core/Module")
const HttpServer = require("./HttpServer")
const {Inject} = require("injection-js")
const GetAuthKeyCommand = require("./commands/GetAuthKeyCommand")

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
            GetAuthKeyCommand
        ]
    }

    static get parameters(){
        return [
            new Inject(HttpServer)
        ]
    }

    async init(){
        await this.httpServer.listen()
    }

}