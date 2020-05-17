const NUM_ROWS = 6;
const NUM_COLS = 7;

class Board {
  constructor() {
    this._initState();
  }

  move(colIdx, color) {
    let moveRowIdx = -1;
    for (let i = this.state.length - 1; i >= 0; i--) {
      if (this.state[i][colIdx] === 0) {
        moveRowIdx = i;
        break;
      }
    }
    let winner = false;
    if (moveRowIdx !== -1) {
      this.state[moveRowIdx][colIdx] = color;
      winner = this.checkWinner(moveRowIdx, colIdx, color);
    }
    return winner;
  }

  reset() {
    this._initState();
  }

  getState() {
    return this.state;
  }

  checkWinner(row, col, color) {
    const isWinner = this.checkHorizontal(row, col, color) ||
      this.checkVertical(row, col, color) ||
      this.checkDiagonals(row, col, color);
    return isWinner;
  }

  checkHorizontal(row, col, color) {
    const lowerBound = Math.max(0, col - 3);
    const upperBound = Math.min(NUM_COLS - 1, col + 3);
    let colorCount = 0;
    for (let i = lowerBound; i <= upperBound; i++) {
      if (this.state[row][i] === color) {
        colorCount++;
      } else {
        colorCount = 0;
      }
      if (colorCount === 4) {
        return true;
      }
    }
    return false;
  }

  checkVertical(row, col, color) {
    const lowerBound = Math.max(0, row - 3);
    const upperBound = Math.min(NUM_ROWS - 1, row + 3);
    let colorCount = 0;
    for (let i = lowerBound; i <= upperBound; i++) {
      if (this.state[i][col] === color) {
        colorCount++;
      } else {
        colorCount = 0;
      }
      if (colorCount === 4) {
        return true;
      }
    }
    return false;
  }

  checkDiagonals(row, col, color) {
    const colLowerBound = Math.max(0, col - 3);
    const colUpperBound = Math.min(NUM_COLS - 1, col + 3);
    const rowLowerBound = Math.max(0, row - 3);
    const rowUpperBound = Math.min(NUM_ROWS - 1, row + 3);
    let colorCount = 0;
    let r = rowLowerBound;
    let c = colLowerBound;
    while (r <= rowUpperBound && c <= colUpperBound) {
      if (this.state[r][c] === color) {
        colorCount++;
      } else {
        colorCount = 0;
      }
      if (colorCount === 4) {
        return true;
      }
      r++;
      c++;
    }
    r = rowUpperBound;
    c = colLowerBound;
    while (r >= rowLowerBound && c <= colUpperBound) {
      if (this.state[r][c] === color) {
        colorCount++;
      } else {
        colorCount = 0;
      }
      if (colorCount === 4) {
        return true;
      }
      r--;
      c++;
    }
    return false;
  }

  _initState() {
    this.state = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }
}

module.exports = Board;
