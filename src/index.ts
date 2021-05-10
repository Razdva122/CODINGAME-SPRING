declare function readline(): string;

type TNeighbors = [number, number, number, number, number, number];

class Cell {
  index: number;
  richness: number;
  neighbors: TNeighbors;

  constructor(index: number, richness: number, neighbors: TNeighbors) {
    this.index = index;
    this.richness = richness;
    this.neighbors = neighbors;
  }
}

class Tree {
  cellIndex: number;
  size: number;
  isMine: boolean;
  isDormant: boolean;

  constructor(cellIndex: number, size: number, isMine: boolean, isDormant: boolean) {
    this.cellIndex = cellIndex;
    this.size = size;
    this.isMine = isMine;
    this.isDormant = isDormant;
  }
}

const WAIT = 'WAIT' as const;
const SEED = 'SEED' as const;
const GROW = 'GROW' as const;
const COMPLETE = 'COMPLETE' as const;

type TActions = 'WAIT' | 'SEED' | 'GROW' | 'COMPLETE';

class AbstractAction {
  type: TActions;
  targetCellIdx: number;

  toString() {
    return `${this.type} ${this.targetCellIdx}`;
  }
}

class SeedAction extends AbstractAction {
  type = SEED;
  targetCellIdx: number;
  sourceCellIdx: number;

  constructor(targetCellIdx: number, sourceCellIdx: number) {
    super();
    this.targetCellIdx = targetCellIdx;
    this.sourceCellIdx = sourceCellIdx;
  }

  toString() {
    return `${SEED} ${this.sourceCellIdx} ${this.targetCellIdx}`;
  }
}

class GrowAction extends AbstractAction {
  type = GROW;
  targetCellIdx: number;

  constructor(targetCellIdx: number) {
    super();
    this.targetCellIdx = targetCellIdx;
  }
}

class CompleteAction extends AbstractAction {
  type = COMPLETE;
  targetCellIdx: number;

  constructor(targetCellIdx: number) {
    super();
    this.targetCellIdx = targetCellIdx;
  }
}

class Action {
  type: TActions;
  targetCellIdx?: number;
  sourceCellIdx?: number;

  constructor(type: TActions, targetCellIdx?: number, sourceCellIdx?: number) {
    this.type = type;
    this.targetCellIdx = targetCellIdx;
    this.sourceCellIdx = sourceCellIdx;
  }

  static parse(line): Action {
    const parts = line.split(' ');
    if (parts[0] === WAIT) {
      return new Action(WAIT);
    }
    if (parts[0] === SEED) {
      return new Action(SEED, parseInt(parts[2]), parseInt(parts[1]));
    }
    return new Action(parts[0], parseInt(parts[1]));
  }

  toString() {
    if (this.type === WAIT) {
      return WAIT;
    }
    if (this.type === SEED) {
      return `${SEED} ${this.sourceCellIdx} ${this.targetCellIdx}`;
    }
    return `${this.type} ${this.targetCellIdx}`;
  }
}


