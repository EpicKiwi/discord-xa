const PlayerStore = require("../../stores/PlayerStore")
const Discord = require("discord.js")
const logger = require("../../logger")

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
        this.strength = {
            min: 0,
            max: 0,
            critical: 0
        }
        this.speed = 0;
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

    async destroy(){
        await this.client.user.setUsername(this.puppet.id)
        await this.client.user.setAvatar(null)
        await this.client.user.setPresence(
            { game: null, status: 'invisible' })
    }

}

module.exports = Monster