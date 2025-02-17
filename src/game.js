import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/**
 * @class {Game}
 */
class Game{
    constructor(){
        if( Game.instance ){
            return Game.instance;
        }
        Game.instance = this.initialize();
    }
    /**
     * Initialize all game container and properties
     * @returns {Game}
     */
    initialize(){

        this._state = Game.State.Init;
        this._loop = new GameLoop();
        this._camera = Camera.instance();
        this._world = new GameWorld();

        return this;
    }
    /**
     * @returns {Game.State}
     */
    state(){
        return this._state;
    }
    /**
     * @param {Game.State} state 
     * @returns {Game.State}
     */
    setState( state ){
        if( this._state !== state ){
            this._state = state;
        }
        return this.state();
    }
    /**
     * @returns {Game}
     */
    load(){
        if( this.state() === Game.State.Init){
            this.setState(Game.State.Loading);

            //set callback to prepare and render the world (running)
            //this.setState(Game.State.Ready);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    unload(){

        if( this.state() === Game.State.Running){
            this.setState(Game.State.Unloading);

            //set callback to complete and quit the game
            //this.setState(Game.State.Finished);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    run(){
        if( this.state() === Game.State.Ready ){
            this._loop.start(( elapsed = 0 , delta = 0 ) => {
                this.update( elapsed , delta );
                this.draw();
            });    
        }
        return this;
    }
    /**
     * @returns {Game}
     */
    finalize(){
        if( this.state() === Game.State.Running){
            this._loop.stop();
            this.unload();    
        }
        return this;
    }
    /**
     * @param {Number} gameTime
     * @param {Number} delta
     * @returns {Game}
     */
    update( gameTime = 0 , delta =  0){

        //update inputs
        //InputManager ...

        //update game content collections
        // entities...
        // game states ...
        this._world.update(gameTime,delta);

        //update camera properties
        this._camera.update(gameTime,delta);
        
        return this;
    }
    /**
     * @returns {Game}
     */
    draw(){
        
        
        Camera.instance().renderer(this.scene());
        
        return this;
    }

    
    /**
     * @returns {Game}
     */
    static instance(){
        return Game.instance ? Game.instance : new Game();
    }
}
/**
 * @type {Game.State}
 */
Game.State = {
    'Init':'init',
    'Loading': 'loading',
    'Ready': 'ready',
    'Running': 'running',
    'Unloading': 'unloading',
    'Finished': 'finished',
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




export {Game};


