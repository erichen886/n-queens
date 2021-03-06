// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (rowIndex) {
      // access the rowIndex of the matrix
      // if any value in the row is not equal to zero, there there is a conflict there
      // return true if there is a conflict
      var rowArray = this.attributes[rowIndex];
      var counter = 0;
      for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i] === 1) {
          counter++;
        }
      }
      if (counter > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      // check each row
      // if two values (1s) exist in the same row, this row contains a conflict (return true)
      // console.log('hi')
      // console.log(this.attributes); // --> object containing matrix

      for (var rowIndex in this.attributes) {
        var rowArray = this.attributes[rowIndex];
        var counter = 0;
        for (var i = 0; i < rowArray.length - 1; i++) {
          if (rowArray[i] === 1) {
            counter++;
          }
        }
        if (counter > 1) {
          return true;
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      // grab the overall matrix array length
      var matrix = this.rows();
      // create counter variable = 0
      var counter = 0;
      // iterate over each subarray in the overall matrix array
      for (var i = 0; i < matrix.length; i++) {
        var currentVal = matrix[i][colIndex];
        // increment counter variable at that colIndex value if there's a 1
        counter += currentVal;
      }
      // if counter is greater than 1, return true
      if (counter > 1) {
        return true;
      }
      // otherwise return false
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      //make alias for matrix
      var matrix = this.rows();
      //loop through matrix
      for (var i = 0; i < matrix.length; i++) {
        //if there is a conflict at the current column
        if (this.hasColConflictAt(i) === true) {
          //return true
          return true;
        }
      }
      return false;
      //otherwise
      //return false
    },


    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      // create counter variable
      var counter = 0;
      // if diagonal is positive
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        // row index = 0 & colIndex = value of input (diagonal)
        var rowIndex = 0;
        var colIndex = majorDiagonalColumnIndexAtFirstRow;
        // (0,1), (1,2)
        while (colIndex < this.rows().length) { //length is 4
          // check if row index/col index are inbounds // maybe first line
          if (this._isInBounds(rowIndex, colIndex)) {
            // at the current position, add current value to counter
            counter += this.rows()[rowIndex][colIndex];
          }
          // increment row index and col index by 1 each
          rowIndex++;
          colIndex++;
          // if counter is greater than 1
          if (counter > 1) {
            // then return true
            return true;
          }
        }
      }
      // if diagonal is negative
      if (majorDiagonalColumnIndexAtFirstRow < 0) { // -1
        // rowIndex = value of input (diagonal) & colIndex = 0
        // at the current position, add current value to counter
        var rowIndex = -majorDiagonalColumnIndexAtFirstRow; // 1
        var colIndex = 0;
        while (rowIndex < this.rows().length) {
          // check if row index/col index are inbounds
          if (this._isInBounds(rowIndex, colIndex)) {
            // at the current position, add current value to counter
            counter += this.rows()[rowIndex][colIndex];
          }
          // increment row index and col index by 1 each
          rowIndex++;
          colIndex++;
          // if counter is greater than 1
          if (counter > 1) {
            // then return true
            return true;
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      var diagonal = this.rows().length - 1; // -3  to 3
      var counter = -diagonal;
      //check each diagonal
      while (counter <= diagonal) {
        //if there is a conflict
        if (this.hasMajorDiagonalConflictAt(counter)) {
          //return true
          return true;
        }
        counter++;
      }
      //return false
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      // create counter variable
      var counter = 0;
      var width = this.rows().length;
      // if diagonal is smaller than length
      if (minorDiagonalColumnIndexAtFirstRow < width) {
        // row index = 0 & colIndex = value of input (diagonal)
        var rowIndex = 0;
        var colIndex = minorDiagonalColumnIndexAtFirstRow;
        while (rowIndex < this.rows().length) {
          // check if row index/col index are inbounds // maybe first line
          if (this._isInBounds(rowIndex, colIndex)) {
            // at the current position, add current value to counter
            counter += this.rows()[rowIndex][colIndex];
          }
          // increment row index and decrement col index
          rowIndex++;
          colIndex--;
          // if counter is greater than 1
          if (counter > 1) {
            // then return true
            return true;
          }
        }
      }
      // if diagonal great than or equal to LENGTH
      if (minorDiagonalColumnIndexAtFirstRow >= width) {
        // rowIndex = value of input (diagonal) & colIndex = 0
        // at the current position, add current value to counter
        var colIndex = width - 1;
        var rowIndex = minorDiagonalColumnIndexAtFirstRow - (colIndex);

        while (rowIndex < this.rows().length) {
          // check if row index/col index are inbounds
          if (this._isInBounds(rowIndex, colIndex)) {
            // at the current position, add current value to counter
            counter += this.rows()[rowIndex][colIndex];
          }
          // increment row index and col index by 1 each
          rowIndex++;
          colIndex--;
          // if counter is greater than 1
          if (counter > 1) {
            // then return true
            return true;
          }
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      // debugger;
      var diagonal = 2 * (this.rows().length - 1); // diagonal range: 0 to 6
      var counter = 0;
      //check each diagonal
      while (counter <= diagonal) {
        //if there is a conflict
        if (this.hasMinorDiagonalConflictAt(counter)) {
          //return true
          return true;
        }
        counter++;
      }
      return false;
    },


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());
