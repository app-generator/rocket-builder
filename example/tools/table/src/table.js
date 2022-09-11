import svgPlusButton from './img/plus.svg';
import Toolbox from './toolbox';
import newToLeftIcon from './img/new-to-left.svg';
import newToRightIcon from './img/new-to-right.svg';
import newToUpIcon from './img/new-to-up.svg';
import newToDownIcon from './img/new-to-down.svg';
import closeIcon from './img/cross.svg';
import * as $ from './utils/dom';
import throttled from './utils/throttled';

const CSS = {
  wrapper: 'tc-wrap',
  wrapperReadOnly: 'tc-wrap--readonly',
  table: 'tc-table',
  row: 'tc-row',
  withHeadings: 'tc-table--heading',
  rowSelected: 'tc-row--selected',
  cell: 'tc-cell',
  cellSelected: 'tc-cell--selected',
  addRow: 'tc-add-row',
  addColumn: 'tc-add-column'
};

/**
 * Generates and manages table contents.
 */
export default class Table {
  /**
   * Creates
   *
   * @constructor
   * @param {boolean} readOnly - read-only mode flag
   * @param {object} api - Editor.js API
   * @param {TableData} data - Editor.js API
   * @param {TableConfig} config - Editor.js API
   */
  constructor(readOnly, api, data, config) {
    this.readOnly = readOnly;
    this.api = api;
    this.data = data;
    this.config = config;

    /**
     * DOM nodes
     */
    this.wrapper = null;
    this.table = null;

    /**
     * Toolbox for managing of columns
     */
    this.toolboxColumn = this.createColumnToolbox();
    this.toolboxRow = this.createRowToolbox();

    /**
     * Create table and wrapper elements
     */
    this.createTableWrapper();

    // Current hovered row index
    this.hoveredRow = 0;

    // Current hovered column index
    this.hoveredColumn = 0;

    // Index of last selected row via toolbox
    this.selectedRow = 0;

    // Index of last selected column via toolbox
    this.selectedColumn = 0;

    // Additional settings for the table
    this.tunes = {
      withHeadings: false
    };

    /**
     * Resize table to match config/data size
     */
    this.resize();

    /**
     * Fill the table with data
     */
    this.fill();

    /**
     * The cell in which the focus is currently located, if 0 and 0 then there is no focus
     * Uses to switch between cells with buttons
     */
    this.focusedCell = {
      row: 0,
      column: 0
    };

    /**
     * Global click listener allows to delegate clicks on some elements
     */
    this.documentClicked = (event) => {
      const clickedInsideTable = event.target.closest(`.${CSS.table}`) !== null;
      const outsideTableClicked = event.target.closest(`.${CSS.wrapper}`) === null;
      const clickedOutsideToolboxes = clickedInsideTable || outsideTableClicked;

      if (clickedOutsideToolboxes) {
        this.hideToolboxes();
      }

      const clickedOnAddRowButton = event.target.closest(`.${CSS.addRow}`);
      const clickedOnAddColumnButton = event.target.closest(`.${CSS.addColumn}`);

      /**
       * Also, check if clicked in current table, not other (because documentClicked bound to the whole document)
       */
      if (clickedOnAddRowButton && clickedOnAddRowButton.parentNode === this.wrapper) {
        this.addRow(undefined, true);
        this.hideToolboxes();
      } else if (clickedOnAddColumnButton && clickedOnAddColumnButton.parentNode === this.wrapper) {
        this.addColumn(undefined, true);
        this.hideToolboxes();
      }
    };

    if (!this.readOnly) {
      this.bindEvents();
    }
  }

  /**
   * Returns the rendered table wrapper
   *
   * @returns {Element}
   */
  getWrapper() {
    return this.wrapper;
  }