class Game {
  cellsMap = {
    25: { index: 25, x: 0, y: 3, z: -3},
    24: { index: 24, x: 1, y: 2, z: -3},
    23: { index: 23, x: 2, y: 1, z: -3},
    22: { index: 22, x: 3, y: 0, z: -3},
    26: { index: 26, x: -1, y: 3, z: -2},
    11: { index: 11, x: 0, y: 2, z: -2},
    10: { index: 10, x: 1, y: 1, z: -2},
    9:  { index: 9, x: 2, y: 0, z: -2},
    21: { index: 21, x: 3, y: -1, z: -2},
    27: { index: 27, x: -2, y: 3, z: -1},
    12: { index: 12, x: -1, y: 2, z: -1},
    3:  { index: 3, x: 0, y: 1, z: -1},
    2:  { index: 2, x: 1, y: 0, z: -1},
    8:  { index: 8, x: 2, y: -1, z: -1},
    20: { index: 20, x: 3, y: -2, z: -1},
    28: { index: 28, x: -3, y: 3, z: 0},
    13: { index: 13, x: -2, y: 2, z: 0},
    4:  { index: 4, x: -1, y: 1, z: 0},
    0:  { index: 0, x: 0, y: 0, z: 0},
    1:  { index: 1, x: 1, y: -1, z: 0},
    7:  { index: 7, x: 2, y: -2, z: 0},
    19: { index: 19, x: 3, y: -3, z: 0},
    29: { index: 29, x: -3, y: 2, z: 1},
    14: { index: 14, x: -2, y: 1, z: 1},
    5:  { index: 5, x: -1, y: 0, z: 1},
    6:  { index: 6, x: 0, y: -1, z: 1},
    18: { index: 18, x: 1, y: -2, z: 1},
    36: { index: 36, x: 2, y: -3, z: 1},
    30: { index: 30, x: -3, y: 1, z: 2},
    15: { index: 15, x: -2, y: 0, z: 2},
    16: { index: 16, x: -1, y: -1, z: 2},
    17: { index: 17, x: 0, y: -2, z: 2},
    35: { index: 35, x: 1, y: -3, z: 2},
    31: { index: 31, x: -3, y: 0, z: 3},
    32: { index: 32, x: -2, y: -1, z: 3},
    33: { index: 33, x: -1, y: -2, z: 3},
    34: { index: 34, x: 0, y: -3, z: 3},
  };
  cycles = [
    {
      start: [25,26,27,28,29,30,31],
      diff: {
        x: 1,
        y: -1,
        z: 0,
      }
    },
    {
      start: [28,29,30,31,32,33,34],
      diff: {
        x: 1,
        y: 0,
        z: -1,
      }
    },
    {
      start: [31,32,33,34,35,36,19],
      diff: {
        x: 0,
        y: 1,
        z: -1,
      }
    },
    {
      start: [34,35,36,19,20,21,22],
      diff: {
        x: -1,
        y: 1,
        z: 0,
      }
    },
    {
      start: [19,20,21,22,23,24,25],
      diff: {
        x: -1,
        y: 0,
        z: 1,
      }
    },
    {
      start: [22,23,24,25,26,27,28],
      diff: {
        x: 0,
        y: -1,
        z: 1,
      }
    },
  ];
  day = 0;
  lastDay = 23;
  round = 0;
  nutrients = 0;
  cells: Cell[] = [];
  possibleActions: Action[] = [];
  trees: Tree[] = [];
  mySun = 0;
  myScore = 0;
  opponentSun = 0;
  opponentScore = 0;
  opponentIsWaiting = false;

  getNextAction(): string {
    const myTrees = this.trees.filter((el) => el.isMine);

    const waitActions = [{
      toString() {
        return 'WAIT';
      }
    }] as Action[];

    const growActions =
        this.possibleActions
            .filter((el) => el.type === GROW)
            .sort((a, b) => {
                const aTree = this.trees.find((el) => el.cellIndex === a.targetCellIdx);
                const bTree = this.trees.find((el) => el.cellIndex === b.targetCellIdx);

                return bTree.size - aTree.size;
            });

    const seedActions = this.generateSeedActions();

    if (this.mySun < 5) {
      seedActions.length = 0;
    }

    const completeActions = this.generateCompleteActions();

    /*
     * 1. [grow, seed, wait]
     * 2. [grow, seed, wait]
     * 3. [grow, seed, complete, wait]
     * 4. [complete, grow, wait]
     */
    const actions = [
      [growActions, seedActions, waitActions], 
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, seedActions, waitActions],
      [growActions, waitActions],
      [completeActions, growActions, waitActions],
    ];
    
    const currentCycle = actions[Math.floor((this.day / (this.lastDay + 1)) * actions.length)];

    let action: Action;

    const maxTreeAmount = this.day > this.lastDay / 2 ? 6 - Math.floor(((this.day - 12) / (this.lastDay - 11)) * 4) : 6;
    if (myTrees.filter((el) => el.size === 3).length > maxTreeAmount) {
        action = completeActions[0] || waitActions[0];
    } else {
        for (let i = 0; i < currentCycle.length; i += 1) {
            if (currentCycle[i].length) {
                action = currentCycle[i][0];
                break;
            }
        }
    }

