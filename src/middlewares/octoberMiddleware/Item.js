const discordjs = require("discord.js")

const Type = {
    "UNKNOWN": "UNKNOWN",
    "MELEE": "MELEE",
    "LAUNCH": "LAUNCH",
    "WEAPON" : "WEAPON"
}

const TypeI18n = {
    "MELEE": "Arme de mélée",
    "LAUNCH": "Arme de lancé",
    "WEAPON": "Arme à distance"
}

class Item {

    constructor(name){
        this.name = name
        this.description = null
        this.type = Type.UNKNOWN
        this.minDamage = 0
        this.maxDamage = 0
        this.criticalDamage = 0
        this.lifetime = 1
        this.image = null
        this.dropChances = 0
    }

    toEmbed(){
        let embed = new discordjs.RichEmbed()

        embed.setTitle(this.name)

        if(this.image)
            embed.setThumbnail(this.image)

        if(this.description)
            embed.addField("Déscription",this.description,false)

        if(this.type && this.type != Type.UNKNOWN)
            embed.addField("Type",TypeI18n[this.type],true)

        let damage = ""

        if(this.minDamage == 0 || this.minDamage)
            damage += this.minDamage

        if(this.maxDamage && this.maxDamage > this.minDamage)
            damage += "-"+this.maxDamage

        if(this.criticalDamage && this.criticalDamage > this.maxDamage)
            damage += " ("+this.criticalDamage+")"

        if(damage != "")
            embed.addField("Dégats",damage,true)

        if(this.lifetime)
            embed.addField("Durée de vie",this.lifetime,true)

        if(this.dropChances)
            embed.addField("Rareté",this.dropChances,true)

        return embed
    }

    clone(){
        let clone = new Item(this.name)
        clone = Object.assign(clone,this)
        return clone
    }

    static fromJson(json){
        if(typeof json == "string"){
            json = JSON.parse(json)
        }

        let item = new Item(json.name)

        item.description = json.description || null
        item.type = Type[json.type] || Type.UNKNOWN
        item.minDamage = json.minDamage || 0
        item.maxDamage = json.maxDamage || item.minDamage
        item.criticalDamage = json.criticalDamage || item.maxDamage
        item.lifetime = json.lifetime || 1
        item.image = json.image || null
        item.dropChances = json.dropChances || 0

        return item
    }

    use(){
        if(this.lifetime < 1)
            throw new Error("Can't use a destroyed item")

        let rdm = Math.random()

        let damages = 0
        let critical = false

        if(rdm > 0.9){
            critical = true
            damages = this.criticalDamage
        } else {
            damages = Math.round(this.minDamage+((rdm*(this.maxDamage-this.minDamage))/0.9))
        }

        this.lifetime--

        return {
            critical,
            damages,
            destroyed: this.lifetime < 1
        }
    }

}

Item.Type = Type

module.exports = Item