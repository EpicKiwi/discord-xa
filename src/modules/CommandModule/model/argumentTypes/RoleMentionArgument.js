const LiteralArgument = require("./LiteralArgument")

module.exports = class RoleMentionArgument extends LiteralArgument {

    constructor(val){
        super(val)
        this.type = "role"
        this.mentioned = null
    }

    static fromParsed(val,mentioned){
        let newObj = new RoleMentionArgument(val.value)
        newObj.mentioned = mentioned
        return newObj
    }

}