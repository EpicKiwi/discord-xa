const Endpoint = require("./Endpoint")

module.exports = class ApiEndpoint extends Endpoint {

    get url(){
        return `${this.httpServer.apiPrefix}/${super.url}`
    }

}