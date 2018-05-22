const Command = require("./Command")
const notevil = require("notevil")

class PingCommand extends Command {

    static getName(){return "Exec"}
    static getDescription(){return "Execute un code Javascript et renvoie le resultat"}
    static getCommandName(){return "exec"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
        this.async = this.args.indexOf("async") > -1
        this.raw = this.args.indexOf("raw") > -1
        this.contextArgs = this.args.filter((el) => el != "async" && el != "raw")
    }

    async execute(){
        let match = this.action.message.content.match(/`(?:``([^\n]*)\n)?([^`]+)`(?:``)?/im)

        if(!match){
            this.action.reply("Aucun bloc de code dans la commande")
            return
        }

        let language = match[1]
        let code = match[2]

        let codeLines = code.split(/\r?\n/)
        if(codeLines.length == 1 && !codeLines.includes("return") && !codeLines.includes(";"))
            code = "return "+code

        let finalResult = ""
        let result = ""

        let context = {
            console: {
                log: (content) => {finalResult += this.parser(content)+"\n"},
                error: (content) => {finalResult += "!! Erreur : "+this.parser(content)+"\n"},
                info: (content) => {finalResult += this.parser(content)+"\n"}
            },
            request: require("request"),
            crypto: require("crypto"),
            stringDecoder: require("string_decoder"),
            timers: require("timers"),
            Math,
            Buffer,
            Promise,
            setTimeout,
            setInterval,
            JSON,
            args: this.contextArgs
        }

        let functionFactory = notevil.FunctionFactory(context)

        try {
            if(this.async){
                let fun = functionFactory("callback",code)
                fun((result) => {this.resolve(finalResult,result)})
            } else {
                result = functionFactory(code)()
            }
        } catch(e) {
            finalResult += `!! Erreur : ${e.message}\n`
        }

        if(!this.async){
            this.resolve(finalResult,result)
        }
    }

    resolve(consoleContent,result){
        if(result) {
            consoleContent += this.parser(result)
        }
        if(this.raw){
            return this.action.reply(consoleContent)
        } else {
            return this.action.reply("```json\n"+consoleContent+"```")
        }
    }

    parser(content){
        let message = ""

        if(typeof content == "object"){
            message = JSON.stringify(content,null,2)
        } else {
            message = content
        }

        return message
    }

}

module.exports = PingCommand