const glob = require("glob")
const util = require("util")
const Module = require("./Module")
const Stream = require("./Stream")
const path = require("path")
const { ReflectiveInjector, Injectable, Injector } = require('injection-js');
const Logger = require("./Logger")

const pglob = util.promisify(glob)

class Loader {

    constructor(){
        this.modules = []
    }

    async loadAll(){
        await this.loadModules()
    }

    async loadModules(){
        let modulesFiles = await pglob(__dirname+"/../modules/**/*Module.js")
        
        modulesFiles.forEach((moduleFile) => {
            let module = require(moduleFile)
            if(!(module.prototype instanceof Module)){
                return Logger.warn(`${path.basename(moduleFile)} no loaded, it's not a module class`)
            }
            this.modules.push(module)
            Logger.info(`${module.moduleName} loaded`)
        })
    }

    createInjector(){
        let AllServices = [...this.modules]
        
        this.modules.forEach((mod) => {
            let extra = mod.provides
            if(extra.length > 0){
                AllServices = [...AllServices,...extra]
            }
        })

        return ReflectiveInjector.resolveAndCreate(AllServices);
    }

}

module.exports = Loader;