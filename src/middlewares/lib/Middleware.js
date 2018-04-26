let nextMiddlewareId = 0;

module.exports = class Middleware {

    constructor(){
        this.id = nextMiddlewareId
        nextMiddlewareId++;

        this.name = `Unamed middleware #${this.id}`
        this.decription = `Please give a description to this Middleware`
    }

    async onAction(action){}

}