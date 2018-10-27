const LiteralArgument = require("./LiteralArgument")

module.exports = class UserMentionArgument extends LiteralArgument {

    constructor(val){
        super(val)
        this.type = "user"
        this.mentioned = null
    }

    static fromParsed(val,mentioned){
        let newObj = new UserMentionArgument(val.value)
        newObj.mentioned = mentioned
        return newObj
    }

}