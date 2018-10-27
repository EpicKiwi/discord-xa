const LiteralArgument = require("./LiteralArgument")

module.exports = class ChannelMentionArgument extends LiteralArgument {

    constructor(val){
        super(val)
        this.type = "channel"
        this.mentioned = null
    }

    static fromParsed(val,mentioned){
        let newObj = new ChannelMentionArgument(mentioned.toString())
        newObj.channelid = val.value
        newObj.mentioned = mentioned
        return newObj
    }

}