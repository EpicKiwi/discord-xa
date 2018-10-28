const settings = require("../../../settings")
const Logger = require("../../core/Logger")
const restify = require("restify")
const Injectable = require("../../core/Injectable")
const {Inject} = require("injection-js")
const jwt = require("jsonwebtoken")

const API_PREFIX = "/api"
const PROTECTED_URL = [API_PREFIX]

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

        this.server.get("/api", (req,res,next) => {
            res.send("Hello API")
            return next()
        })
    }

    checkAuth(req,res,next){
        let {query} = req
        let path = req.path()
        
        let requireAuth = PROTECTED_URL.find((el) => path.startsWith(el))
        if(!requireAuth){
            return next()
        }

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

    getAuthKey(guildId,userId,issuer,additionnal){return new Promise((resolve,reject) => {
        let payload = {
            gld: guildId,
            usr: userId,
            iat: Math.round(Date.now()/1000),
            exp: Math.round((Date.now()+settings.http.jwt.lifetime)/1000),
            iss: issuer
        }

        Object.assign(payload,additionnal)

        jwt.sign(payload,settings.http.jwt.secret,(err,key) => {
            if(err)
                return reject(err)
            resolve(key)
        })
    })}

    listen(){return new Promise(resolve => {
        this.server.listen(settings.http.port,settings.http.address,() => {
            Logger.info(`Listening on ${settings.http.address}:${settings.http.port}`)
            return resolve()
        })
    })}

}