  /**
   * Hangs the necessary handlers to events
   */
  bindEvents() {
    // set the listener to close toolboxes when click outside
    document.addEventListener('click', this.documentClicked);

    // Update toolboxes position depending on the mouse movements
    this.table.addEventListener('mousemove', throttled(150, (event) => this.onMouseMoveInTable(event)), { passive: true });

    // Controls some of the keyboard buttons inside the table
    this.table.onkeypress = (event) => this.onKeyPressListener(event);

    // Tab is executed by default before keypress, so it must be intercepted on keydown
    this.table.addEventListener('keydown', (event) => this.onKeyDownListener(event));

    // Determine the position of the cell in focus
    this.table.addEventListener('focusin', event => this.focusInTableListener(event));
  }

  /**
   * Configures and creates the toolbox for manipulating with columns
   *
   * @returns {Toolbox}
   */
  createColumnToolbox() {
    return new Toolbox({
      api: this.api,
      cssModifier: 'column',
      items: [
        {
          label: this.api.i18n.t('Add column to left'),
          icon: newToLeftIcon,
          onClick: () => {
            this.addColumn(this.selectedColumn, true);
            this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t('Add column to right'),
          icon: newToRightIcon,
          onClick: () => {
            this.addColumn(this.selectedColumn + 1, true);
            this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t('Delete column'),
          icon: closeIcon,
          hideIf: () => {
            return this.numberOfColumns === 1;
          },
          confirmationRequired: true,
          onClick: () => {
            this.deleteColumn(this.selectedColumn);
            this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectColumn(this.hoveredColumn);
        this.hideRowToolbox();
      },
      onClose: () => {
        this.unselectColumn();
      }
    });
  }

  /**
   * Configures and creates the toolbox for manipulating with rows
   *
   * @returns {Toolbox}
   */
  createRowToolbox() {
    return new Toolbox({
      api: this.api,
      cssModifier: 'row',
      items: [
        {
          label: this.api.i18n.t('Add row above'),
          icon: newToUpIcon,
          onClick: () => {
            this.addRow(this.selectedRow, true);
            this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t('Add row below'),
          icon: newToDownIcon,
          onClick: () => {
            this.addRow(this.selectedRow + 1, true);
            this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t('Delete row'),
          icon: closeIcon,
          hideIf: () => {
            return this.numberOfRows === 1;
          },
          confirmationRequired: true,
          onClick: () => {
            this.deleteRow(this.selectedRow);
            this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectRow(this.hoveredRow);
        this.hideColumnToolbox();
      },
      onClose: () => {
        this.unselectRow();
      }
    });
  }

  /**
   * When you press enter it moves the cursor down to the next row
   * or creates it if the click occurred on the last one
   */
  moveCursorToNextRow() {
    if (this.focusedCell.row !== this.numberOfRows) {
      this.focusedCell.row += 1;
      this.focusCell(this.focusedCell);
    } else {
      this.addRow();
      this.focusedCell.row += 1;
      this.focusCell(this.focusedCell);
      this.updateToolboxesPosition(0, 0);
    }
  }

  /**
   * Get table cell by row and col index
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @returns {HTMLElement}
   */
  getCell(row, column) {
    return this.table.querySelector(`.${CSS.row}:nth-child(${row}) .${CSS.cell}:nth-child(${column})`);
  }

  /**
   * Get table row by index
   *
   * @param {number} row - row coordinate
   * @returns {HTMLElement}
   */
  getRow(row) {
    return this.table.querySelector(`.${CSS.row}:nth-child(${row})`);
  }

  /**
   * The parent of the cell which is the row
   *
   * @param {HTMLElement} cell - cell element
   * @returns {HTMLElement}
   */
  getRowByCell(cell) {
    return cell.parentElement;
  }

  /**
   * Ger row's first cell
   *
   * @param {Element} row - row to find its first cell
   * @returns {Element}
   */
  getRowFirstCell(row) {
    return row.querySelector(`.${CSS.cell}:first-child`);
  }

  /**
   * Set the sell's content by row and column numbers
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @param {string} content - cell HTML content
   */
  setCellContent(row, column, content) {
    const cell = this.getCell(row, column);

    cell.innerHTML = content;
  }

  /**
   * Add column in table on index place
   * Add cells in each row
   *
   * @param {number} columnIndex - number in the array of columns, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the first cell
   */
  addColumn(columnIndex = -1, setFocus = false) {
    let numberOfColumns = this.numberOfColumns;

    /**
     * Iterate all rows and add a new cell to them for creating a column
     */
    for (let rowIndex = 1; rowIndex <= this.numberOfRows; rowIndex++) {
      let cell;
      const cellElem = this.createCell();

      if (columnIndex > 0 && columnIndex <= numberOfColumns) {
        cell = this.getCell(rowIndex, columnIndex);

        $.insertBefore(cellElem, cell);
      } else {
        cell = this.getRow(rowIndex).appendChild(cellElem);
      }

      /**
       * Autofocus first cell
       */
      if (rowIndex === 1) {
        const firstCell = this.getCell(rowIndex, columnIndex > 0 ? columnIndex : numberOfColumns + 1);

        if (firstCell && setFocus) {
          $.focus(firstCell);
        }
      }
    }

    this.addHeadingAttrToFirstRow();
  };

  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of rows, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the inserted row
   * @returns {HTMLElement} row
   */
  addRow(index = -1, setFocus = false) {
    let insertedRow;
    let rowElem = $.make('div', CSS.row);

    if (this.tunes.withHeadings) {
      this.removeHeadingAttrFromFirstRow();
    }

    /**
     * We remember the number of columns, because it is calculated
     * by the number of cells in the first row
     * It is necessary that the first line is filled in correctly
     */
    let numberOfColumns = this.numberOfColumns;

    if (index > 0 && index <= this.numberOfRows) {
      let row = this.getRow(index);

      insertedRow = $.insertBefore(rowElem, row);
    } else {
      insertedRow = this.table.appendChild(rowElem);
    }

    this.fillRow(insertedRow, numberOfColumns);

    if (this.tunes.withHeadings) {
      this.addHeadingAttrToFirstRow();
    }

    const insertedRowFirstCell = this.getRowFirstCell(insertedRow);

    if (insertedRowFirstCell && setFocus) {
      $.focus(insertedRowFirstCell);
    }

    return insertedRow;
  };

  /**
   * Delete a column by index
   *
   * @param {number} index
   */
  deleteColumn(index) {
    for (let i = 1; i <= this.numberOfRows; i++) {
      const cell = this.getCell(i, index);

      if (!cell) {
        return;
      }

      cell.remove();
    }
  }

  /**
   * Delete a row by index
   *
   * @param {number} index
   */
  deleteRow(index) {
    this.getRow(index).remove();

    this.addHeadingAttrToFirstRow();
  }

  /**
   * Create a wrapper containing a table, toolboxes
   * and buttons for adding rows and columns
   *
   * @returns {HTMLElement} wrapper - where all buttons for a table and the table itself will be
   */
  createTableWrapper() {
    this.wrapper = $.make('div', CSS.wrapper);
    this.table = $.make('div', CSS.table);

    if (this.readOnly) {
      this.wrapper.classList.add(CSS.wrapperReadOnly);
    }

    this.wrapper.appendChild(this.toolboxRow.element);
    this.wrapper.appendChild(this.toolboxColumn.element);
    this.wrapper.appendChild(this.table);

    if (!this.readOnly) {
      const addColumnButton = $.make('div', CSS.addColumn, {
        innerHTML: svgPlusButton
      });
      const addRowButton = $.make('div', CSS.addRow, {
        innerHTML: svgPlusButton
      });

      this.wrapper.appendChild(addColumnButton);
      this.wrapper.appendChild(addRowButton);
    }
  }

  /**
   * Returns the size of the table based on initial data or config "size" property
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  computeInitialSize() {
    const content = this.data && this.data.content;
    const isValidArray = Array.isArray(content);
    const isNotEmptyArray = isValidArray ? content.length : false;
    const contentRows = isValidArray ? content.length : undefined;
    const contentCols = isNotEmptyArray ? content[0].length : undefined;
    const parsedRows = Number.parseInt(this.config && this.config.rows);
    const parsedCols = Number.parseInt(this.config && this.config.cols);

    /**
     * Value of config have to be positive number
     */
    const configRows = !isNaN(parsedRows) && parsedRows > 0 ? parsedRows : undefined;
    const configCols = !isNaN(parsedCols) && parsedCols > 0 ? parsedCols : undefined;
    const defaultRows = 2;
    const defaultCols = 2;
    const rows = contentRows || configRows || defaultRows;
    const cols = contentCols || configCols || defaultCols;

    return {
      rows: rows,
      cols: cols
    };
  }

  /**
   * Resize table to match config size or transmitted data size
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  resize() {
    const { rows, cols } = this.computeInitialSize();

    for (let i = 0; i < rows; i++) {
      this.addRow();
    }

    for (let i = 0; i < cols; i++) {
      this.addColumn();
    }
  }

  /**
   * Fills the table with data passed to the constructor
   *
   * @returns {void}
   */
  fill() {
    const data = this.data;

    if (data && data.content) {
      for (let i = 0; i < data.content.length; i++) {
        for (let j = 0; j < data.content[i].length; j++) {
          this.setCellContent(i + 1, j + 1, data.content[i][j]);
        }
      }
    }
  }

  /**
   * Fills a row with cells
   *
   * @param {HTMLElement} row - row to fill
   * @param {number} numberOfColumns - how many cells should be in a row
   */
  fillRow(row, numberOfColumns) {
    for (let i = 1; i <= numberOfColumns; i++) {
      const newCell = this.createCell();

      row.appendChild(newCell);
    }
  }

  /**
   * Creating a cell element
   *
   * @return {Element}
   */
  createCell() {
    return $.make('div', CSS.cell, {
      contentEditable: !this.readOnly
    });
  }

  /**
   * Get number of rows in the table
   */
  get numberOfRows() {
    return this.table.childElementCount;
  }

  /**
   * Get number of columns in the table
   */
  get numberOfColumns() {
    if (this.numberOfRows) {
      return this.table.querySelector(`.${CSS.row}:first-child`).childElementCount;
    }

    return 0;
  }

  /**
   * Is the column toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isColumnMenuShowing() {
    return this.selectedColumn !== 0;
  }

  /**
   * Is the row toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isRowMenuShowing() {
    return this.selectedRow !== 0;
  }

  /**
   * Recalculate position of toolbox icons
   *
   * @param {Event} event - mouse move event
   */
  onMouseMoveInTable(event) {
    const { row, column } = this.getHoveredCell(event);

    this.hoveredColumn = column;
    this.hoveredRow = row;

    this.updateToolboxesPosition();
  }

  /**
   * Prevents default Enter behaviors
   * Adds Shift+Enter processing
   *
   * @param {KeyboardEvent} event - keypress event
   */
  onKeyPressListener(event) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return true;
      }

      this.moveCursorToNextRow();
    }

    return event.key !== 'Enter';
  };

  /**
   * Prevents tab keydown event from bubbling
   * so that it only works inside the table
   *
   * @param {KeyboardEvent} event - keydown event
   */
  onKeyDownListener(event) {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  }

  /**
   * Set the coordinates of the cell that the focus has moved to
   *
   * @param {FocusEvent} event - focusin event
   */
  focusInTableListener(event) {
    const cell = event.target;
    const row = this.getRowByCell(cell);

    this.focusedCell = {
      row: Array.from(this.table.querySelectorAll(`.${CSS.row}`)).indexOf(row) + 1,
      column: Array.from(row.querySelectorAll(`.${CSS.cell}`)).indexOf(cell) + 1
    };
  }

  /**
   * Unselect row/column
   * Close toolbox menu
   * Hide toolboxes
   *
   * @returns {void}
   */
  hideToolboxes() {
    this.hideRowToolbox();
    this.hideColumnToolbox();
    this.updateToolboxesPosition();
  }

  /**
   * Unselect row, close toolbox
   *
   * @returns {void}
   */
  hideRowToolbox() {
    this.unselectRow();
    this.toolboxRow.hide();
  }
  /**
   * Unselect column, close toolbox
   *
   * @returns {void}
   */
  hideColumnToolbox() {
    this.unselectColumn();

    this.toolboxColumn.hide();
  }

  /**
   * Set the cursor focus to the focused cell
   *
   * @returns {void}
   */
  focusCell() {
    this.focusedCellElem.focus();
  }

  /**
   * Get current focused element
   *
   * @returns {HTMLElement} - focused cell
   */
  get focusedCellElem() {
    const { row, column } = this.focusedCell;

    return this.getCell(row, column);
  }

  /**
   * Update toolboxes position
   *
   * @param {number} row - hovered row
   * @param {number} column - hovered column
   */
  updateToolboxesPosition(row = this.hoveredRow, column = this.hoveredColumn) {
    if (!this.isColumnMenuShowing) {
      if (column > 0 && column <= this.numberOfColumns) { // not sure this statement is needed. Maybe it should be fixed in getHoveredCell()
        this.toolboxColumn.show(() => {
          return {
            left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${column} - 1) * 2))`
          };
        });
      }
    }

    if (!this.isRowMenuShowing) {
      if (row > 0 && column <= this.numberOfColumns) { // not sure this statement is needed. Maybe it should be fixed in getHoveredCell()
        this.toolboxRow.show(() => {
          const hoveredRowElement = this.getRow(row);
          const { fromTopBorder } = $.getRelativeCoordsOfTwoElems(this.table, hoveredRowElement);
          const { height } = hoveredRowElement.getBoundingClientRect();

          return {
            top: `${Math.ceil(fromTopBorder + height / 2)}px`
          };
        });
      }
    }
  }

  /**
   * Makes the first row headings
   *
   * @param {boolean} withHeadings - use headings row or not
   */
  setHeadingsSetting(withHeadings) {
    this.tunes.withHeadings = withHeadings;

    if (withHeadings) {
      this.table.classList.add(CSS.withHeadings);
      this.addHeadingAttrToFirstRow();
    } else {
      this.table.classList.remove(CSS.withHeadings);
      this.removeHeadingAttrFromFirstRow();
    }
  }

  /**
   * Adds an attribute for displaying the placeholder in the cell
   */
  addHeadingAttrToFirstRow() {
    for (let cellIndex = 1; cellIndex <= this.numberOfColumns; cellIndex++) {
      let cell = this.getCell(1, cellIndex);

      if (cell) {
        cell.setAttribute('heading', this.api.i18n.t('Heading'));
      }
    }
  }

  /**
   * Removes an attribute for displaying the placeholder in the cell
   */
  removeHeadingAttrFromFirstRow() {
    for (let cellIndex = 1; cellIndex <= this.numberOfColumns; cellIndex++) {
      let cell = this.getCell(1, cellIndex);

      if (cell) {
        cell.removeAttribute('heading');
      }
    }
  }

  /**
   * Add effect of a selected row
   *
   * @param {number} index
   */
  selectRow(index) {
    const row = this.getRow(index);

    if (row) {
      this.selectedRow = index;
      row.classList.add(CSS.rowSelected);
    }
  }

  /**
   * Remove effect of a selected row
   */
  unselectRow() {
    if (this.selectedRow <= 0) {
      return;
    }

    const row = this.table.querySelector(`.${CSS.rowSelected}`);

    if (row) {
      row.classList.remove(CSS.rowSelected);
    }

    this.selectedRow = 0;
  }

  /**
   * Add effect of a selected column
   *
   * @param {number} index
   */
  selectColumn(index) {
    for (let i = 1; i <= this.numberOfRows; i++) {
      const cell = this.getCell(i, index);

      if (cell) {
        cell.classList.add(CSS.cellSelected);
      }
    }

    this.selectedColumn = index;
  }

  /**
   * Remove effect of a selected column
   */
  unselectColumn() {
    if (this.selectedColumn <= 0) {
      return;
    }

    let cells = this.table.querySelectorAll(`.${CSS.cellSelected}`);

    Array.from(cells).forEach(column => {
      column.classList.remove(CSS.cellSelected);
    });

    this.selectedColumn = 0;
  }

  /**
   * Calculates the row and column that the cursor is currently hovering over
   * The search was optimized from O(n) to O (log n) via bin search to reduce the number of calculations
   *
   * @param {Event} event - mousemove event
   * @returns hovered cell coordinates as an integer row and column
   */
  getHoveredCell(event) {
    let hoveredRow = this.hoveredRow;
    let hoveredColumn = this.hoveredColumn;
    const { width, height, x, y } = $.getCursorPositionRelativeToElement(this.table, event);

    // Looking for hovered column
    if (x >= 0) {
      hoveredColumn = this.binSearch(
        this.numberOfColumns,
        (mid) => this.getCell(1, mid),
        ({ fromLeftBorder }) => x < fromLeftBorder,
        ({ fromRightBorder }) => x > (width - fromRightBorder)
      );
    }

    // Looking for hovered row
    if (y >= 0) {
      hoveredRow = this.binSearch(
        this.numberOfRows,
        (mid) => this.getCell(mid, 1),
        ({ fromTopBorder }) => y < fromTopBorder,
        ({ fromBottomBorder }) => y > (height - fromBottomBorder)
      );
    }

    return {
      row: hoveredRow || this.hoveredRow,
      column: hoveredColumn || this.hoveredColumn
    };
  }

  /**
   * Looks for the index of the cell the mouse is hovering over.
   * Cells can be represented as ordered intervals with left and
   * right (upper and lower for rows) borders inside the table, if the mouse enters it, then this is our index
   *
   * @param {number} numberOfCells - upper bound of binary search
   * @param {function} getCell - function to take the currently viewed cell
   * @param {function} beforeTheLeftBorder - determines the cursor position, to the left of the cell or not
   * @param {function} afterTheRightBorder - determines the cursor position, to the right of the cell or not
   * @returns {number}
   */
  binSearch(numberOfCells, getCell, beforeTheLeftBorder, afterTheRightBorder) {
    let leftBorder = 0;
    let rightBorder = numberOfCells + 1;
    let totalIterations = 0;
    let mid;

    while (leftBorder < rightBorder - 1 && totalIterations < 10) {
      mid = Math.ceil((leftBorder + rightBorder) / 2);

      const cell = getCell(mid);
      const relativeCoords = $.getRelativeCoordsOfTwoElems(this.table, cell);

      if (beforeTheLeftBorder(relativeCoords)) {
        rightBorder = mid;
      } else if (afterTheRightBorder(relativeCoords)) {
        leftBorder = mid;
      } else {
        break;
      }

      totalIterations++;
    }

    return mid;
  }

  /**
   * Collects data from cells into a two-dimensional array
   *
   * @returns {string[][]}
   */
  getData() {
    const data = [];

    for (let i = 1; i <= this.numberOfRows; i++) {
      const row = this.table.querySelector(`.${CSS.row}:nth-child(${i})`);
      const cells = Array.from(row.querySelectorAll(`.${CSS.cell}`));
      const isEmptyRow = cells.every(cell => !cell.textContent.trim());

      if (isEmptyRow) {
        continue;
      }

      data.push(cells.map(cell => cell.innerHTML));
    }

    return data;
  }

  /**
   * Remove listeners on the document
   */
  destroy() {
    document.removeEventListener('click', this.documentClicked);
  }
}
