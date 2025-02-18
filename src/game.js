import * as THREE from 'three';
import { GameState,GameLoop,Camera,InputManager } from './components';
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

        this._loop = new GameLoop();
        this._camera = Camera.instance();
        this._world = new GameWorld();
        //this._scene = new THREE.Scene();

        this._gameStates = GameState.CreateStates();
        this._currentState = GameState.States.Init;
        this._inputs = InputManager.instance();

        return this;
    }
    /**
     * @returns {String|Object}
     */
    states( list = false ){
        return list ? Object.keys(this._gameStates) : this._gameStates;
    }
    /**
     * @returns {GameState}
     */
    state(){
        return this.states()[ this._currentState ];
    }
    /**
     * @param {String} state 
     * @returns {GameState}
     */
    setState( state = '' ){
        if( this.states().hasOwnProperty(state) && this._currentState !== state ){
            this._currentState = state;
        }
        return this.state();
    }
    /**
     * @returns {Game}
     */
    load(){
        if( this.state() === GameState.States.Init){
            this.setState(GameState.States.Loading);

            //set callback to prepare and render the world (running)
            //this.setState(GameState.State.Ready);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    unload(){

        if( this.state() === GameState.States.Running){
            this.setState(GameState.States.Unloading);

            //set callback to complete and quit the game
            //this.setState(GameState.State.Finished);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    run(){
        if( this.state() === GameState.States.Ready ){
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
        if( this.state() === GameState.States.Running){
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
        this._inputs.update( gameTime , delta );

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
        
        Camera.instance().renderer(this._world.scene());

        return this;
    }

    
    /**
     * @returns {Game}
     */
    static instance(){
        return Game.instance ? Game.instance : new Game();
    }
}




export {Game};


