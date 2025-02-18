import { GameWorld } from './world';
/**
 * @class {DungeonWorld}
 */
class DungeonWorld extends GameWorld{

    constructor(){
        super();

        this._map = new DungeonMap();
    }

}
/**
 * @class {DungeonMap}
 */
class DungeonMap{
    constructor(){
        this._tileSet = new TileSet();
        this._tiles = [];
        this._width = 128;
        this._height = 128;
    }
    witdh(){
        return this._width;
    }
    height(){
        return this._height;
    }
    tileSet(){
        return this._tileSet;
    }
    tiles(){
        return this._tiles;
    }
    /**
     * @param {Number} index 
     * @returns {TileType}
     */
    tile( index = 0 , getIndex = false ){
        return getIndex ? this.tileSet()[this.tiles()[index]] : this.tiles()[index];
    }
    width(){
        return this._width;
    }
    height(){
        return this._height;
    }
    set( x , y , tileId = 0 ){
        if( this.tileSet().contains(tileId) ){
            const index = y * this.width() + x;
            this.tiles()[index] = tileId;
            this.refresh(index);
        }
        return this;
    }
    get( x , y ){
        const index = y * this.width() + x;
        return this.tiles()[index];
    }
    refresh( tileId ){
        return this;
    }
}

/**
 * 
 */
class TileSet{
    constructor(){
        this._tileTypes = [];
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|TileType[]}
     */
    tiles( list = false ){
        return list ? Object.values(this._tileTypes) : this._tileTypes;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has( type = ''){
        return type && this.tiles().hasOwnProperty(type);
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.tiles(true).length;
    }
    /**
     * @param {Number} tileId 
     * @returns {Boolean}
     */
    contains( tileId = 0){
        return tileId < this.count();
    }
    /**
     * @param {TileType} tileType 
     * @returns {TileSet}
     */
    add( tileType ){
        if( tileType instanceof TileType && this.count() < TileSet.MAX_TILES && !this.has(tileType.name()) ){
            this._tileTypes[tileType.name()] = tileType;
        }
        return this;
    }
}
/**
 * @type {Number}
 */
TileSet.MAX_TILES = 255;
/**
 * 
 */
class TileType{
    constructor( name = 'tile' ){
        this._name = name;
        this._material = null;
    }
    name(){
        return this._name;
    }
}

class Tile{
    constructor( type = 0, density = 1){
        this._density = 1;
    }
    north(){

    }
    south(){
        
    }
    east(){
        
    }
    west(){

    }
}


export {DungeonWorld,TileType,TileSet,Tile};