const logger = require("./logger")
const settings = require("./settings")
const bot = require("./bot")
const commandManager = require("./commandManager")

logger.info("Loading settings")
settings.load()
logger.info("Loading bot")
bot.init()
logger.info("Loading commands")
commandManager.load();
logger.info("Logging-in discord")
bot.login(()=>{
	logger.info("Bot ready")
})