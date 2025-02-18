import * as THREE from 'three';
import { GameComponent } from '../components/component.js';
import {Entity} from '../content/entity.js';

/**
 * @class {GameWorld}
 */
class GameWorld extends GameComponent{

    constructor(){
        super();
        this._scene = new THREE.Scene();
        this._contents = [];
    }
    /**
     * @returns {Entity[]}
     */
    contents(){
        return this._contents;
    }
    /**
     * @param {Entity} content 
     * @returns {GameWorld}
     */
    addContent( content = null ){
        if( content instanceof Entity){
            this._contents.push(content);
            //add to scene too
            //this.scene().add();
        }
        return this;
    }
    /**
     * @param {Number} elapsed 
     * @param {Number} delta 
     * @returns {GameWorld}
     */
    update( elapsed = 0, delta = 0){

        this.contents().forEach( content => content.update( elapsed, delta ) );
        
        return this;
    }
    /**
     * @returns {THREE.Scene}
     */
    scene(){
        return this._scene;
    }
}

export {GameWorld};