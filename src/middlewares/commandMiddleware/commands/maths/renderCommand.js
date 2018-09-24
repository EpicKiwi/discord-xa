const Command = require("../Command")
const canvasUtils = require("./canvasUtils")
const mathCanvas = require("./mathCanvas")
const Discord = require("discord.js")
const maths = require("mathjs")

class ComputeCommand extends Command {

    static getName(){return "Render math"}
    static getDescription(){return "Rend une équation mathématique LaTeX"}
    static getCommandName(){return "rendermath"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        if(this.args.length < 1) return this.action.reply("Aucune equation")

        let canvas = null

        try {
            canvas = await mathCanvas.renderEquation(this.args.join(" "))
        } catch(e){
            return this.action.reply("```!! Erreur de rendu : "+e.message+"```")
        }

        this.action.reply("",
            new Discord.Attachment(
                canvas.toBuffer(),
                `rendu.png`))
    }

}

module.exports = ComputeCommand