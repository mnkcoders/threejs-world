import * as THREE from 'three';
/**
 * @class {ContentManager}
 */
class ContentManager{
    constructor(){
        if( this.instance ){
            return this.instance;
        }

        this.instance = this.initialize();
    }
    /**
     * @returns {ContentManager}
     */
    initialize(){
        //load
        this._assets = [];

        this._templates = {};
        this._sounds = {};
        this._models = {};
        this._textures = {};

        return this;
    }
    add( asset ){
        if( asset instanceof GameAsset && asset.valid() ){
            this._assets.push(asset);
        }
        return this;
    }
    /**
     * @returns {ContentManager}
     */
    loadContents(){
        const drive = new DriveManager();
        //load all assets here by type and folder (use a folder content loader)
        drive.read('models')
            .map( name => new GameAsset(name,GameAsset.Types.Model))
            .forEach( asset => ContentManager.instance().add(asset));
        drive.read('textures')
            .map( name => new GameAsset(name,GameAsset.Types.Texture))
            .forEach( asset => ContentManager.instance().add(asset));
        drive.read('sounds')
            .map( name => new GameAsset(name,GameAsset.Types.Sound))
            .forEach( asset => ContentManager.instance().add(asset));
        drive.read('templates')
            .map( name => new GameAsset(name,GameAsset.Types.Template))
            .forEach( asset => ContentManager.instance().add(asset));
        return this;
    }
    /**
     * @returns {String[]|Object}
     */
    templates( list = false ){
        return list ? Object.keys(this._templates) : this._templates;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    sounds( list = false ){
        return list ? Object.keys(this._sounds) : this._sounds;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    models( list = false ){
        return list ? Object.keys(this._models) : this._models;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    textures( list = false ){
        return list ? Object.keys(this._textures) : this._textures;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    sounds( list = false ){
        return list ? Object.keys(this._textures) : this._textures;
    }
    /**
     * @returns {ContentManager}
     */
    instance(){
        return this.instance ? this.instance : new ContentManager();
    }
}
/**
 * @class {DriveManager}
 */
class DriveManager{
    constructor(){

    }
    path( content = '' ){
        return content.length ? `static/contents/${content}` : '';
    }
    /**
     * @param {String} content 
     * @returns {String[]}
     */
    read( content = '' , filterTypes = '' ){
        const path = this.path(content);

        return [];
    }
}
/**
 * @class {Asset}
 */
class GameAsset{
    constructor( name = 'content', type = GameAsset.Types.Invalid ){
        this._type = type;
        this._name = name;
    }
    /**
     * @returns {GameAsset}
     */
    load(){
        if(this.valid()){
            switch(this.type()){
                default:
                    return null;
            }    
        }
        return null;
    }
    path(){
        switch(this.type()){
            case GameAsset.Types.Model:
                return `static/models/${this.name()}`;
            case GameAsset.Types.Sound:
                return `static/sounds/${this.name()}`;
            case GameAsset.Types.Texture:
                return `static/textures/${this.name()}`;
            case GameAsset.Types.Template:
                return `static/templates/${this.name()}`;
        }
        return '';
    }
    type(){
        return this._type;
    }
    name(){
        return this._name;
    }
    /**
     * @returns {Boolean}
     */
    valid(){
        return this.type() !== GameAsset.Types.Invalid;
    }
}
/**
 * @type {GameAsset.Types}
 */
GameAsset.Types = {
    'Invalid':'invalid',
    'Texture':'texture',
    'Sound':'sound',
    'Model':'model',
    'Template':'template',
};

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



