const Module = require("../../core/Module")
const StatsDatabase = require("./databases/StatsDatabase")
const {Inject} = require("injection-js")
const MessageInputStream = require("../CoreModule/MessageInputStream")
const {increment,avg} = require("../../core/operators")
const {filter} = require("rxjs/operators")
const dateFns = require("date-fns")
const {Client} = require("discord.js")
const StatsEndpoint = require("./endpoints/StatsEndpoint")
const StatsCommand = require("./commands/StatsCommand")
const StatsHelper = require("./StatsHelper")

const TICK_SIZE = 60000

module.exports = class StatsModule extends Module {

    static get moduleName(){
        return 'Stats module'
    }

    static get description(){
        return 'Module permettant l\'enregistrement de tout un tas de statistiques super interessantes'
    }

    static get provides(){
        return [
            StatsDatabase,
            StatsEndpoint,
            StatsCommand,
            StatsHelper
        ]
    }

    static get parameters(){
        return [
            new Inject(MessageInputStream),
            new Inject(StatsDatabase),
            new Inject(Client)
        ]
    }

    async init(){
        await this.statsDatabase.load();
        this.countMessage(this.messageInputStream.asObservable())
        this.countMentions(this.messageInputStream.asObservable())
        this.registerGeneralData()
        setTimeout(this.tick.bind(this),TICK_SIZE)
    }

    tick(){
        this.countPresence()
        this.processStats()
        setTimeout(this.tick.bind(this),TICK_SIZE)
    }

    getDateToken(){
        return dateFns.startOfHour(new Date()).getTime().toString();
    }

    setStat(db,keyPrefix,operator){
        db.operate(`${keyPrefix}:total`,operator)
        db.operate(`${keyPrefix}:${this.getDateToken()}`,operator)
    }

    countMessage(message$){
        message$.subscribe((message) => {
            let server = message.guild
            let channel = message.channel
            let user = message.author
            let serverDb = this.statsDatabase.get(server.id)

            this.setStat(serverDb,`server:message`,increment())
            this.setStat(serverDb,`channel:${channel.id}:message`,increment())
            this.setStat(serverDb,`user:${user.id}:message`,increment())
            this.setStat(serverDb,`user:${user.id}:message:channel:${channel.id}`,increment())
        })
    }

    countMentions(message$){
        message$.pipe(
            filter((message) => {
                let {mentions} = message

                return mentions.channels.size +
                    mentions.roles.size +
                    mentions.users.size > 0 || mentions.everyone
            })
        ).subscribe((message) => {

            let {mentions} = message

            let server = message.guild
            let channel = message.channel
            let user = message.author
            let serverDb = this.statsDatabase.get(server.id)

            let totalMention = mentions.channels.size +
            mentions.roles.size +
            mentions.users.size + (mentions.everyone ? 1 : 0)

            this.setStat(serverDb,`server:mention`,increment(totalMention))
            this.setStat(serverDb,`server:mention:channel`,increment(mentions.channels.size))
            this.setStat(serverDb,`server:mention:role`,increment(mentions.roles.size))
            this.setStat(serverDb,`server:mention:user`,increment(mentions.users.size))
            if(mentions.everyone){
                this.setStat(serverDb,`server:mention:everyone`,increment())
            }

            this.setStat(serverDb,`channel:${channel.id}:mention`,increment(totalMention))
            this.setStat(serverDb,`channel:${channel.id}:mention:channel`,increment(mentions.channels.size))
            this.setStat(serverDb,`channel:${channel.id}:mention:role`,increment(mentions.roles.size))
            this.setStat(serverDb,`channel:${channel.id}:mention:user`,increment(mentions.users.size))
            if(mentions.everyone){
                this.setStat(serverDb,`channel:${channel.id}:mention:everyone`,increment())
            }

            this.setStat(serverDb,`user:${user.id}:mention`,increment(totalMention))
            this.setStat(serverDb,`user:${user.id}:mention:channel`,increment(mentions.channels.size))
            this.setStat(serverDb,`user:${user.id}:mention:role`,increment(mentions.roles.size))
            this.setStat(serverDb,`user:${user.id}:mention:user`,increment(mentions.users.size))
            if(mentions.everyone){
                this.setStat(serverDb,`user:${user.id}:mention:everyone`,increment())
            }

            mentions.channels.tap((mChan) => {
                this.setStat(serverDb,`server:mention:channel:${mChan.id}`,increment())
                this.setStat(serverDb,`channel:${channel.id}:mention:channel:${mChan.id}`,increment())
                this.setStat(serverDb,`user:${user.id}:mention:channel:${mChan.id}`,increment())
            })

            mentions.roles.tap((mRole) => {
                this.setStat(serverDb,`server:mention:role:${mRole.id}`,increment())
                this.setStat(serverDb,`channel:${channel.id}:mention:role:${mRole.id}`,increment())
                this.setStat(serverDb,`user:${user.id}:mention:role:${mRole.id}`,increment())
            })

            mentions.users.tap((mUser) => {
                this.setStat(serverDb,`server:mention:user:${mUser.id}`,increment())
                this.setStat(serverDb,`channel:${channel.id}:mention:user:${mUser.id}`,increment())
                this.setStat(serverDb,`user:${user.id}:mention:user:${mUser.id}`,increment())
            })

        })
    }

    countPresence(){
        this.client.guilds.tap((guild) => {
            if(!guild.available)
                return
            
            let serverDb = this.statsDatabase.get(guild.id)

            guild.presences.tap((presence,key) => {
                this.setStat(serverDb,`user:${key}:presence:status:${presence.status}`,increment(TICK_SIZE))
                if(presence.game){
                    this.setStat(serverDb,`user:${key}:presence:game:${presence.game.name}`,increment(TICK_SIZE))
                }
            })
        })
    }

    processStats(){
        let gDb = this.statsDatabase.getGlobal()
        this.cpu = process.cpuUsage(this.cpu)
        let memory = process.memoryUsage()

        gDb.operate(`bot:up:${this.getDateToken()}`,increment(TICK_SIZE))
        gDb.operate(`bot:cpu:user:${this.getDateToken()}`,increment(this.cpu.user/1000))
        gDb.operate(`bot:cpu:system:${this.getDateToken()}`,increment(this.cpu.system/1000))
        gDb.operate(`bot:memory:rss:${this.getDateToken()}`,avg(memory.rss))
        gDb.operate(`bot:memory:heapTotal:${this.getDateToken()}`,avg(memory.heapTotal))
        gDb.operate(`bot:memory:heapUsed:${this.getDateToken()}`,avg(memory.heapUsed))
        gDb.operate(`bot:memory:external:${this.getDateToken()}`,avg(memory.external))

    }

    registerGeneralData(){
        let gDb = this.statsDatabase.getGlobal()
        gDb.set(`bot:pid`,process.pid)
        gDb.set(`bot:platform`,process.platform)
    }

}