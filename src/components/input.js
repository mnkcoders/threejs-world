

/**
 * @class {InputManager}
 */
class InputManager{

    constructor(){
        if( this.__instance ){
            return this.__instance;
        }
        this.__instance = this.initialize();
    }
    /**
     * @returns {InputManager}
     */
    static instance(){
        return this.__instance || new InputManager();
    }
    /**
     * @returns {InputManager}
     */
    initialize(){


        
        return this;
    }
    /**
     * @param {Number} elapsed 
     * @param {Number} delta 
     */
    update( elapsed = 0, delta = 1 ){

        return this;
    }
}


export {InputManager};