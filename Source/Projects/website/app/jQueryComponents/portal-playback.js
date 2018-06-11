import $ from 'jquery';

window.$ = $;
window.jQuery = $;

/*jshint esversion: 6 */

(function(ns, jQuery, doc) {
    "use strict";

    let sessionKeyFunc = null;
    $(document).ready(sessionKeyFunc = () =>  $("#session_key" ).val() );
    const getSessionKey = () => {
      let token = null;
      while (token ===  null) {
        token = sessionKeyFunc();
      }
      setTimeout(null, 2000)
      return token;
    }

    /**
     * An Anomaly for anomaly video playback - implements the IVideoTimelineItem
    */
    ns.Anomaly = class extends ns.IVideoTimelineItem {
        /**
         * Constructor
         * @override
         */
        constructor(pk, start, end, cameraPK, cameraName, host, color=null){
            super(pk, start, end, color);
            // additional information for anomaly data
            this.date = moment(parseInt(start, 10)).format('YYYY/MM/DD');
            this.time = moment(parseInt(start, 10)).format('HH:mm:ss');
            this.duration = end - start;
            this.cameraPK = cameraPK;
            this.camera = cameraName;
            this.host = host;
            this.videoSrc =  'https://'+host+'/portal/playback/anomaly/'+pk+'/?session_key='+getSessionKey();
            // to test with local video only during development - comment out the above and
            // uncomment the line below (updating as appropriate to retrieve the test video)
            //     this.videoSrc =  '/portal/static/video/test-5mins-24fps.mp4';
            // recommend downloading the 5 minute YouTube video available here:
            //     https://www.youtube.com/watch?v=CW7-nFObkpw
            // and re-encoding it with `ffmpeg` to a resolution of 640x480 and a frame rate of
            // 24FPS (or similar) like so:
            //     ffmpeg -i DOWNLOADED_VIDEO.mp4 -r 24 -f mp4 -strict -2 -pix_fmt yuv420p test-5mins-24fps.mp4
        }
        /**
         * Required implementation of the getVideoSrc() method
         *
         * @return {string} the URL of the video assoicated with the video timeline item
         * @override
         */
        getVideoSrc(){
            return this.videoSrc;
        }
    };

    /**
     * A single camera playback - combines a large number of widgets together to create a widget
     * for playing back anomalies from a single camera
     */
    ns.PlaybackSingle = class {
        constructor(opts, abc) {
            // DOM elements
            this.busyIndicator = opts.busyIndicator;
            this.timeline = opts.timeline;
            this.dateTimeRangePicker = opts.dateTimeRangePicker;
            this.anomalyTable = opts.anomalyTable;
            this.playbackControls = opts.playbackControls;
            this.continuousPlayToggle = opts.continuousPlayToggle;
            this.zoomControls = opts.zoomControls;
            this.playbackSpeedSlider = opts.playbackSpeedSlider;
            this.video = opts.video;
            this.cameraSelector = opts.cameraSelector;
            // other options
            this.datetimeRange = opts.datetimeRange;
            this.cameraPK = opts.cameraPK;
            this.initialAnomaly = opts.initialAnomaly;
            this.cameraviewToCameras = opts.cameraviewToCameras;
            this.anomaliesForCamerasUrl = opts.anomaliesForCamerasUrl;
            // internal state tracking
            this.isTableSelectionTriggeredByTimeline = false;

            // build up the playback wall widgets
            this._initialiseGUI();
            // initialise and tie together the event handling
            this._initialiseEvents();

            // populate the initial set of anomalies
            this.updateAnomalies();
        }

        /**
         * Update the anomalies according to the current state of the PlaybackWall
         */
        updateAnomalies() {
            $(this.busyIndicator.container).show();

            this.timelineWidget.clearTimelineItems();
            this.anomalyTableWidget.clear();

            let params = jQuery.extend({}, this.datetimeRange);

            jQuery.ajax({
                url: this.anomaliesForCamerasUrl.replace(/0/, ''+this.cameraPK),
                method: 'GET',
                data: params,
                dataType: 'json',
                traditional: true,
                success: function (data) {
                    if(data.length > 0){
                        let anomalies = data.map(function(x){
                            return new ns.Anomaly(
                                x.id,
                                x.start, x.end,
                                x.camera_id, x.camera_name,
                                x.host,
                                x.sessionKey,
                            );
                        });
                        // add the items to the timeline, but only render it after restricting
                        // the view to the first item by zooming to it first
                        this.timelineWidget.addTimelineItems(anomalies, false).zoomToItem(anomalies[0], 1.2, true);
                        this.anomalyTableWidget.setAnomalies(anomalies);
                        if(this.initialAnomaly !== null){
                            // scroll to the initial anomaly if one is specified
                            this.anomalyTableWidget.select(this.initialAnomaly);
                            // clear the initial anomaly because this only happens the first time
                            this.initialAnomaly = null;
                        } else {
                            // scroll to the first item
                            this.anomalyTableWidget.select(anomalies[0]);
                        }
                    }
                }.bind(this),
                error: function(){}.bind(this),
                complete: function(){
                    $(this.busyIndicator.container).hide();
                }.bind(this)
            });
        }

        /**
         * Initialises all the internal widgets that comprise the playback wall
         * @private
         */
        _initialiseGUI() {
            $(this.busyIndicator.container).hide();

            // set up the datetime picker widget
            let datetimeRangepickerOptions = {
                timePickerSeconds: false,
                locale: {format: 'DD/MM/YYYY HH:mm'}
            };
            if (this.datetimeRange) {
                // initial date/time range
                datetimeRangepickerOptions.rangeSpecifier = this.datetimeRange;
            }
            new portal.FieldUtils.DateTimeRangePicker(this.dateTimeRangePicker.container, datetimeRangepickerOptions);

            // set up the timeline
            let defaultTimeLineOption = {
                // we only encode the first 3 mins of video, so restrict the rendered duration to
                // that amount
                maxRenderedDuration: 3 * 60 * 1000,
                nowIndicatorPosition: 1.0 / 3.0
            };
            let timeLineOptions = jQuery.extend(true, {}, defaultTimeLineOption, this.timeline.options);

            console.log('portal-playback PlaybackSingle timeLineOptions', timeLineOptions);

            this.timelineWidget = new portal.Timeline(this.timeline.container, timeLineOptions);

            // set up the timeline video playback manager
            let defaultTimelineVideoManagerOptions = {};
            let timelineVideoManagerOptions = jQuery.extend(true, {}, defaultTimelineVideoManagerOptions, this.video.options);
            this.timelineVideoManager = new portal.TimelineVideoManager(
                this.timelineWidget, this.video.videoElm, timelineVideoManagerOptions
            );

            // set up the media controls (play, pause etc)
            let defaultPlaybackControlsOptions = {
                toolbar: {
                    klasses: ['btn-toolbar'],
                    buttonGroup: {
                        klasses: ['btn-group', 'btn-group-lg'],
                        buttons: {
                            skipToFirst: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent'],
                            },
                            skipToPrevious: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            },
                            playPause: {
                                klasses: ['btn', 'btn-primary']
                            },
                            skipToNext: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            },
                            skipToLast: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            }
                        }
                    }
                }
            };
            let playbackControlsOptions = jQuery.extend(true, {}, defaultPlaybackControlsOptions, this.playbackControls.options);
            this.playbackControlsWidget = new portal.MediaControls(this.playbackControls.container, playbackControlsOptions);

            // set up the zoom controls
            let defaultZoomControlsOptions = {
                buttonGroup: {
                    klasses: ['btn-group', 'btn-group-sm', 'pull-left'],
                    buttons: {
                        zoomIn: {
                            klasses: ['btn', 'btn-default'],
                        },
                        zoomOut: {
                            klasses: ['btn', 'btn-default'],
                        },
                        zoomExtents: {
                            klasses: ['btn', 'btn-default'],
                        }
                    }
                }
            };
            let zoomControlsOptions = jQuery.extend(true, {}, defaultZoomControlsOptions, this.zoomControls.options);
            new portal.ZoomControls(this.zoomControls.container, zoomControlsOptions);

            // initialise playback rate selector
            let playbackRates = this.timelineVideoManager.getPlaybackRates();
            new portal.PlaybackSpeedSlider(this.playbackSpeedSlider.container, playbackRates);

            // initialise anomaly table
            let defaultAnomalyTableWidgetOptions = {
                size: {height: 700},
                table:{
                    columns:{
                        visibility:{
                             // hide the camera name column - all anomalies are from the same
                            // camera so this information is superfluous
                            camera:false
                        }
                    }
                }
            };
            let anomalyTableWidgetOptions = jQuery.extend(true, {}, defaultAnomalyTableWidgetOptions, this.anomalyTable.options);

            console.log('portal-playback PlaybackSingle anomalyTableWidgetOptions', anomalyTableWidgetOptions);

            this.anomalyTableWidget = new portal.AnomalyTable(this.anomalyTable.container, anomalyTableWidgetOptions);
        }

        /**
         * Initialises and ties together all the event handling for the widgets in the playback
         * wall
         * @private
         */
        _initialiseEvents() {
            // camera selector dropdown
            let $cameraSelector = $(this.cameraSelector);
            $cameraSelector.on({
                'change':function(){
                    this.cameraPK = $cameraSelector.val();
                    this.updateAnomalies();
                }.bind(this)
            });

            // Date/time range picker
            $(this.dateTimeRangePicker.container).on({
                'apply.daterangepicker': function (ev, picker) {
                    let startEpoch = picker.startDate.valueOf();
                    let endEpoch = picker.endDate.valueOf();
                    if (this.datetimeRange.start !== startEpoch || this.datetimeRange.end !== endEpoch) {
                        this.datetimeRange = {start: startEpoch, end: endEpoch};
                        this.updateAnomalies();
                    }
                }.bind(this)
            });

            this.isTableSelectionTriggeredByTimeline = false;
            let debouncedNowItemsChangedHandler = portal.debounce(
                function (jQevt) {
                    if (this.timelineWidget.isTransitioning()) {
                        // don't bother while the timeline is transitioning from one visible range
                        // to another
                        return;
                    }
                    let evt = jQevt.originalEvent;
                    let items = evt.items;
                    if (items === null || items.length === 0) {
                        this.anomalyTableWidget.deselectAll();
                    } else {
                        this.isTableSelectionTriggeredByTimeline = true;
                        this.anomalyTableWidget.select(items, true);
                        this.isTableSelectionTriggeredByTimeline = false;
                    }
                }.bind(this), 50
            );

            $(this.playbackControls.container).on({
                'media-control-skip-to-first': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = timeline.getFirstTimelineItem();
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-skip-to-previous': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let timelineNow = timeline.getNow();
                    let nowItems = this.timelineWidget.getTimelineItemsForNow();
                    if (nowItems.length !== 0 && nowItems[0].start === timelineNow) {
                        timelineNow -= 1;
                    }
                    let item = this.timelineWidget.getTimelineItemBefore(timelineNow);
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-play': function () {
                    if (!this.timelineVideoManager.isPlaybackActive()) {
                        let timeline = this.timelineVideoManager.getTimeline();
                        let nowItems = timeline.getTimelineItemsForNow();
                        if (nowItems.length > 0) {
                            this.timelineVideoManager.startPlayback();
                        } else {
                            this.timelineVideoManager.playOnToNextItem();
                        }
                    }
                }.bind(this),
                'media-control-pause': function () {
                    if (this.timelineVideoManager.isPlaybackActive()) {
                        this.timelineVideoManager.pausePlayback();
                    }
                }.bind(this),
                'media-control-skip-to-next': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = this.timelineWidget.getTimelineItemAfter(timeline.getNow());
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-skip-to-last': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = timeline.getLastTimelineItem();
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this)
            });
            $(this.continuousPlayToggle.container).on({
                'click':function(){
                    let isContinuous = this.timelineVideoManager.playbackIsContinous();
                    $(this.continuousPlayToggle.container).toggleClass('btn-success', !isContinuous);
                    this.timelineVideoManager.setContinousPlayback(!isContinuous);
                }.bind(this)
            });

            $(this.zoomControls.container).on({
                'zoom-control-in': function () {
                    this.timelineVideoManager.transitionZoom(1.5);
                }.bind(this),
                'zoom-control-out': function () {
                    this.timelineVideoManager.transitionZoom(1.0 / 1.5);
                }.bind(this),
                'zoom-control-extents': function () {
                    let start = this.timelineWidget.getStart();
                    let duration = this.timelineWidget.getTotalDuration();
                    let halfDuration = duration * 0.5;
                    let middle = start + halfDuration;
                    this.timelineVideoManager.transitionVisibleRange(middle - (halfDuration * 1.2),
                        middle + (halfDuration * 1.2));
                }.bind(this)
            });

            $(this.timeline.container).on({
                'timeline-play': function () {
                    this.playbackControlsWidget.setPlaying();
                }.bind(this),
                'timeline-pause': function () {
                    this.playbackControlsWidget.setPaused();
                }.bind(this),
                'timeline-playback-rate-changed': function (jQevt) {
                    // ignore
                }.bind(this),
                'timeline-transition-complete': function (jQevt) {
                    let items = this.timelineWidget.getTimelineItemsForNow();
                    if (items.length === 0) {
                        this.anomalyTableWidget.deselectAll();
                    } else {
                        this.isTableSelectionTriggeredByTimeline = true;
                        this.anomalyTableWidget.select(items[0], true);
                        this.isTableSelectionTriggeredByTimeline = false;
                    }
                }.bind(this),
                'timeline-now-items-changed': debouncedNowItemsChangedHandler
            });

            $(this.anomalyTable.container).on({
                'anomaly-table-select': function (jQevt) {
                    if (this.isTableSelectionTriggeredByTimeline) {
                        return;
                    }

                    let evt = jQevt.originalEvent;
                    let anomalies = evt.anomalies;
                    this.timelineVideoManager.transitionToItems(anomalies);
                }.bind(this)
            });

            $(this.playbackSpeedSlider.container).on('playback-speed-slider-change', function (jQevt) {
                // playback speed slider has changed position - update video playback rate
                let evt = jQevt.originalEvent;
                let playbackRateIdx = evt.index;
                this.timelineVideoManager.setPlaybackRate(playbackRateIdx);
            }.bind(this));

            // add event handlers for keyboard navigation controls
            $('body').on('keypress', function (jQevt) {
                let evt = jQevt.originalEvent;
                if (evt.keyCode === 37 || evt.keyCode === 39) {
                    evt.preventDefault();
                    this.timelineVideoManager.pausePlayback();
                    // left arrow (37) or right arrow (39)
                    let direction = evt.keyCode === 37 ? -1 : 1;
                    let ctrlKey = evt.ctrlKey;

                    let timeline = this.timelineVideoManager.getTimeline();
                    let timelineNow = timeline.getNow();
                    let next = timelineNow;
                    if (ctrlKey) {
                        // CTRL+LEFT/RIGHT ARROW
                        // step back and forward by "one item"
                        let item = null;
                        if (direction < 0) {
                            item = timeline.getTimelineItemBefore(timelineNow - 1);
                        } else {
                            item = timeline.getTimelineItemAfter(timelineNow + 1);
                        }
                        if (item !== null) {
                            timeline.transitionNow(item.start, 100);
                        }
                    } else {
                        // LEFT/RIGHT ARROW
                        // step back and forward by one minor tick interval
                        let step = timeline.getMinorTickInterval();
                        let chunk = timelineNow / step;
                        if (Math.floor(chunk) !== 0) {
                            chunk = direction < 0 ? Math.ceil(timelineNow / step)    // left
                                : Math.floor(timelineNow / step); // right
                        }
                        next = (chunk * step) + (step * direction);
                        timeline.setNow(next);
                    }
                } else if (evt.keyCode === 38 || evt.keyCode === 40) {
                    // UP/DOWN ARROW
                    // zoom in/out
                    evt.preventDefault();
                    this.timelineVideoManager.pausePlayback();
                    // up arrow (38) or down arrow (40)
                    let zoomFactor = evt.keyCode === 38 ? 1.2 : 1.0 / 1.2;
                    let timeline = this.timelineVideoManager.getTimeline();
                    timeline.transitionZoom(zoomFactor, 100);
                }
            }.bind(this));
        }
    };

    /**
     * A playback wall - combines a large number of widgets together to create a playback wall
     */
    ns.PlaybackWall = class{
        constructor(opts) {
            // DOM elements
            this.busyIndicator = opts.busyIndicator;
            this.timeline = opts.timeline;
            this.dateTimeRangePicker = opts.dateTimeRangePicker;
            this.anomalyTable = opts.anomalyTable;
            this.playbackControls = opts.playbackControls;
            this.continuousPlayToggle = opts.continuousPlayToggle;
            this.zoomControls = opts.zoomControls;
            this.playbackSpeedSlider = opts.playbackSpeedSlider;
            this.videoWall = opts.videoWall;
            this.cameraViewSelector = opts.cameraViewSelector;
            // other options
            this.datetimeRange = opts.datetimeRange;
            this.cameraPKs = opts.cameraPKs;
            this.cameraviewToCameras = opts.cameraviewToCameras;
            this.anomaliesForCamerasUrl = opts.anomaliesForCamerasUrl;
            this.singlePlaybackJump = opts.singlePlaybackJump;

            // internal state tracking
            this.isTableSelectionTriggeredByTimeline = false;

            // build up the playback wall widgets
            this._initialiseGUI();
            // initialise and tie together the event handling
            this._initialiseEvents();

            // populate the initial set of anomalies
            this.updateAnomalies();
        }
        /**
         * Update the anomalies according to the current state of the PlaybackWall
         */
        updateAnomalies()
        {
            $(this.busyIndicator.container).show();
            this.timelineWidget.clearTimelineItems();
            this.anomalyTableWidget.clear();

            let params = {ids: this.cameraPKs};
            params = jQuery.extend(params, this.datetimeRange);

            jQuery.ajax({
                url: this.anomaliesForCamerasUrl,
                method: 'GET',
                data: params,
                dataType: 'json',
                traditional: true,
                success: function (data) {
                    let anomalies = [];
                    let keys = Object.getOwnPropertyNames(data);
                    for (let idx = 0; idx < keys.length; idx++) {
                        let cameraPK = keys[idx];
                        let cameraRecord = data[cameraPK];
                        let cameraName = cameraRecord.name;
                        let cameraHost = cameraRecord.host;
                        anomalies = anomalies.concat(
                            cameraRecord.anomalies.map(function (x) {
                                return new ns.Anomaly(
                                    x.id,
                                    x.start, x.end,
                                    cameraPK, cameraName,
                                    cameraHost,
                                );
                            })
                        );
                    }
                    if (anomalies.length > 0) {
                        // order the anomalies chronologically so that we can extract the first one
                        anomalies = anomalies.sort(function (a, b) { return a.start - b.start; });
                        // add the items to the table - this seems to be very time consuming,
                        // especially for large numbers of items; should perhaps be AJAXed...?
                        this.anomalyTableWidget.setAnomalies(anomalies);
                        // add the items to the timeline, but only render it after restricting
                        // the view to the first item by zooming to it first
                        this.timelineWidget.addTimelineItems(anomalies, false).zoomToItem(anomalies[0], 1.2, true);

                        // inject styles so that table row selection colors match timeline colors
                        // NOTE - I've tried to do the same with CSS classes based on the slot
                        // indices the anomalies occupy in the timeline rather than individual CSS
                        // IDs to reduce the amount of injected CSS rules, but for some reason they
                        // don't seem to work at all. In any case I suspect that even if I had been
                        // able to make them work they would be less performant than IDs, so...
                        //     ¯\_(ツ)_/¯
                        // It's probably for the best in the end - in any case the current CSS
                        // injection takes well under 1/10th of a second in my testing, so it's not
                        // a noticeable performance hit, especially in comparison to the datatables
                        // initialisation which takes place above.
                        let styleOverrides = [];
                        for (let idx = 0; idx < anomalies.length; idx++) {
                            let anomaly = anomalies[idx];
                            let color = this.timelineWidget.getSlotColor(anomaly);
                            let tableRowId = this.anomalyTableWidget.getRowID(anomaly);
                            styleOverrides.push('#' + tableRowId + '.selected{background-color:' + color + ';}');
                        }
                        portal.injectStyles(styleOverrides.join(''), 'anomalyTableRowSelectionColorOverrides');

                        // force a 'now items changed' event to make the table, video wall, etc update
                        this.timelineWidget.triggerNowItemsChanged();
                    }
                }.bind(this),
                error: function () {}.bind(this),
                complete: function () {
                    $(this.busyIndicator.container).hide();
                }.bind(this)
            });
        }

        /**
         * Initialises all the internal widgets that comprise the playback wall
         * @private
         */
        _initialiseGUI() {
            $(this.busyIndicator.container).hide();

            // set up the datetime picker widget
            let datetimeRangepickerOptions = {
                timePickerSeconds: false,
                locale: {format: 'DD/MM/YYYY HH:mm'}
            };
            if (this.datetimeRange) {
                // initial date/time range
                datetimeRangepickerOptions.rangeSpecifier = this.datetimeRange;
            }
            new portal.FieldUtils.DateTimeRangePicker(this.dateTimeRangePicker.container, datetimeRangepickerOptions);

            // set up the timeline
            let defaultTimeLineOption = {
                // we only encode the first 3 mins of video, so restrict the rendered duration to
                // that amount
                maxRenderedDuration: 3 * 60 * 1000,
                nowIndicatorPosition: 1.0 / 3.0
            };
            let timeLineOptions = jQuery.extend(true, {}, defaultTimeLineOption, this.timeline.options);

            console.log('portal-playback PlaybackWall timeLineOptions', timeLineOptions);

            this.timelineWidget = new portal.Timeline(this.timeline.container, timeLineOptions);

            // set up the timeline video playback manager
            let defaultTimelineVideoManagerOptions = {};
            let timelineVideoManagerOptions = jQuery.extend(true, {}, defaultTimelineVideoManagerOptions, this.videoWall.options);
            this.timelineVideoManager = new portal.TimelineVideoManager(
                this.timelineWidget, this.videoWall.videoElms, timelineVideoManagerOptions
            );

            // set up the media controls (play, pause etc)
            let defaultPlaybackControlsOptions = {
                toolbar: {
                    klasses: ['btn-toolbar'],
                    buttonGroup: {
                        klasses: ['btn-group', 'btn-group-lg'],
                        buttons: {
                            skipToFirst: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent'],
                            },
                            skipToPrevious: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            },
                            playPause: {
                                klasses: ['btn', 'btn-primary']
                            },
                            skipToNext: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            },
                            skipToLast: {
                                klasses: ['btn', 'btn-primary', 'icetana-transparent']
                            }
                        }
                    }
                }
            };
            let playbackControlsOptions = jQuery.extend(true, {}, defaultPlaybackControlsOptions, this.playbackControls.options);
            this.playbackControlsWidget = new portal.MediaControls(this.playbackControls.container, playbackControlsOptions);

            // set up the zoom controls
            let defaultZoomControlsOptions = {
                buttonGroup: {
                    klasses: ['btn-group', 'btn-group-sm', 'pull-left'],
                    buttons: {
                        zoomIn: {
                            klasses: ['btn', 'btn-default'],
                        },
                        zoomOut: {
                            klasses: ['btn', 'btn-default'],
                        },
                        zoomExtents: {
                            klasses: ['btn', 'btn-default'],
                        }
                    }
                }
            };
            let zoomControlsOptions = jQuery.extend(true, {}, defaultZoomControlsOptions, this.zoomControls.options);
            new portal.ZoomControls(this.zoomControls.container, zoomControlsOptions);

            // initialise playback rate selector
            let playbackRates = this.timelineVideoManager.getPlaybackRates();
            new portal.PlaybackSpeedSlider(this.playbackSpeedSlider.container, playbackRates);

            // initialise anomaly table
            let defaultAnomalyTableWidgetOptions = {
                size: {height: 700},
                table: {
                    rows: {
                        // enable selection of mutiple rows
                        selection: 'os'
                    }
                }
            };
            let anomalyTableWidgetOptions = jQuery.extend(true, {}, defaultAnomalyTableWidgetOptions, this.anomalyTable.options);

            console.log('portal-playback PlaybackWall anomalyTableWidgetOptions', anomalyTableWidgetOptions);

            this.anomalyTableWidget = new portal.AnomalyTable(this.anomalyTable.container, anomalyTableWidgetOptions);
        }
        /**
         * Initialises and ties together all the event handling for the widgets in the playback
         * wall
         * @private
         */
        _initialiseEvents(){
            // cameraview selector dropdown
            let $cameraViewSelector = $(this.cameraViewSelector);
            $cameraViewSelector.on({
                'change':function(){
                    let camerasetPK = $cameraViewSelector.val();
                    this.cameraPKs = this.cameraviewToCameras[camerasetPK];
                    this.updateAnomalies();
                }.bind(this)
            });

            // Date/time range picker
            $(this.dateTimeRangePicker.container).on({
                'apply.daterangepicker':function(ev, picker) {
                    let startEpoch = picker.startDate.valueOf();
                    let endEpoch = picker.endDate.valueOf();
                    if(this.datetimeRange.start !== startEpoch || this.datetimeRange.end !== endEpoch){
                        this.datetimeRange = {start:startEpoch, end:endEpoch};
                        this.updateAnomalies();
                    }
                }.bind(this)
            });

            this.isTableSelectionTriggeredByTimeline = false;
            let debouncedNowItemsChangedHandler = portal.debounce(
                function(jQevt){
                    if(this.timelineWidget.isTransitioning()) {
                        // don't bother while the timeline is transitioning from one visible range
                        // to another
                        return;
                    }
                    let evt = jQevt.originalEvent;
                    let items = evt.items;
                    if(items===null || items.length===0){
                        this.anomalyTableWidget.deselectAll();
                    } else {
                        this.isTableSelectionTriggeredByTimeline = true;
                        this.anomalyTableWidget.select(items, true);
                        this.isTableSelectionTriggeredByTimeline = false;
                    }
                }.bind(this), 50
            );

            $(this.playbackControls.container).on({
                'media-control-skip-to-first': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = timeline.getFirstTimelineItem();
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-skip-to-previous': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let timelineNow = timeline.getNow();
                    let nowItems = this.timelineWidget.getTimelineItemsForNow();
                    if (nowItems.length !== 0 && nowItems[0].start === timelineNow) {
                        timelineNow -= 1;
                    }
                    let item = this.timelineWidget.getTimelineItemBefore(timelineNow);
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-play': function () {
                    if (!this.timelineVideoManager.isPlaybackActive()) {
                        let timeline = this.timelineVideoManager.getTimeline();
                        let nowItems = timeline.getTimelineItemsForNow();
                        if (nowItems.length > 0) {
                            this.timelineVideoManager.startPlayback();
                        } else {
                            this.timelineVideoManager.playOnToNextItem();
                        }
                    }
                }.bind(this),
                'media-control-pause': function () {
                    if (this.timelineVideoManager.isPlaybackActive()) {
                        this.timelineVideoManager.pausePlayback();
                    }
                }.bind(this),
                'media-control-skip-to-next': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = this.timelineWidget.getTimelineItemAfter(timeline.getNow());
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this),
                'media-control-skip-to-last': function () {
                    this.timelineVideoManager.pausePlayback();
                    let timeline = this.timelineVideoManager.getTimeline();
                    let item = timeline.getLastTimelineItem();
                    this.timelineVideoManager.transitionToItem(item);
                }.bind(this)
            });

            $(this.continuousPlayToggle.container).on({
                'click':function(){
                    let isContinuous = this.timelineVideoManager.playbackIsContinous();
                    $(this.continuousPlayToggle.container).toggleClass('btn-success', !isContinuous);
                    this.timelineVideoManager.setContinousPlayback(!isContinuous);
                }.bind(this)
            });

            $(this.zoomControls.container).on({
                'zoom-control-in': function () {
                    this.timelineVideoManager.transitionZoom(1.5);
                }.bind(this),
                'zoom-control-out': function () {
                    this.timelineVideoManager.transitionZoom(1.0 / 1.5);
                }.bind(this),
                'zoom-control-extents': function () {
                    let start = this.timelineWidget.getStart();
                    let duration = this.timelineWidget.getTotalDuration();
                    let halfDuration = duration * 0.5;
                    let middle = start + halfDuration;
                    this.timelineVideoManager.transitionVisibleRange(middle - (halfDuration * 1.2),
                                                                middle + (halfDuration * 1.2));
                }.bind(this)
            });

            $(this.timeline.container).on({
                'timeline-play':function(){
                    this.playbackControlsWidget.setPlaying();
                }.bind(this),
                'timeline-pause':function(){
                    this.playbackControlsWidget.setPaused();
                }.bind(this),
                'timeline-playback-rate-changed':function(jQevt){
                    // ignore
                }.bind(this),
                'timeline-transition-complete':function(jQevt){
                    let items = this.timelineWidget.getTimelineItemsForNow();
                    if(items.length===0){
                        this.anomalyTableWidget.deselectAll();
                    } else {
                        this.isTableSelectionTriggeredByTimeline = true;
                        this.anomalyTableWidget.select(items[0], true);
                        this.isTableSelectionTriggeredByTimeline = false;
                    }
                }.bind(this),
                'timeline-now-items-changed':debouncedNowItemsChangedHandler
            });

            $(this.anomalyTable.container).on({
                'anomaly-table-select':function(jQevt){
                    if(this.isTableSelectionTriggeredByTimeline) {
                        return;
                    }

                    let evt = jQevt.originalEvent;
                    let anomalies = evt.anomalies;
                    this.timelineVideoManager.transitionToItems(anomalies);
                }.bind(this)
            });

            $(this.playbackSpeedSlider.container).on('playback-speed-slider-change', function(jQevt){
                // playback speed slider has changed position - update video playback rate
                let evt = jQevt.originalEvent;
                let playbackRateIdx = evt.index;
                this.timelineVideoManager.setPlaybackRate(playbackRateIdx);
            }.bind(this));

            $(this.videoWall.videoElms).on('timeline-video-clicked', function(jQevt){
                // when video panels are clicked, jump to the camera view for the anomaly displayed
                // in the clicked pane, with the smae time range (if any), the anomaly pre-selected
                // in the table and centered on the playback timeline
                if(this.singlePlaybackJump){
                    // jump to the single camera view for the clicked anomaly
                    let evt = jQevt.originalEvent;
                    let anomaly = evt.item;
                    if(anomaly) {
                        // set up the 'base' URL
                        let baseUrl = this.singlePlaybackJump.baseUrl.replace(/0/, ''+anomaly.cameraPK);
                        // set up the query parameters for the URL
                        let queryParams = {};
                        let paramKeys = this.singlePlaybackJump.paramKeys;
                        queryParams[paramKeys.anomaly] = anomaly.pk;
                        if(this.datetimeRange !== null) {
                            // preserve the current date/time range
                            queryParams[paramKeys.start] = this.datetimeRange.start;
                            queryParams[paramKeys.end] = this.datetimeRange.end;
                        }
                        // jump to the page
                        document.location = baseUrl+'?'+jQuery.param(queryParams);
                    }
                }
            }.bind(this));

            // add event handlers for keyboard navigation controls
            $('body').on('keypress', function(jQevt){
                let evt = jQevt.originalEvent;
                if(evt.keyCode === 37 || evt.keyCode === 39){
                    evt.preventDefault();
                    this.timelineVideoManager.pausePlayback();
                    // left arrow (37) or right arrow (39)
                    let direction = evt.keyCode === 37 ? -1 : 1;
                    let ctrlKey = evt.ctrlKey;

                    let timeline = this.timelineVideoManager.getTimeline();
                    let timelineNow = timeline.getNow();
                    let next = timelineNow;
                    if(ctrlKey){
                        // CTRL+LEFT/RIGHT ARROW
                        // step back and forward by "one item"
                        let item = null;
                        if(direction < 0){
                            item = timeline.getTimelineItemBefore(timelineNow-1);
                        } else {
                            item = timeline.getTimelineItemAfter(timelineNow+1);
                        }
                        if(item !== null){
                            timeline.transitionNow(item.start, 100);
                        }
                    } else {
                        // LEFT/RIGHT ARROW
                        // step back and forward by one minor tick interval
                        let step = timeline.getMinorTickInterval();
                        let chunk = timelineNow / step;
                        if(Math.floor(chunk) !== 0){
                            chunk = direction < 0 ? Math.ceil(timelineNow / step)    // left
                                                  : Math.floor(timelineNow / step); // right
                        }
                        next = (chunk * step) + (step * direction);
                        timeline.setNow(next);
                    }
                } else if(evt.keyCode === 38 || evt.keyCode === 40){
                    // UP/DOWN ARROW
                    // zoom in/out
                    evt.preventDefault();
                    this.timelineVideoManager.pausePlayback();
                    // up arrow (38) or down arrow (40)
                    let zoomFactor = evt.keyCode === 38 ? 1.2 : 1.0/1.2;
                    let timeline = this.timelineVideoManager.getTimeline();
                    timeline.transitionZoom(zoomFactor, 100);
                }
            }.bind(this));
        }
    };
}(window.portal, jQuery, $(document)));
