const LiteralArgument = require("./LiteralArgument")

module.exports = class ChannelMentionArgument extends LiteralArgument {

    constructor(val){
        super(val)
        this.type = "channel"
        this.mentioned = null
    }

    static fromParsed(val,mentioned){
        let newObj = new ChannelMentionArgument(val.value)
        newObj.mentioned = mentioned
        return newObj
    }

}