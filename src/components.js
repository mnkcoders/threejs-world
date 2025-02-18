import * as THREE from 'three';

/**
 * @class {GameComponent}
 */
class GameComponent{
    constructor(){
        this._values = {};
        this._tags = [];
    }
    /**
     * @returns {String[]}
     */
    tags(){
        return this._tags;
    }
    /**
     * @param {String} tag 
     * @returns {Boolean}
     */
    is( tag = '' ){
        return tag && this.tags().includes(tag);
    }
    /**
     * @param {String} tag 
     * @returns {GameComponent}
     */
    tag( tag = ''){
        if( !this.is(tag)){
            this._tags.push(tag);
        }
        return this;
    }
    /**
     * @param {String} tag 
     * @returns {GameComponent}
     */
    untag( tag = ''){
        if( this.is(tag)){
            this._tags = this._tags.filter( t => t !== tag );
        }
        return this;
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|String[]}
     */
    properties( list = false ){
        return list ? Object.keys(this._values ) : this._values;
    }
    /**
     * @param {String} name 
     * @returns {Number}
     */
    value( name = ''){
        return this.has(name) ? this._values[name] : 0;
    }
    /**
     * @param {String} name 
     * @param {Number} value 
     */
    set( name , value = 0){
        this._values[name] = value;
        return this;
    }
    /**
     * @param {String} name 
     * @param {Number} value 
     * @returns {GameComponent}
     */
    add( name , value = 1 , max = 0){
        return this.set( this.value(name) + value );
    }
    /**
     * @param {String} name 
     * @param {Number} value 
     * @returns {GameComponent}
     */
    sub( name , value = 1){
        return this.add( name , - value );
    }
    /**
     * @param {String} name 
     * @returns {Boolean}
     */
    has( name = '' ){
        return name && this.properties(true).includes(name);
    }
}
/**
 * @class {GameState}
 */
class GameState extends GameComponent{
    constructor(name){
        super();
        this._state = name || '';
    }
    /**
     * @returns {String}
     */
    toString(){
        return this.state();
    }
    /**
     * @returns {String}
     */
    state(){
        return this._state;
    }
    /**
     * @param {String} state 
     * @returns {Boolean}
     */
    isState( state = ''){
        return this.state() === state;
    }
}
/**
 * @returns {Object}
 */
GameState.CreateStates = function(){
    const states = {};
    Object.values(GameState.States)
        .map( state => new GameState(state))
        .forEach( state => states[state.name()] = state);
    return states;
}
/**
 * @type {GameState.States}
 */
GameState.States = {
    'Init':'init',
    'Loading': 'load',
    'Running': 'play',
    'Unloading': 'unload',
    'Finished': 'done',
};
/**
 * @class {GameLoop}
 */
class GameLoop{

    constructor(){
        this._gameTime = new THREE.Clock(false);
    }
    /**
     * @returns {THREE.Clock}
     */
    time(){
        return this._gameTime;
    }
    /**
     * @returns {Number}
     */
    elapsed(){
        return this.time().elapsedTime();
    }
    /**
     * @returns {Number}
     */
    delta(){
        return this.time().getDelta();
    }
    /**
     * @param {Function} callback 
     */
    update( callback ){
        if( this.running() ){
            callback( this.time().elapsedTime() , this.time().getDelta() );
            window.requestAnimationFrame( () => this.update( callback ) );    
        }
    }
    /**
     * @returns {GameLoop}
     */
    start( callback ){
        if( !this.running() && typeof callback === 'function' ){
            this.time().start();
            this.update( callback );    
        }
        return this;
    }
    /**
     * @returns {GameLoop}
     */
    stop(){
        if( this.running() ){
            this.time().stop();
        }
        return this;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this.time().running();
    }
}

/**
 * @class {Renderer}
 */
class Renderer{

