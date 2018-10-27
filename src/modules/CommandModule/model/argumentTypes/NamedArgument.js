module.exports = class NamedArgument {

    constructor(value){
        this.type = "switch";
        this.value = value;
    }

    static fromParsed(parsedArg){
        let newObj = new NamedArgument(parsedArg.value)
        return newObj;
    }

}