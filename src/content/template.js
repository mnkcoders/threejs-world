

/**
 * @class {Template}
 */
class Template{
    constructor(){
        this._name = '';
        this._users = 0;
    }
    /**
     * @returns {String}
     */
    toString(){
        return this.name();
    }
    /**
     * @returns {Boolean}
     */
    used(){
        return this._users > 0;
    }
    create(){
        this._users++;
        return null;
    }
    /**
     * @returns {Template}
     */
    drop(){
        if( this._users > 0 ){
            this._users--;
        }
        return this;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
}


class SoundTemplate extends Template{
    constructor(){

    }
}

class ModelTemplate extends Template{
    constructor(){
        
    }
}

class TextureTemplate extends Template{
    constructor(){
        
    }
}


export {Template,SoundTemplate,TextureTemplate,ModelTemplate};