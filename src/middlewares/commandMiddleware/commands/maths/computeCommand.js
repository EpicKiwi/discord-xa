const Command = require("../Command")
const canvasUtils = require("./canvasUtils")
const mathCanvas = require("./mathCanvas")
const Discord = require("discord.js")
const maths = require("mathjs")

class ComputeCommand extends Command {

    static getName(){return "Compute"}
    static getDescription(){return "Calcule le resultat de l'equation donnée"}
    static getCommandName(){return "compute"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        if(this.args.length < 1) return this.action.reply("Aucune equation")

        let equationParsing = null
        let equationResult = null

        try {
            equationParsing = maths.parse(this.args.join(" "))
            equationResult = equationParsing.compile().eval()
        } catch(e){
            return this.action.reply("```!! Erreur d'équation : "+e.message+"```")
        }

        let textResult = `${equationParsing.toString()} = ${equationResult}`
        let equationResultTex = equationResult.toString().replace("Infinity","\\infty")

        let canvas = await mathCanvas.renderEquation(equationParsing.toTex()+" = "+equationResultTex)

        this.action.reply("```\n"+textResult+"```",
            new Discord.Attachment(
                canvas.toBuffer(),
                `resultat.png`))
    }

}

module.exports = ComputeCommand