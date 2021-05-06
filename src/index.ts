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
  round = 0;
  nutrients = 0;
  cells: Cell[] = [];
  possibleActions: Action[] = [];
  trees = [];
  mySun = 0;
  myScore = 0;
  opponentSun = 0;
  opponentScore = 0;
  opponentIsWaiting = false;

  getNextAction(): string {
    const waitActions = this.possibleActions.filter((el) => el.type === WAIT);
    const growActions = this.possibleActions.filter((el) => el.type === GROW);
    const completeActions =
      this.possibleActions
        .filter((el) => el.type === COMPLETE)
        .sort((a, b) => {
          const aCell = this.cells.find((el) => el.index === a.targetCellIdx);
          const bCell = this.cells.find((el) => el.index === b.targetCellIdx);
          return bCell.richness - aCell.richness;
        });

    let action: Action;

    if (completeActions.length) {
      action = completeActions[0];
    } else if (growActions.length) {
      action = growActions[0];
    } else {
      action = waitActions[0]
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
    const [cellIndex, size, isMine, isDormant] = readline().split(' ').map(parseInt);
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
  console.error(game.possibleActions);
  console.log(action);
}