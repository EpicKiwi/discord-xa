const logger = require("./logger")
const settings = require("./settings")
const bot = require("./bot")

logger.info("Loading settings")
settings.load()
logger.info("Loading bot")
bot.init()
logger.info("Logging-in discord")
bot.login(()=>{
	logger.info("Bot ready")
})