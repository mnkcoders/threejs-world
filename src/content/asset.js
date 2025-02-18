
/**
 * @class {Asset}
 */
export default class GameAsset{
    constructor( name = 'content', type = GameAsset.Types.Invalid ){
        this._type = type;
        this._name = name;
    }
    /**
     * @returns {GameAsset}
     */
    load(){
        if(this.valid()){
            switch(this.type()){
                default:
                    return null;
            }    
        }
        return null;
    }
    path(){
        switch(this.type()){
            case GameAsset.Types.Model:
                return `static/models/${this.name()}`;
            case GameAsset.Types.Sound:
                return `static/sounds/${this.name()}`;
            case GameAsset.Types.Texture:
                return `static/textures/${this.name()}`;
            case GameAsset.Types.Template:
                return `static/templates/${this.name()}`;
        }
        return '';
    }
    type(){
        return this._type;
    }
    name(){
        return this._name;
    }
    /**
     * @returns {Boolean}
     */
    valid(){
        return this.type() !== GameAsset.Types.Invalid;
    }
}


/**
 * @type {GameAsset.Types}
 */
GameAsset.Types = {
    'Invalid':'invalid',
    'Texture':'texture',
    'Sound':'sound',
    'Model':'model',
    'Template':'template',
};


