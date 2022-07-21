import Game from './game.js'
import CONTROLS from './controls.js'
import Utils from './Utils.js';


const sprites = await Utils.loadSprites();

const game = new Game(sprites);

window.addEventListener('keydown', function(e) {
   if (!game.board.currentShape.active || game.ended) return;
   if (e.code === CONTROLS.moveRight) game.board.moveShapeRight();
   if (e.code === CONTROLS.moveLeft) game.board.moveShapeLeft();
   if (e.code === CONTROLS.moveDown) game.board.moveShapeDown();
   if (e.code === CONTROLS.drop) game.board.dropShape();
   if (e.code === CONTROLS.rotate) game.board.rotateShape();
   if (e.code === CONTROLS.pause) {
      if (game.paused) game.start();
      else game.pause();
   }

   game.board.clearFilledRows();
   game.board.update();
})


game.board.renderBackground(game.sprites[0]) // First image is background block image

game.generateShape();

game.board.draw(game.sprites)

game.loop();