import $ from 'jquery';

window.$ = $;
window.jQuery = $;

/* eslint-disable */

/**
 * A Collection of name spaced utility functions for the Portal UI
 */
// ensure that 'portal' namespace exists for functions, create if not
window.portal = window.portal || {};
window.portal.VideoCanvas = window.portal.VideoCanvas || {};

/**
 * The live feed manager provides pan and zoom functionality to a video element by switching the video with a
 * canvas element that is re-drawn continuously applying the necessary transforms.
 */
(function(ns) {
    ns.VideoCanvasWidget = class {
        /**
         * Creates a new instance.
         * @param videoElemId The ID of the HTML video element.
         * @param options configurable options for this widget.
         */
        constructor(videoElemId, options={}) {
            let defaultOptions = {
                // The minimum zoom level. A zoom level of 1 represents native size.
                minZoom: 1,
                // The maximum zoom level.
                maxZoom: 16,
                // The number of times per second the canvas is redrawn with the latest video frame.
                // Why select a 24 FPS refresh rate? No real reason for this. We can make the delay as low as 0 however
                // that will consume a lot more processing power for limited benefit. The correct answer is probably
                // somewhere between 24 FPS and 60 FPS.
                fpsRefreshRate: 24,

                // The style of the box that is drawn when zooming using the shift key.
                zoomBounds: {
                    lineWidth: 2,
                    strokeStyle: '#3ece34'
                },

                // Picture in Picture is the small preview component in the bottom right corner of the viewport.
                pictureInPicture: {
                    // The offset of the component from the bottom right corner of the viewport.
                    padding: 8,
                    // The size of the PiP component will change depending on the native size of the video however
                    // the maximum size of the component will never exceed this value in pixels.
                    maxSideLength: 240,
                    // The size of the PiP component will be relative to the size of the native component but never
                    // larger than maxSideLength. By default it is 15% the size of the native component.
                    sideLengthPercent: 0.15,

                    // The style of the border that is drawn around the PiP component.
                    border: {
                        lineWidth: 1,
                        strokeStyle: '#000000'
                    },
                    // The style of the current viewport rendered inside the PiP component.
                    zoom: {
                        lineWidth: 1,
                        strokeStyle: '#FFFFFF'
                    }
                }
            };

            this.options = $.extend(true, {}, defaultOptions, options);

            // Wrap a container element around the video and insert the canvas element.
            this.videoElem = $("#" + videoElemId);
            let container = $('<div class="videocanvas-container"></div>');
            this.videoElem.wrap(container);
            this.canvasElem = $('<canvas id="videocanvas_' + videoElemId + '"></canvas>');
            this.videoElem.before(this.canvasElem);

            // Interestingly if you use jQuery.wrap it will break the autoplay attribute on the video element.
            // Concretely this means that the video will not automatically start playing. As a workaround I am invoking
            // play manually here.
            this.videoElem[0].play();

            this.canvasContext = this.canvasElem[0].getContext("2d");

            // Hide the video element because the content will be rendered to the canvas.
            this.videoElem.hide();
            this.videoWidth = this.videoElem.width();
            this.videoHeight = this.videoElem.height();

            // Initially display the entire video content.
            this.zoom = this.options.minZoom;
            this.sourceX = 0;
            this.sourceY = 0;

            this.pipBounds = this.getPipBounds();
            this.pipZoomBounds = this.getPipZoomBounds();

            // The current canvas coordinate of the mouse while it is being dragged.
            this._mouseDragCoord = null;
            // The starting canvas coordinate of a mouse drag.
            this._mouseDownCanvasCoord = null;
            // The starting video coordinate of a mouse drag.
            this._mouseDownVideoCoord = null;
            // True if the user has enabled zoom mode by holding shift and dragging the mouse.
            this._isDragZoomMode = false;

            // Add the various event handlers.
            this.addEventHandlers();

            // Resize the canvas to match the aspect ratio of the video.
            this.resizeCanvas();

            // Begin rendering
            this.timer = setTimeout(this.drawVideo.bind(this), 0);
        }

        /**
         * Add various event handlers.
         */
        addEventHandlers() {
            // Resize the canvas if the window is resized.
            $(window).resize(portal.debounce(function() {
                this.resizeCanvas();
            }, 250).bind(this));

            // Configure Mouse Events
            this.canvasElem.on({
                'mousedown': function (jQevt) {
                    jQevt.preventDefault();

                    let canvasCoord = this.mouseEvtToCanvasCoord(jQevt);
                    this._mouseDownCanvasCoord = canvasCoord;
                    this._mouseDownVideoCoord = this.canvasCoordToVideoCoord(canvasCoord.x, canvasCoord.y);

                    let cursorStyle = 'default';
                    if(this.isInPipBounds(canvasCoord.x, canvasCoord.y)) {
                        // Snap the viewport center to the clicked location
                        cursorStyle = "move";
                        this.onMousePipPan(canvasCoord.x, canvasCoord.y);
                    } else {
                        // Only allow zooming with left mouse button
                        if(jQevt.which === 1) {
                            // If the shift key is down we will in zooming mode otherwise we are in panning mode.
                            this._isDragZoomMode = jQevt.shiftKey;
                            cursorStyle = this._isDragZoomMode ? "crosshair" : "move";
                        }
                    }
                    this.canvasElem.css("cursor", cursorStyle);
                }.bind(this),

                'mousemove': function (jQevt) {
                    jQevt.preventDefault();
                    // 0 No button
                    // 1 Left Button
                    // 2 Middle Button (if present)
                    // 3 Right Button
                    if(jQevt.which === 1) {
                        let coord = this.mouseEvtToCanvasCoord(jQevt);
                        if(this.isInPipBounds(coord.x, coord.y)) {
                            // If we are in the pip bounds we pan the view based on the overview.
                            this.onMousePipPan(coord.x, coord.y);
                        } else {
                            if(this._isDragZoomMode) {
                                // If we are in zooming mode simply update the latest mouse drag coord.
                                // On the next redraw cycle the bounds of the zoom selected area will be updated.
                                this._mouseDragCoord = coord;
                            } else {
                                this.onMouseDragPan(coord.x, coord.y);
                            }
                        }
                    }
                }.bind(this),

                'mouseup': function (jQevt) {
                    jQevt.preventDefault();

                    if(this._isDragZoomMode) {
                        // On mouse up we can now zoom the view.
                        let coord = this.mouseEvtToCanvasCoord(jQevt);
                        this.onMouseDragZoom(coord.x, coord.y);
                    }

                    // The mouse drag has been completed so reset the internal state.
                    this.reset();

                }.bind(this),

                'mouseout': function (jQevt) {
                    // If the mouse exits the canvas, reset the drag state.
                    jQevt.preventDefault();
                    this.reset();
                }.bind(this),

                'mousewheel': function (jQevt) {
                    jQevt.preventDefault();

                    // Disable zooming while holding down the mouse button.
                    if(this._mouseDownVideoCoord !== null) {
                        return;
                    }

                    // The mouse wheel action will perform digital zoom.
                    let isZoomOut = jQevt.originalEvent.deltaY > 0;
                    let offset = this.canvasElem.offset();
                    let x = jQevt.pageX- offset.left;
                    let y = jQevt.pageY- offset.top;
                    this.onMouseWheelZoom(isZoomOut, x, y);
                }.bind(this)
            });
        }

        /**
         * Resets the internal mouse drag state.
         */
        reset() {
            this.canvasElem.css("cursor", "default");
            this._mouseDragCoord = null;
            this._mouseDownCanvasCoord = null;
            this._mouseDownVideoCoord = null;
            this._isDragZoomMode = false;
        }

        /**
         * Reset the zoom back to the minimum zoom.
         */
        resetZoomState() {
            this.zoom = this.options.minZoom;
            this.sourceX = 0;
            this.sourceY = 0;
        }

        /**
         * Converts the specified mouse events to canvas relative coordinates where
         * (0, 0) is the top left corner of the canvas.
         * @param jQevt the mouse event
         * @returns {{x: number, y: number}}
         */
        mouseEvtToCanvasCoord(jQevt) {
            let offset = this.canvasElem.offset();
            return {
                x: jQevt.pageX- offset.left,
                y: jQevt.pageY- offset.top
            }
        }

        /**
         * Converts the specified canvas coordinate to the same coordinate on the video. Concretely if the specified
         * coordinate is of a specific item in the video scene, the returned coordinate will be the coordinate
         * of the same item relative to the video.
         *
         * This function is required because the size of the video may be larger than the available space
         * for the canvas.
         *
         * @param x the x coordinate relative to the canvas.
         * @param y the y coordinate relative to the canvas.
         * @returns {{x: number, y: number}} relative to the video.
         */
        canvasCoordToVideoCoord(x, y) {
            // Since we preserve the aspect ratio, the scale ratio for the width and height will be the same.
            let scaleRatio = this.videoWidth / this.canvasElem.width();
            return {
                x: ((x * scaleRatio) / this.zoom) + this.sourceX,
                y: ((y * scaleRatio) / this.zoom) + this.sourceY
            }
        }

        /**
         * Sanitise the source x and source y coordinate such that all the image data to be drawn to the canvas
         * falls within the bounds of the video.
         *
         * @param sx the proposed left corner of the video to be rendered.
         * @param sy the proposed top corner of the video to be rendered.
         * @param zoom the proposed zoom level.
         * @returns {{x: number, y: number}}
         */
        sanitizeSourceOffset(sx, sy, zoom) {
            let maxSourceX = this.videoWidth - (this.videoWidth / zoom);
            let maxSourceY = this.videoHeight - (this.videoHeight / zoom);
            return {
                x: Math.min(Math.max(0, sx), maxSourceX),
                y: Math.min(Math.max(0, sy), maxSourceY)
            }
        }

        /**
         * Render the current video frame to the canvas.
         */
        drawVideo() {
            // Update the canvas size if the source video has changed sized.
            if(this.videoElem.width() !== this.videoWidth || this.videoElem.height() !== this.videoHeight) {
                this.resizeCanvas();
            }

            // We always want to redraw the entire canvas.
            let dx = 0;
            let dy = 0;
            let dWidth = this.canvasElem.width();
            let dHeight = this.canvasElem.height();

            // The area of the video source will change depending on the zoom and pan state.
            let sx = this.sourceX;
            let sy = this.sourceY;
            let sWidth = this.videoWidth / this.zoom;
            let sHeight = this.videoHeight / this.zoom;

            this.canvasContext.drawImage(
                this.videoElem[0],
                sx, sy, sWidth, sHeight,
                dx, dy, dWidth, dHeight
            );


            this.drawPictureInPicture();
            this.drawZoomBounds();
            this.timer = setTimeout($.proxy(this.drawVideo, this), 1000/this.options.fpsRefreshRate);
        }

        /**
         * Renders a picture in picture view if the zoom level is greater than 1.
         */
        drawPictureInPicture() {
            // Only draw the PiP view if the zoom level > 1
            if(this.zoom === 1) {
                return;
            }

            // PiP Outline
            this.canvasContext.lineWidth = this.options.pictureInPicture.border.lineWidth;
            this.canvasContext.strokeStyle = this.options.pictureInPicture.border.strokeStyle;
            this.canvasContext.strokeRect(
                this.pipBounds.x, this.pipBounds.y,
                this.pipBounds.width, this.pipBounds.height);

            // PiP Content
            this.canvasContext.drawImage(
                this.videoElem[0],
                0, 0, this.videoWidth, this.videoHeight,
                this.pipBounds.x, this.pipBounds.y,
                this.pipBounds.width, this.pipBounds.height
            );

            // PiP Zoom Bounds
            this.canvasContext.lineWidth = this.options.pictureInPicture.zoom.lineWidth;
            this.canvasContext.strokeStyle = this.options.pictureInPicture.zoom.strokeStyle;
            this.canvasContext.strokeRect(
                this.pipZoomBounds.x, this.pipZoomBounds.y,
                this.pipZoomBounds.width, this.pipZoomBounds.height);
        }

        /**
         * @param x the x coordinate relative to the canvas.
         * @param y the y coordinate relative to the canvas.
         * @returns {boolean} True if the canvas coord is inside the boundary of the picture in picture, False otherwise.
         */
        isInPipBounds(x, y) {
            return (this.pipBounds.x <= x && x <= (this.pipBounds.x + this.pipBounds.width)) &&
                (this.pipBounds.y <= y && y <= (this.pipBounds.y + this.pipBounds.height));
        }

        /**
         * Returns the bounds of the current viewport within the PiP component. The width and height of the bounds will
         * change based on the current zoom level while the x and y coordinate of the bounds will change if the
         * viewport is panned.
         * @returns {{x: number, y: number, width: number, height: number}}
         */
        getPipZoomBounds() {
            let scale = this.pipBounds.width / this.videoWidth;
            let width = this.videoWidth / this.zoom * scale;
            let height = this.videoHeight / this.zoom * scale;
            return {
                x: this.pipBounds.x + (this.sourceX * scale),
                y: this.pipBounds.y + (this.sourceY * scale),
                width: width,
                height: height
            }
        }

        /**
         * Returns the bounds of the PiP component in canvas coordinates.
         * @returns {{x: number, y: number, width: number, height: number}}
         */
        getPipBounds() {
            let padding = this.options.pictureInPicture.padding;
            let dim = this.getSizeForAspectRatio(
                this.videoWidth, this.videoHeight,
                this.options.pictureInPicture.maxSideLength, this.options.pictureInPicture.maxSideLength
            );
            return {
                width: dim.width,
                height: dim.height,
                x: this.canvasElem.width() - dim.width - padding,
                y: this.canvasElem.height() - dim.height - padding
            }
        }

        /**
         * Resize the canvas such that it has the same aspect ratio as the video while fitting completely within the
         * bounds of its containing element.
         */
        resizeCanvas() {


            // If the canvas or video is resized reset the drag and zoom state because it will be invalid.
            this.reset();
            this.resetZoomState();

            let canvasParent = this.canvasElem.parent();
            let dim = this.getSizeForAspectRatio(
                this.videoElem.width(), this.videoElem.height(), canvasParent.width(), canvasParent.height());
            this.canvasElem.attr(dim);

            this.videoWidth = this.videoElem.width();
            this.videoHeight = this.videoElem.height();

            this.options.pictureInPicture.maxSideLength = this.options.pictureInPicture.sideLengthPercent * this.canvasElem.width();

            // If the canvas size changes the pip location will also change.
            this.pipBounds = this.getPipBounds();
            this.pipZoomBounds = this.getPipZoomBounds();
        }

        /**
         * Invoked when a mouse drag action is completed and the canvas should zoom to the selected area.
         *
         * The overall objective of this function is to render the entire selected are within the boundary of the
         * canvas at the highest zoom level possible.
         *
         * This function will update the internal source x, source y and zoom values which will be applied the next
         * time the canvas is redrawn.
         *
         * @param x the x coordinate relative to the canvas where the drag finished.
         * @param y the y coordinate relative to the canvas where the drag finished.
         */
        onMouseDragZoom(x, y) {
            let videoCoord = this.canvasCoordToVideoCoord(x, y);

            // For the sake of my sanity clean up the start and stop coordinates such that
            // the drag start will be the top left coord and the drag end is the bottom right coord.
            let dragStartVideo = {
                x: Math.min(this._mouseDownVideoCoord.x, videoCoord.x),
                y: Math.min(this._mouseDownVideoCoord.y, videoCoord.y)
            };
            let dragEndVideo = {
                x: Math.max(this._mouseDownVideoCoord.x, videoCoord.x),
                y: Math.max(this._mouseDownVideoCoord.y, videoCoord.y)
            };

            // First work out the center of the selected area.
            // Note that the selected area will not be the correct aspect ratio.
            let targetVideoWidth = Math.abs((dragStartVideo.x - dragEndVideo.x) / this.zoom);
            let targetVideoHeight = Math.abs((dragStartVideo.y - dragEndVideo.y) / this.zoom);
            let targetVideoCenter = {
                x: (targetVideoWidth / 2) + dragStartVideo.x,
                y: (targetVideoHeight / 2) + dragStartVideo.y
            };

            // Next clean up the aspect ratio of the selected area.
            // Keep in mind that while the area (dim) now has the correct aspect ratio, it is still going to be a
            // non-standard size. Concretely the size will not exactly match any integral zoom level.
            let dim = this.getSizeForAspectRatio(
                targetVideoWidth, targetVideoHeight, this.videoWidth, this.videoHeight);

            // Calculate the integral zoom level while clamping the min and max zoom levels.
            // This will be our new zoom level.
            let newZoomWidth = Math.round(this.canvasElem.width() / dim.width);
            let newZoomHeight = Math.round(this.canvasElem.height() / dim.height);
            let newZoom = Math.min(Math.min(newZoomWidth, newZoomHeight), this.options.maxZoom);

            // Based on the center of the selected area and the new zoom level, calculate sx and sy.
            let newSourceX = (targetVideoCenter.x) - (this.videoWidth / 2 / newZoom);
            let newSourceY = (targetVideoCenter.y) - (this.videoHeight / 2 / newZoom);

            // Now cap the result so that you cannot place the image off the canvas.
            let sourceOffset = this.sanitizeSourceOffset(newSourceX, newSourceY, newZoom);
            this.sourceX = sourceOffset.x;
            this.sourceY = sourceOffset.y;
            this.zoom = newZoom;

            this.pipZoomBounds = this.getPipZoomBounds();
        }

        /**
         * Draws the bounds of the selected area where the canvas will zoom to when the drag is complete.
         */
        drawZoomBounds() {
            if(this._mouseDragCoord === null || this._mouseDownCanvasCoord === null) {
                return;
            }

            this.canvasContext.lineWidth = this.options.zoomBounds.lineWidth;
            this.canvasContext.strokeStyle = this.options.zoomBounds.strokeStyle;
            let width = this._mouseDragCoord.x - this._mouseDownCanvasCoord.x;
            let height = this._mouseDragCoord.y - this._mouseDownCanvasCoord.y;

            this.canvasContext.strokeRect(
                this._mouseDownCanvasCoord.x, this._mouseDownCanvasCoord.y,
                width, height);
        }

        /**
         * Pans the canvas by updating the bounds of the video that is rendered to the canvas.
         * @param x the current x coordinate of the mouse relative to the canvas.
         * @param y the current y coordinate of the mouse relative to the canvas.
         */
        onMouseDragPan(x, y) {
            if(this._mouseDownVideoCoord === null || this.zoom === 1) {
                return;
            }

            // The objective of this function is to make the point where mouse down occurred be rendered
            // under the current x, y coordinate of the mouse. This is your typical drag to pan functionality.
            // let startVideoCoord = this._mouseDownVideoCoord;
            let videoCoord = this.canvasCoordToVideoCoord(x, y);

            let newSourceX = ((this._mouseDownVideoCoord.x - videoCoord.x) / this.zoom) + this.sourceX;
            let newSourceY = ((this._mouseDownVideoCoord.y - videoCoord.y) / this.zoom) + this.sourceY;

            // Now cap the result so that you cannot pan the image off the canvas.
            let sourceOffset = this.sanitizeSourceOffset(newSourceX, newSourceY, this.zoom);
            this.sourceX = sourceOffset.x;
            this.sourceY = sourceOffset.y;

            this.pipZoomBounds = this.getPipZoomBounds();
        }

        /**
         * Converts canvas coordinates to the equivalent point (in canvas coordinates) within the PiP bounds.
         * @param x the current x coordinate of the mouse relative to the canvas.
         * @param y the current y coordinate of the mouse relative to the canvas.
         * @returns {{x: number, y: number}}
         */
        canvasCoordToPipCoord(x, y) {
            return {
                x: x - this.pipBounds.x,
                y: y - this.pipBounds.y
            }
        }

        /**
         * Pans the viewport based on the position of the mouse within the PiP component.
         * @param x the current x coordinate of the mouse relative to the canvas.
         * @param y the current y coordinate of the mouse relative to the canvas.
         */
        onMousePipPan(x, y) {
            let pipCoord = this.canvasCoordToPipCoord(x, y);
            let scale = this.videoElem.width() / this.pipBounds.width;

            let newVideoCenter = {
                x: pipCoord.x * scale,
                y: pipCoord.y * scale
            };

            // Based on the center of the selected area and the new zoom level, calculate sx and sy.
            let newSourceX = (newVideoCenter.x) - (this.videoWidth / 2 / this.zoom);
            let newSourceY = (newVideoCenter.y) - (this.videoHeight / 2 / this.zoom);

            let sourceOffset = this.sanitizeSourceOffset(newSourceX, newSourceY, this.zoom);
            this.sourceX = sourceOffset.x;
            this.sourceY = sourceOffset.y;
            this.pipZoomBounds = this.getPipZoomBounds();
        }

        /**
         * Zooms the canvas while keeping the mouse pointer over the same point in the video.
         * @param isZoomOut true if we are zooming out, false otherwise.
         * @param x the current x coordinate of the mouse pointer relative to the canvas.
         * @param y the current y coordinate of the mouse pointer relative to the canvas.
         */
        onMouseWheelZoom(isZoomOut, x, y) {
            let new_zoom = isZoomOut ? this.zoom / 2 : this.zoom * 2;
            new_zoom = Math.max(Math.min(this.options.maxZoom, new_zoom), this.options.minZoom);

            // Since we preserve the aspect ratio, the scale ratio for the width and height will be the same.
            let scaleRatio = this.videoWidth / this.canvasElem.width();
            x = x * scaleRatio;
            y = y * scaleRatio;

            let newSourceX = 0;
            let newSourceY = 0;
            // Rounding errors can accumulate but if you hit a zoom level of 1, then you know that sx and sy is
            // definitely going to be zero. This will "reset" any rounding errors that have built up.
            if(new_zoom > 1) {
                // For the specified x and y coord calculate the corresponding x and y coord on the original video.
                let videoX = (x / this.zoom) + this.sourceX;
                let videoY = (y / this.zoom) + this.sourceY;

                // For the new zoom level, calculate the new corresponding x and y coord.
                // For the moment canvasX and canvasY is the coordinate if the entire area is rendered.
                let canvasX = videoX * new_zoom;
                let canvasY = videoY * new_zoom;

                // Calculate the source X and source Y coordinate so that the mouse pointer is over the same position
                // on the image.
                newSourceX = (canvasX - x) / new_zoom;
                newSourceY = (canvasY - y) / new_zoom;
            }

            let sourceOffset = this.sanitizeSourceOffset(newSourceX, newSourceY, new_zoom);
            this.sourceX = sourceOffset.x;
            this.sourceY = sourceOffset.y;
            this.zoom = new_zoom;

            this.pipZoomBounds = this.getPipZoomBounds();
        }

        /**
         * Returns the largest width and height that will fit within the boundary of the target maximum while
         * maintaining the same aspect ratio as the source width and height.
         *
         * @param srcWidth the width of the source.
         * @param srcHeight the height of the source.
         * @param targetMaxWidth the maximum allowable width.
         * @param targetMaxHeight the maximum allowable height.
         * @returns {{width: number, height: number}}
         */
        getSizeForAspectRatio(srcWidth, srcHeight, targetMaxWidth, targetMaxHeight) {
            let srcAspectRatio = srcWidth / srcHeight;

            let w = Math.min(srcWidth, targetMaxWidth);
            let h = w / srcAspectRatio;
            if (h > targetMaxHeight) {
                h = Math.min(srcHeight, targetMaxHeight);
                w = h * srcAspectRatio;
            }

            return {
                width: w,
                height: h,
            };
        }
    }
}(window.portal.VideoCanvas));


