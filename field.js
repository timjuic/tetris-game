class Field {
   constructor(blockSize, height, width) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.blockSize = blockSize;
      this.canvas.height = blockSize * height;
      this.canvas.width = blockSize * width;
      this.fieldMap = [];
      for (let i = 0; i < height; i++) {
         this.fieldMap.push([]);
         for (let j = 0; j < width; j++) {
            this.fieldMap[i].push(0);
         }
      }
      console.log(this.fieldMap);
   }

   render(bgImage) {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.fieldMap.forEach((row, i) => {
         row.forEach((_, j) => {
            this.ctx.drawImage(bgImage, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
         })
      })
   }

   addShape(shape) {
      this.fieldMap
   }
}

export default Field;