import * as THREE from 'three';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

/**
 * @class {ContentManager}
 */
class ContentManager {
    constructor() {
        if (this.__instance) {
            return this.__instance;
        }

        this.__instance = this.initialize();
    }
    /**
     * @returns {ContentManager}
     */
    static instance() {
        return this.__instance ? this.__instance : new ContentManager();
    }
    /**
     * @returns {ContentManager}
     */
    initialize() {
        this._contentLoader = new ContentLoader();
        this._contentProvider = ContentProvider.instance();
        this._contents = {};

        return this;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has(type = '') {
        return type.length && this._contents.hasOwnProperty(type);
    }
    /**
     * @param {Content} content 
     * @returns {ContentManager}
     */
    add(content) {
        if (content instanceof Content && content.valid()) {
            if (!this.has(content.type())) {
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
    contents(type = '') {
        if (type.length) {
            return this.has(type) ? this._contents[type] : [];
        }
        return Object.keys(this._contents);
    }
    /**
     * @returns {ContentManager}
     */
    loadContents() {

        this._contentLoader.types(true).forEach(type => this._contentLoader.listContents(type));

        this._contentLoader.loadContents(
            (content) => this.add(content),
            this.progress);

        this._contentLoader.loadTemplate('static/contents/world/gamedata.json');

        return this;
    }
    /**
     * @returns {ContentManager}
     */
    unloadContents() {

        this._contents = {};
        return this;
    }
    /**
     * @param {Number} count 
     * @param {Number} total 
     * @returns {ContentManager}
     */
    progress(count = 0, total = 0) {
        const progress = total > 0 ? Math.trunc(count / total * 100) : 0;
        console.log(`Progress: ${count} of ${total} (${progress} %)`);
        return this;
    }
}
/**
 * @type {ContentManager.Types}
 */
ContentManager.Types = {
    'Invalid': 'invalid',
    'Textures': 'texture',
    'Audio': 'audio',
    'Models': 'model',
    'Templates': 'template',
};
/**
 * @class {DriveManager}
 */
class ContentLoader {
    constructor() {
        this.initialize();
    }
    /**
     * @returns {ContentLoader}
     */
    initialize() {
        this._storage = {};
        this._total = 0;
        this._count = 0;
        this._service = new ContentService();
        this._gameData = null;

        return this;
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|String[]}
     */
    storage(list = false) {
        return list ? Object.keys(this._storage) : this._storage;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this._count === this._total && this._gameData !== null;
    }
    /**
     * @param {String} content 
     * @returns {ContentLoader}
     */
    listContents(content = '', filterTypes = '') {
        this._storage[content] = this.requestContent(content);
        this._total += this._storage[content].length;
        return this;
    }
    /**
     * @param {Function} registerCallback 
     * @param {Function} progressCallback
     * @returns {ContentLoader}
     */
    loadContents(registerCallback, progressCallback) {
        if (progressCallback) {
            progressCallback(this._count, this._total);
        }
        const contentMap = Content.contentMap();
        if (typeof registerCallback === 'function') {
            this.storage(true).forEach(type => {
                this.storage()[type].forEach(name => {
                    registerCallback(new Content(name, contentMap[type]));
                    this._count++;
                    if (progressCallback) {
                        progressCallback(this._count, this._total);
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
    requestContent(content = '') {
        return this._service.request(content);
    }
    /**
     * 
     * @param {String} path 
     * @returns {ContentLoader}
     */
    async loadTemplate(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load JSON: ${response.statusText}`);
            this._gameData = await response.json(); // Store data in local attribute
            console.log("Game Template Loaded:", this._gameData);
        }
        catch (error) {
            console.error(`Error loading game template from path: ${path} \n${error}`);
        }
        return this;
    }
    /**
     * @param {Boolean} list
     * @returns {Object}
     */
    types(list = false) {
        const types = {
            'models': 'model',
            'textures': 'texture',
            'templates': 'template',
            'audio': 'audio',
        };

        return list ? Object.keys(types) : types;
    }
}

/**
 * @class {ContentProvider}
 */
class ContentProvider {
    constructor() {
        if (this.__instance) {
            return this.__instance;
        }

        this.__instance = this.initialize();
    }
    /**
     * @returns {ContentProvider}
     */
    static instance() {
        return ContentProvider.__instance || new ContentProvider();
    }
    /**
     * @returns {ContentProvider}
     */
    initialize() {

        this.createGLTFLoader();
        this.createTextureLoader();
        this.createAudioLoader();

        return this;
    }
    /**
     * @returns {ContentLoader}
     */
    createGLTFLoader() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        this._gltfLoader = new GLTFLoader();
        this._gltfLoader.setDRACOLoader(dracoLoader);
        return this;
    }
    /**
     * @returns {ContentLoader}
     */
    createTextureLoader() {
        this._textureLoader = new THREE.TextureLoader();
        return this;
    }
    /**
     * @returns {ContentLoader}
     */
    createAudioLoader() {
        this._audioLoader = new THREE.AudioLoader();
        return this;
    }
    /**
     * @param {Content} asset 
     * @returns {AudioBuffer}
     */
    audio(asset = null) {
        return asset instanceof Content ?
            this._audioLoader.load(
                asset.name(true),
                asset.onLoad.bind(asset),
                asset.onProgress.bind(asset),
                asset.onError.bind(asset)
            ) : null;
    }
    /**
     * @param {Content} asset 
     * @returns {THREE.Texture}
     */
    texture(asset = null) {
        return asset instanceof Content ?
            this._textureLoader.load(
                asset.name(true),
                asset.onLoad.bind(asset),
                asset.onProgress.bind(asset),
                asset.onError.bind(asset)
            ) : null;
    }
    /**
     * 
     * @param {Content} asset 
     * @returns {*}
     */
    model(asset) {
        return asset instanceof Content ?
            this._gltfLoader.load(
                asset.name(true),
                asset.onLoad.bind(asset),
                asset.onProgress.bind(asset),
                asset.onError.bind(asset)
            ) : null;
    }
}


/**
 * @class {Asset}
 */
class Content {
    constructor(name = 'content', type = ContentManager.Types.Invalid) {
        this._type = type;
        this._name = name;

        this._buffer = null;
    }
    /**
     * @returns {String}
     */
    toString() {
        return `(${this.type()})${this.name()}`;
    }
    /**
     * @returns {Content|THREE.Texture}
     */
    load() {
        if (this.valid()) {
            switch (this.type()) {
                case ContentManager.Types.Models:
                    return ContentProvider.instance().model(this);
                case ContentManager.Types.Textures:
                    return ContentProvider.instance().texture(this);
                case ContentManager.Types.Audio:
                    return ContentProvider.instance().audio(this);
            }
        }
        return null;
    }
    onProgress(progress) {
        console.log(progress);
    }
    onError(error) {
        console.log(error, this.name(true));
    }
    onLoad(data) {
        console.log(data);
    }
    /**
     * @returns {String}
     */
    name(pathName = false) {
        return pathName ? this.type(true) + this._name : this._name;
    }
    /**
     * @param {Boolean} pathName 
     * @returns {String}
     */
    type(pathName = false) {
        return pathName ? `static/contents/${this.store()}/` : this._type;
    }
    /**
     * @returns {Boolean}
     */
    valid() {
        return this.type() !== ContentManager.Types.Invalid && this.exists();
    }
    /**
     * @returns {Boolean}
     */
    exists() {
        return true;
    }
    /**
     * @param {String} type 
     * @returns {String}
     */
    store() {
        const types = Object.values(Content.contentMap());
        return types.includes(this.type()) ? Content.contentMap(true)[types.indexOf(this.type())].toLowerCase() : '';
    }
    /**
     * @param {Boolean} list
     * @returns {Object}
     */
    static contentMap(list = false) {
        const map = {
            'models': 'model',
            'textures': 'texture',
            'templates': 'template',
            'audio': 'audio',
        };

        return list ? Object.keys(map) : map;
    }
}

/**
 * @class {ContentService}
 */
class ContentService {
    constructor() {

        return this.initialize();
    }
    /**
     * @returns {ContentService}
     */
    initialize() {
        this._contents = {
            'models': [

            ],
            'textures': [
                'dungeon_01.jpg',
                'dungeon_02.jpg',
            ],
            'templates': [
                'gameData'
            ],
            'audio': [
                'cricket_01.ogg',
                'cricket_02.ogg',
                'cricket_03.ogg',
            ],
        };
        return this;
    }
    /**
     * @param {Boolean} list 
     * @returns {String[]|Object}
     */
    content(list = false) {
        return list ? Object.keys(this._contents) : this._contents;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has(type = '') {
        return type && this._contents.hasOwnProperty(type);
    }
    /**
     * @param {String} type 
     * @returns {String[]}
     */
    request(type = '') {
        return this.has(type) ? this.content()[type] : [];
    }
}


export { ContentManager };