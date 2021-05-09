const directions = [];
directions.push({ x: -1, y: 0, z: 1});
directions.push({ x: -1, y: 1, z: 0});
directions.push({ x: 0, y: -1, z: 1});
directions.push({ x: 0, y: 1, z: -1});
directions.push({ x: 1, y: -1, z: 0});
directions.push({ x: 1, y: 0, z: -1});

const map = {
  'x0 y0 z0': null
}

const stack = [{x: 0, y: 0, z: 0}];

for (let i = 1; i <= 3; i += 1) {
  let len = stack.length;
  for (let amount = 0; amount < len; amount += 1) {
      const cell = stack.splice(0, 1)[0];
      directions.forEach((dir) => {
        map[`x${dir.x + cell.x} y${dir.y + cell.y} z${dir.z + cell.z}`] = null;
        stack.push({x: dir.x + cell.x, y: dir.y + cell.y, z: dir.z + cell.z});
      });
  }
}