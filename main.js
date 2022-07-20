import Game from './game.js'
import Field from './field.js'
import SHAPES from './shapes.js'
import Shape from './shape.js'
import CONTROLS from './controls.js'

window.addEventListener('keydown', function(e) {
   // console.log(e.code);
   if (game.field.currentShape.active === false) return;
   if (e.code === CONTROLS.moveRight) game.field.moveShapeRight();
   if (e.code === CONTROLS.moveLeft) game.field.moveShapeLeft();
   if (e.code === CONTROLS.moveDown) game.field.moveShapeDown();
   if (e.code === CONTROLS.drop) game.field.dropShape();
   if (e.code === CONTROLS.rotate) game.field.rotateShape();

   game.loop(null, true);
})


const game = new Game();

await game.loadSprites();


game.field.renderBackground(game.sprites[0]) // First image is background block image

let randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
console.log(randomShapeIndex);
let randomShapeMatrix = SHAPES[randomShapeIndex];
let offsetX = Math.floor((game.field.fieldMap[0].length - randomShapeMatrix[0].length) / 2);




let shape = new Shape(randomShapeMatrix, randomShapeIndex + 1, offsetX);

game.field.addShape(shape);

game.field.draw(game.sprites)

game.loop();