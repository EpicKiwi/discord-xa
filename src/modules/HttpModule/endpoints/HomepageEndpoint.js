const Endpoint = require("../Endpoint")

module.exports = class HomepageEndpoint extends Endpoint {

    static get url(){
        return '/'
    }

    get(req,res,next){
        res.send("Hello world")
        return next()
    }

}