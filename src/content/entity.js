import { GameComponent } from '../components/component.js';

/**
 * @class {Entity}
 */
class Entity extends GameComponent{
    constructor(template){
        super();
        this._template = template;
    }
    /**
     * @param {Number} gameTime 
     * @param {Number} delta 
     * @returns {Entity} 
     */
    update( gameTime = 0 , delta = 0){
        return this;
    }
    width(){
        return 0;
    }
    height(){
        return 0;
    }
    x(){
        return 0;
    }
    y(){
        return 0;
    }
    /**
     * @returns {Template}
     */
    template(){
        return this._template;
    }
   /**
    * 
    * @returns {String}
    */
    name(){
        return this.template().name();
    }
}

/**
 * @class {Actor}
 */
class Actor extends Entity{
    constructor(){
        super();
    }
}

class Particle extends Entity{

}


export {Entity};



