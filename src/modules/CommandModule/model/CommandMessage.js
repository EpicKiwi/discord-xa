const nearley = require("nearley")
const grammar = require("../grammar/commandGrammar")
const LiteralArgument = require("./argumentTypes/LiteralArgument")
const CodeArgument = require("./argumentTypes/CodeArgument")
const UserMentionArgument = require("./argumentTypes/UserMentionArgument")
const RoleMentionArgument = require("./argumentTypes/RoleMentionArgument")
const ChannelMentionArgument = require("./argumentTypes/ChannelMentionArgument")

class CommandMessage {

    constructor(rawCommandString,originalMessage){
        this.rawCommand = rawCommandString.trim()

        this.commandName = null;
        this.args = [];
        this.originalMessage = originalMessage;

        this.valid = false
        this.parse()
    }

    parse(){
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

        try {
        parser.feed(this.rawCommand)
        } catch(e) {
            this.errorMessage = e.message
            return;
        }

        if(!parser.results[0]){
            this.errorMessage = "La commande ne semble pas finie... Avez vous bien fermé toutes vos quotes ?"
            return;
        }

        let parsed = parser.results[0]

        this.commandName = parsed.command
        this.args = parsed.arguments.map((arg) => {
            switch(arg.type){
                case "code":
                    return CodeArgument.fromParsed(arg)
                case "user":
                    let userMentioned = this.originalMessage.mentions.members.get(arg.value)
                    return UserMentionArgument.fromParsed(arg,userMentioned)
                case "role":
                    let roleMentioned = this.originalMessage.mentions.roles.get(arg.value)
                    return RoleMentionArgument.fromParsed(arg,roleMentioned)
                case "channel":
                    let channelMentioned = this.originalMessage.mentions.channels.get(arg.value)
                    return ChannelMentionArgument.fromParsed(arg,channelMentioned)
                default:
                    return LiteralArgument.fromParsed(arg)
            }
        })

        this.valid = true
    }

    isValid(){
        return this.valid
    }

}

module.exports = CommandMessage