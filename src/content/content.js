import * as THREE from 'three';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

/**
 * @class {ContentManager}
 */
class ContentManager{
    constructor(){
        if( this.__instance ){
            return this.__instance;
        }

        this.__instance = this.initialize();
    }
    /**
     * @returns {ContentManager}
     */
    static instance(){
        return this.__instance ? this.__instance : new ContentManager();
    }    
    /**
     * @returns {ContentManager}
     */
    initialize(){
        this._contentLoader = new ContentLoader();
        this._contentProvider = ContentProvider.instance();
        this._contents = {};

        return this;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has( type = '' ){
        return type.length && this._contents.hasOwnProperty(type);
    }
    /**
     * @param {Content} content 
     * @returns {ContentManager}
     */
    add( content ){
        if( content instanceof Content && content.valid() ){
            if( !this.has(content.type())){
                this._contents[content.type()] = [];
            }
            this._contents[content.type()].push(content);
        }
        return this;
    }
    /**
     * @param {String} type 
     * @returns {String[]|Content[]}
     */
    contents( type = ''){
        if( type.length ){
            return this.has(type) ? this._contents[type] : [];
        }
        return Object.keys(this._contents);
    }
    /**
     * @returns {ContentManager}
     */
    loadContents(){

        this._contentLoader.types(true).forEach( type => this._contentLoader.load(type));

        this._contentLoader.importContents(
             ( content ) => this.add(content) ,
             this.progress );

        return this;
    }
    /**
     * @returns {ContentManager}
     */
    unloadContents(){

        this._contents = {};
        return this;
    }
    /**
     * @param {Number} count 
     * @param {Number} total 
     * @returns {ContentManager}
     */
    progress( count = 0, total = 0){
        const progress = total > 0 ? Math.trunc(count / total  * 100 ) : 0;
        console.log( `Progress: ${count} of ${total} (${progress} %)`);
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
}
/**
 * @class {DriveManager}
 */
class ContentLoader{
    constructor(){
        this.initialize();
    }
    /**
     * @returns {ContentLoader}
     */
    initialize(){
        this._collection = {};
        this._total = 0;
        this._count = 0;
        this._service = new ContentService();

        return this;
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|String[]}
     */
    contents( list = false ){
        return list ? Object.keys(this._collection) : this._collection;
    }
    /**
     * @param {String} content 
     * @returns {ContentLoader}
     */
    load( content = '' , filterTypes = '' ){
        this._collection[content] = this.requestContent(content);
        this._total += this._collection[content].length;
        return this;
    }
    /**
     * @param {Function} registerCallback 
     * @param {Function} progressCallback
     * @returns {ContentLoader}
     */
    importContents( registerCallback , progressCallback ){
        if( progressCallback ){
            progressCallback(this._count , this._total);
        }
        const types = this.types();
        if( typeof registerCallback === 'function'){
            this.contents(true).forEach( type => {
                this.contents()[type].forEach( name => {
                    registerCallback(new Content(name,types[type]));
                    this._count++;
                    if( progressCallback ){
                        progressCallback(this._count , this._total);
                    }
                });
            });
        }
        return this;
    }
    /**
     * 
     * @param {String} content 
     * @returns {String[]}
     */
    requestContent( content = ''){
        return this._service.request( content );
    }
    /**
     * @param {Boolean} list
     * @returns {Object}
     */
    types( list = false ){
        const types = {
            'models' : 'model',
            'textures' : 'texture',
            'templates' : 'template',
            'sounds' : 'sound',        
        };

        return list ? Object.keys(types) : types;
    }
}

/**
 * @class {ContentProvider}
 */
class ContentProvider{
    constructor(){
        if( this.__instance){
            return this.__instance;
        }

        this.__instance = this.initialize();
    }
    /**
     * @returns {ContentProvider}
     */
    static instance(){
        return ContentProvider.__instance || new ContentProvider();
    }
    /**
     * @returns {ContentProvider}
     */
    initialize(){

        this.createGLTFLoader();
        this.createTextureLoader();
        
        return this;
    }
    /**
     * @returns {ContentLoader}
     */
    createGLTFLoader(){
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        this._gltfLoader = new GLTFLoader();
        this._gltfLoader.setDRACOLoader(dracoLoader);
        return this;
    }    
    /**
     * @returns {ContentLoader}
     */
    createTextureLoader(){
        this._textureLoader = new THREE.TextureLoader();
        return this;
    }

    texture( path ){
        
    }

    model( path ){
        this._gltfLoader.load(path,this.loadGLTF,this.progressGLTF,this.errorGLTF);
    }

    loadGLTF( data ){
        console.log(data);
    }
    progressGLTF(){

    }
    errorGLTF( error ){
        console.log(error)
    }

}


/**
 * @class {Asset}
 */
class Content{
    constructor( name = 'content', type = Content.Types.Invalid ){
        this._type = type;
        this._name = name;
    }
    /**
     * @returns {Content}
     */
    load( ){
        if(this.valid()){
            switch(this.type()){
                case Content.Types.Model:
                    return ContentProvider.instance().createGLTFLoader();
                default:
                    return null;
            }    
        }
        return null;
    }
    /**
     * @returns {String}
     */
    name( pathName = false ){
        return pathName ? this.type(true) + this._name : this._name ;
    }
    /**
     * @param {Boolean} pathName 
     * @returns {String}
     */
    type( pathName = false ){
        return pathName ? `static/${this._type}s/` : this._type;
    }
    /**
     * @returns {Boolean}
     */
    valid(){
        return this.type() !== Content.Types.Invalid && this.exists();
    }
    /**
     * @returns {Boolean}
     */
    exists(){
        return true;
    }
}
/**
 * @type {Content.Types}
 */
Content.Types = {
    'Invalid':'invalid',
    'Texture':'texture',
    'Sound':'sound',
    'Model':'model',
    'Template':'template',
};
/**
 * @class {ContentService}
 */
class ContentService{
    constructor(){
        
        return this.initialize();
    }
    /**
     * @returns {ContentService}
     */
    initialize(){
        this._contents = {
            'models':[

            ],
            'textures':[
                'dungeon_01.jpg',
                'dungeon_02.jpg',
            ],
            'templates':[
                'cricket'
            ],
            'sounds':[
                'cricket_01.wav',
                'cricket_02.wav',
                'cricket_03.wav',
            ],
        };
        return this;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    content( list = false){
        return list ? Object.keys(this._contents) : this._contents;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has( type = '' ){
        return type && this._contents.hasOwnProperty(type);
    }
    /**
     * @param {String} type 
     * @returns {String[]}
     */
    request( type = '' ){
        return this.has(type) ? this.content()[type] : [];
    }
}


export {ContentManager};