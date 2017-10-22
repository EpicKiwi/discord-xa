const logger = require("../../logger")
const request = require("request")
const Webhook = require("./Webhook")
const map = require("../map")
const Command = require("../../Command")

module.exports = class WebhookCommand extends Command {

    constructor(name,webhook,doc,categoryDefault) {
        super(name, [])
        this.categoryDefault = !!categoryDefault
        this.description = {
            short: doc.short,
            params: doc.params,
            long: doc.long
        }
        this.webhook = webhook
    }


    execute(args, message) {
        this.webhook.call(message,)
    }
}