    constructor(){
        this._display = document.querySelector('canvas.threejs');
        this._renderer = new THREE.WebGLRenderer({canvas:this._display});

        return this.initialize();
    }
    /**
     * 
     * @returns {Renderer}
     */
    initialize(){
        this._renderer.setSize(this.width(),this.height());
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
        return this;
    }
    /**
     * @returns {Element}
     */
    display(){
        return this._display;
    }
    /**
     * @returns {THREE.WebGLRenderer}
     */
    renderer(){
        return this._renderer;
    }
    /**
     * @returns {Number}
     */
    width(){
        return window.innerWidth;
    }
    /**
     * @returns {Number}
     */
    height(){
        return window.innerHeight;
    }
    /**
     * @returns {Number}
     */
    aspectRatio(){
        return this.width() / this.height();
    }
    /**
     * @returns {Renderer}
     */
    refresh(){
        this._renderer.setSize(this.width(),this.height());
        return  this;
    }
}
/**
 * @class {Camera}
 */
class Camera{
    constructor( type = Camera.ViewType.Free ){
        if( Camera.instance ){
            return Camera.instance;
        }
        Camera.instance = this.initialize( type );
    }
    /**
     * 
     * @param {Camera.ViewType} type 
     * @returns {Camera}
     */
    initialize( type ){
        this._viewType = type || Camera.ViewType.Free;
        this._near = 0.01;
        this._far = 10000;
        this._fieldOfView = 30;

        this._renderer = new Renderer();
        this._view = null;
        this._controls = null;

        return this.createView().attachControls().bind();
    }
    /**
     * @returns {Camera}
     */
    static instance(){
        return Camera.instance || new Camera();
    }
    /**
     * @param {Number} gameTime 
     * @param {Number} delta 
     * @returns {Camera}
     */
    update( gameTime = 0, delta = 0){
        if( this._controls){
            this._controls.update();
        }
    
        return this;
    }
    /**
     * @param {THREE.Scene} scene 
     * @returns {Camera}
     */
    draw( scene ){
        if( scene instanceof THREE.Scene){
            this.renderer().renderer().render(scene,this.view());
        }
        return this;
    }
    /**
     * @returns {Number}
     */
    FOV(){
        return this._fieldOfView;
    }
    /**
     * @returns {Number}
     */
    near(){
        return this._near;
    }
    /**
     * @returns {Number}
     */
    far(){
        return this._far;
    }
    /**
     * @returns {Renderer}
     */
    renderer(){
        return this._renderer;
    }
    /**
     * @returns {THREE.PerspectiveCamera}
     */
    view(){
        return this._view;
    }
    /**
     * @param {Camera.ViewType} viewType 
     * @returns {Camera}
     */
    setView( viewType = Camera.ViewType.Free ){
        if( this.type() !== viewType ){
            this._viewType = viewType;
        }
        return this;
    }
    /**
     * @returns {Camera}
     */
    createView(){
        if( this._view === null ){
            this._view = new THREE.PerspectiveCamera(
                this.FOV(),
                this.renderer().aspectRatio(),
                this.near(),
                this.far());    
        }
        return this;
    }
    /**
     * @returns {Camera}
     */
    attachControls(){
        //controls
        if( this._controls === null ){
            this._controls = new OrbitControls(this.view(),this.renderer().display());
            controls.enableDamping = true;
            controls.maxDistance = 100000;
            controls.minDistance = 30;    
        }
        return this;
    }
    /**
     * @returns {Camera}
     */
    refresh(){
        this.view().aspect = this.renderer().aspectRatio();
        this.view().updateProjectionMatrix();
        this.renderer().refresh();
        return this;
    }
    /**
     * @returns {Camera}
     */
    bind(){
        //resize
        window.addEventListener('resize',() => {
            Camera.instance().refresh();
        });  
        return this;
    }
    /**
     * @returns {Camera.ViewType}
     */
    type(){
        return this._viewType || Camera.ViewType.Undefined;
    }
}
/**
 * @type {Camera.ViewType}
 */
Camera.ViewType = {
    'Undefined':0,
    'Avatar':1,
    'RTS':2,
    'Free':3,
    'Orbit':4,
    'Debug':5,
};

/**
 * @class {InputManager}
 */
class InputManager{

    constructor(){
        if( this.instance ){
            return this.instance();
        }
        this.instance = this.initialize();
    }
    /**
     * @returns {InputManager}
     */
    initialize(){
        return this;
    }
    /**
     * @returns {InputManager}
     */
    static instance(){
        return this.instance || new InputManager();
    }
    /**
     * @param {Number} elapsed 
     * @param {Number} delta 
     */
    update( elapsed = 0, delta = 1 ){

        return this;
    }
}


export {GameComponent,GameState,GameLoop,Renderer,Camera,InputManager};