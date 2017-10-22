module.exports = {
    smallGuild(guild){
        return {
            name: guild.name,
            id: guild.id
        }
    },

    fullGuild(guild){
        return {
            name: guild.name,
                id: guild.id,
            channels: guild.channels.map(this.smallChannel),
            members: guild.members.map(this.smallMember),
        }
    },

    smallChannel(channel){
        return {
            name:channel.name,
            id:channel.id,
            type: channel.type
        }
    },

    fullChannel(channel){
        if(channel.type == "text") {
            return {
                name: channel.name,
                id: channel.id,
                type: channel.type,
                messages: channel.messages.last(20).map(this.smallMessage)
            }
        } else if(channel.type == "voice") {
            return {
                name: channel.name,
                id: channel.id,
                type: channel.type,
                members: channel.members.map(this.smallMember)
            }
        } else {
            return this.smallChannel(channel)
        }
    },

    smallMessage(message){
        return {
            id: message.id,
            content: message.content,
            author: module.exports.smallMember(message.author),
            date: message.createdAt
        }
    },

    fullMessage(message){
        return this.smallMessage(message)
    },

    smallMember(member){
        return {
            username: member.user ? member.user.username : member.username,
            nickname: member.nickname ? member.nickname : member.user ? member.user.username : member.username,
            id:member.id,
            mension: `${member}`
        }
    },

    smallWebhook(webhook){
        return {
            id: webhook.id,
            type: webhook.type,
            callback: webhook.callback,
            channels: webhook.channels.map(module.exports.smallChannel),
        }
    }
}