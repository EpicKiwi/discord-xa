const ApiEndpoint = require("./ApiEndpoint")
const {Inject} = require("injection-js")
const {any,sComp} = require("../../core/queryOperators")

module.exports = class DatabaseEndpoint extends ApiEndpoint {

    static get database(){}

    static get url(){
        return `data/${this.database.name.toLowerCase()}/:key`
    }

    static get options(){
        return {
            read: true,
            write: false
        }
    }

    static get parameters(){
        return [new Inject(this.database),...ApiEndpoint.parameters]
    }

    constructor(...args){
        super(...args)
        this.db = args[0]
    }

    get options(){
        return this.constructor.options
    }

    get(req,res,next){
        if(!this.options.read){
            let err = new Error()
            err.message = `${this.constructor.database.name} doesn't allow read access`
            err.statusCode = 403
            return next(err)
        }
        if(!req.params.key){
            let err = new Error()
            err.message = `You must provide a key to request`
            err.statusCode = 400
            return next(err)
        }

        let serverDb = this.db.get(req.jwt.gld)

        let strings = req.params.key.split("*")
        let expressions = Array(strings.length-1).fill(sComp(any()))

        let values = serverDb.query(strings,...expressions).map((key) => {
            return {
                key,
                value: serverDb.get(key)
            }
        })

        let response = {
            resultNumber: values.length,
            results: values
        }

        res.send(response)
        return next()
    }

    opts(req,res,next){
        if(!this.options.list){
            let err = new Error()
            err.message = `${this.constructor.database.name} doesn't allow to list keys`
            err.statusCode = 403
            return next(err)
        }
        let serverDb = this.db.get(req.jwt.gld)

        let keys = Object.keys(serverDb.values)
        
        res.send({
            keyNumber: keys.length,
            availableKays:keys
        })

        return next()
    }

    post(req,res,next){
        if(!this.options.write){
            let err = new Error()
            err.message = `${this.constructor.database.name} doesn't allow write access`
            err.statusCode = 403
            return next(err)
        }

        return next()
    }

}