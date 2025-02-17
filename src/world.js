import * as THREE from 'three';
import {Template} from './content.js';

/**
 * @class {GameWorld}
 */
class GameWorld{
    constructor(){
        this._scene = new THREE.Scene();
        this._map = null;
        this._contents = [];
    }
    /**
     * @returns Array
     */
    contents(){
        return this._contents;
    }
    /**
     * @param {Number} elapsed 
     * @param {Number} delta 
     * @returns {GameWorld}
     */
    update( elapsed = 0, delta = 0){

        this.contents().forEach( content => content.update( delta ) );
        
        return this;
    }
    /**
     * @returns {THREE.Scene}
     */
    scene(){
        return this._scene;
    }
}
/**
 * @class {Entity}
 */
class Entity{
    constructor(template){
        this._template = template;
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
 * @param {Template} template 
 * @returns {Entity}
 */
Entity.create = function( template ){
    return template instanceof Template ? new Entity(template) : null;
};




export {GameWorld,Entity};