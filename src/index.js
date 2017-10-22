const logger = require("./logger")
const settings = require("./settings")
const bot = require("./bot")
const commandManager = require("./commandManager")
const xio = require("./xio/xio")

//The entry point of the application

logger.info("Loading settings")
settings.load()
logger.info("Loading bot")
bot.init()
logger.info("Loading commands")
commandManager.load();
logger.info("Loading xio")
xio.init()
logger.info("Logging-in discord")
bot.login(()=>{
    logger.info("Bot ready")
    xio.start(() => {
        logger.info("xio listening")
    })
})
