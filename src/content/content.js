import * as THREE from 'three';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

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

        this._contentLoader = new ContentLoader();

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
        const drive = new ContentLoader();
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
class ContentLoader{
    constructor(){
        this.initialize().createLoaders();
    }
    /**
     * @returns {ContentLoader}
     */
    initialize(){
        this._loaded = 0;
        this._collection = {};

        return this;
    }
    /**
     * @returns {ContentLoader}
     */
    createLoaders(){
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        this._gltfLoader = new GLTFLoader();
        this._gltfLoader.setDRACOLoader(dracoLoader);
        this._textureLoader = new THREE.TextureLoader();
        return this;
    }
    /**
     * @returns {GLTFLoader}
     */
    modelLoader(){
        return this._gltfLoader;
    }
    /**
     * @returns {THREE.TextureLoader}
     */
    textureLoader(){
        return this._textureLoader;
    }
    /**
     * @param {String} content 
     * @returns {String}
     */
    path( content = '' ){
        return content.length ? `static/contents/${content}` : '';
    }
    /**
     * @param {String} content 
     * @returns {String[]}
     */
    read( content = '' , filterTypes = '' ){
        const path = this.path(content);
        //get all filenames here
        this._collection[content] = [];

        //this._contents += this._assets[content].length;

        return this._collection;
    }
    /**
     * @returns {Number}
     */
    loadedContents(){
        return this._loaded;
    }
    /**
     * @returns {Number}
     */
    totalContents(){
        return Object.values( this._collection )
            .map( list => list.reduce( (a,b) => a+b , 0) )
            .reduce( (a,b) => a+b , 0);
    }
    /**
     * @returns {Number}
     */
    loadProgress(){
        return this.loadedContents() / this.totalContents();
    }
}

export {ContentManager,ContentLoader};