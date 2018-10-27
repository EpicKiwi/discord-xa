module.exports = class SwitchArgument {

    constructor(value){
        this.type = "switch";
        this.value = value;
    }

    static fromParsed(parsedArg){
        let newObj = new SwitchArgument(parsedArg.value)
        return newObj;
    }

}