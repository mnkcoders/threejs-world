//import './style.css'
import { Clock } from "three";
import { Game } from "./game";


const game = new Game();

const gameTime = new Clock();

const gameLoop = function(){

    game.update(gameTime.elapsedTime,gameTime.getDelta());

    game.draw();

    window.requestAnimationFrame(gameLoop);
};

gameLoop();



