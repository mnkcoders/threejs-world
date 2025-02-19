import { Clock } from "three";
import { Display} from './display';
import { GameComponent } from "./component";
import { GameWorld } from "../world/world";
import { InputManager } from "./input";
import { ContentManager } from "../content/content";

/**
 * @class {Game}
 */
class Game{
    constructor(){
        if( Game.__instance ){
            return Game.__instance;
        }
        Game.__instance = this.initialize();
    }
    /**
     * @returns {Game}
     */
    static instance(){
        return Game.__instance || new Game();
    }
    /**
     * Initialize all game container and properties
     * @returns {Game}
     */
    initialize(){

        this._loop = new GameLoop();
        this._display = Display.instance();
        //this._content = ContentManager.instance();
        //this._world = new GameWorld();
        //this._world = new GameWorld();
        this._world = new GameWorld();

        this._state = '';
        this._states = GameState.CreateStates();
        this.setState(GameState.States.Init);

        return this;
    }
    /**
     * @returns {GameLoop}
     */
    gameLoop(){
        return this._loop;
    }
    /**
     * @returns {Display}
     */
    display(){
        return this._display;
    }
    /**
     * @returns {ContentManager}
     */
    content(){
        return ContentManager.instance();
    }


    /**
     * @returns {String|Object}
     */
    states( list = false ){
        return list ? Object.keys(this._states) : this._states;
    }
    /**
     * @returns {GameState}
     */
    state(){
        return this.states()[ this._state ];
    }
    /**
     * @param {Number} state 
     * @returns {Boolean}
     */
    isState( state = ''){
        return this.state().name() === state;
    }
    /**
     * @param {String} state 
     * @returns {GameState}
     */
    setState( state = '' ){
        if( this.states(true).includes(state) && this._state !== state ){
            this._state = state;
            this.debug(this.state().name());
        }
        return this.state();
    }
    /**
     * @returns {Game}
     */
    load(){
        if( this.isState( GameState.States.Init )){
            this.setState(GameState.States.Loading);

            const contentManager =this.content();

            contentManager.loadContents();



            this.debug(contentManager.contents()
                .map( type => contentManager.contents(type)
                    .map(asset => asset.name())));

            console.log(contentManager.contents());
            console.log(contentManager.contents('texture')[0].load());
            console.log(contentManager.contents('audio')[0].load());

            //set callback to prepare and render the world (running)
            this.setState(GameState.States.Ready);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    unload(){

        if( this.isState( GameState.States.Running ) ){

            this.setState(GameState.States.Unloading);
            this._content.unloadContents();

            //set callback to complete and quit the game
            //this.setState(GameState.State.Finished);
        }

        return this;
    }
    /**
     * @returns {Game}
     */
    play(){
        if( this.isState( GameState.States.Ready ) ){
            this.setState(GameState.States.Running);
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
        if( this.isState(GameState.States.Running)){
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

        //update game-state inputs
        this.state().update( gameTime , delta );

        //update game content collections
        // entities...
        // game states ...
        this._world.update(gameTime,delta);

        //update camera properties
        this._display.update(gameTime,delta);

        //this.debug( gameTime );
        
        return this;
    }
    /**
     * @returns {Game}
     */
    draw(){
        
        this._display.renderer(this._world.scene());

        return this;
    }
    /**
     * @returns {Game}
     */
    run(){
        this.load();

        this.play();

        return this;
    }
    /**
     * @param {*} message 
     */
    debug( message ){
        const date = new Date();
        console.log( `[ThreeWorld ${date.toDateString()}]` , message );
    }
}

/**
 * @class {GameState}
 */
class GameState extends GameComponent{
    constructor(name = GameState.States.Init ){
        super();
        this._state = name || '';
        //this.tag(name);
        this._inputs = InputManager.instance();
    }
    /**
     * @returns {String}
     */
    toString(){
        return this.name();
    }
    /**
     * @returns {String}
     */
    name(){
        return this._state;
    }
    /**
     * @returns {GameState}
     */
    update( gameTime = 0, delta = 0){
        this._inputs.update( gameTime , delta );
        return this;
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
    'Ready': 'ready',
    'Running': 'play',
    'Unloading': 'unload',
    'Finished': 'done',
};
/**
 * @class {GameLoop}
 */
class GameLoop{

    constructor(){
        this._gameTime = new Clock(false);
    }
    /**
     * @returns {Clock}
     */
    time(){
        return this._gameTime;
    }
    /**
     * @returns {Number}
     */
    elapsed(){
        return this.time().elapsedTime;
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
            callback( this.elapsed() , this.delta() );
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
        return this.time().running;
    }
}

export { Game };