    return action.toString();
  }

  generateSeedActions(): SeedAction[] {
    const myValidTrees = this.trees.filter((tree) => tree.isMine && !tree.isDormant && tree.size > 0);
    const cellsTreesShadows = Object.keys(this.cellsMap).reduce<{ [key: number]: Tree[]}>((acc, el) => {
      acc[Number(el)] = this.getAllShadowTreesInRadius(Number(el), {1: true, 2: true, 3: true});
      return acc;
    }, {});

    const seeds = myValidTrees.reduce<SeedAction[]>((acc, el) => {
      const variants = 
        this.findClosestCellsIndexes(el.cellIndex, {1: el.size >= 1, 2: el.size >= 2, 3: el.size >= 3})
        .filter((index) => {
          const cell = this.cells.find((el) => el.index === index);
          if (!cell) {
            return false;
          }
          
          if (cell.richness === 0) {
            return false;
          }

          return !this.trees.find((tree) => tree.cellIndex === index);
        });

      return [...acc, ...variants.map((variant) => new SeedAction(variant, el.cellIndex))];
    }, []);

    seeds.sort((a, b) => {
      const richnessDiff = 
        this.cells.find((el) => el.index === b.targetCellIdx).richness -
        this.cells.find((el) => el.index === a.targetCellIdx).richness;
      
      const treesDiff =
        cellsTreesShadows[a.targetCellIdx].length -
        cellsTreesShadows[b.targetCellIdx].length;

      return richnessDiff * 3 + treesDiff;
    });

    return seeds;
  }

  generateCompleteActions(): CompleteAction[] {
    const myValidTrees = this.trees.filter((tree) => tree.isMine && !tree.isDormant && tree.size === 3);
    return [...myValidTrees.map((tree) => new CompleteAction(tree.cellIndex))];
  }

  getAllShadowTreesInRadius(cellIndex: number, radius: {1: boolean, 2: boolean, 3: boolean}): Tree[] {
    const cells: Tree[] = [];
    const currentCell = this.cellsMap[cellIndex];
    Object.keys(radius).forEach((key) => {
      if (!radius[key]) {
        return;
      }

      this.cycles.forEach((cycle) => {
        const possibleEl = this.findEl(
          currentCell.x + cycle.diff.x * Number(key), 
          currentCell.y + cycle.diff.y * Number(key), 
          currentCell.z + cycle.diff.z * Number(key)
        );

        if (possibleEl) {
          const tree = this.trees.find((tree) => tree.cellIndex === possibleEl.index);

          if (tree) {
            cells.push(tree);
          }
        }
      });
    })

    return cells;
  }

  findClosestCellsIndexes(cellIndex: number, radius: {1: boolean, 2: boolean, 3: boolean}): number[] {
    const indexes: number[] = [];
    const currentCell = this.cellsMap[cellIndex];
    Object.keys(radius).forEach((key) => {
      if (!radius[key]) {
        return;
      }

      indexes.push(...Object.values(this.cellsMap).filter((el) => {
          const xDiff = el.x - currentCell.x;
          const yDiff = el.y - currentCell.y;
          const zDiff = el.z - currentCell.z;
          return Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff) === (Number(key)) * 2;
        }).map((el) => el.index));
    })

    return indexes;
  }

  findEl(x, y, z) {
    return Object.values(this.cellsMap).find((el) => el.x === x && el.y === y && el.z === z);
  }
}

const game = new Game();

const numberOfCells = parseInt(readline());
for (let i = 0; i < numberOfCells; i++) {
  const [index, richness, ...neighbors] = readline().split(' ').map((el) => parseInt(el, 10));
  game.cells.push(
    new Cell(index, richness, neighbors as TNeighbors)
  );
}


while (true) {
  game.day = parseInt(readline());
  game.nutrients = parseInt(readline());

  const [mySun, myScore] = readline().split(' ').map(parseInt);
  game.mySun = mySun;
  game.myScore = myScore;

  const [opponentSun, opponentScore, opponentIsWaiting] = readline().split(' ').map(parseInt);
  game.opponentSun = opponentSun;
  game.opponentScore = opponentScore;
  game.opponentIsWaiting = opponentIsWaiting !== 0;
  game.trees = [];

  const numberOfTrees = parseInt(readline());

  for (let i = 0; i < numberOfTrees; i++) {
    const [cellIndex, size, isMine, isDormant] = readline().split(' ').map((el) => parseInt(el, 10));
    game.trees.push(
      new Tree(cellIndex, size, isMine !== 0, isDormant !== 0)
    )
  }

  game.possibleActions = [];
  const numberOfPossibleAction = parseInt(readline());
  for (let i = 0; i < numberOfPossibleAction; i++) {
    const possibleAction = readline();
    game.possibleActions.push(Action.parse(possibleAction))
  }

  const action = game.getNextAction();
  const info = 'My challenge website';
  const link = 'bit.ly/33y3Szi';
  const afterInfo = 'Also avaialble in my github';
  let text = '';
  if (game.day % 12 === 0) {
      text = info;
  }
  if (game.day % 12 === 1) {
      text = link;
  }
  if (game.day % 12 === 2) {
      text = afterInfo;
  }
  console.log(action, text);
}
