import $ from 'jquery';

window.$ = $;
window.jQuery = $;

/* eslint-disable */

/**
 * A Collection of name spaced utility functions for the Portal UI.
 */
// ensure that 'portal' namespace exists for functions, create if not
window.portal = window.portal || {};
window.portal.Live = window.portal.Live || {};

/**
 * The Live widget provides a grid of the latest video frames.
 */
(function(ns) {
    /**
     * An enumeration of the various ways of sorting the live cells.
     */
    ns.LiveViewSortOrder = Object.freeze({
        NAME_AZ: function(a, b) {
            let nameA = $(a).find('.name').text();
            let nameB = $(b).find('.name').text();

            if(nameA < nameB) {
                return -1;
            }
            if(nameA > nameB) {
                return 1;
            }

            return 0;
        },
        NAME_ZA: function(a, b) {
            let nameA = $(a).find('.name').text();
            let nameB = $(b).find('.name').text();

            if(nameA < nameB) {
                return 1;
            }
            if(nameA > nameB) {
                return -1;
            }

            return 0;
        },
        NEWEST: function(a, b) {
            let timeA = $(a).find('img').data('time');
            let timeB = $(b).find('img').data('time');
            return timeA - timeB;
        },
        OLDEST: function(a, b) {
            let timeA = $(a).find('img').data('time');
            let timeB = $(b).find('img').data('time');
            return timeB - timeA;
        }
    });

    ns.LiveWidget = class {

        /**
         * Creates a new instance.
         */
        constructor(liveId, camera_list, options={}) {
            let defaultOptions = {
                // The maximum number of columns to show in the grid.
                width: 4,
                // The URL of the image to be shown if the latest frame cannot be retrieved.
                errorImageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                // The URL of the image to be shown when the latest frame is being retrieved.
                pendingImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkOAMAANIAzr59FiYAAAAASUVORK5CYII=',
                // The URL of the image to be shown in a stub cell.
                stubCellImageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                // The content to be inserted into the header of a stub camera cell.
                stubCameraName: '&nbsp;',

                // The time format of the image.
                timestampFormat: 'HH:mm:ss YYYY/MM/DD',

                // A list of frame load listeners that will be registered before images are loaded.
                frameLoadListeners: []
            };
            this.options = $.extend(true, {}, defaultOptions, options);

            this._cell_size = null;
            this._frameLoadListeners = [];

            this._liveElem = $('#' + liveId);
            this._liveElem.addClass("live");
            this._camera_list = camera_list;

            this._width = this._calculateWidth(this.options.width);

            $.each(this.options.frameLoadListeners, function(index, listener) {
                this.addFrameLoadListener(listener);
            }.bind(this));

            this._initialiseGrid();
            this.resize();
            this._load_images();

            // Add listeners for user interaction.
            this._addEventListeners();
        }

        /**
         * Add various event handlers to detect user interaction.
         */
        _addEventListeners() {
            // If the window size changes we need to resize the canvas and repaint the content for the updated size.
            $(window).resize(portal.debounce(function() {
                this.resize();
            }, 250).bind(this));
        }

        /**
         * Registers a callback to be invoked when a frame has loaded no matter if it was successful or not.
         * The callback will be invoked with 3 parameters - the image dom element, the timestamp of the frame
         * provided by the detector and a boolean that is true if the image was loaded successfully.
         * @param callback the callback to be invoked.
         */
        addFrameLoadListener(callback) {
            if($.isFunction(callback)) {
                this._frameLoadListeners.push(callback);
            }
        }

        /**
         * Unregisters a callback that was previously registered using #addFrameLoadListener.
         * @param callback the callback to be removed.
         */
        removeFrameLoadListener(callback) {
            if($.isFunction(callback)) {
                let index = this._frameLoadListeners.indexOf(callback);
                if(index > -1) {
                    this._frameLoadListeners.splice(index, 1);
                }
            }
        }

        /**
         * Return the number of columns currently in the grid.
         * @returns {number}
         */
        getWidth() {
            return this._width;
        }

        /**
         * Returns the maximum number of columns supported by the grid.
         * @returns {number}
         */
        getMaxWidth() {
            return this._calculateWidth(9999);
        }

        /**
         * Sorts the cells in the grid based on the specified comparator.
         * @param comparator a comparator function to be used in sorting grid cells.
         */
        sortGrid(comparator) {
            let cells = this._liveElem.find('.live-cell').not('.live-stub-cell').toArray();
            if($.isFunction(comparator)) {
                cells.sort(comparator);
            }

            this._liveElem.empty();
            this._liveElem.append(cells);
            this._generate_stub_cells(this.options.stubCellImageUrl);
            this.resize();
        }

        /**
         * Calculates the appropriate width of the grid.
         *
         * The function will attempt to generate a square grid that can contain all frames but not larger than the
         * hinted value.
         *
         * @param hint the maximum desired number of columns in the grid.
         * @returns {number}
         */
        _calculateWidth(hint) {
            return Math.min(hint, Math.ceil(Math.sqrt(this._camera_list.length)));
        }

        /**
         * Initialises (but does not load) the grid of images.
         */
        _initialiseGrid() {
            $.each(this._camera_list, function(index, camera) {
                this._create_grid_cell(camera);
            }.bind(this));

            this._generate_stub_cells(this.options.pendingImageUrl);
        }

        /**
         * Generates stub cells (used to "square off" the grid).
         *
         * @param imgUrl the image to be displayed in the stub cells.
         */
        _generate_stub_cells(imgUrl) {
            let stubCount = Math.pow(this._width, 2) - this._camera_list.length;
            stubCount = stubCount === this._width ? 0 : stubCount;
            if(stubCount < 0 || stubCount > this._width) {
                stubCount = this._width - (this._camera_list.length % this._width)
            }

            for (let i = 0; i < stubCount; i++) {
                this._create_grid_cell(null, imgUrl);
            }
        }

        /**
         * Creates a new cell in the grid for the specified camera. If the camera is null then the specified
         * imgUrl will be used in place of the camera frame url.
         *
         * @param camera the camera information to be used to populate the newly created cell.
         * @param imgUrl if the camera is not specified the cell will be populated with this image.
         */
        _create_grid_cell(camera, imgUrl=null) {
            let camera_src = camera ? camera.img_url : this.options.stubCellImageUrl;
            let camera_name = camera ? camera.name : this.options.stubCameraName;

            let img = $('<img/>');
            img.data({
                src: camera_src
            });
            img.attr({
                src: imgUrl,
                title: camera_name
            });

            let cell_body = null;
            if(camera) {
                let anchor = $("<a></a>");
                anchor.attr('href', camera.detail_url);
                anchor.append(img);
                cell_body = anchor;
            } else {
                cell_body = img;
            }

            let header_name = $('<span></span>');
            header_name.addClass('name');
            header_name.html(camera_name);

            let header_time = $('<span></span>');
            header_time.addClass('time');

            let header = $('<div/>');
            header.addClass('live-cell-header');
            header.append(header_name);
            header.append(header_time);

            let cell = $('<div/>');
            cell.addClass('live-cell');
            if(!camera) {
                cell.addClass('live-stub-cell');
            }
            cell.css({
                width: (100.0 / this._width) + '%'
            });
            cell.append(header);
            cell.append(cell_body);

            this._liveElem.append(cell);
        }

        /**
         * Loads the specified image using AJAX. The specified img dom element is expected to have a
         * data attribute called 'src' containing the URL of the image to be loaded.
         * @param img the dom element.
         */
        _load_one(img) {
            let imgElem = $(img);
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 2) {
                    // HEADERS_RECEIVED
                    let timestamp = parseInt(xhr.getResponseHeader('icetana-timestamp'), 10);
                    if(!isNaN(timestamp)) {
                        let momentTime = moment(timestamp);
                        imgElem.attr('data-time', timestamp);

                        let timestr = momentTime.format(this.options.timestampFormat);
                        imgElem.parent().find('.time').text(timestr);

                        let title = imgElem.attr('title');
                        title = title + ' from ' + momentTime.fromNow();
                        imgElem.attr('title', title);
                    }
                } else if (xhr.readyState === 4) {
                    // DONE
                    if(xhr.status === 0) {
                        // Reload the image
                        this._load_one(img);
                    } else {
                        if(xhr.status === 200) {
                            let blob = new Blob([xhr.response], {
                                type: xhr.getResponseHeader("Content-Type")
                            });
                            imgElem.attr('src', window.URL.createObjectURL(blob));
                        } else {
                            imgElem.attr('src', this.options.errorImageUrl);
                        }
                        if (imgElem.parents('.live-stub-cell').length === 0) {
                            this._fireOnFrameLoad(imgElem[0], imgElem.data('time'), xhr.status === 200);
                        }
                    }
                }
            }.bind(this);
            xhr.responseType = "arraybuffer";
            xhr.open("GET", imgElem.data('src'));
            xhr.send();
        }

        /**
         * Invokes each callback registered using #addFrameLoadListener.
         * @param img the dom element of the image that was loaded.
         * @param time the timestamp when the frame was captured.
         * @param isSuccess true if the image was loaded successfully, false otherwise.
         */
        _fireOnFrameLoad(img, time, isSuccess) {
            $.each(this._frameLoadListeners, function(index, listener) {
                listener(img, time, isSuccess);
            }.bind(this));
        }

        /**
         * Loads images all images in the live grid.
         */
        _load_images() {
            $.each(this._liveElem.find('img'), function(index, img) {
                this._load_one(img);
            }.bind(this));
        }

        /**
         * Resizes the grid cells based on the size of the overall live grid container.
         */
        resize() {
            this._cell_size = this._liveElem.width() / this._width;
            $(this._liveElem.find('img')).css({
                width: this._cell_size,
                height: this._cell_size
            });
        }

        /**
         * Resizes the grid to the specified number of columns.
         * @param width the number of columns to displayed by the grid.
         */
        setWidth(width) {
            let w = parseInt(width, 10);
            if(!isNaN(w)) {
                this._width = w;
            }

            this._liveElem.find('.live-stub-cell').remove();
            this._generate_stub_cells(this.options.stubCellImageUrl);
            this._liveElem.find('.live-cell').css({
                width: (100.0 / this._width) + '%'
            });
            this.resize();
        }
    }
}(window.portal.Live));


