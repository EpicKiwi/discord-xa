class ServerDatabase {
    constructor(databaseName,serverId,defaultValues){
        this.databaseName = databaseName
        this.serverId = serverId
        this.defaults = defaultValues
        this.values = {}
    }

    get(key){
        if(this.values[key] === undefined){
            return this.defaults[key]
        }
        return this.values[key]
    }

    set(key,value){
        return this.values[key] = value
    }
}

module.exports = class Database {

    static get defaultValues(){
        return {}
    }

    constructor(){
        this.servers = {}
    }

    get(serverId){
        if(!this.servers[serverId]){
            this.servers[serverId] = new ServerDatabase(
                this.constructor.name,
                serverId,
                this.constructor.defaultValues)
        }
        return this.servers[serverId]
    }

}