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

const WAIT = 'WAIT';
const SEED = 'SEED';
const GROW = 'GROW';
const COMPLETE = 'COMPLETE';

type TActions = 'WAIT' | 'SEED' | 'GROW' | 'COMPLETE';

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

    const waitActions = this.possibleActions.filter((el) => el.type === WAIT);

    const growActions =
        this.possibleActions
            .filter((el) => el.type === GROW)
            .sort((a, b) => {
                const aTree = this.trees.find((el) => el.cellIndex === a.targetCellIdx);
                const bTree = this.trees.find((el) => el.cellIndex === b.targetCellIdx);
                const amountATrees =
                    myTrees
                        .filter((tree) => tree.size === (aTree.size + 1))
                        .length;

                const amountBTrees =
                    myTrees
                        .filter((tree) => tree.size === (bTree.size + 1))
                        .length;

                return (amountATrees - aTree.size) - (amountBTrees - bTree.size);
            });

    const seedActions =
      this.possibleActions
        .filter((el) => el.type === SEED)
        .sort((a, b) => {
          if (this.day < this.lastDay + 1 / 3) {
              const aCellNeighbors = this.cells
              .find((el) => el.index === a.targetCellIdx)
              .neighbors
              .filter((el) => el !== -1)
              .filter((el) => this.trees.find((tree) => tree.cellIndex === el && tree.size > 0))
              .length;

            const bCellNeighbors = this.cells
              .find((el) => el.index === b.targetCellIdx)
              .neighbors
              .filter((el) => el !== -1)
              .filter((el) => this.trees.find((tree) => tree.cellIndex === el && tree.size > 0))
              .length;

            return aCellNeighbors - bCellNeighbors;
          } else {
            const indexes = [
              { start: 0, end: 6, value: 0},
              { start: 7, end: 18, value: 1},
              { start: 19, end: 36, value: 2},
            ];

            const aValue = indexes.find((el) => a.targetCellIdx >= el.start && a.targetCellIdx <= el.end).value;
            const bValue = indexes.find((el) => a.targetCellIdx >= el.start && a.targetCellIdx <= el.end).value;
            return aValue - bValue;
          }
        });

    if (this.mySun < 5) {
      seedActions.length = 0;
    }

    const completeActions =
      this.possibleActions
        .filter((el) => el.type === COMPLETE)
        .sort((a, b) => {
          const aCell = this.cells.find((el) => el.index === a.targetCellIdx);
          const bCell = this.cells.find((el) => el.index === b.targetCellIdx);
          return bCell.richness - aCell.richness;
        });

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
      [completeActions, growActions, waitActions],
    ];
    
    const currentCycle = actions[Math.floor((this.day / (this.lastDay + 1)) * actions.length)];

    let action: Action;

    const maxTreeAmount = this.day > this.lastDay / 2 ? 5 - Math.floor(((this.day - 12) / (this.lastDay - 11)) * 4) : 5;
    console.error('maxTreeAmount', maxTreeAmount);
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
  console.log(action, (Math.floor(Math.random() * 1000000)).toString(16));
}
