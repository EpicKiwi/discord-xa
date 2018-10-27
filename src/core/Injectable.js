const camelcase = require("camelcase")

module.exports = class Injectable {
    constructor(...params){
        let parametersNames = this.constructor.parameters.map((el) => camelcase(el.token.name))
        params.forEach((inst,i) => {
            if(parametersNames[i]){
                this[parametersNames[i]] = inst
            }
        })
    }
}