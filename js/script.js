var app = new Vue({
  el: '#app',
  data: {
    isJsonDisplayed: false,
    selectedCellIndex: null,
    selectedCellRadius: 'shadow',
    selectedDay: null,
    selectedColorsScheme: 'rainbow',
    inputDay: '',
    cells: {
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
    },
    cycles: [
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
    ],
    colors: {
      rainbow: [
        [ '#b53838', '#b58538', '#a9b538', '#63b538', '#38b557', '#38b5a1', '#3882b5'],
        [ '#a13232', '#a17632', '#97a132', '#58a132', '#32a14e', '#32a190', '#3274a1'],
        [ '#8e2c2c', '#8e682c', '#858e2c', '#4e8e2c', '#2c8e45', '#2c8e7e', '#2c668e'],
        [ '#7a2626', '#7a5a26', '#737a26', '#437a26', '#267a3b', '#267a6d', '#26587a'],
        [ '#672020', '#674c20', '#606720', '#386720', '#206732', '#20675c', '#204a67'],
        [ '#531a1a', '#533d1a', '#4e531a', '#2e531a', '#1a5328', '#1a534a', '#1a3c53'],
        [ '#401414', '#402f14', '#3c4014', '#234014', '#14401f', '#144039', '#142e40'],
      ],
      rainbowReverse: [
        [ '#401414', '#402f14', '#3c4014', '#234014', '#14401f', '#144039', '#142e40'],
        [ '#531a1a', '#533d1a', '#4e531a', '#2e531a', '#1a5328', '#1a534a', '#1a3c53'],
        [ '#672020', '#674c20', '#606720', '#386720', '#206732', '#20675c', '#204a67'],
        [ '#7a2626', '#7a5a26', '#737a26', '#437a26', '#267a3b', '#267a6d', '#26587a'],
        [ '#8e2c2c', '#8e682c', '#858e2c', '#4e8e2c', '#2c8e45', '#2c8e7e', '#2c668e'],
        [ '#a13232', '#a17632', '#97a132', '#58a132', '#32a14e', '#32a190', '#3274a1'],
        [ '#b53838', '#b58538', '#a9b538', '#63b538', '#38b557', '#38b5a1', '#3882b5'],
      ],
      twoColor: [
        [ '#a8964f', '#4f61a8', '#a8964f', '#4f61a8', '#a8964f', '#4f61a8', '#a8964f'],
        [ '#978647', '#475797', '#978647', '#475797', '#978647', '#475797', '#978647'],
        [ '#85773f', '#3f4d85', '#85773f', '#3f4d85', '#85773f', '#3f4d85', '#85773f'],
        [ '#746736', '#364374', '#746736', '#364374', '#746736', '#364374', '#746736'],
        [ '#63582e', '#2e3963', '#63582e', '#2e3963', '#63582e', '#2e3963', '#63582e'],
        [ '#514826', '#262f51', '#514826', '#262f51', '#514826', '#262f51', '#514826'],
        [ '#40391e', '#1e2540', '#40391e', '#1e2540', '#40391e', '#1e2540', '#40391e'],
      ]
    }
  },
  computed: {
    selectedCell: function() {
      return this.cells[this.selectedCellIndex];
    },
    seedCells: function() {
      let cells = [[], [], []];
      if (this.selectedCellIndex !== null) {
        cells = cells.map((_, index) => {
          return Object.values(this.cells).filter((el) => {
              const xDiff = el.x - this.selectedCell.x;
              const yDiff = el.y - this.selectedCell.y;
              const zDiff = el.z - this.selectedCell.z;
              return Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff) === (index + 1) * 2;
            }).map((el) => el.index);
        });
      }
      return cells;
    },
    shadowCells: function() {
      const cells = [[], [], []];
      if (this.selectedCellIndex !== null) {
        this.cycles.forEach((cycle) => {
          for (let i = 1; i <= 3; i += 1) {
            const el = 
              this.findEl(
                this.selectedCell.x + cycle.diff.x * i, 
                this.selectedCell.y + cycle.diff.y * i, 
                this.selectedCell.z + cycle.diff.z * i
              );
            
            if (el) {
              cells[i - 1].push(el.index);
            }
          }
        })
      }
      return cells;
    },
    grids: function() {
      const colors = new Array(37).fill('');
      if (this.selectedDay !== null) {
        const currentCycle = this.cycles[this.selectedDay % 6];

        currentCycle.start.forEach((start, index) => {
          let lastEl = this.cells[start];
          let innerIndex = 0;
          while (true) {
            colors[lastEl.index] = this.colors[this.selectedColorsScheme][innerIndex][index];
            innerIndex += 1;
            lastEl = this.findEl(lastEl.x + currentCycle.diff.x, lastEl.y + currentCycle.diff.y, lastEl.z + currentCycle.diff.z);
            if (!lastEl) {
              break;
            }
          }
        });
      }

      return [
        { 
          class: 'four', 
          elements: [this.cells[25],this.cells[24],this.cells[23],this.cells[22]],
          colors: [colors[25], colors[24], colors[23], colors[22]],
        },
        { 
          class: 'five', 
          elements: [this.cells[26],this.cells[11],this.cells[10],this.cells[9],this.cells[21]],
          colors: [colors[26], colors[11], colors[10], colors[9], colors[21]],
        },
        { 
          class: 'six', 
          elements: [this.cells[27],this.cells[12],this.cells[3],this.cells[2],this.cells[8],this.cells[20]],
          colors: [colors[27], colors[12], colors[3], colors[2], colors[8], colors[20]]
        },
        { 
          class: 'seven', 
          elements: [
            this.cells[28],this.cells[13],this.cells[4],this.cells[0],this.cells[1],this.cells[7],this.cells[19]
          ],
          colors: [colors[28], colors[13], colors[4], colors[0], colors[1], colors[7], colors[19]],
        },
        { 
          class: 'six', 
          elements: [this.cells[29],this.cells[14],this.cells[5],this.cells[6],this.cells[18],this.cells[36]],
          colors: [colors[29], colors[14], colors[5], colors[6], colors[18], colors[36]],
        },
        { 
          class: 'five', 
          elements: [this.cells[30],this.cells[15],this.cells[16],this.cells[17],this.cells[35]],
          colors: [colors[30], colors[15], colors[16], colors[17], colors[35]],
        },
        { 
          class: 'four', 
          elements: [this.cells[31],this.cells[32],this.cells[33],this.cells[34]],
          colors: [colors[31], colors[32], colors[33], colors[34]],
        },
      ]
    },
    jsonData: function() {
      return JSON.stringify(Object.values(this.cells).sort((a, b) => a.index - b.index))
    },
  },
  methods: {
    clearInfo() {
      this.selectedCellIndex = null;
      this.isJsonDisplayed = false;
      this.selectedDay = null;
    },
    selectCell(index) {
      if (this.selectedCellIndex === index) {
        this.selectedCellIndex = null;
      } else {
        this.clearInfo();
        this.selectedCellIndex = index;
      }
    },
    showJson(bool) {
      this.clearInfo();
      this.isJsonDisplayed = bool;
    },
    simulateDay() {
      if (this.selectedDay === null) {
        if (typeof this.inputDay === 'number') {
          if (this.inputDay > -1 && this.inputDay < 24) {
            this.clearInfo();
            this.selectedDay = this.inputDay;
          }
        }
      } else {
        this.clearInfo();
      }

      this.inputDay = '';
    },
    findEl(x, y, z) {
      return Object.values(this.cells).find((el) => el.x === x && el.y === y && el.z === z);
    }
  }
});