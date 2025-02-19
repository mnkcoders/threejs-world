import { SoundManager } from "../components/sound";

/**
 * @class {AudioTrack}
 */
class AudioTrack{

    constructor( music , ambient , emitters ){
        this._music = null;
        this._ambient = null;
        this._emitters = null;
    }
    /**
     * 
     * @returns {AudioTrack}
     */
    play(){

        return this;
    }
    /**
     * 
     * @returns {AudioTrack}
     */
    update( elapsed = 0 ){

        return this;
    }
}

/**
 * @class {SoundEmitter}
 */
class SoundEmitter{
    constructor(){
        this._sounds = [];
        this._pitch = 100;
        this._balance = 0;
        this._volume = 100;
    }
    /**
     * 
     * @param {Sound} sound 
     * @returns {SoundEmitter}
     */
    add( sound ){
        if( sound instanceof Sound ){
            this._sounds.push(sound);
        }
        return this;
    }

    play(){

        return this;
    }
}

/**
 * @class {Sound}
 */
class Sound{
    constructor( source ){
        //asset
        this._source = source && source instanceof Content || null;
    }
    play(){
        return this;
    }
}
/**
 * @class {BGMSound}
 */
class Music extends Sound{
    constructor(){
        super();
    }
}
/**
 * @class {AmbientSound}
 */
class AmbientSound extends Sound{
    constructor(){
        super();
    }
}



export {SoundManager,SoundEmitter,Sound,Music,AmbientSound};