

module.exports = {

    lastId: -1,
    active: [],
    inactive: [],

    addWebhook(webhook){
        this.lastId++
        webhook.id = this.lastId
        this.active.push(webhook)
        return webhook
    },

    callMessage(message){
        let messageWebhooks = this.active.filter((el => el.type == "message" && el.channels.find(ch => ch.id == message.channel.id)))
        messageWebhooks.forEach(el => {
            el.call(message)
        })
    }

}