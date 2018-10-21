const Loader = require("./core/Loader")
const Logger = require("./core/Logger")

async function start(){
    let botLoader = new Loader()
    await botLoader.loadAll()
    
    let botInjector = botLoader.createInjector()
    for(let mod of botLoader.modules){
        let instance = botInjector.get(mod)
        Logger.info(`Initializing ${mod.moduleName}`)
        await instance.init()
    }
    Logger.info("All modules initialized")
}

start()