import $ from 'jquery';

window.$ = $;
window.jQuery = $;

/* eslint-disable */

/**
 * A Collection of name spaced utility functions for the Portal UI.
 */
// ensure that 'portal' namespace exists for functions, create if not
window.portal = window.portal || {};
window.portal.VideoMask = window.portal.VideoMask || {};

/**
 * The video mask provides a clickable gridded overlay to aid in the creation of the "BOF Mask" to suppress
 * undesired motion.
 */
(function(ns) {
    ns.VideoMaskLayer = class {

        /**
         * Creates a new instance.
         *
         * @param baselayerId the ID of the underlying HTML element that will provide context to the masking.
         * @param gridSize the size of the processing grid. By default 20.
         * @param initialMask the initial raw mask as a delimited string of integers.
         * @param options configurable options for this widget.
         */
        constructor(baselayerId, initialMask=null, gridSize=20, options={}) {
            let defaultOptions = {
                // The delimiter used between each integer in the raw mask.
                maskDelimiter: ',',
                // The masking levels that will always be available to be selected.
                scaleLevels: [0.0, 1.0],
                // True if the mask can be edited, false otherwise.
                editable: true,

                // Options related to rendering the grid.
                grid: {
                    // Options related to the rendering of the grid lines.
                    line: {
                        // True if grid lines should be rendered, false otherwise.
                        enabled: true,
                        // The drawing style of the grid line.
                        strokeStyle: 'rgba(211, 211, 211, 0.3)',
                        // The width of the grid line.
                        lineWidth: 2
                    },
                    // Options related to the rendering of the cell mask (fill).
                    cell: {
                        // True if the cell mask (fill) should be rendered, false otherwise.
                        enabled: true,
                        // The fill style of the masked cell.
                        fillStyle: 'rgb(19, 39, 56)',
                        // The opacity of a masked cell.
                        selectedOpacity: 0.8,
                        // The fill style of the cell if the underlying mask value is invalid.
                        errorFillStyle: 'rgba(255, 69, 0, 0.8)'
                    },
                    // Options related to rendering of the mask value.
                    text: {
                        // True if the raw mask value should be rendered, false otherwise.
                        enabled: true,
                        // The font style to be used to render the raw mask value.
                        textFont: '12px sans-serif',
                        // The text alignment of the raw mask value.
                        textAlign: 'right',
                        // The rendering style of the raw mask value.
                        textStyle: 'rgb(255, 255, 255, 1.0)',
                    },
                    boundary: {
                        // True if boundary lines should be rendered, false otherwise.
                        enabled: true,
                        // The drawing style of the boundary line.
                        strokeStyle: 'rgba(50, 205, 50, 0.8)',
                        // The width of the boundary line.
                        lineWidth: 3
                    }
                },
                // Options related to the rendering of the error overlay.
                error: {
                    // The default error message.
                    defaultErrorMessage: 'An unknown error has occurred. Please contact iCetana support.',
                    // The fill style of the background of an error message.
                    modalBackgroundFill: 'rgb(20, 20, 20, 0.8)',
                    // The font style of the error text.
                    errorTextFont: '20px sans-serif',
                    // The text alignment of the error message.
                    errorTextAlign: 'center',
                    // The rendering style of the error text.
                    errorTextStyle: 'rgb(255, 255, 255, 1.0)',

                }
            };
            this._defaultScaleLevels = defaultOptions.scaleLevels.slice();
            this.options = $.extend(true, {}, defaultOptions, options);

            // Initialise state variables to default values.
            this._isError = false;
            this._errorMessage = null;
            this._maxMaskVal = Math.max.apply(null, this.options.scaleLevels);
            this._selectedCellIndex = null;
            this._maskChangeListeners = [];


            this._baselayer = $('#' + baselayerId);
            this._gridSize = gridSize;

            // Create the rendering canvas
            this._mask = $('<canvas id="videomask_layer_"' + baselayerId + ' ></canvas>');
            this._maskCtx = this._mask[0].getContext("2d");
            this._baselayer.after(this._mask);

            // Add listeners for user interaction.
            this.addEventListeners();

            // Initialise the mask. This will automatically repaint the canvas.
            this.initialiseMaskArray(initialMask);
        }

        /**
         * Add various event handlers to detect user interaction.
         */
        addEventListeners() {
            // If the window size changes we need to resize the canvas and repaint the content for the updated size.
            $(window).resize(portal.debounce(function() {
                this.repaint();
            }, 250).bind(this));

            // Add mouse event listeners.
            this._mask.on({
                // On mouse down we store the selected cell (if it is valid) so that we can replicate the underlying
                // mask value if the mouse is dragged.
                'mousedown': function (jQevt) {
                    jQevt.preventDefault();
                    let canvasCoord = this._mouseEvtToCanvasCoord(jQevt);
                    let cellIndex = this._getCellIndexAtCanvasCoord(canvasCoord);
                    let cellValue = this._maskMatrix[cellIndex.row][cellIndex.col];
                    if (this._isValidCellValue(cellValue)) {
                        this._selectedCellIndex = cellIndex;
                    }
                }.bind(this),

                // When the mouse is dragged, the widget propagates the previously selected mask value to the new cell.
                'mousemove': function (jQevt) {
                    jQevt.preventDefault();
                    // 0 No button
                    // 1 Left Button
                    // 2 Middle Button (if present)
                    // 3 Right Button
                    if (jQevt.which === 1 && this._selectedCellIndex !== null && this.options.editable) {
                        let canvasCoord = this._mouseEvtToCanvasCoord(jQevt);
                        let cellIndex = this._getCellIndexAtCanvasCoord(canvasCoord);
                        this._maskMatrix[cellIndex.row][cellIndex.col] =
                            this._maskMatrix[this._selectedCellIndex.row][this._selectedCellIndex.col];
                        this._fireMaskChangeEvent();
                        this.repaint();
                    }
                }.bind(this),

                // On mouse up, if we are in the same cell as when the mouse down occurred we will cycle the
                // mask state.
                'mouseup': function (jQevt) {
                    jQevt.preventDefault();
                    let canvasCoord = this._mouseEvtToCanvasCoord(jQevt);
                    let cellIndex = this._getCellIndexAtCanvasCoord(canvasCoord);
                    if(this._selectedCellIndex !== null) {
                        if( this._selectedCellIndex.row === cellIndex.row &&
                            this._selectedCellIndex.col === cellIndex.col) {
                            // Mouse went down and up on the same cell so we want to cycle to the next state.
                            this._transitionCellState(this._selectedCellIndex);
                            this.repaint();
                        }
                    }
                    // The mouse drag has been completed so reset the internal state.
                    this._reset();
                }.bind(this),

                // If the mouse exits the component we cannot continue to monitor mouse events so reset the internal
                // state of this widget.
                'mouseout': function (jQevt) {
                    // If the mouse exits the canvas, reset the internal state.
                    jQevt.preventDefault();
                    this._reset();
                }.bind(this),
            });
        }

        /**
         * Resets the internal state of this widget.
         */
        _reset() {
            this._selectedCellIndex = null;
        }

        /**
         * Initialise the initial raw mask string to an internal matrix.
         *
         * @param initialMask the initial raw mask as a delimited string of integers.
         */
        initialiseMaskArray(initialMask) {
            // This function can be called from anywhere so reset the internal state to make sure
            // we have a known starting state.
            this._reset();
            this._isError = false;
            this.options.scaleLevels = this._defaultScaleLevels.slice();

            // Create the default mask
            let maskMatrix = new Array(this._gridSize);
            for(let i=0; i<maskMatrix.length; i++) {
                let col = new Array(this._gridSize);
                col.fill(1.0);
                maskMatrix[i] = col;
            }

            let maxMaskVal = Math.max.apply(null, this.options.scaleLevels);
            if (initialMask.trim().length > 0) {

                // Assume that it is a string with comma separated delimiters.
                let vals = initialMask.split(this.options.maskDelimiter);

                // Array bounds check.
                if (vals.length === Math.pow(this._gridSize, 2)) {
                    for (let r=0; r<maskMatrix.length; r++) {
                        for (let c=0; c<maskMatrix[r].length; c++) {
                            // Get the raw string value.
                            let valStr = vals[r * maskMatrix[r].length + c];

                            // If the value is NOT valid, store the invalid value in the matrix as the raw value.
                            // Otherwise if the value is valid, store the cleaned value.
                            if (!this._isValidCellValue(valStr)) {
                                maskMatrix[r][c] = valStr;
                            } else {
                                let valNum = parseFloat(valStr);
                                maskMatrix[r][c] = valNum;
                                maxMaskVal = Math.max(maxMaskVal, valNum);

                                // If we have never encountered this value before, add it to the array of available
                                // transition states.
                                if(this.options.scaleLevels.indexOf(valNum) < 0) {
                                    this.options.scaleLevels.push(valNum);
                                }
                            }
                        }
                    }
                } else {
                    this._isError = true;
                    this._errorMessage = 'Invalid Mask Provided. Please contact iCetana support.';
                }
            }

            this._maskMatrix = maskMatrix;
            this._maxMaskVal = maxMaskVal;
            this.options.scaleLevels.sort(function (a, b) { return a - b; });
            this.repaint();
        }

        /**
         * Redraws the entire canvas area.
         */
        repaint() {
            // First ensure that the canvas is the same size and position as the base layer.
            let baselayerOffsetParentOffset = this._baselayer.offsetParent().offset();
            let baselayerPos = this._baselayer.offset();
            let baselayerWidth = this._baselayer.width();
            let baselayerHeight = this._baselayer.height();

            // The width and height must be set directly as attributes on the canvas element.
            // If you set the width and height in the style attribute the canvas will be scaled instead.
            this._mask.attr({
                width: baselayerWidth,
                height: baselayerHeight
            });
            this._mask.css({
                position: 'absolute',
                top: baselayerPos.top - baselayerOffsetParentOffset.top,
                left: baselayerPos.left - baselayerOffsetParentOffset.left
            });

            // Begin the drawing process by by clearing the layer.
            let maskWidth = this._mask.width();
            let maskHeight = this._mask.height();
            this._maskCtx.clearRect(0, 0, maskWidth, maskHeight);

            if(this._isError) {
                // If we are in an unrecoverable state ...
                this._paintError();
            } else {
                let cellWidth = maskWidth / this._gridSize;
                let cellHeight = maskHeight / this._gridSize;

                // ==== Paint each cell ====
                if(this.options.grid.cell.enabled) {
                    for (let rowIndex = 0; rowIndex < this._maskMatrix.length; rowIndex++) {
                        for (let colIndex = 0; colIndex < this._maskMatrix[rowIndex].length; colIndex++) {
                            let cellValue = this._maskMatrix[rowIndex][colIndex];
                            // Rows are y-axis. Cols are x-axis.
                            // Get the cell style here.
                            this._drawCell(cellValue, colIndex * cellWidth, rowIndex * cellHeight, cellWidth, cellHeight);
                        }
                    }
                }

                // ==== Draw cell boundaries ====
                if(this.options.grid.line.enabled) {
                    // Set the line style.
                    this._maskCtx.strokeStyle = this.options.grid.line.strokeStyle;
                    this._maskCtx.lineWidth = this.options.grid.line.lineWidth;
                    // Draw the rows.
                    this._maskCtx.beginPath();
                    for (let rowIndex = 1; rowIndex < this._gridSize; rowIndex++) {
                        this._maskCtx.moveTo(0, rowIndex * cellHeight);
                        this._maskCtx.lineTo(this._mask.width(), rowIndex * cellHeight);
                    }
                    // Draw the columns
                    for (let colIndex = 1; colIndex < this._gridSize; colIndex++) {
                        this._maskCtx.moveTo(colIndex * cellWidth, 0);
                        this._maskCtx.lineTo(colIndex * cellWidth, this._mask.height());
                    }
                    this._maskCtx.stroke();
                }

                // ==== Draw edge boundaries ====
                if(this.options.grid.boundary.enabled) {
                    this._maskCtx.strokeStyle = this.options.grid.boundary.strokeStyle;
                    this._maskCtx.lineWidth = this.options.grid.boundary.lineWidth;

                    this._maskCtx.beginPath();
                    // Draw the boundaries
                    for (let rowIndex = 0; rowIndex < this._maskMatrix.length; rowIndex++) {
                        for (let colIndex = 0; colIndex < this._maskMatrix[rowIndex].length; colIndex++) {

                            let row = this._maskMatrix[rowIndex];
                            let previousRowVal = colIndex === 0 ? null : row[colIndex - 1];
                            let nextRowVal = colIndex === (row.length - 1) ? null : row[colIndex + 1];
                            let currentVal = row[colIndex];

                            let previousColVal = rowIndex === 0 ? null : this._maskMatrix[rowIndex - 1][colIndex];
                            let nextColVal = rowIndex === (this._maskMatrix.length - 1) ?
                                null : this._maskMatrix[rowIndex + 1][colIndex];

                            // If we have a left edge or we are different to the previous row cell.
                            if (previousRowVal !== null && previousRowVal !== currentVal) {
                                // Draw the left edge
                                this._maskCtx.moveTo(colIndex * cellWidth, rowIndex * cellHeight);
                                this._maskCtx.lineTo(colIndex * cellWidth, (rowIndex + 1) * cellHeight);
                            }

                            // If we have a right edge or we are different to the next row cell.
                            if (nextRowVal !== null && nextRowVal !== currentVal) {
                                // Draw the right edge
                                this._maskCtx.moveTo((colIndex + 1) * cellWidth, rowIndex * cellHeight);
                                this._maskCtx.lineTo((colIndex + 1) * cellWidth, (rowIndex + 1) * cellHeight);
                            }

                            // If we have a top edge or we are different to the previous column cell.
                            if (previousColVal !== null && previousColVal !== currentVal) {
                                this._maskCtx.moveTo(colIndex * cellWidth, rowIndex * cellHeight);
                                this._maskCtx.lineTo((colIndex + 1) * cellWidth, rowIndex * cellHeight);
                            }

                            // If we have a bottom edge or we are different to the previous column cell.
                            if (nextColVal !== null && nextColVal !== currentVal) {
                                this._maskCtx.moveTo(colIndex * cellWidth, (rowIndex + 1) * cellHeight);
                                this._maskCtx.lineTo((colIndex + 1) * cellWidth, (rowIndex + 1) * cellHeight);
                            }
                        }
                    }
                    this._maskCtx.stroke();
                }

            }
        }

        /**
         * @returns {boolean} True if all values in the mask are valid, false otherwise.
         */
        is_valid() {
            for(let rowIndex=0; rowIndex<this._maskMatrix.length; rowIndex++) {
                for(let colIndex=0; colIndex<this._maskMatrix[rowIndex].length; colIndex++) {
                    if(!this._isValidCellValue(this._maskMatrix[rowIndex][colIndex])) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * Adds a callback that is invoked when the mask is changed.
         * @param callback invoked when the mask is changed. The callback will receive a single delimited string
         * representing the mask as a parameter.
         */
        addMaskChangeListener(callback) {
            if($.isFunction(callback)) {
                this._maskChangeListeners.push(callback);
            }
        }

        /**
         * Removes the specified callback from the list of callbacks that are invoked when the mask is changed.
         * @param callback the callback to be removed.
         */
        removeMaskChangeListener(callback) {
            if($.isFunction(callback)) {
                let index = this._maskChangeListeners.indexOf(callback);
                if(index > -1) {
                    this._maskChangeListeners.splice(index, 1);
                }
            }
        }

        _fireMaskChangeEvent() {
            let maskStr = this.toMask();
            $.each(this._maskChangeListeners, function(index, callback) {
                callback(maskStr);
            }.bind(this));
        }

        /**
         * @returns {string} The mask as a delimited string.
         */
        toMask() {
            return [].concat.apply([], this._maskMatrix).join(this.options.delimiter);
        }

        /**
         * Paints the layer for unrecoverable errors.
         */
        _paintError() {
            // Paint the modal background
            this._maskCtx.fillStyle = this.options.error.modalBackgroundFill;
            this._maskCtx.fillRect(0, 0, this._mask.width(), this._mask.height());

            let msg = this.options.defaultErrorMessage ? this._errorMessage === null : this._errorMessage;
            this._maskCtx.font = this.options.error.errorTextFont;
            this._maskCtx.textAlign = this.options.error.errorTextAlign;

            this._maskCtx.fillStyle = this.options.error.errorTextStyle;
            this._maskCtx.fillText(msg, this._mask.width() / 2, this._mask.height() / 2);
        }

        /**
         * Converts the cell value to an opacity.
         * @param cellValue the valid mask scale value.
         * @returns {number} an opacity value for the provided mask value.
         */
        _cellValueToOpacity(cellValue) {
            return ((1.0 - (cellValue/this._maxMaskVal)) * this.options.grid.cell.selectedOpacity);
        }

        /**
         * Draws a single cell in the mask.
         * @param cellValue the mask scale value.
         * @param x the left edge of the cell.
         * @param y the top  edge of the cell.
         * @param width the width of the cell.
         * @param height the height of the cell.
         */
        _drawCell(cellValue, x, y, width, height) {
            let fillStyle;
            let alpha;

            if(!this._isValidCellValue(cellValue)) {
                fillStyle = this.options.grid.cell.errorFillStyle;
                alpha = 1.0;
            } else {
                fillStyle = this.options.grid.cell.fillStyle;
                alpha = this._cellValueToOpacity(cellValue);
            }

            this._maskCtx.globalAlpha = alpha;
            this._maskCtx.fillStyle = fillStyle;
            this._maskCtx.fillRect(x, y, width, height);
            // Revert the global alpha
            this._maskCtx.globalAlpha = 1.0;


            if(this.options.grid.text.enabled) {
                this._maskCtx.font = this.options.grid.text.textFont;
                this._maskCtx.textAlign = this.options.grid.text.textAlign;
                this._maskCtx.fillStyle = this.options.grid.text.textStyle;
                this._maskCtx.fillText(cellValue, x + width, y + height);
            }
        }

        /**
         * Converts the specified mouse events to canvas relative coordinates where
         * (0, 0) is the top left corner of the canvas.
         * @param jQevt the mouse event
         * @returns {{x: number, y: number}}
         */
        _mouseEvtToCanvasCoord(jQevt) {
            let offset = this._mask.offset();
            return {
                x: jQevt.pageX- offset.left,
                y: jQevt.pageY- offset.top
            }
        }

        /**
         * Converts the canvas coordinate to a cell index into the mask matrix.
         * @param canvasCoord the canvas coordinate.
         * @returns {{row: number, col: number}}
         */
        _getCellIndexAtCanvasCoord(canvasCoord) {
            let cellWidth = this._mask.width() / this._gridSize;
            let cellHeight = this._mask.height() / this._gridSize;

            let colIndex = Math.floor(canvasCoord.x / cellWidth);
            let rowIndex = Math.floor(canvasCoord.y / cellHeight);

            return {
                row: rowIndex,
                col: colIndex
            }
        }

        /**
         * True if the specified cell_value is numeric and a positive float, false otherwise.
         * @param cellValue the mask scale value.
         * @returns {boolean} True if the specified cell_value is numeric and a positive float, false otherwise.
         */
        _isValidCellValue(cellValue) {
            if(!$.isNumeric(cellValue)) {
                return false;
            }

            let val = parseFloat(cellValue);
            return !isNaN(val) && val > -1;
        }

        /**
         * Transitions the value at the specified cell index to the next state.
         * @param cellIndex the index of the cell to be updated.
         */
        _transitionCellState(cellIndex) {
            if(!this.options.editable) {
                return;
            }

            let cellValue = this._maskMatrix[cellIndex.row][cellIndex.col];
            if(!this._isValidCellValue(cellValue)) {
                // Unable to transition the cell state because it is invalid
                return;
            }

            cellValue = parseFloat(cellValue);
            // Increment the scale index and apply a modulus for a wrap around.
            let scaleIndex = (this.options.scaleLevels.indexOf(cellValue) + 1) % this.options.scaleLevels.length;
            this._maskMatrix[cellIndex.row][cellIndex.col] = this.options.scaleLevels[scaleIndex];
            this._fireMaskChangeEvent();
        }
    }
}(window.portal.VideoMask));


