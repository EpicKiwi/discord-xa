const settings = require("../../../settings")
const Logger = require("../../core/Logger")
const restify = require("restify")
const Injectable = require("../../core/Injectable")
const {Inject} = require("injection-js")
const jwt = require("jsonwebtoken")

const API_PREFIX = "/api"

module.exports = class HttpServer extends Injectable {
    
    constructor(...args){
        super(...args)
        this.server = restify.createServer()

        this.server.use(restify.plugins.queryParser());
        this.server.use(this.checkAuth.bind(this))

        this.server.get("/", (req,res,next) => {
            res.send("Hello world")
            return next()
        })
    }

    checkAuth(req,res,next){

        let {query} = req

        let key = null

        if(query.auth){
            key = query.auth
        } else if(req.header("Authorization")) {
            let splitted = req.header("Authorization").split(" ")
            if(splitted[0] == "jwt") {
                key = splitted[1]
            }
        }

        if(!key){
            let err = new Error()
            err.statusCode = 401
            err.message = "Authorization required in 'auth' query parameter or in 'Authorization' header"
            return next(err)
        }

        jwt.verify(key,settings.http.jwt.secret,(err,decoded) => {
            if(err){
                let erro = new Error()
                erro.statusCode = 401
                erro.message = `Auth error : ${err.message}`
                return next(erro)
            }

            req.jwt = decoded
            return next()
        })
    }

    listen(){return new Promise(resolve => {
        this.server.listen(settings.http.port,settings.http.address,() => {
            Logger.info(`Listening on ${settings.http.address}:${settings.http.port}`)
            return resolve()
        })
    })}

}