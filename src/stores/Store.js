const EventEmitter = require('events').EventEmitter;

class Store extends EventEmitter {

    constructor(){
        super();
        this.state = {};
        this.$$decorateStore();
    }

    $$decorateStore(){
        Object.getOwnPropertyNames(this.__proto__)
            .filter((el) => typeof this[el] == "function" && el != "constructor" && el.match(/^.+Action$/) && !this[el].$$decorated)
            .forEach((member) => {
                this[member] = this.$$decorateFunction(this[member],member)
            });
    }

    $$decorateFunction(fun,originalName){
        let name = originalName || fun.name;
        if(fun.$$decorated)
            return fun;

        let event = name;
        let func = fun.bind(this);

        let decorator = (...args) => {

            let emitEvent = (result) => {
                let emitedObject = {
                    action: name,
                    args: args,
                    result: result,
                    state: this.state
                };
                this.emit(event,emitedObject);
                this.emit("action",emitedObject)
            };

            let result = func(...args);

            if(result instanceof Promise){
                result.then(emitEvent)
            } else {
                emitEvent(result)
            }

            return result
        };

        decorator.event = event;
        decorator.originalFunction = func;
        decorator.$$decorated = true;

        return decorator;
    }

}

module.exports = Store;