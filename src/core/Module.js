const Injectable = require("./Injectable")

/**
 * The base class for module definition
 */
class Module extends Injectable {

    /**
     * Represents the human-displayable name of the module
     * Must be completely override (no need to call super) and 
     * return the name of the module
     * @returns String
     */
    static get moduleName(){
        return 'Unamed module'
    }

    /**
     * Represents the description of the module
     * Must be completely override (no need to call super) and 
     * return a short description of the module
     * @returns String
     */
    static get description(){
        return 'Please provide a description for this module'
    }

    /**
     * Extra classes that the module provides to the DI System
     * @returns Class[]
     */
    static get provides(){
        return []
    }

    /**
     * Called once when the module is ready to be loaded
     * Can be completely overwrite (no need to call super) and
     * can return a promise for async operations.
     * @returns Promise
     */
    async init(){
    }

}

module.exports = Module