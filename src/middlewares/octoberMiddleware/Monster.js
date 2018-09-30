const PlayerStore = require("../../stores/PlayerStore")
const Discord = require("discord.js")
const logger = require("../../logger")
const monsterQuotes = require("./monsterQuotes")

class Monster extends PlayerStore.PuppetPlayer {

    get excludedProperties(){
        return ['client','puppet','ready', 'guildMember']
    }

    constructor(puppet,serverId){
        super(puppet.id,serverId,"pending");
        this.client = new Discord.Client();
        this.puppet = puppet
        this.ready = false;
        this.type = "MONSTER";
        this.name = null;
        this.image = null;
        this.lastAttack = Date.now()
        this.strength = {
            min: 0,
            max: 0,
            critical: 0
        }
        this.speed = +Infinity;
    }

    get guild(){
        return this.client.guilds.get(this.server)
    }

    async init(){
        await this.client.login(this.puppet.token)
        await this.client.user.setPresence(
            { game: null, status: 'invisible' })
        this.user = this.client.user.id
        this.guildMember = this.client.guilds.get(this.server).members.get(this.user)
        this.ready = true
    }

    async appear(){
        await this.setMeta()
        await this.client.user.setPresence(
            { game: null, status: 'online' })
    }

    async setMeta(){
        if(!this.ready)
            return
        try {
            if (this.name && this.name != this.guildMember.nickname){
                await this.guildMember.setNickname(this.name)
            }
            if (this.image){
                await this.client.user.setAvatar(this.image)
            }
        } catch(e){
            logger.error(`Can't set puppet meta (retry in 5 minutes) : ${e.message}`)
            setTimeout(() => this.setMeta(), 300000)
        }
    }

    async attack(){
        let rdm = Math.random()
        let damages = 0
        let critical = false

        if(rdm > 0.9){
            critical = true
            damages = this.strength.critical
        } else {
            damages = Math.round(this.strength.min+((rdm*(this.strength.max-this.strength.min))/0.9))
        }

        return {
            critical,
            damages,
            quote: monsterQuotes.generate()
        }
    }

    getQuote(){
        return monsterQuotes.generate()
    }

    async disapear(){
        await this.client.user.setPresence({status: 'invisible' })
    }

    async destroy(){
        try {
            if (this.name){
                await this.guildMember.setNickname(null)
            }
            if (this.image){
                await this.client.user.setAvatar(null)
            }
        } catch(e) {
            logger.error(`Can't reset meta : ${e.message}`)
        }
        await this.client.user.setPresence({status: 'invisible' })
        await this.client.destroy()
    }

}

module.exports = Monster