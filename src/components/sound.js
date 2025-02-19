/**
 * @class {SoundManager}
 */
class SoundManager{

    constructor(){
        if( SoundManager.__instance){
            return SoundManager.__instance;
        }
        
        this.initialize();
        SoundManager.__instance = this;
    }
    /**
     * @returns {SoundManager}
     */
    static instance(){
        return SoundManager.__instance || new SoundManager();
    }
    /**
     * @returns {SoundManager}
     */

    initialize(){
        //class members here

        return this;
    }

    /**
     * @param {String} sound
     * @param {Number} pitch
     * @param {Number} balance
     * @param {Number} volume
     * @returns {SoundManager}
     */
    play( sound , pitch = 100, balance = 0, volume = 100){


        return this;
    }
}

export {SoundManager};