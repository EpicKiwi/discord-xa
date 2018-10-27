module.exports = class LiteralArgument {

    constructor(value){
        this.type = "literal";
        this.value = value;
    }

    static fromParsed(parsedArg){
        let newObj = new LiteralArgument(parsedArg.value)
        return newObj;
    }

}