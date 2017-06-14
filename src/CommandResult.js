
module.exports = class CommandResult {

    constructor(command,commandArgs,fullArgs){
        this.command = command;
        this.args = commandArgs;
        this.fullArgs = fullArgs;
    }

}