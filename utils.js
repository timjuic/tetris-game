export default class Utils {
   static rotateMatrix(matrix) {
      return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
   }

   static generateMatrix(columns, rows) {
      let matrix = []
      for (let i = 0; i < columns; i++) {
         matrix.push([]);
         for (let j = 0; j < rows; j++) {
            matrix[i].push(0);
         }
      }
      return matrix;
   }

   static async loadSprites() {
      const spriteAmount = 8;
      let promises = []
      for (let i = 0; i < spriteAmount; i++){
         const imagePath = `./sprites/${i}.png`;
         let promise = new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(`Error while loading image ${i}`);
            image.src = imagePath;
         })
         promises.push(promise);
      }
      return await Promise.all(promises);
   }
}