const LiteralArgument = require("./LiteralArgument")

module.exports = class CodeArgument extends LiteralArgument {

    constructor(val){
        super(val)
        this.type = "code"
        this.language = null
    }

    static fromParsed(parsed){
        let newObj = new CodeArgument(parsed.value.content)
        newObj.value = parsed.value.content
        newObj.language = parsed.value.language
        return newObj
    }

}