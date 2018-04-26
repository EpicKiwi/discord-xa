const logger = require("./logger")
const settings = require("./settings")

//The entry point of the application

logger.info("Loading settings")
settings.load()
logger.info("Loading bot")
const bot = require("./bot")
logger.info("Logging-in discord")
bot.login().then(()=> logger.info("Bot ready"))
