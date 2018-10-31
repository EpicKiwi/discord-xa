const Module = require("../../core/Module")
const {Inject} = require("injection-js")
const MessageInputStream = require("../CoreModule/MessageInputStream")
const {filter,map} = require("rxjs/operators")
const {Client} = require("discord.js")
const CommandMessage = require("./model/CommandMessage")
const {Injector} = require("injection-js")
const Command = require("./Command")
const PingCommand = require("./commands/PingCommand")
const Logger = require("../../core/Logger");
const MessageOutputStream = require("../CoreModule/MessageOutputStream")
const ReactionOutputStream = require("../CoreModule/ReactionOutputStream")

const COMMAND_DELIMITER = "$";

class CommandModule extends Module {

    static get moduleName(){
        return 'Command module'
    }

    static get description(){
        return 'Module permettant la prise en compte des commandes tapés dans le chat'
    }

    static get parameters(){
        return [
            new Inject(MessageInputStream),
            new Inject(Client),
            new Inject(Injector),
            new Inject(MessageOutputStream),
            new Inject(ReactionOutputStream)]
    }

    static get provides(){
        return [PingCommand]
    }

    constructor(...args){
        super(...args)
        this.commands = [];
    }

    async init(){
        this.onMessageInput(this.messageInputStream.asObservable())

        this.commands = this.injector._providers.reduce((acc,provider) => {
            let token = provider.key.token
            if(token.prototype instanceof Command){
                let obj = this.injector.get(token)
                Logger.info(`Loaded command ${token.name}`)
                return [...acc,obj];
            }
            return acc;
        },[])
    }

    onMessageInput(message$){
        message$.pipe(
            filter((message) => message.author.id != this.client.user.id),
            filter((message) => message.content.trim().startsWith(COMMAND_DELIMITER)),
            map((message) => {
                let commandString = message.content.slice(COMMAND_DELIMITER.length);
                let command = new CommandMessage(commandString,message)
                return command
            })
        ).subscribe((command) => this.executeCommand.bind(this)(command))
    }

    async executeCommand(commandMessage){

        let channel = commandMessage.originalMessage.channel

        if(!commandMessage.isValid()){
            return this.messageOutputStream.send(channel,`**Erreur** ${commandMessage.errorMessage}`)
        }

        let command = this.commands.find((el) => {
            return el.constructor.commandName.toLowerCase() == commandMessage.commandName.toLowerCase()
        })

        let result = 0;

        if(command){
            Logger.info(`Issued "${commandMessage.commandName}" command`)
            result = command.execute(commandMessage)
            if(result instanceof Promise)
                result = await result;
        } else {
            Logger.warn(`Command "${commandMessage.commandName}" not found`)
            this.messageOutputStream.send(channel,`**Erreur** La commande "${commandMessage.commandName}" n'existe pas`,
            {autoDestroy:8000})
            result = 404;
        }

        if(result){
            this.reactionOutputStream.send(commandMessage.originalMessage,'🔴')
        }
    }

}

module.exports = CommandModule