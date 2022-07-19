import Game from './game.js'
import Field from './field.js'
import SHAPES from './shapes.js'
import Shape from './shape.js'

const game = new Game();

await game.loadSprites();
console.log(game.sprites);
console.log(game.field.fieldMap);

game.field.render(game.sprites[game.sprites.length - 1]) // Last image is background block image

let randomShapeMatrix = SHAPES[Math.floor(Math.random() * SHAPES.length)];
let randomImage = game.sprites[Math.floor(Math.random() * game.sprites.length - 1)];
let offsetX = (game.field.fieldMap - randomShapeMatrix[0].length) / 2;
let shape = new Shape(randomShapeMatrix, randomImage, offsetX);

game.field.addShape(shape);


game.fieldBgCanvas.width = game.field.canvas.width;
game.fieldBgCanvas.height = game.field.canvas.height;
game.fieldBgCtx.drawImage(game.field.canvas, 0, 0);