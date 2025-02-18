import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/**
 * @class {Renderer}
 */
class Renderer{

    constructor(){
        this._output = document.querySelector('canvas.threejs');
        this._renderer = new THREE.WebGLRenderer({canvas:this._output});

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
    output(){
        return this._output;
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
class Display{
    
    constructor( type = Display.Type.Free ){
        if( Display.__instance ){
            return Display.__instance;
        }
        Display.__instance = this.initialize( type );
    }
    /**
     * @returns {Display}
     */
    static instance(){
        return Display.__instance || new Display();
    }
    /**
     * @param {Display.ViewType} type 
     * @returns {Display}
     */
    initialize( type ){
        this._type = type || Display.Type.Free;
        this._near = 0.01;
        this._far = 10000;
        this._fieldOfView = 30;

        this._renderer = new Renderer();
        this._camera = null;
        this._controls = null;

        return this.createCamera().attachControls().bind();
    }
    /**
     * @param {Number} gameTime 
     * @param {Number} delta 
     * @returns {Display}
     */
    update( gameTime = 0, delta = 0){
        if( this._controls){
            this._controls.update();
        }
    
        return this;
    }
    /**
     * @param {THREE.Scene} scene 
     * @returns {Display}
     */
    draw( scene ){
        if( scene instanceof THREE.Scene){
            this.renderer().renderer().render(scene,this.camera());
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
    camera(){
        return this._camera;
    }
    /**
     * @param {Display.ViewType} viewType 
     * @returns {Display}
     */
    setView( viewType = Display.Type.Free ){
        if( this.type() !== viewType ){
            this._type = viewType;
        }
        return this;
    }
    /**
     * @returns {Display}
     */
    createCamera(){
        if( this._camera === null ){
            this._camera = new THREE.PerspectiveCamera(
                this.FOV(),
                this.renderer().aspectRatio(),
                this.near(),
                this.far());    
        }
        return this;
    }
    /**
     * @returns {Display}
     */
    attachControls(){
        //controls
        if( this._controls === null ){
            const controls = new OrbitControls(this.camera(),this.renderer().output());
            controls.enableDamping = true;
            controls.maxDistance = 100000;
            controls.minDistance = 30;    
            this._controls = controls;
        }
        return this;
    }
    /**
     * @returns {Display}
     */
    refresh(){
        this.camera().aspect = this.renderer().aspectRatio();
        this.camera().updateProjectionMatrix();
        this.renderer().refresh();
        return this;
    }
    /**
     * @returns {Display}
     */
    bind(){
        //resize
        window.addEventListener('resize',() => {
            Display.__instance().refresh();
        });  
        return this;
    }
    /**
     * @returns {Display.ViewType}
     */
    type(){
        return this._type || Display.Type.Undefined;
    }
}
/**
 * @type {Display.ViewType}
 */
Display.Type = {
    'Undefined':0,
    'Avatar':1,
    'RTS':2,
    'Free':3,
    'Orbit':4,
    'Debug':5,
};

export {Display,Renderer};
