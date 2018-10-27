const _ = require("lodash")
const fs = require("fs")
const util = require("util")
const settings = require("../../settings")
const Logger = require("./Logger")
const path = require("path")
const glob = require("glob")

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
        this.persistDebounce = _.debounce(this.persist.bind(this),1000,{maxWait:60000})
    }

    get(key){
        if(this.values[key] === undefined){
            return this.defaults[key]
        }
        return this.values[key]
    }

    set(key,value){
        this.persistDebounce()
        return this.values[key] = value
    }

    async persist(){
        let dataDirectory = settings.dataDir;

        try{
            await pfs.stat(dataDirectory)
        } catch(e){
            Logger.info(`Created data folder in ${dataDirectory}`)
            await pfs.mkdir(dataDirectory)
        }

        let filename = `${this.databaseName}-${this.serverId}.json`
        await pfs.writeFile(path.join(dataDirectory,filename),JSON.stringify(this.values))
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