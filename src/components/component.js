

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



export {GameComponent};