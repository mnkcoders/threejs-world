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

        this._scene = new THREE.Scene();
        this._gameTime = new THREE.Clock();
        this._gameState = Game.State.Init;

        return this;
    }
    /**
     * @returns {Game.State}
     */
    gameState(){
        return this._gameState;
    }
    /**
     * @returns {Game}
     */
    load(){
        return this;
    }
    /**
     * @returns {Game}
     */
    unload(){

        return this;
    }
    /**
     * @param {Number} gameTime
     * @param {Number} delta
     * @returns {Game}
     */
    update( gameTime = 0 , delta =  0){

        //update game content collections
        // entities...
        // game states ...

        //update inputs
        //InputManager ...

        //update camera view and render
        Camera.instance().update(gameTime,delta).renderer(this.scene());
        
        return this;
    }
    /**
     * @returns {Game}
     */
    draw(){

        return this;
    }
    /**
     * @returns {THREE.Scene}
     */
    scene(){
        return this._scene;
    }
    /**
     * @returns {THREE.Clock}
     */
    time(){
        return this._gameTime;
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
    'Main': 'main',
    'Settings': 'settings',
    'Running': 'running',
    'Finalizing': 'finalizing',
    'Finalize': 'finalize',
};


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

class ContentManager{

}

class InputManager{

}



export {Game,ContentManager,InputManager};


