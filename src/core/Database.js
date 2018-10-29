const _ = require("lodash")
const fs = require("fs")
const util = require("util")
const settings = require("../../settings")
const Logger = require("./Logger")
const path = require("path")
const glob = require("glob")

const CREATED_KEY = "database:created";
const PERSISTED_KEY = "database:persisted";
const GLOBAL_NAME = "global";

const pfs = {
    mkdir: util.promisify(fs.mkdir),
    writeFile: util.promisify(fs.writeFile),
    stat: util.promisify(fs.stat),
    readFile: util.promisify(fs.readFile),
    glob: util.promisify(glob)
}

class ServerDatabase {
    constructor(databaseName,serverId,defaultValues){
        this.databaseName = databaseName
        this.serverId = serverId
        this.defaults = defaultValues
        this.values = {}
        this.values[CREATED_KEY] = Date.now()
        this.values[PERSISTED_KEY] = null
        this.persistDebounce = _.debounce(this.persist.bind(this),1000,{maxWait:60000})
    }

    get(key){
        if(this.values[key] === undefined){
            return this.defaults[key]
        }
        return this.values[key]
    }

    set(key,value,options){
        if(!(options && options.ignorePersist)){
            this.persistDebounce()
        }
        return this.values[key] = value
    }

    operate(key,operator){
        let currentValue = this.get(key)
        let newValue = operator(currentValue)
        this.set(key,newValue)
    }

    query(strings,...expressions){
        let keys = Object.keys(this.values)
        let matcher = this.matchKey(strings,...expressions)

        let foundKeys = keys.filter((key) => {
            return matcher(key)
        })

        return foundKeys
    }

    matchKey(strings,...expressions){return (key) => {

        return strings.reduce((acc,str,i) => {
            if(acc === false) return false;
            if(i == 0){
                return key.startsWith(str) ? str : false
            } else {
                let exp = expressions[i-1]
                if(typeof exp !== 'function'){
                    return key.startsWith(acc+exp+str) ? acc+exp+str : false
                } else {
                    let substr = key.substr(acc.length)

                    if(str != ""){
                        let nextPos = substr.indexOf(str)
                        if(nextPos == -1) return false
                        substr = substr.substr(0,nextPos)
                    }

                    return exp(substr) ? acc+substr+str : false
                }
            }
        },"")

    }}

    async persist(){
        this.set(PERSISTED_KEY,Date.now(),{ignorePersist:true})
        let dataDirectory = settings.dataDir;

        try{
            await pfs.stat(dataDirectory)
        } catch(e){
            Logger.info(`Created data folder in ${dataDirectory}`)
            await pfs.mkdir(dataDirectory)
        }

        let filename = `${this.databaseName}-${this.serverId}.json`
        await pfs.writeFile(path.join(dataDirectory,filename),JSON.stringify(this.values,null,4))
    }

    hydrate(values){
        Object.keys(values).forEach((key) => {
            this.values[key] = values[key]
        })
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
                this.databaseName,
                serverId,
                this.constructor.defaultValues)
        }
        return this.servers[serverId]
    }

    getGlobal(){
        return this.get(GLOBAL_NAME)
    }

    get databaseName(){
        return this.constructor.name
    }

    async load(){
        let globPath = path.join(settings.dataDir,`${this.databaseName}-*.json`)
        let files = await pfs.glob(globPath)
        for(let file of files){
            let serverId = path.basename(file,path.extname(file)).split("-")[1]
            let serverDb = new ServerDatabase(
                this.databaseName,
                serverId,
                this.constructor.defaultValues
            )
            serverDb.hydrate(JSON.parse(await pfs.readFile(file)));
            this.servers[serverId] = serverDb;
        }
    }

}

module.exports.keys = {
    CREATED_KEY,
    PERSISTED_KEY
}
module.exports.ServerDatabase = ServerDatabase
module.exports.operators = require("./operators")