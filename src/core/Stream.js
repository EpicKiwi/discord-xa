const {Subject} = require("rxjs")

/**
 * Represents a internal data stream
 */
class Stream extends Subject {

    /**
     * The class of the messages sent on the stream
     */
    static get messageClass(){
        throw new Error(`No message model defined`)
    }
    
    /**
     * Send a message on the stream according to the MessageClass model
     * Must be completely overwrite on children and 
     * send the message using the `next` function
     */
    send(){
        throw new Error("You must completely override the 'send' function")
    }

}

module.exports = Stream