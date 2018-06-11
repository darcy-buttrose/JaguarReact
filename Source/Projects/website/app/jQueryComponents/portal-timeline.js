import $ from 'jquery';

window.$ = $;
window.jQuery = $;

// ensure that namespaces exist, create if not

/**
 * A collection of namespaced utility functions for the Portal UI, focused around the provision of
 * a timeline and playback of video related to timeline items on a 'video wall'
 */
// ensure that namespaces exist, create if not
window.portal = window.portal || {};

(function(ns, jQuery) {
    "use strict";
    //==============================================================================================
    /**
     * Creates an instance of an timeline item suitable for use on a {@link ns.Timeline}
    */
    ns.TimelineItem = class {
        /**
         * An item to display on the timeline.
         *
         * NOTE: Timeline items need not necessarily be instances of TimelineItem, but they must
         * at least 'act' the same way - that is, they must at least provide the 'pk', 'start' and
         * 'end' attributes. For example. {pk:123, start:123456789, end:234567890} would be a
         * sufficient 'implementation' of a timeline item.
         *
         * @param pk the unique identifier of the timeline item.
         * @param start the start of the timeline item, as a UNIX timestamp in milliseconds
         * @param end the end of the timeline item, as a UNIX timestamp in milliseconds
         * @param color optionally specify a color to render the timeline item
         */
        constructor(pk, start, end, color=null){
            // required fields for timeline items
            this.pk = pk;
            this.start = start;
            this.end = end;
            // optional fields for timeline items
            this.color = color;
        }
    };

    //==============================================================================================
    /**
     * An interface for a timeline item with a video source for playback, as might be used by the
     * {@link ns.TimelineVideoManager}
    */
    ns.IVideoTimelineItem = class extends ns.TimelineItem {
        /**
         * An item to display on the timeline with an associated video source.
         *
         * NOTE: Timeline items need not necessarily be instances of a class implementing the
         * IVideoTimelineItem interface, but they must at least 'quack' the same way - that is,
         * they must at least provide the `pk`, `start` and `end` attributes, and a implementation
         * of the getVideoSrc() method.
         *
         * For example...
         *
         *     {pk:123,
         *      start:123456789, end:234567890,
         *      getVideoSrc:function(){
         *              return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
         *          }
         *     }
         *
         * ... would be a sufficient 'implementation'.
         *
         * @param pk the unique identifier of the timeline item.
         * @param start the start of the timeline item, as a UNIX timestamp in milliseconds
         * @param end the end of the timeline item, as a UNIX timestamp in milliseconds
         * @param color optionally specify a color to render the timeline item
         */
        constructor(pk, start, end, color=null){
            if (new.target === ns.AbstractVideoTimelineItem) {
              throw new TypeError("Cannot construct AbstractVideoTimelineItem instances directly");
            }
            super(pk, start, end, color);

            if (!jQuery.isFunction(this.getVideoSrc)) {
              throw new TypeError("Classes inheriting from AbstractVideoTimelineItem must implement the getVideoSrc() method");
            }
        }

        /**
         * Inheriting classes *must* implement the getVideoSrc() method
         *
         * @return {string} the URL of the video assoicated with the video timeline item
         */
        // getVideoSrc(){return 'SOURCE_URL_HERE';}
    };

    //==============================================================================================
    /**
     * Creates an instance of a timeline for display of items on an interactive timeline
    */
    ns.Timeline = class{
        //------------------------------------------------------------------------------------------
        // CONSTRUCTOR
        //------------------------------------------------------------------------------------------
        constructor(container, options={}){
            this.container = container;

            let defaultOptions = {
                // Sizing -----------------------------------------------------------------------------
                // canvas size
                // TODO get from container element
                height:120,
                width:800,
                // the vertical height/thickness of a timeline item "bar", in pixels (note - may be
                // automatically adjusted in order to make timeline items fit in the case of
                // concurrent items to prevent them from m"overflowing" the vertical space)
                itemThickness:15,
                // the vertical separation between two concurrent (i.e., overlapping) timeline item
                // "bars", in pixels (note - may be automatically adjusted in order to make timeline
                // items fit in the case of concurrent items to prevent them from m"overflowing" the
                // vertical space)
                itemSeparation:2,
                // Colors -----------------------------------------------------------------------------
                // color for the timeline background
                timelineBackgroundColor:'#FFFFFF',
                // color for the 'now' indicator
                nowIndicatorColor:'#880000',
                // bounds masking color
                boundsMaskColor:'#DDDDDD',
                // the color to draw timeline items in the event that they do not have a 'color'
                // property
                defaultItemColor:'#0088CC', // NOTE: this matches the Bootstrap v3 'primary' color
                // colors for major and minor ticks
                majorTickColor:'#2244CC',
                minorTickColor:'#AAAAAA',
                // color and font for major tick labels
                tickLabelColor:'#000000',
                tickLabelFont:'10px Arial',
                tickLabelFormats:[
                    // multiple tick label formats can be supplied to adapt to the current zoom
                    // level of the timeline to provide an appropriate level of detail for the
                    // time/date displayed next to the ticks
                    {min:24*60*60*1000, format:['YYYY/MM/DD']},                // used when major ticks are more than 1 day apart
                    {min:60*1000,       format:['HH:mm', 'YYYY/MM/DD']},       // used when major ticks are more than 1 minute apart but less than 1 day apart
                    {min:1000,          format:['HH:mm:ss', 'YYYY/MM/DD']},    // used when major ticks are more than 1 second apart but less than 1 minute apart
                    {min:0,             format:['HH:mm:ss.SSS', 'YYYY/MM/DD']} // used when major ticks are less than 1 second apart
                ],
                // Zoom in/out ------------------------------------------------------------------------
                // when the mouse wheel is scrolled, this determines how the zoom is affected - a
                // value of 1 means no zoom, a positive value means zoom in on wheel up, out on
                // wheel down (negative value will reverse this). A 0 value is ignored.
                mouseWheelZoom: 1.2,
                // the "furthest out" zoom level in milliseconds - for example, a value of 259200000
                // would mean that you can zoom out far enough that 3 days of time is visible on the
                // timeline, but no further (so you couldn't zoom out so far that a whole week was
                // visible, etc). Note that this is dependent on the items on the timeline, which
                // also limits the zoom (for example, if there is only an hour's worth of items on
                // the timeline, you can only zoom out until everything is "contained" on the
                // timeline)
                maxZoomDuration: 3*24*60*60*1000,
                // the "furthest out" zoom level as a factor of the total duration of all items on
                // the timeline. this is secondary to the maxZoomDuration (i.e., if the
                // maxZoomFactor results in a visible duration which is larger than the
                // maxZoomDuration, the maxZoomDuration value is used).
                maxZoomFactor: 1.5,
                // the "furthest in" zoom level in milliseconds - for example, a value of 3000 would
                // mean that you can zoom in far enough that 3 seconds of time is visible on the
                // timeline, but no further (so you couldn't zoom in so far that only 1 second was
                // visible, etc)
                minZoomDuration: 1000,
                // ---------------------------------------------------------------------------------
                // Advanced ------------------------------------------------------------------------
                // ---------------------------------------------------------------------------------
                // position for the 'now' indicator from 0.0 to 1.0, where 0.0 is the extreme left,
                // 1.0 is the extreme right, and 0.5 is the middle (default). Values outside of the
                // range of 0.25 - 0.5 are not particularly helpful, but your mileage may vary
                nowIndicatorPosition: 0.5,
                // the maximum rendered item duration (in milliseconds), regardless of how long the
                // items actually are. If the values are 0 or negative, the original item duration
                // is used when plotting the items. Does not affect the underlying start/end times.
                maxRenderedDuration: 0,
                // the tick spacing groups to provide suitable ticks at various zoom levels
                tickSpacingGroups: ns.Timeline._makeTickSpacingGroups(),
                // the minimum distance between major ticks on the timeline, in pixels. Used to
                // maintain separation for major tick labels. Too small a value for this will result
                // in tick labels overlapping
                minTickPixelSeparation: 75,
                // the frame rate (in frames per second) which is attempted to be maintained for
                // timeline transition animations
                targetTransitionFPS:60,
                // how much the user must drag the mouse before it is considered to be a drag, rather
                // than just a click - note that this is not a distance but a 'count' of the number
                // of times a movement is detected while the mouse button is depressed.
                dragVsClickThreshold: 2,
                // the name of the data property under which this instance will be stored on the
                // container element
                dataName:'timeline',
                // set up the naming conventions for for events fired by this widget
                events:{
                    // the namespace (prefix) for the names of events fired by this widget (for
                    // example, 'timeline-click', timeline-drag', etc..
                    namespace:'timeline-',
                    // the (suffix) names of events fired by this widget
                    names:{
                       // fired when the timeline is clicked
                       click:'click',
                       // fired when the timeline is double clickde
                       doubleClick:'double-click',
                       // fired when a timeline transition animation commences
                       transitionStart:'transition-start',
                       // fired whenever the items currently under the "now" indicator changes
                       transitionComplete:'transition-complete',
                       // fired whenever the items currently under the "now" indicator changes
                       nowItemsChanged:'now-items-changed',
                       // fired when the visible range shown by the timeline changes (WARNING: may
                       // fire multiple times in rapid succession during mouse drags or transitions)
                       visibleRangeChanged:'visible-range-changed',
                       // fired as the timeline is dragged (WARNING: may fire multiple times in
                       // rapid succession as the dragging action continues)
                       drag:'drag'
                   }
                },
                // Density Statistics --------------------------------------------------------------
                // whether to draw the density statistics
                shouldRenderDensityStatistics: false,
                // the density statistics plotting style - 'line' or 'box' (any other value is
                // interpreted as 'box')
                densityStatisticsStyle: 'line',
                // if true, draw the density statistics *above* the timeline items (will potentially
                // obscure items)
                densityStatisticsAbove: true,
                // the color to draw the density statistics
                densityStatisticsColor: '#000000',
                // the colors to code the density level slots by (recommend at least 16 reasonably
                // distinct colors) here we just create a basic 'rainbow' color gradient starting at
                // the default item color 'sky blue' and spinning around the colour wheel in 8 steps
                densitySlotColors: ns.Timeline.rgbs2web(
                    ns.Timeline.hsvs2rgb(
                        ns.Timeline.colorGradientHsv({h:200,s:100,v:80}, {h:560,s:100,v:80}, 8)
                    )
                )
            };
            this.options = jQuery.extend(true, {}, defaultOptions, options);

            // ensure that tick label formats are in descending order of their upper time limit
            this.options.tickLabelFormats.sort(function(a,b){return b.min - a.min;});

            // information about the extents of the timeline
            this.startTime = null;
            this.endTime = null;
            this.visibleStart = null;
            this.visibleEnd = null;

            // tick spacing policies
            this.tickSpacing = this.options.tickSpacingGroups[0];

            // statistics related to items which "overlap" chronologically, affecting
            // rendering policies
            this.densityStats = {max:0, densities:[]};
            this.itemSlots = {};

            this.timelineItems = [];
            this.timelineItemLookup = {};
            this.renderedItems = {bounds:{x0:-1,y0:-1,x1:-1,y1:-1}, items:[]};

            this.isDragging = false;
            this.dragCounter = 0;
            this.dragStart = {x:null, y:null};
            this.dragTracking = {x:null, y:null};
            this.nowItems = [];

            this.transition = null;
            this.transitionUpdateDelay = Math.max(10, 1000.0 / (Math.max(1, this.options.targetTransitionFPS)));

            this._initGUI();
            this.render();
            this._addEventListeners();

            jQuery(this.container).data(this.options.dataName, this);
        }
        //------------------------------------------------------------------------------------------
        // INSTANCE METHODS
        //------------------------------------------------------------------------------------------
        /**
         * Obtain the timestamp of the start of the timeline (i.e, the start of the first timeline
         * item) as a UNIX timestamp in milliseconds
         *
         * @return {number} the start of the timeline as a UNIX timestamp in milliseconds
         */
        getStart()
        {
            return this.startTime;
        }
        /**
         * Obtain the timestamp of the end of the timeline (i.e, the end of the last timeline
         * item) as a UNIX timestamp in milliseconds
         *
         * @return {number} the end of the timeline as a UNIX timestamp in milliseconds
         */
        getEnd()
        {
            return this.endTime;
        }
        /**
         * Obtain the timestamps of the start and end of the first and last items of the timeline as
         * UNIX timestamps in milliseconds in an object of the form {start: 12354, end: 23456}
         *
         * @return {{start: (*|null|number), end: (*|null|number)}} the timestamps of the start and
         * end of the visible portion of the timeline as UNIX timestamps in milliseconds
         */
        getRange()
        {
            return {start: this.startTime, end: this.endTime};
        }
        /**
         * Determine if the given timestamp is within the range the timeline (i.e., on or after the
         * start of the first timeline item and/or on or before the end of the last timeline item)
         *
         * @param timestamp the timestamp
         * @return {boolean} true if the given timestamp is within the range of the timeline,
         * false otherwise
         */
        isDuringTotalRange(timestamp){
            return this._isDuring(timestamp, this.startTime , this.endTime);
        }
        /**
         * Determine if *entire* range of the timeline (i.e., from the start of the first timeline
         * item to the end of the last timeline item) is currently visible
         *
         * @return {boolean} true if the *entire* range of the timeline is currently visible, false
         * otherwise
         */
        isTotalRangeVisible(){
            return this.isTimeRangeFullyVisible(this.startTime, this.endTime);
        }
        /**
         * Obtain the total duration of the timeline, from the start of the first timeline item to
         * the end of the last timeline item, in milliseconds
         *
         * @return {number} total duration of the timeline in milliseconds
         */
        getTotalDuration()
        {
            if(this.startTime === null || this.endTime === null)
                return 1;

            return (this.endTime - this.startTime);
        }
        /**
         * Obtain the timestamp of the start of the visible portion of the timeline as a UNIX
         * timestamp in milliseconds
         *
         * @return {number} timestamp of the start of the visible portion of the timeline as a UNIX
         * timestamp in milliseconds
         */
        getVisibleStart()
        {
            return this.visibleStart;
        }
        /**
         * Obtain the timestamp of the end of the visible portion of the timeline as a UNIX
         * timestamp in milliseconds
         *
         * @return {number} timestamp of the end of the visible portion of the timeline as a UNIX
         * timestamp in milliseconds
         */
        getVisibleEnd()
        {
            return this.visibleEnd;
        }
        /**
         * Obtain the timestamps of the start and end of the visible portion of the timeline as UNIX
         * timestamps in milliseconds in an object of the form {start: 12354, end: 23456}
         *
         * @return {{start: (*|null|number), end: (*|null|number)}} the timestamps of the start and
         * end of the visible portion of the timeline as UNIX timestamps in milliseconds
         */
        getVisibleRange()
        {
            return {start: this.visibleStart, end: this.visibleEnd};
        }
        /**
         * Determine if the given timestamp is within the currently visible range of the timeline
         * @param timestamp the timestamp
         * @return {boolean} true if the given timestamp is within the currently visible range of
         *         the timeline, false otherwise
         */
        isDuringVisibleRange(timestamp){
            return this._isDuring(timestamp, this.visibleStart , this.visibleEnd);
        }
        /**
         * Determine if a time range is visible (partially or fully) with respect to the current state
         * of the timeline
         *
         * @param start the start of the time range as a UNIX time in milliseconds
         * @param end the end of the time range as a UNIX time in milliseconds
         * @return {*} true if the time range is partially or fully within the currently visible
         *         range of the timeline, false otherwise
         */
        isTimeRangeVisible(start , end){
            return (start <= this.visibleEnd && end >= this.visibleStart) ||
                    (start >= this.visibleStart && start <= this.visibleEnd) ||
                    (end >= this.visibleStart && end <= this.visibleEnd);
        }
        /**
         * Determine if a time range is *fully* with respect to the current state of the timeline
         *
         * @param start the start of the time range as a UNIX time in milliseconds
         * @param end the end of the time range as a UNIX time in milliseconds
         * @return {*} true if the time range is *fully* within the currently visible range of the
         * timeline, false otherwise
         */
        isTimeRangeFullyVisible(start , end){
            return (start >= this.visibleStart) && (end <= this.visibleEnd);
        }
        /**
         * Obtain the duration of the visible portion of the timeline in milliseconds
         *
         * @return {number} the duration of the visible portion of the timeline in milliseconds
         */
        getVisibleDuration()
        {
            if(this.visibleStart === null || this.visibleEnd === null)
                return 1;

            return (this.visibleEnd - this.visibleStart);
        }
        /**
         * Obtain the number of items currently in the timeline
         *
         * @return {*} the number of items currently in the timeline
         */
        getTimelineItemCount(){
            return this.timelineItems.length;
        }
        /**
         * Determine if the timeline is currently empty (i.e., has no timeline items in it)
         *
         * @return {boolean} true if the timeline is currently empty, false if there are currently
         *         one or more timeline items in the timeline.
         */
        isEmpty(){
            return this.getTimelineItemCount() === 0;
        }
        /**
         * Obtain the current major tick spacing interval in milliseconds
         *
         * @return {number} the current major tick spacing interval in milliseconds
         */
        getMajorTickInterval(){
            return this.tickSpacing.minor;
        }
        /**
         * Obtain the current minor tick spacing interval in milliseconds
         *
         * @return {number} the current minor tick spacing interval in milliseconds
         */
        getMinorTickInterval(){
            return this.tickSpacing.minor;
        }
        /**
         * Obtain the colours used for the densty slots
         *
         * @return {*} an array of colours corresponding to the density slots
         */
        getDensitySlotColors(){
            // return a copy or the array of colours, not the actual array
            return [].concat(this.options.densitySlotColors);
        }
        /**
         * Bulk add items to the timeline
         *
         * NOTE: if a single item is to be inserted, it may be more efficient to use
         *       the addTimelineItem() method instead.
         *
         * @param items an array of items to be added. Each item must be an object which must
         *        provides the following properties:
         *            pk - a unique identifier for the item
         *            start - a timestamp for the start of the item as a UNIX time in milliseconds
         *            end - a timestamp for the end of the item as a UNIX time in milliseconds
         *        For example:
         *            {pk:'ABC-123', start:12345678, end:23456789}
         *        Optionally, the following properties are also recognised:
         *            color: the color to draw the item - if unspecified, the currently configured
         *                   value for options.defaultItemColor is used.
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        addTimelineItems(items, render=true){
            if(typeof(items) !== 'undefined' && items !== null && items.length > 0) {
                let startEndTimesWereNull = this.startTime === null || this.endTime === null ;
                if(startEndTimesWereNull) {
                    this.startTime = items[0].start;
                    this.endTime = items[0].end;
                }

                for(let idx=0; idx<items.length; idx++){
                    let item = items[idx];
                    this.startTime = Math.min(this.startTime, item.start);
                    this.endTime = Math.max(this.endTime, item.end);
                    this.timelineItems.push(item);
                    this.timelineItemLookup[item.pk] = item;
                }

                // put all timeline items in chronological order
                this._sortTimelineItems(this.timelineItems);
                // update the density statistics so we know about overlapping items
                this._refreshDensityStats();

                if(startEndTimesWereNull) {
                    this.visibleStart = this.startTime;
                    this.visibleEnd = this.endTime;
                    this.zoomToAll(false);
                }

                if(this._updateNowItems()){
                    this._fireNowItemsChangedEvent(this.getNow(), this.nowItems);
                }

                if(render){
                    this.render();
                }
            }
            return this;
        }
        /**
         * Add a single item to the timeline. Uses a binary search to determine the index at which
         * to insert the item.
         *
         * NOTE: if large numbers of items are to be inserted, it may be more efficient to use
         *       the addTimelineItems() method instead.
         *
         * @param item the item to be added. The item must be an object which must provide the
         *        following properties:
         *            pk - a unique identifier for the item
         *            start - a timestamp for the start of the item as a UNIX time in milliseconds
         *            end - a timestamp for the end of the item as a UNIX time in milliseconds
         *        For example:
         *            {pk:'ABC-123', start:12345678, end:23456789}
         *        Optionally, the following properties are also recognised:
         *            color: the color to draw the item - if unspecified, the currently configured
         *                   value for options.defaultItemColor is used.
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        addTimelineItem(item, render=true){
            if(typeof(item) !== 'undefined' && item !== null) {
                let startEndTimesWereNull = this.startTime === null || this.endTime === null ;
                if(startEndTimesWereNull) {
                    this.startTime = item.start;
                    this.endTime = item.end;
                }

                this.startTime = Math.min(this.startTime, item.start);
                this.endTime = Math.max(this.endTime, item.end);

                let idx = this._binaryTimeSearch(item.start, this.timelineItems);
                this.timelineItems.splice(idx+1, 0, item);
                this.timelineItemLookup[item.pk] = item;

                if(startEndTimesWereNull) {
                    this.visibleStart = this.startTime;
                    this.visibleEnd = this.endTime;
                    this.zoomToAll(false);
                }

                // update the density statistics so we know about overlapping items
                // TODO this is not a very efficient thing to do when adding just a single items
                this._refreshDensityStats();

                if(this._updateNowItems()){
                    this._fireNowItemsChangedEvent(this.getNow(), this.nowItems);
                }

                if(render){
                    this.render();
                }
            }
            return this;
        }
        /**
         * Clear all items from the timeline
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         */
        clearTimelineItems(render=true){
            this.startTime = null;
            this.endTime = null;
            this.visibleStart = null;
            this.visibleEnd = null;

            this.tickSpacing = this.options.tickSpacingGroups[0];

            this.timelineItems = [];
            this.timelineItemLookup = {};
            this.renderedItems = {bounds:{x0:-1,y0:-1,x1:-1,y1:-1}, items:[]};
            this._refreshDensityStats();

            if(this.nowItems.length !== 0){
                this.nowItems = [];
                this._fireNowItemsChangedEvent(null, null);
            }

            if(render){
                this.render();
            }
        }
        /**
         * Obtain the time for the "now" indicator with respect to the current state of the timeline
         * as a UNIX time in milliseconds.
         * @return {*} a UNIX time in milliseconds corresponding to the time indicated by the "now"
         *        indicator with respect to the current state of the timeline
         */
        getNow(){
            return this.visibleStart + (this.getVisibleDuration() * this.options.nowIndicatorPosition);
        }
        /**
         * Update the timeline state so that the "now" indicator is aligned with the given UNIX time
         * in milliseconds. This is merely a wrapper around the moveTo() method, and is identical in
         * functionality.
         *
         * @param timestamp the UNIX time in milliseconds to align the "now" indicator to
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        setNow(timestamp, render=true){
            return this.moveTo(timestamp, render);
        }
        /**
         * Update the timeline so that the 'now' indicator is on the given time. The time parameter
         * is automatically constrained to be within the bounds of the timeline. The visible
         * duration does not change.
         *
         * @param timestamp the UNIX time in milliseconds to align the "now" indicator to
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        moveTo(timestamp, render=true){
            // sanity check - constrain supplied time parameter value to be within bounds
            timestamp = ns.Timeline._constrain(timestamp, this.startTime, this.endTime);
            let visibleDuration = this.getVisibleDuration();
            let start = timestamp - (visibleDuration * this.options.nowIndicatorPosition);
            let end = start + visibleDuration;
            return this.setVisibleRange(start, end, render);
        }
        /**
         * Update the timeline so the visible range is as specified. The start and end parameters
         * are automatically constrained to be within the bounds of the timeline.
         *
         * @param start the desired start of the visible range as a UNIX timestamp in milliseonds.
         *        Note that any value passed in will be automatically constrained to be within the
         *        bounds of the timeline.
         * @param end the desired end of the visible range as a UNIX timestamp in milliseonds. Note
         *        that any value passed in will be automatically constrained to be within the bounds
         *        of the timeline.
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        setVisibleRange(start, end, render=true, updateTicks=true){
            if(start !== this.visibleStart || end !== this.visibleEnd){
                let newDuration = end - start;
                let currentDuration = this.visibleEnd - this.visibleStart;

                // sanitise the duration so that we are not zooming in or out too far
                let maxDuration = this.getTotalDuration() * this.options.maxZoomFactor;
                if(newDuration < this.options.minZoomDuration){
                    // zoomed in too far
                    let mid = start + (newDuration / 2.0);
                    let halfMinDuration = this.options.minZoomDuration / 2.0;
                    start = mid - halfMinDuration;
                    end = mid + halfMinDuration;
                    newDuration = end - start;
                } else if(newDuration > maxDuration || newDuration > this.options.maxZoomDuration){
                    // zoomed out too far
                    let mid = start + (newDuration / 2.0);
                    let halfMaxDuration = Math.min(maxDuration / 2.0, this.options.maxZoomDuration / 2.0);
                    start = mid - halfMaxDuration;
                    end = mid + halfMaxDuration;
                    newDuration = end - start;
                }

                // sanitize the start and end so that we don't scroll the start and
                // end limits past 'now'
                let leftDuration = newDuration * this.options.nowIndicatorPosition;
                let rightDuration = newDuration * (1.0 - this.options.nowIndicatorPosition);
                this.visibleStart = Math.max(this.startTime - leftDuration, start);
                this.visibleEnd = Math.min(this.endTime + rightDuration, end);

                // work out what the item(s) "at now" is/are
                let nowItemsChanged = this._updateNowItems();

                if(updateTicks && newDuration !== currentDuration) {
                    // we need to find a new tick scale that works for the current duration
                    this._updateTickSpacing();
                }

                if(render){
                    this.render();
                }

                // fire events as required
                let now = this.getNow();
                this._fireVisibleRangeChangedEvent(now, this.visibleStart, this.visibleEnd);
                if(nowItemsChanged){
                    this._fireNowItemsChangedEvent(now, this.nowItems);
                }
            }

            return this;
        }
        /**
         * Update the timeline so the visible duration is as specified (it will remain "centered
         * on" the current time). The duration parameter is automatically constrained to be within
         * the bounds of the timeline.
         *
         * @param milliseconds the duration which should be visible. Note that any value passed in
         *        will be automatically constrained by the configured zoom limits
         * @param render if true, re-render the timeline immediately, otherwise the timeline will
         *        not be updated at this time.
         * @return {ns.Timeline}
         */
        setVisibleDuration(milliseconds, render=true){
            // sanity check - constrain supplied time parameter value to be within bounds
            let totalDuration = this.getTotalDuration();
            milliseconds = ns.Timeline._constrain(milliseconds, 1, totalDuration * this.options.maxZoomFactor);
            milliseconds = ns.Timeline._constrain(milliseconds, this.options.minZoomDuration, this.options.maxZoomDuration);

            let now = this.getNow();

            let leftDuration = (milliseconds * this.options.nowIndicatorPosition);
            let rightDuration = (milliseconds * (1.0 - this.options.nowIndicatorPosition));
            let start = now - leftDuration;
            let end = now + rightDuration;

            return this.setVisibleRange(start, end, render);
        }
        /**
         * Zoom the timeline "out" by the specified factor - increases the currently visible
         * duration by the given factor.
         *
         * @param factor the factor to zoom the timeline out by
         * @return {ns.Timeline}
         */
        zoomOut(factor){
            // if the zoom factor is 1 there is nothing to do
            if(factor !== 1) {
                let visibleDuration = this.getVisibleDuration();
                let newDuration = visibleDuration * factor;
                // sanitize zooming to keep it within configured limits, preventing the user
                // from zooming in or out so far that they (or the data) gets lost
                newDuration = ns.Timeline._constrain(newDuration, 0, this.getTotalDuration() * this.options.maxZoomFactor);
                newDuration = ns.Timeline._constrain(newDuration, this.options.minZoomDuration, this.options.maxZoomDuration);
                this.setVisibleDuration(newDuration);
            }
            return this;
        }
        /**
         * Zoom the timeline "in" by the specified factor - decreases the currently visible duration
         * by the given factor.
         *
         * @param factor the factor to zoom the timeline in by
         * @return {ns.Timeline}
         */
        zoomIn(factor){
            // sanity check factor to prevent possible divide by 0
            factor = factor === 0 ? 1.0 : factor;
            return this.zoomOut(1.0 / factor);
        }
        /**
         * Update the timeline so that it spans from the specified start to the specified end. The
         * start and end parameters are automatically constrained to be within the bounds of the
         * timeline.
         *
         * NOTE: this is simply for symmetry with the other `zoomXYZ(...)` methods, and is merely a
         *       wrapper around the `setVisibleRange(...)` method
         *
         * @param start the start timestamp of the range to display
         * @param end the end timestamp of the range to display
         * @param render if true, immediately re-render the timeline, otherwise do not update the
         *        timeline (a render must be manually triggered).
         * @return {ns.Timeline}
         */
        zoomTo(start, end, render=true){
            // simply delegates to the `setVisibleRange(...)` method
            return this.setVisibleRange(start, end , render, true);
        }
        /**
         * Update the timeline so that it spans from the start to the end of the specified item. The
         * start and end are automatically constrained to be within the bounds of the timeline.
         *
         * @param item the item to zoom to display
         * @param padding the padding factor - 1.0 means that the end of the item will be at the
         * exact end of the timeline at the end of the transition, larger values will put padding
         * after the end of the item so that it does not line up on the end of the timeline.
         * Suggested values are in the range 1.2 - 1.5. Values below 1.0 are ignored.
         * @param render if true, immediately re-render the timeline, otherwise do not update the
         *        timeline (a render must be manually triggered).
         * @return {ns.Timeline}
         */
        zoomToItem(item, padding=1.0, render=true){
            if(item !== null && item !== undefined) {
                this.zoomToItems([item], padding, render);
            }
        }
        /**
         * Update the timeline so that it spans from the start to the end of the specified items.
         * The start and end are automatically constrained to be within the bounds of the timeline.
         *
         * @param items the items to zoom to display
         * @param padding the padding factor - 1.0 means that the end of the item will be at the
         * exact end of the timeline at the end of the transition, larger values will put padding
         * after the end of the item so that it does not line up on the end of the timeline.
         * Suggested values are in the range 1.2 - 1.5. Values below 1.0 are ignored.
         * @param render if true, immediately re-render the timeline, otherwise do not update the
         *        timeline (a render must be manually triggered).
         * @return {ns.Timeline}
         */
        zoomToItems(items, padding=1.0, render=true){
            if(jQuery.isArray(items) && items.length > 0) {
                // sort by earliest to start
                let startOrdered = items.sort(function(a,b){return a.start - b.start;});
                // sort by earliest to end
                let endOrdered = items.sort(function(a,b){return b.end - a.end;});

                let earliestStart = startOrdered[0].start;
                let latestEnd = endOrdered[0].end;

                if(padding === null || padding === undefined || padding <= 1.0) {
                    // if there is no padding, just transition to the start of the item
                    this.setVisibleRange(earliestStart, latestEnd, render);
                } else {
                    // work out how long the item range is
                    let itemsDuration = (latestEnd - earliestStart);
                    if(this.options.maxRenderedDuration > 0) {
                        // correct for maximum rendered duration as required
                        itemsDuration = Math.min(this.options.maxRenderedDuration, itemsDuration);
                    }
                    // pad as specified so we can see a bit beyond the items
                    itemsDuration *= Math.max(1.0, padding);

                    // work out where the start and end of the visible duration need to be for
                    // the "now" indicator to line up with the start of the item given the
                    // length of the items and the specified padding factor.
                    let paddingFactor = this.options.nowIndicatorPosition / (1.0 - this.options.nowIndicatorPosition);
                    let start = earliestStart - (itemsDuration * paddingFactor);

                    // now that we know the required start and end, delegate the actual transition
                    // off to the appropriate method
                    this.setVisibleRange(start, earliestStart + itemsDuration, render);
                }
            }
        }
        /**
         * Update the timeline so that all anomalies in the timeline are visible.
         *
         * Immediately re-renders the timeline.
         */
        zoomToAll(render=true){
            // sanity check zoom factor - must be at least 1.0 to "zoom to all"
            let factor = Math.max(1.0, this.options.maxZoomFactor);
            // zoom out to encompass everything (potentially with a margin either side as determined
            // by the 'factor')
            let duration = this.getTotalDuration() * factor;
            // delegate to the appropriate method
            return this.setVisibleDuration(duration, render);
        }
        /**
         * Obtain the rendered items which correspond to the provided coordinates
         * @param coords the coordinates in the form {x:123, y:456}
         * @return {Array} an array of rendered items which correspond to the provided coordinates
         *         (may be empty)
         */
        getTimelineItemsForLocation(coords){
            let results = [];

            let bounds = this.renderedItems.bounds;
            if(ns.Timeline._isWithinBounds(coords, bounds))
            {
                let renderedItems = this.renderedItems.items;
                for(let idx=0; idx < renderedItems.length; idx++){
                    let candidate = renderedItems[idx];
                    let bounds = candidate.bounds;
                    if(ns.Timeline._isWithinBounds(coords, bounds)) {
                        results.push(candidate.item);
                    }
                }
            }
            return results;
        }
        /**
         * Obtain the rendered items which 'overlap' 'now'
         * @return {Array} an array of timeline items which correspond to the provided timestamp
         *         (may be empty, but will never be null)
         */
        getTimelineItemsForNow(){
            return this.getTimelineItemsForTimestamp(this.getNow());
        }
        /**
         * Obtain the rendered items which 'overlap' the provided timestamp
         * @param timestamp the timestamp as a UNIX time in milliseconds
         * @return {Array} an array of timeline items which correspond to the provided timestamp
         *         (may be empty)
         */
        getTimelineItemsForTimestamp(timestamp) {
            let results = [];
            if (this.timelineItems.length > 0 &&
                timestamp >= this.startTime && timestamp <= this.endTime) {
                if (!this.isTotalRangeVisible() && this.isDuringVisibleRange(timestamp)) {
                    // we know that the timeline is only partially visible *and* that timestamp is
                    // inside the visible range of the timeline, so in this case we can reduce the
                    // search space (possibly quite drastically) to only those timeline items which
                    // have been rendered to the timeline.
                    results = this._searchVisibleTimelineItemsByTimestamp(timestamp);
                } else {
                    for (let idx = 0; idx < this.timelineItems.length; idx++) {
                        let candidate = this.timelineItems[idx];
                        if (candidate.start > timestamp) {
                            // since items are sorted chronologically, once the start time of an
                            // item goes beyond the timestamp end we know there will be nothing else
                            // which will match so we can BREAK out of the loop right now
                            break;
                        } else if (candidate.end >= timestamp) {
                            if (this._isDuringRenderedItem(timestamp, candidate)) {
                                results.push(candidate);
                            }
                        }
                    }
                }
            }
            return results;
        }
        /**
         * Obtain the first timeline item
         * @return {*} the first timeline item, or null if there are no timeline items
         */
        getFirstTimelineItem(){
            if(this.timelineItems.length > 0){
                return this.timelineItems[0];
            }
            return null;
        }
        /**
         * Obtain the last timeline item
         * @return {*} the las timeline item, or null if there are no timeline items
         */
        getLastTimelineItem(){
            if(this.timelineItems.length > 0){
                return this.timelineItems[this.timelineItems.length-1];
            }
            return null;
        }
        /**
         * Obtain the next timeline item chronologically after the given item
         * @param item the item to find the next item after
         * @return {*} the timeline item which is chronologically after the given item, or null if
         *         there are no timeline items after the given item
         */
        getNextTimelineItem(item){
            let index = this._binaryItemSearch(item, this.timelineItems);
            if(index >= 0 && index < this.timelineItems.length-1){
                return this.timelineItems[index + 1];
            }
            return null;
        }
        /**
         * Obtain the timeline item chronologically before the given item
         * @param item the item to find the item before
         * @return {*} the timeline item which is chronologically before the given item, or null if
         *         there are no timeline items before the given item
         */
        getPreviousTimelineItem(item){
            let index = this._binaryItemSearch(item, this.timelineItems);
            if(index > 0){
                return this.timelineItems[index - 1];
            }
            return null;
        }
        /**
         * Obtain the first timeline item with a start time chronologically before the given UNIX
         * timestamp in milliseconds
         *
         * @param timestamp the UNIX timestamp in milliseconds to find the first item before
         * @return {*} the timeline item which is chronologically before the given timestamp, or
         *             null if there are no timeline items before the given timestamp
         */
        getTimelineItemBefore(timestamp){
            if(this.timelineItems.length > 0) {
                let index = this._binaryTimeSearch(timestamp, this.timelineItems);
                if(index >= 0 && index < this.timelineItems.length){
                    return this.timelineItems[index];
                }
            }
            return null;
        }
        /**
         * Obtain the first timeline item with a start time chronologically before the given UNIX
         * timestamp in milliseconds
         *
         * @param timestamp the UNIX timestamp in milliseconds to find the first item before
         * @return {*} the timeline item which is chronologically before the given timestamp, or
         *             null if there are no timeline items before the given timestamp
         */
        getTimelineItemAfter(timestamp){
            if(this.timelineItems.length > 0) {
                let index = this._binaryTimeSearch(timestamp, this.timelineItems);
                if (index < this.timelineItems.length - 1) {
                    return this.timelineItems[index + 1];
                }
            }
            return null;
        }
        /**
         * Determine if a timeline item is visible (partially or fully) with respect to the current
         * state of the timeline
         *
         * @param item the item to be checked for visibility
         * @return {*} true if the timeline item is partially or fully within the currently visible
         * range of the timeline, false otherwise
         */
        isTimelineItemVisible(item) {
            if (item === null) {
                return false;
            }

            let start = item.start;
            let end = item.end;

            // respect the configured maximum rendering duration, if any
            if(this.options.maxRenderedDuration > 0 && (end - start > this.options.maxRenderedDuration)) {
                end = item.start + this.options.maxRenderedDuration;
            }

            return this.isTimeRangeVisible(start, end);
        }
        /**
         * Obtain the slot index for the given timeline item.
         *
         * NOTE: This is only really relevant to timelines which display concurrent items (i.e.,
         * items which "overlap" on the timeline) which are assigned different "slots" during
         * update of the density statistics (please refer to the internal _refreshDensityStats()
         * method for more details) to avoid drawing items on top of each other.
         *
         * @param item the item for which the slot index is required
         * @return {number} the slot index (0-indexed)
         */
        getSlotFor(item){
            if(this.densityStats.max <= 1){
                // there are no overlapping items, so the slot for any item will always be 0
                return 0;
            }
            return this.itemSlots[item.pk];
        }

        /**
         * Obtain the color for the density slot the given item falls into
         *
         * NOTE: This is only really relevant to timelines which display concurrent items (i.e.,
         * items which "overlap" on the timeline) which are assigned different "slots" during
         * update of the density statistics (please refer to the internal _refreshDensityStats()
         * method for more details) to avoid drawing items on top of each other.
         *
         * @param item the item to obtain the density slot color for
         * @return {*} the colour as a web color specifier
         */
        getSlotColor(item){
            if(this.densityStats.max <= 1){
                // there are no overlapping items, so the density slot for any item will always be
                // slot #0, and so the color is either the item's preferred color or the default
                // render color
                return item.color ? item.color: this.options.defaultItemColor;
            }
            let slotIdx = this.getSlotFor(item);
            if(slotIdx === undefined){
                // the item doesn't seem to be in a density slot, and so the color is either the
                // item's preferred color or the default render color
                return item.color ? item.color: this.options.defaultItemColor;
            }
            // return the color associated with the density slot for this item
            return this.options.densitySlotColors[slotIdx % this.options.densitySlotColors.length];
        }

        /**
         * Occasionally it might be necessary to forcefully trigger a 'now items changed' event to
         * fire to cause refreshing of "late" listeners - this method will cause this to happen
         */
        triggerNowItemsChanged(){
            let now = this.getNow();
            let nowItems = this.getTimelineItemsForNow();
            this._fireNowItemsChangedEvent(now, nowItems);
        }
        /**
         * Occasionally it might be necessary to forcefully trigger a 'visible range changed' event
         * to fire to cause refreshing of "late" listeners - this method will cause this to happen
         */
        triggerVisibleRangeChanged(){
            let now = this.getNow();
            let visibleRange = this.getVisibleRange();
            this._fireVisibleRangeChangedEvent(now, visibleRange.start, visibleRange.end);
        }
        /**
         * Smoothly transition the timeline from its current 'now' to a new 'now', rather than
         * jumping immediately to the new 'now'. Useful for maintaining visual context during jumps
         * over large duration differences.
         *
         * NOTE: the value for targetNow will be automatically constrained to the current bounds of
         *       the timeline items
         *
         * @param targetNow the target 'now' timestamp as a UNIX time in milliseconds
         * @param duration the duration of the transition
         */
        transitionNow(targetNow, duration){
            // ensure that the targetNow is within the bounds of the current timeline items
            targetNow = ns.Timeline._constrain(this.startTime, this.endTime, targetNow);
            this.transitionOffset(targetNow - this.getNow(), duration);
        }
        /**
         * Smoothly transition the timeline forward or backward from its current position to a new
         * position, rather than jumping immediately to the new position. Useful for maintaining
         * visual context during jumps over large time differences.
         *
         * @param delta the number of milliseconds to transition by (+ve moves forward in time, -ve
         *        moves backward)
         * @param duration the duration of the transition
         * @private
         */
        transitionOffset(delta, duration){
            this.transitionVisibleRange(this.visibleStart + delta, this.visibleEnd + delta, duration);
        }
        /**
         * Smoothly transition the timeline zoom level in or out from its zoom level to a new
         * zoom level, rather than jumping immediately to the new zoom level. Useful for maintaining
         * visual context during zooms over large zoom level differences.
         *
         * @param factor the amount to zoom in or out by - > 1.0 zooms in, < 1.0 zooms out. 1.0
         *        maintains the existing zoom level and is therefore ignored. Values of 0 or less
         *        are also ignored.
         * @param duration the duration of the transition
         */
        transitionZoom(factor, duration){
            if(factor > 0 && factor !== 1)
            {
                // work out where the zoom ends
                let newDuration = (this.getVisibleDuration() / factor);
                // constrain zooming to configured limits
                let maxDuration = Math.min(this.options.maxZoomDuration, this.getTotalDuration() * this.options.maxZoomFactor);
                newDuration = ns.Timeline._constrain(newDuration, this.options.minZoomDuration, maxDuration);
                // kick off the zoom
                let leftDuration = newDuration * this.options.nowIndicatorPosition;
                let rightDuration = newDuration * (1.0 - this.options.nowIndicatorPosition);
                let now = this.getNow();
                this.transitionVisibleRange(now - leftDuration, now + rightDuration, duration);
            }
        }
        /**
         * Smoothly transition the timeline from its current visible range to a new visible
         * range, where the 'now' indicator is positioned on the start of the given item, with
         * padding to see the context "around" the item if specified.
         *
         * @param item the target visible start time
         * @param padding the padding factor - 1.0 means that the end of the anomaly will be at the
         * exact end of the timeline at the end of the transition, larger values will put padding
         * after the end of the item so that it does not line up on the end of the timeline.
         * Suggested values are in the range 1.2 - 1.5. Values below 1.0 are ignored.
         * @param duration the duration of the transition
         */
        transitionToItem(item, padding, duration){
            if(item !== null && item !== undefined) {
                this.transitionToItems([item], padding, duration);
            }
        }
        /**
         * Smoothly transition the timeline from its current visible range to a new visible
         * range, where the 'now' indicator is positioned on the start of the earliest given item,
         * with padding to see the context "around" the items if specified.
         *
         * @param items the target visible times
         * @param padding the padding factor - 1.0 means that the end of the anomaly will be at the
         * exact end of the timeline at the end of the transition, larger values will put padding
         * after the end of the items so that it does not line up on the end of the timeline.
         * Suggested values are in the range 1.2 - 1.5. Values below 1.0 are ignored.
         * @param duration the duration of the transition
         */
        transitionToItems(items, padding, duration){
            if(jQuery.isArray(items) && items.length > 0) {
                // sort by earliest to start
                let startOrdered = items.sort(function(a,b){return a.start - b.start;});
                // sort by earliest to end
                let endOrdered = items.sort(function(a,b){return b.end - a.end;});

                let earliestStart = startOrdered[0].start;
                let latestEnd = endOrdered[0].end;

                if(padding === null || padding === 0) {
                    // if there is no padding, just transition to the start of the item
                    this.transitionVisibleRange(earliestStart, latestEnd, duration);
                } else {
                    // work out how long the item range is
                    let itemsDuration = (latestEnd - earliestStart);
                    if(this.options.maxRenderedDuration > 0) {
                        // correct for maximum rendered duration as required
                        itemsDuration = Math.min(this.options.maxRenderedDuration, itemsDuration);
                    }
                    // pad as specified so we can see a bit beyond the items
                    itemsDuration *= Math.max(1.0, padding);

                    // work out where the start and end of the visible duration need to be for
                    // the "now" indicator to line up with the start of the item given the
                    // length of the items and the specified padding factor.
                    let paddingFactor = this.options.nowIndicatorPosition / (1.0 - this.options.nowIndicatorPosition);
                    let start = earliestStart - (itemsDuration * paddingFactor);

                    // now that we know the required start and end, delegate the actual transition
                    // off to the appropriate method
                    this.transitionVisibleRange(start, earliestStart + itemsDuration, duration);
                }
            }
        }

        /**
         * Smoothly transition the timeline from its current visible range to a new visible
         * range, rather than jumping immediately to the new position. Useful for maintaining
         * visual context during jumps or zooms over large time range differences.
         *
         * NOTE: all other transition methods eventually call this one to carry out the actual
         *       transition, since any timeline transition is really just a change in the visible
         *       range of the timeline.
         *
         * @param targetStart the target visible start time
         * @param targetEnd the target visible end time
         * @param duration the duration of the transition
         */
        transitionVisibleRange(targetStart, targetEnd, duration){
            // complete and cancel any transition in progress
            this._completeTransition();
            // work out the deltas required for the transition
            let startDelta = targetStart - this.visibleStart;
            let endDelta = targetEnd - this.visibleEnd;
            // sanity check that there is a transition which will occur - if the deltas are both
            // under 1/1000th of a second we don't bother
            if(Math.abs(Math.round(startDelta))>0 && Math.abs(Math.round(endDelta))>0) {
                // set up the transition
                this.transition = {duration:duration,
                                   t0:new Date().getTime(),
                                   start:{t0:this.visibleStart, delta:targetStart-this.visibleStart},
                                   end:{t0:this.visibleEnd, delta:targetEnd-this.visibleEnd},
                                   updateCount:0};
                // notify listeners that the transition is starting
                this._fireTimelineTransitionStart();
                // kick off the transition
                this.transition.timer = setTimeout(this._updateTransition.bind(this),
                                                   this.transitionUpdateDelay);
            }
        }
        /**
         * Determine if the timeline is currently in the process of transitioning from one visible
         * range to another. May be useful to avoid carrying out external event handling (such as
         * for "now items changed" and related events) during a transition
         *
         * @return {boolean} true if a transition is in progress, false otherwise
         */
        isTransitioning(){
            return this.transition !== null;
        }
        /**
         * Determine if the timeline is currently in the process of being dragged. May be useful to
         * avoid carrying out external event handling (such as for "now items changed" and related
         * events) during a drag interaction
         *
         * @return {boolean} true if a transition is in progress, false otherwise
         */
        isBeingDragged(){
            return this.isDragging;
        }
        /**
         * Immediately redraws the entire timeline to reflect the current state
         * @return {ns.Timeline}
         */
        render() {
            this.renderedItems = {
                bounds:null, // the overall bounding box of what has been rendered
                items:[], // individual bounding boxes of rendered timeline items
                bookmarks:[], // individual bounding boxes of rendered bookmarks
            };

            if(this.startTime === null || this.endTime === null)
            {
                this._clear('rgb(192, 192, 192)');
                this._renderNowIndicator();
            }
            else
            {
                let renderDensitySatistics = (this.options.shouldRenderDensityStatistics && this.densityStats.max > 1);

                this._clear(this.options.timelineBackgroundColor);

                this._renderStartEndMasking();

                if(renderDensitySatistics && !this.options.densityStatisticsAbove){
                    this._renderTimelineDensities();
                }

                this._renderTimelineTicks();

                this._renderTimelineItems();
                if(renderDensitySatistics && this.options.densityStatisticsAbove){
                    this._renderTimelineDensities();
                }

                this._renderNowIndicator();
            }

            return this;
        }
        //------------------------------------------------------------------------------------------
        // PRIVATE METHODS
        //------------------------------------------------------------------------------------------
        /**
         * Utility function to initialise the canvas and render the starting state of the timeline
         * @return {ns.Timeline}
         * @private
         */
        _initGUI() {
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            this.ctx2d = this.canvas.getContext("2d");
            this.ctx2d.imageSmoothingEnabled = true;

            this.container.appendChild(this.canvas);

            this.render();

            return this;
        }
        /**
         * Utility function to add the event listeners required for mouse interactions with the
         * canvas
         * @return {ns.Timeline}
         * @private
         */
        _addEventListeners(){
            jQuery(this.canvas).on({
                'mousedown': function (jQevt) {
                    // as soon as the user presses a button on the canvas, cancel
                    // any transition which might be in progress
                    this._cancelTransition();
                    this._startDrag(jQevt.originalEvent);
                    this.canvas.style.cursor = 'pointer';
                }.bind(this),
                'mousemove': function (jQevt) {
                    this._updateDrag(jQevt.originalEvent);
                }.bind(this),
                'mouseup': function (jQevt) {
                    let originalEvent = jQevt.originalEvent;
                    // important - check for click *before* ending the drag
                    this._click(originalEvent);
                    // important - end the drag *after* checking for click
                    this._endDrag(originalEvent);
                    this.canvas.style.cursor = 'auto';
                }.bind(this),
                'mouseout': function (jQevt) {
                    this._endDrag(jQevt.originalEvent);
                }.bind(this),
                'mousewheel': function (jQevt) {
                    jQevt.preventDefault();
                    // as soon as the user rolls the wheel on the canvas, cancel
                    // any transition which might be in progress
                    if(this.options.mouseWheelZoom && this.options.mouseWheelZoom !== 1 ){
                        if(jQevt.originalEvent.deltaY > 0){
                            // wheel was rolled upward
                            this.zoomOut(this.options.mouseWheelZoom);
                        } else {
                            // wheel was rolled downward
                            this.zoomIn(this.options.mouseWheelZoom);
                        }
                    }
                }.bind(this),
                'dblclick': function(jQevt){
                    this._doubleClick(jQevt.originalEvent);
                }.bind(this)
            });

            return this;
        }
        /**
         * Utility method to set up the state of the timeline for starting a mouse drag
         *
         * @param evt the DOM event which triggered the drag
         * @private
         */
        _startDrag(evt){
            this.isDragging = true;
            this.dragCounter = 0;
            // where did the drag start?
            this.dragStart = {x:evt.x, y:evt.y};
            // where is the drag currently "at"?
            this.dragTracking = {x:evt.x, y:evt.y};
        }
        /**
         * Utility method to update the state of the timeline for an ongoing mouse drag action
         *
         * @param evt the DOM event which triggered the update of the drag
         * @private
         */
        _updateDrag(evt){
            if (this.isDragging) {
                this.dragCounter += 1;

                // how far have we dragged since the last time we checked?
                let dx = evt.x - this.dragTracking.x;
                let dy = evt.y - this.dragTracking.y;

                // update where the drag is currently "at"
                this.dragTracking.x = evt.x;
                this.dragTracking.y = evt.y;

                // drag the timeline
                let draggedTime = dx / this._getMillisecondsPerPixel();
                let newNow = Math.round(this.getNow() - draggedTime);
                this.setNow(newNow, true);

                // callback to anyone interested
                this._fireTimelineDragEvent(
                    newNow, // "now" according to the current state of the timeline
                    {x: this.dragStart.x, y: this.dragStart.y}, // start of drag
                    {x: this.dragTracking.x, y: this.dragTracking.y}, // current drag position
                    {dx: dx, dy: dy}, // delta since last drag event
                    {dx: this.dragTracking.x - this.dragStart.x, // current x,y offset relative
                     dy:this.dragTracking.y - this.dragStart.y}  // to start of drag
                );
            }
        }
        /**
         * Utility method to update the state of the timeline for a mouse drag which has completed
         *
         * @param evt the DOM event which triggered the completion of the drag
         * @private
         */
        _endDrag(evt){
            if(this.isDragging)
            {
                this.isDragging = false;
                this.dragCounter = 0;
                this.dragStart = {x: null, y: null};
                this.dragTracking = {x: null, y: null};
            }
        }
        /**
         * Utility method to determine whether a mouse click on the timeline is actually a 'click'
         * or just the mouseup at the end of a mouse drag.
         *
         * @param evt the DOM event which triggered the candidate click
         * @private
         */
        _click(evt){
            let isClick = (this.isDragging && this.dragCounter < this.options.dragVsClickThreshold);
            if(isClick){
                let canvasOffset = jQuery(this.canvas).offset();
                let coords = {x:evt.pageX - canvasOffset.left,
                              y:evt.pageY - canvasOffset.top};
                let clickedItems = this.getTimelineItemsForLocation(coords);
                this._fireTimelineClick(coords, clickedItems);
            }
        }
        /**
         * Utility method to handle a double mouse click on the timeline
         *
         * @param evt the DOM event which triggered the double click
         * @private
         */
        _doubleClick(evt){
            let canvasOffset = jQuery(this.canvas).offset();
            let coords = {x:evt.pageX - canvasOffset.left,
                          y:evt.pageY - canvasOffset.top};
            let clickedItems = this.getTimelineItemsForLocation(coords);
            this._fireTimelineDoubleClick(coords, clickedItems);
        }
        /**
         * Updates the list of items currently under the 'now' indicator
         *
         * @return {boolean} true if the now items have changed, false otherwise
         * @private
         */
        _updateNowItems(){
            if(this.densityStats.max <= 1){
                // special optimised case for situations where we know that none of the timeline
                // items "overlap" (i.e., occur concurrently)
                return this._updateNowItem();
            }

            let now = this.getNow();
            let nowItemsChanged = false;
            let nowItemPKs = {};
            let notNowItemPKs = {};
            let currentNowItems = [];

            // check if any of the items which were 'now' items are no longer 'now' items
            if(this.nowItems.length !== 0){
                for(let idx=0; idx<this.nowItems.length; idx++){
                    let item = this.nowItems[idx];
                    if(this._isDuringRenderedItem(now, item)){
                        currentNowItems.push(item);
                        nowItemPKs[item.pk] = true;
                    } else {
                        // one of the existing 'now' items is no longer a 'now' item
                        nowItemsChanged = true;
                        notNowItemPKs[item.pk] = true;
                    }
                }
            }
            // since the 'now' indicator is always in the visible range, we can restrict our search
            // to only those items which are currently visible (i.e., have been rendered to the
            // timeline), which, in most cases, should be a lot faster than checking *all* the
            // items (though of course when the timeline is zoomed "all the way out" is no better.
            // NOTE: this code is almost identical to that in the internal utility method
            //       _searchVisibleTimelineItemsByTimestamp(), but because we need to track whether
            //       the nowItems have changed, there is a bit of extra code in here for that.
            let renderedTimelineItems = this.renderedItems.items;
            for(let idx=0; idx<renderedTimelineItems.length; idx++){
                let rendered = renderedTimelineItems[idx];
                let renderedItem = rendered.item;
                if(nowItemPKs[renderedItem.pk] !== true && notNowItemPKs[renderedItem.pk] !== true){
                    // we found something that's not in the list of 'now' items yet, and isn't in
                    // the list of items we already know is not overlapping 'now', so check if it
                    // needs to be added...
                    let renderedBounds = rendered.bounds;
                    if(this._isDuringRenderedItem(now, renderedItem)){
                        // it is, so a new 'now' item has been identified
                        currentNowItems.push(renderedItem);
                        nowItemPKs[renderedItem.pk] = true;
                        nowItemsChanged = true;
                    }
                }
            }

            if(nowItemsChanged){
                // sort the new 'now' items chronologically
                this._sortTimelineItems(currentNowItems);
                this.nowItems = currentNowItems;
            }

            return nowItemsChanged;
        }
        /**
         * Updates the *single* item currently under the 'now' indicator
         *
         * NOTE: This is only suitable if the timeline is such that no items can "overlap" (i.e.,
         * there are no cases where multiple items occur concurrently), and is optimised for that
         * case. Generally speaking {@link _updateNowItems} should be called instead of this
         * method - it will delegate to this method as appropriate.
         *
         * @return {boolean} true if the now items have changed, false otherwise
         * @private
         */
        _updateNowItem(){
            let now = this.getNow();
            let currentNowItem = this.nowItems.length === 0 ? null : this.nowItems[0];
            let newNowItem = currentNowItem;

            if(currentNowItem !== null){
                if(!this._isDuringRenderedItem(now, currentNowItem)){
                    // existing 'now' item is no longer under the 'now' marker
                    newNowItem = null;
                }
            }

            if(currentNowItem === null && this.timelineItems.length > 0){
                let idx = this._binaryTimeSearch(now, this.timelineItems);
                if(idx >= 0){
                    let item = this.timelineItems[idx];
                    if(this._isDuringRenderedItem(now, item)){
                        // a new 'now' item is under the 'now' marker
                        newNowItem = item;
                    }
                }
            }

            if(newNowItem === null){
                this.nowItems = [];
            } else {
                this.nowItems = [newNowItem];
            }

            return (currentNowItem === null && newNowItem !== null) ||
                (currentNowItem !== null && newNowItem === null) ||
                (currentNowItem !== null && newNowItem !== null && currentNowItem.pk !== newNowItem.pk);
        }
        /**
         * Utility function to sort timeline items chronologically by start time, and then by end
         * time if two items happen to have the same start time.
         *
         * @param items the array of items to be sorted (will be sorted in place)
         * @return {ns.Timeline}
         * @private
         */
        _sortTimelineItems(items){
            if(typeof(items) !== 'undefined' && items !== null && items.length > 1) {
                items.sort(this._timelineItemComparator);
            }
            return this;
        }
        /**
         * Utility function to return the index in the timeline items of the given item.
         *
         * NOTE: uses a binary search, so the candidateItems must be sorted chronologically with
         * {@link _sortTimelineItems} for this to work
         * @param searchItem the item to search for
         * @param candidateItems the items to find the index of the item in
         * @return {number} the index of the item, or -1 if the item could not be found in the
         *         candidate items.
         * @private
         */
        _binaryItemSearch(searchItem, candidateItems){
            let minIndex = 0;
            let maxIndex = candidateItems.length - 1;

            while (minIndex <= maxIndex) {
                let currentIndex = (minIndex + maxIndex) / 2 | 0;
                let currentItem = this.timelineItems[currentIndex];

                let comparison = this._timelineItemComparator(searchItem, currentItem);
                if (comparison < 0) {
                    maxIndex = currentIndex - 1;
                } else if (comparison > 0) {
                    minIndex = currentIndex + 1;
                } else {
                    return currentIndex;
                }
            }

            return -1;
        }
        /**
         * Utility function to return the index in the timeline items for item 'best matching' the
         * given time, which will either be the index for the item which starts *exactly* at the
         * given time, or the index for item which starts before the given time in the case that
         * there is no exact match.
         *
         * NOTE: If there are no candidate items at all, -1 will be returned by this method.
         *
         * NOTE: uses a binary search, so the candidateItems must be sorted chronologically with
         * {@link _sortTimelineItems} for this to work
         *
         * @param timestamp the timestamp to search on, as a UNIX time in milliseconds
         * @param candidateItems the items to search amongst
         * @return {number} the index in the timeline items for item 'best matching' the given time,
         * which will either be the index for the item which starts *exactly* at the given time, or
         * the index for item which happens before the given time in the case that there is no
         * exact match.
         * @private
         */
        _binaryTimeSearch(timestamp, candidateItems){
            let minIndex = 0;
            let maxIndex = candidateItems.length - 1;

            while (minIndex <= maxIndex) {
                let currentIndex = (minIndex + maxIndex) / 2 | 0;
                let currentItem = this.timelineItems[currentIndex];

                let comparison = timestamp - currentItem.start;
                if (comparison < 0) {
                    maxIndex = currentIndex - 1;
                } else if (comparison > 0) {
                    minIndex = currentIndex + 1;
                } else {
                    return currentIndex;
                }
            }

            return maxIndex;
        }
        /**
         * Utility function to compare timeline items chronologically by start time, and then by end
         * time if two items happen to have the same start time, and finally by pk if both items
         * have the same start and end times.
         *
         * @param a the first timeline item
         * @param b the second timeline item
         * @return {number} a value < 0 if a is chronologically earlier than b, a value > 0 if a is
         *         chronologically after b, and a value of 0 if a and b can be considered to be
         *         chronologically equivalent
         * @private
         */
        _timelineItemComparator(a, b){
            let delta = a.start - b.start;
            if(delta === 0){
                delta = a.end - b.end;
                if(delta === 0){
                    delta = a.pk > b.pk ? 1 : a.pk === b.pk ? 0 : -1;
                }
            }
            return delta;
        }
        /**
         * Utility method to determine whether a timestamp falls within the duration of the timeline
         * item *as rendered on the timeline* (due to the maxRenderedDuration option setting this
         * may be shorter than the *actual* full duration of the item.
         *
         * @param timestamp the timestamp as a UNIX time in milliseonds which is to be tested
         *        against the timeline item
         * @param item the timeline item
         * @return {boolean} true if the timestamp is on or after the start of the timeline item
         *         AND on or before the end of the timeline item as rendered on the timeline, false
         *         otherwise.
         * @private
         */
        _isDuringRenderedItem(timestamp, item){
            let renderClipping = this.options.maxRenderedDuration;
            if( renderClipping > 0 &&
               (item.end - item.start > renderClipping)) {
                return this._isDuring(timestamp, item.start, item.start + renderClipping);
            }
            return this._isDuringItem(timestamp, item);
        }
        /**
         * Utility method to determine whether a timestamp falls within the duration of the timeline
         * item (compare with {@link _isDuringRenderedItem}).
         *
         * @param timestamp the timestamp as a UNIX time in milliseonds which is to be tested
         *        against the timeline item
         * @param item the timeline item
         * @return {boolean} true if the timestamp is on or after the start of the timeline item
         *         AND on or before the end of the timeline item, false otherwise.
         * @private
         */
        _isDuringItem(timestamp, item){
            return this._isDuring(timestamp, item.start, item.end);
        }
        /**
         * Utility method to determine whether a timestamp falls within the given time range
         * @param timestamp the timestamp as a UNIX time in milliseonds which is to be tested
         *        against the duration
         * @param range the range, conatining the start and end timestamps of the range as a UNIX
         *        times in milliseonds {start:12345, end:23456}
         * @return {boolean} true if the timestamp is on or after the start of the range AND on or
         *         before the end of the range, false otherwise.
         * @private
         */
        _isDuringRange(timestamp, range){
            return this._isDuring(timestamp, range.start, range.end);
        }
        /**
         * Utility method to determine whether a timestamp falls within the given duration
         * @param timestamp the timestamp as a UNIX time in milliseonds which is to be tested against
         *        the duration
         * @param start the start timestamp of the duration as a UNIX time in milliseonds
         * @param end the end timestamp of the duration as a UNIX time in milliseonds
         * @return {boolean} true if the timestamp is on or after the start of the duration item
         *         AND on or before the end of the duration item, false otherwise.
         * @private
         */
        _isDuring(timestamp, start, end){
            return start <= timestamp && end >= timestamp;
        }
        /**
         * Utility function to obtain the number of milliseconds which is represented by a single
         * (horizontal) pixel with respect to the current state of the timeline.
         *
         * @return {number} the number of milliseconds which is represented by a single (horizontal)
         *         pixel with respect to the current state of the timeline.
         * @private
         */
        _getMillisecondsPerPixel()
        {
            return this.canvas.width / this.getVisibleDuration();
        }
        /**
         * Utility function to convert a width in pixels to a duration relative to the current state
         * of the timeline canvas
         *
         * @param pixels the width to convert
         * @return {number} the duration in milliseconds which the width corresponds to
         * @private
         */
        _widthToDuration(pixels){
            return pixels * this._getMillisecondsPerPixel();
        }
        /**
         * Utility function to convert a width in pixels to a duration relative to the current state
         * of the timeline canvas
         *
         * @param pixels the list of widths to convert
         * @return {number} the durations in milliseconds which the widths correspond to
         * @private
         */
        _widthsToDurations(...pixels){
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            let result = [];
            for(let idx=0; idx<pixels.length; idx++){
                result.push(pixels[idx] * millisecondsPerPixel);
            }
            return result;
        }
        /**
         * Utility function to convert a duration in seconds to a width in pixels to relative to the
         * current state of timeline
         *
         * @param milliseconds the duration in milliseconds to be converted
         * @return {number} the width in pixels corresponding to the provided duration
         * @private
         */
        _durationToWidth(milliseconds){
            return milliseconds / this._getMillisecondsPerPixel();
        }
        /**
         * Utility function to convert durations in seconds to widths in pixels to relative to the
         * current state of timeline
         *
         * @param milliseconds the durations in milliseconds to be converted
         * @return {number} the widths in pixels corresponding to the provided durations
         * @private
         */
        _durationsToWidths(...milliseconds){
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            let result = [];
            for(let idx=0; idx<milliseconds.length; idx++){
                result.push(milliseconds[idx] / millisecondsPerPixel);
            }
            return result;
        }
        /**
         * Utility function to convert a timestamp to an x-coordinate relative to the current state
         * of the timeline canvas
         *
         * @param timestamp the timestamp to convert as a UNIX time in milliseconds
         * @return {number} the x-coordinate corresponding to the timestamp
         * @private
         */
        _timeToXcoord(timestamp){
            return (timestamp - this.visibleStart) * this._getMillisecondsPerPixel();
        }
        /**
         * Utility function to convert timestamps to x-coordinates relative to the current state of
         * the timeline canvas
         *
         * @param timestamps the timestamps to convert as UNIX times in milliseconds
         * @return {number} the x-coordinates corresponding to the timestamps
         * @private
         */
        _timesToXcoords(...timestamps){
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            let result = [];
            for(let idx=0; idx<timestamps.length; idx++){
                result.push((timestamps[idx] - this.visibleStart) * millisecondsPerPixel);
            }
            return result;
        }
        /**
         * Utility function to convert an x-coordinate relative to the current state of the timeline
         * canvas to a timestamp
         *
         * @param x the x-coordinate to convert
         * @return {*} the timestamp corresponding to the x-coordinate as a UNIX time in
         *         milliseconds
         * @private
         */
        _xCoordToTime(x){
            return this.visibleStart + (x / this._getMillisecondsPerPixel());
        }
        /**
         * Utility function to convert x-coordinates relative to the current state of the timeline
         * canvas to timestamps
         *
         * @param x the x-coordinates to convert
         * @return {*} the timestamps corresponding to the x-coordinate as a UNIX times in
         *         milliseconds
         * @private
         */
        _xCoordsToTimes(...x){
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            let result = [];
            for(let idx=0; idx<x.length; idx++){
                result.push(this.visibleStart + (x[idx] / millisecondsPerPixel));
            }
            return result;
        }
        /**
         * An internal utility method which attempts to provide a way to (potentially) drastically
         * cut down on searching for timeline items by timestamp in the case that the timestamp is
         * within the currently visible range - in this situation we only need to consider the
         * *rendered* timeline items, which is generally a *much* smaller subset of all the timeline
         * items (unless the entirety of the timeline is visible from start to end, in which case
         * it is no better)
         *
         * @param timestamp
         * @return {Array}
         * @private
         */
        _searchVisibleTimelineItemsByTimestamp(timestamp){
            let items = [];
            // if the timestamp is actually within the visible range...
            if(this.isDuringVisibleRange(timestamp)){
                // .. grab the X-coordinate which is equivalent to the timestamp
                let timeXcoord = this._timeToXcoord(timestamp);
                //... and run through the rendered timeline items to see if this coordinate falls
                // inside the left/right edges of any of their bounding boxes
                let renderedTimelineItems = this.renderedItems.items;
                let renderedItemCount = renderedTimelineItems.length;
                for(let idx=0; idx<renderedItemCount; idx++){
                    let rendered = renderedTimelineItems[idx];
                    let renderedBounds = rendered.bounds;
                    if(timeXcoord >= renderedBounds.x0 && timeXcoord <= renderedBounds.x1){
                        // found one!
                        items.push(rendered.item);
                    }
                }
            }
            return items;
        }
        /**
         * Updates the internal 'density statistics' based on the current timeline items.
         * Essentially it tries to provide a way to determine how many timeline items are
         * overlapping at any given point, and pre-calculate the information required to deconflict
         * items when rendering so that they don't overlap visually on the timeline.
         *
         * This should be called after adding or removing items from the timeline. Bear in mind
         * that it could potentially be quite expensive to call repeatedly, so items should be
         * added "in bulk", and then this method should be called.
         *
         * The density statistics updates two member variables:
         *   - this.densityStats
         *   - this.itemSlots
         *
         *     this.densityStats is an object of the following form:
         *
         *        {{max: number, densities: Array}} where...
         *         - max : is the maximum item density across the entire timeline (i.e., the maximum
         *                 number of simultaneous/overlapping items which was found
         *         - densities : an array of objects of the following form:
         *           {density:123, start:123456789, end:234567890, items:[...]}
         *           ...where...
         *               - count is the number of items overlapping in the current 'period of
         *                 density'
         *               - start is the start timestamp of the current 'period of density' as a UNIX
         *                 time in milliseconds
         *               - end is the end timestamp of the current 'period of density' as a UNIX
         *                 time in milliseconds
         *               - duration is duration of the current 'period of density' in milliseconds
         *               - items is an array containing all the timeline items which are
         *                 contributing to the current 'period of density', ordered by their start
         *                 timestamp.
         *           Items in the densities array are chronologically ordered, and the end timestamp
         *           of each density entry is guaranteed to be the start timestamp of the next
         *           entry.
         *
         *
         *     this.itemSlots is simply a lookup table of item PK to slot index, and is of the
         *     following form:
         *        {
         *          ITEM_A_PK: ITEM_A_SLOT_IDX,
         *          ITEM_B_PK: ITEM_B_SLOT_IDX,
         *          ITEM_C_PK: ITEM_C_SLOT_IDX,
         *          ...
         *        }
         *
         * @return {ns.Timeline}
         * @private
         */
        _refreshDensityStats() {
            this.densityStats = {max:0, densities:[]};
            this.itemSlots = {};

            if(this.timelineItems.length === 0){
                return this;
            }

            let shouldClipDuration = this.options.maxRenderedDuration > 0;
            let clippedDuration = this.options.maxRenderedDuration;

            // here we put all the start and end timestamps for all timeline items into an array,
            // flagging each as a 'start' or 'end', and then ordering all of them chronologically
            let changes = [];
            for (let idx = 0; idx < this.timelineItems.length; idx++) {
                let item = this.timelineItems[idx];
                changes.push({isStart: true, timestamp: item.start, item: item});
                // respect the configured maximum duration, if required
                if(shouldClipDuration){
                    let duration = Math.min(clippedDuration, (item.end - item.start));
                    changes.push({isStart: false, timestamp: item.start + duration, item: item});
                } else {
                    changes.push({isStart: false, timestamp: item.end, item: item});
                }
            }
            changes.sort(function (a, b) {return a.timestamp - b.timestamp;});

            // now we run through the changes array and...
            // - each time we come across a 'start' change, we increment the overlap count by one
            // - each time we come across an 'end' change, we decrement the overlap count by one
            // - for each overlap level change 'period', create an entry containing details the
            //   overlap level, start and end, and items contributing to the overlaps for that
            //   change 'period'

            // the number of items which are currently overlapping (i.e., the number of items
            // happening "at the same time"
            let currentOverlapCount = 0;
            // the maximum number of overlapping items at any given time across
            // all items in the timeline
            let maxOverlap = 0;
            // a lookup table mapping item PKs to items
            let currentItemPks = {};
            // lookup tables mapping item PKs to "slot" numbers - items occupy slots as they
            // overlap, each item occupying the first available slot. That is, the first item will
            // occupy slot 0, then second slot 1, and so on. As items "end" they free up a slot,
            // and that slot then becomes available for the next item. This assists in
            // deconflicting rendered items so that they are not rendered "on top of" each other.
            let currentSlotsOccupied = {};
            // the actual list of density entries
            let densities = [];

            for (let idx = 0; idx < changes.length-1; idx++) {
                // grab current and next change entries
                let thisChange = changes[idx];
                let nextChange = changes[idx+1];
                // update the current overlap count depending on whether the current
                // entry was the 'start' or 'end' of a timeline item
                let isStart = thisChange.isStart;
                currentOverlapCount += isStart ? 1 : -1;
                // track the maximum density level
                maxOverlap = currentOverlapCount > maxOverlap ? currentOverlapCount : maxOverlap;
                // figure out which timeline items contribute to the current overlap count
                let items = null;
                let startedItem = null;
                let endedItem = null;
                if(currentOverlapCount === 0) {
                    // nothing overlapping
                    currentItemPks = {};
                    currentSlotsOccupied = [];
                } else {
                    if(isStart){
                        // a 'start' - need to add the item to the currently overlapping items
                        startedItem = thisChange.item;
                        currentItemPks[startedItem.pk] = startedItem;
                        // find a 'slot' for the item - choose the first slot available (i.e., the
                        // one with the lowest index which is also currently empty)
                        let slotIdx = 0;
                        let itemIsSlotted = false;
                        while(!itemIsSlotted){
                            if(!currentSlotsOccupied[slotIdx]){
                                // the value for the slot at this index is either false or
                                // undefined, either of which means that it is currently vacant -
                                // put the item in this slot
                                this.itemSlots[startedItem.pk] = slotIdx;
                                // mark the slot as "occupied"
                                currentSlotsOccupied[slotIdx] = true;
                                itemIsSlotted = true;
                            } else {
                                // the slot is occupied - search the next one
                                slotIdx ++;
                            }
                        }
                    } else {
                        endedItem = thisChange.item;
                        // an 'end' - need to remove the item from the currently overlapping items
                        delete currentItemPks[endedItem.pk];

                        // remove the item from the occupied "slots" so something else can use it by
                        // first marking the slot as "vacant"...
                        let slotIdx = this.itemSlots[endedItem.pk];
                        currentSlotsOccupied[slotIdx] = false;
                    }

                    // put all overlapping items for this change period into an
                    // array sorted chronologically
                    let keys = Object.getOwnPropertyNames(currentItemPks);
                    items = [];
                    for(let j=0;j<keys.length; j++) {
                        let key = keys[j];
                        items.push(currentItemPks[key]);
                    }
                    this._sortTimelineItems(items);
                }
                // push an entry onto the density statistics for output
                densities.push({
                    count:currentOverlapCount, // how many simultaneous items are there currently?
                    items:items, // the items that are currently overlapping
                    startedItem:startedItem, // the item that started to make the density change (if
                                             // any)
                    endedItem:endedItem, // the item that ended to make the density change (if any)
                    start:thisChange.timestamp, end:nextChange.timestamp, // start and end of the
                                                                          // change in "density"
                    duration:nextChange.timestamp - thisChange.timestamp // how long the current
                                                                         // density lasts
                });
            }

            // finally, return the statistics
            this.densityStats.max = maxOverlap;
            this.densityStats.densities = densities;
            return this;
        }
        /**
         * Utility function to update the major/minor tick spacing so that it is appropriate to the
         * current timeline state. This should be called whenever the visible duration (or the "zoom
         * level") changes
         */
        _updateTickSpacing(){
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            // work out appropriate tick spacing for current zoom level
            let idx= 0;
            let tickSpacingGroups = this.options.tickSpacingGroups;
            let groupCount = tickSpacingGroups.length;
            let done = false;
            while(!done && idx < groupCount){
                let timeBlock = tickSpacingGroups[idx];
                if((idx === groupCount - 1) ||
                    (millisecondsPerPixel * timeBlock.major > this.options.minTickPixelSeparation))
                {
                    this.tickSpacing = timeBlock;
                    done = true;
                }
                idx++;
            }
        }
        /**
         * Renders "masks" before the start of the first timeline item and after the end time of the
         * last timeline item to provide a visual indicator of the bounds of the timeline items
         *
         * @private
         */
        _renderStartEndMasking(){
            let maskColor = this.options.boundsMaskColor;
            let visibleRange = this.getVisibleRange();
            if(this.startTime > visibleRange.start){
                let x = this._timeToXcoord(this.startTime);
                this._rect(0, 0, x, this.canvas.height, maskColor);
            }
            if(this.endTime < visibleRange.end){
                let x = this._timeToXcoord(this.endTime);
                this._rect(x, 0, this.canvas.width, this.canvas.height, maskColor);
            }
        }
        /**
         * Renders the ticks of the timeline
         * @return {ns.Timeline}
         * @private
         */
        _renderTimelineTicks(){
            let visibleDuration = this.getVisibleDuration();
            let millisecondsPerPixel = this._getMillisecondsPerPixel();
            let canvasHeight = this.canvas.height;

            let minorTickSpacing = this.tickSpacing.minor;
            let majorTickSpacing = this.tickSpacing.major;

            let datetimeFormatter = null;
            let idx = 0;
            datetimeFormatter = this.options.tickLabelFormats[0].format;
            while(idx < (this.options.tickLabelFormats.length-1) && majorTickSpacing < this.options.tickLabelFormats[idx].min){
                idx++;
                datetimeFormatter = this.options.tickLabelFormats[idx].format;
            }

            // minor ticks
            let tickColor = this.options.minorTickColor;
            let start = this.visibleStart;
            if(start % minorTickSpacing !== 0) {
                let roundedStart = Math.round(start);
                start = roundedStart + minorTickSpacing - (roundedStart % minorTickSpacing);
            }
            start -= this.visibleStart;

            this.ctx2d.setLineDash([1, 1]);
            for(let x=start; x < visibleDuration; x+=minorTickSpacing){
                let xPos = x * millisecondsPerPixel;
                // draw minor tick line
                this._line({x:xPos, y:0}, {x:xPos, y:canvasHeight}, tickColor, 1.0);
            }
            this.ctx2d.setLineDash([]);

            // major ticks
            tickColor = this.options.majorTickColor;
            let textColor = this.options.tickLabelColor;
            let textFont = this.options.tickLabelFont;
            start = this.visibleStart;
            if(start % majorTickSpacing !== 0) {
                let roundedStart = Math.round(start);
                start = roundedStart + majorTickSpacing - (roundedStart % majorTickSpacing);
            }
            start -= this.visibleStart;
            for(let x=start; x < visibleDuration; x+=majorTickSpacing){
                let xPos = x * millisecondsPerPixel;
                let datetime = moment(this._xCoordToTime(xPos));
                // draw major tick line
                this._line({x:xPos, y:0}, {x:xPos, y:canvasHeight}, tickColor, 1.0);
                // draw major tick label
                let yPosBase = canvasHeight - 5;
                for(let idx=0; idx<datetimeFormatter.length; idx++)
                {
                    let formatter = datetimeFormatter[idx];
                    let text = datetime.format(formatter);
                    let yPos = yPosBase - (idx * 10);
                    this._centeredText({x:xPos, y:yPos}, text, textColor, textFont);
                }
            }

            return this;
        }
        /**
         * Renders the item density statistics on the timeline
         * @return {ns.Timeline}
         * @private
         */
        _renderTimelineDensities(){
            if(!this.options.shouldRenderDensityStatistics) {
                // the density  plotting is turned off
                return this;
            }

            if(this.densityStats.max <= 1){
                // the density map is only useful if items are actually overlapping, so don't bother
                // if the maximum density is 1 or lower, since this means that no items
                // are overlapping, and there no point drawing.
                return this;
            }

            let color = this.options.densityStatisticsColor;
            let plotAsLine = (this.options.densityStatisticsStyle === 'line');
            let unitStep = this.canvas.height / this.densityStats.max;

            let densities = this.densityStats.densities;
            let lastDensity = 0;
            for(let idx=0; idx<densities.length; idx++){
                let densityEntry = densities[idx];
                let densityStart = densityEntry.start;
                let densityEnd = densityEntry.end;
                let densityCount = densityEntry.count;
                if(densityStart > this.visibleEnd) {
                    // since densities are sorted chronologically, once the start time of density
                    // entries goes beyond the visible end we know there will be nothing else to
                    // draw so we can BREAK out of the loop right now
                    break;
                } else if (densityEnd < this.visibleStart) {
                    // since densities are sorted chronologically, while the end time of density
                    // entries is before the visible start we know we can skip the current item
                    // and just CONTINUE the loop
                    lastDensity = densityCount;
                    continue;
                }

                // check if the density occupies any part of the currently visible range
                if(this.isTimeRangeVisible(densityStart, densityEnd)) {
                    // it's visible - draw it up
                    let currentY = this.canvas.height - (unitStep * densityCount);
                    if (densityStart <= this.visibleStart && densityEnd >= this.visibleEnd) {
                        // item occupies or overflows the entire visible range - can shortcut
                        // by just drawing across the entire timeline width, no need to
                        // calculate the edges
                        if(plotAsLine) {
                            this._line({x: 0,                 y: currentY},
                                       {x: this.canvas.width, y: currentY}, color);
                        } else {
                            let bounds = {x0: 0,                 y0: this.canvas.height,
                                          x1: this.canvas.width, y1: currentY};
                            this._rectBounds(bounds, color);
                        }
                    } else {
                        // all or part of the anomaly is within the range
                        let edges = this._timesToXcoords(densityStart, densityEnd);
                        let lastY = this.canvas.height - (unitStep * lastDensity);
                        if(plotAsLine) {
                            this._line({x: edges[0], y: lastY},
                                       {x: edges[0], y: currentY}, color);
                            this._line({x: edges[0], y: currentY},
                                       {x: edges[1], y: currentY}, color);
                        } else {
                            let bounds = {x0:edges[0], y0:this.canvas.height,
                                          x1:edges[1], y1:currentY};
                            this._rectBounds(bounds, color);
                        }
                    }
                }
                lastDensity = densityCount;
            }

            return this;
        }
        /**
         * Renders the items on the timeline
         * @return {ns.Timeline}
         * @private
         */
        _renderTimelineItems(){
            let hasOverlapItems = this.densityStats.max > 1;
            let verticalCenter = this.canvas.height / 2.0;
            if(!hasOverlapItems){
                // if there are no overlapping items, we can render straight off the timeline items
                // which is a bit simpler to process
                let thickness = this.options.itemThickness;
                for(let timelineItemIdx=0; timelineItemIdx< this.timelineItems.length; timelineItemIdx++) {
                    let timelineItem = this.timelineItems[timelineItemIdx];
                    // check if the anomaly occupies any part of the currently visible range
                    if(this.isTimelineItemVisible(timelineItem)) {
                        // it's visible - draw it up
                        let color = timelineItem.color ? timelineItem.color : this.options.defaultItemColor;
                        this._renderTimelineItem(timelineItem, verticalCenter, thickness, color);
                    }
                }
            } else {
                // if there *are* overlapping items, we render based off density map that gets
                // created/updated as timeline items are added.
                let densityEntries = this.densityStats.densities;
                // make sure that the thickness of the timeline items is small enough to fit
                // vertically given the number of overlapping items
                let thickness = this.options.itemThickness;
                let separation = this.options.itemSeparation;
                let maxHeight = this.canvas.height / this.densityStats.max;
                if((thickness + separation) > maxHeight){
                    // the configured values are too big - trim them down to fit
                    thickness = maxHeight - separation;
                    if(thickness < 3){
                        thickness = 3;
                        separation = 0;
                    }
                }
                for(let densityEntryIdx=0; densityEntryIdx < densityEntries.length; densityEntryIdx++) {
                    let densityEntry = densityEntries[densityEntryIdx];
                    if(densityEntry.startedItem !== null){
                        // check if the anomaly occupies any part of the currently visible range
                        let timelineItem = densityEntry.startedItem;
                        if(this.isTimelineItemVisible(timelineItem)) {
                            // it's visible - draw it up - basically here we put the first one in
                            // the middle, and then alternate odd/even slots to put overlapping
                            // items above/below the center to try and keep everything "in the
                            // middle". This works a bit better visually than straight vertical
                            // "stacking" of events from the bottom (or top) in my humble opinion.
                            let slotIdx = this.itemSlots[timelineItem.pk] + 1;
                            let color = timelineItem.color ? timelineItem.color : this.getSlotColor(timelineItem);
                            let upOrDown = (slotIdx % 2 === 0);
                            let halfSlotIdx = Math.floor(slotIdx / 2.0);
                            let yPos = verticalCenter +
                                       (halfSlotIdx * (thickness + separation)) *
                                       (upOrDown ? -1 : 1);
                            this._renderTimelineItem(timelineItem, yPos, thickness, color);
                        }
                    }
                }
            }
            return this;
        }
        /**
         * Renders a single timeline item
         *
         * NOTE: it is assumed when this method is called that it has been validated that some or
         * all of the timeline item *is* actually visible on the timeline - no such checks are done
         * here
         *
         * @param item the item to be drawn
         * @param yCenter the vertical center coordinate on the timeline to draw the item at
         * @param thickness the vertical hight (in pixels) for the item
         * @param color the color to draw the item
         * @return {ns.Timeline}
         * @private
         */
        _renderTimelineItem(item, yCenter, thickness, color){
            let start = item.start;
            let end = item.end;

            // respect the configured maximum rendering duration, if any
            if(this.options.maxRenderedDuration > 0 && ((end - start) > this.options.maxRenderedDuration)){
                end = start + this.options.maxRenderedDuration;
            }

            let halfThickness = thickness * 0.5;
            if (start <= this.visibleStart && end >= this.visibleEnd) {
                // item occupies or overflows the entire visible range - shortcut
                let bounds = {x0: 0,                 y0: yCenter - halfThickness,
                              x1: this.canvas.width, y1: yCenter + halfThickness};
                this._rectBounds(bounds, color);
                this.renderedItems.items.push({bounds:bounds, item:item});
                this.renderedItems.bounds = ns.Timeline._mergedBounds(this.renderedItems.bounds, bounds);
            } else {
                // all or part of the anomaly is within the range
                let edges = this._timesToXcoords(start, end);
                // make sure the width of the item doesn't go below 2 pixels (i.e., prevent
                // it from becoming a single pixel line or invisible)
                if (edges[1] - edges[0] < 2) {
                    // too skinny! fatten it up a bit.
                    edges[0] -= 1;
                    edges[1] += 1;
                }
                let bounds = {x0: edges[0], y0: yCenter - halfThickness,
                              x1: edges[1], y1: yCenter + halfThickness
                };
                this._rectBounds(bounds, color);
                this.renderedItems.items.push({bounds: bounds, item: item});
                this.renderedItems.bounds = ns.Timeline._mergedBounds(this.renderedItems.bounds, bounds);
            }

            return this;
        }
        /**
         * Renders the 'now' indicator in the center of the timeline
         * @return {ns.Timeline}
         * @private
         */
        _renderNowIndicator(){
            // "now" indicator
            let color = this.options.nowIndicatorColor;
            let cx = this.canvas.width * this.options.nowIndicatorPosition;
            this._line({x:cx, y:0}, {x:cx, y:this.canvas.height}, color, 1);
            let triangles = [
                [{x:cx-5, y:0}, {x:cx+5, y:0}, {x:cx, y:5}],
                [{x:cx-5, y:this.canvas.height},{x:cx+5, y:this.canvas.height},{x:cx, y:this.canvas.height-5}]
            ];
            for(let idx=0; idx< triangles.length; idx++){
                this._filledPolygon(triangles[idx], color, color);
            }
            return this;
        }
        /**
         * Clear the canvas
         * @param color the color to fill the canvas with
         * @return {ns.Timeline}
         * @private
         */
        _clear(color){
            if(color){
                this.ctx2d.fillStyle = color;
                this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            return this;
        }
        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.Timeline}
         * @private
         */
        _fireEvent(eventName, eventProperties={}){
            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
            }

            event.eventName = eventName;
            event.timeline = this;
            jQuery.extend(event, eventProperties);

            if (document.createEvent) {
                this.container.dispatchEvent(event);
            } else {
                this.container.fireEvent("on" + event.eventType, event);
            }
            return this;
        }
        /**
         * Utility method to create 'namespaced' event names for the timeline
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName){
            return this.options.events.namespace + eventName;
        }
        /**
         * Utility method to fire a custom event when the "now" item changes (i.e., the item which
         * is currently under the "now" indicator)
         *
         * @param now the current now timestamp as a UNIX time in milliseconds with respect to the
         *        current state of the timeline
         * @param nowItems the items which are currently under the "now" indicator
         * @return {ns.Timeline}
         * @private
         */
        _fireNowItemsChangedEvent(now, nowItems){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.nowItemsChanged),
                {now:now, items:nowItems}
            );
        }
        /**
         * Utility method to fire a custom event when the visible range of the timeline changes,
         * due to scrolling and/or zooming of the timeline.
         *
         * WARNING: because of the nature of this event,it is possible that it will fire many times
         *          in rapid succession as the timeline is dragged around. Listeners which handle
         *          this event should take this into account.
         *
         * @param now the current now timestamp as a UNIX time in milliseconds with respect to the
         *        current state of the timeline
         * @param visibleStart the timestamp of the new start of the visible range of the timeline
         *        as a UNIX time in milliseconds
         * @param visibleEnd the timestamp of the new end of the visible range of the timeline as
         *        a UNIX time in milliseconds
         * @return {ns.Timeline}
         * @private
         */
        _fireVisibleRangeChangedEvent(now, visibleStart, visibleEnd){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.visibleRangeChanged),
                {now:now, start:visibleStart, end:visibleEnd}
            );
        }
        /**
         * Utility method to fire a custom event as the timeline is dragged
         *
         * WARNING: because of the nature of this event,it is possible that it will fire many times
         *          in rapid succession as the timeline is dragged around. Listeners which handle
         *          this event should take this into account.
         *
         * @param now the current now timestamp as a UNIX time in milliseconds with respect to the
         *        current state of the timeline
         * @param startPos the coordinates in pixels of the start of the current drag relative to
         *        the origin (0,0) at the top left of the timeline canvas as an object in the form
         *        {x:123, y:456}
         * @param currentPos the coordinates in pixels of the current location of the current drag
         *        relative to the origin (0,0) at the top left of the timeline canvas as an object
         *        in the form {x:123, y:456}
         * @param delta the (x,y) offset in pixels of the current location of the current drag
         *        relative to previous drag event as an object in the form {dx:123, dy:456}
         * @param distance the (x,y) offset in pixels of the current location of the current drag
         *        relative to the start of the drag event as an object in the form {dx:123, dy:456}
         * @return {ns.Timeline}
         * @private
         */
        _fireTimelineDragEvent(now, startPos, currentPos, delta, distance){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.drag),
                {
                    now: now, // "now" according to the current state of the timeline
                    startPos: startPos, // start of drag as {x:123, y:123}
                    currentPos: currentPos, // current drag position as {x:123, y:123}
                    delta: delta, // x,y offset from last drag event as {dx: 12, dy: 34}
                    distance: distance // current x,y offset relative to start of drag as {dx: 12, dy: 34}
                }
            );
        }
        /**
         * Utility method to fire a custom event when the timeline is clicked
         *
         * @param coords the coordinates in pixels of the click relative to the origin (0,0) at the
         *        top left of the timeline canvas as an object in the form {x:123, y:456}
         * @param clickedItems a list of timeline items under the clicked coordinates (may be empty,
         *        but should not be null)
         * @return {ns.Timeline}
         * @private
         */
        _fireTimelineClick(coords, clickedItems){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.click),
                {location:coords, clicked:clickedItems}
            );
        }
        /**
         * Utility method to fire a custom event when the timeline is double clicked
         *
         * @param coords the coordinates in pixels of the double click relative to the origin (0,0)
         *        at the top left of the timeline canvas as an object in the form {x:123, y:456}
         * @param clickedItems a list of timeline items under the double clicked coordinates (may be
         *        empty, but should not be null)
         * @return {ns.Timeline}
         * @private
         */
        _fireTimelineDoubleClick(coords, clickedItems){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.doubleClick),
                {location:coords, clicked:clickedItems}
            );
        }
        /**
         * Utility method to fire a custom event when a timeline transition commences
         *
         * @return {ns.Timeline}
         * @private
         */
        _fireTimelineTransitionStart(){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.transitionStart)
            );
        }
        /**
         * Utility method to fire a custom event when a timeline transition completes
         *
         * @return {ns.Timeline}
         * @private
         */
        _fireTimelineTransitionComplete(){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.transitionComplete)
            );
        }
        /**
         * Draw a line between two points on the timeline canvas
         *
         * @param coord0 the origin of the line in the form {x:123, y:456} where x and y are the
         *        coordinates of the start of the line
         * @param coord1 the terminus of the line in the form {x:123, y:456} where x and y are the
         *        coordinates of the terminus of the line
         * @param color the color for the line
         * @param width the width of the line
         * @return {ns.Timeline}
         * @private
         */
        _line(coord0, coord1, color, width) {
            this.ctx2d.strokeStyle = color;
            this.ctx2d.lineWidth = width ? width : 1;
            this.ctx2d.beginPath();
            this.ctx2d.moveTo(coord0.x, coord0.y);
            this.ctx2d.lineTo(coord1.x, coord1.y);
            this.ctx2d.stroke();
            return this;
        }
        /**
         * Draw a filled polygon on the timeline canvas
         * @param coords an array containing the coordinates of the vertices of the polygon in the
         *        form {x:123, y:456} where x and y are the coordinates of the vertex
         * @param color the fill color
         * @return {ns.Timeline}
         * @private
         */
        _filledPolygon(coords, color) {
            this.ctx2d.fillStyle = color;
            this.ctx2d.beginPath();
            this.ctx2d.moveTo(coords[0].x, coords[0].y);
            for(let idx=1; idx<coords.length; idx++){
                this.ctx2d.lineTo(coords[idx].x, coords[idx].y);
            }
            this.ctx2d.closePath();
            this.ctx2d.fill();
            return this;
        }
        /**
         * Draw a rectangle based on bounds on the timeline canvas
         * @param bounds the bounds of the rectangle in the form {x0:12, y0:34, x1:56, y1:78}, where
         *        x0 and y0 are the x and y coordinates of the top left corner and x1 and y1 are the
         *        x and y coordinates of the bottom right corner
         * @param fill the fill color
         * @return {ns.Timeline}
         * @private
         */
        _rectBounds(bounds, fill) {
            let x = bounds.x0,
                y = bounds.y0,
                w = bounds.x1 - bounds.x0,
                h = bounds.y1 - bounds.y0;
            return this._rect(x, y, w, h, fill);
        }
        /**
         * Draw a rectangle based on top left corner and width and height on the timeline canvas
         * @param x the x coordinate of the top left corner
         * @param y the y coordinate of the top left corner
         * @param w the width of the rectangle
         * @param h the height of the rectangle
         * @param fill the fill color
         * @return {ns.Timeline}
         * @private
         */
        _rect(x, y, w, h, fill) {
            this.ctx2d.fillStyle = fill;
            this.ctx2d.fillRect(x, y, w, h);
            return this;
        }
        /**
         * Draw a circle on the timeline canvas
         * @param center the center of the circle in the form {x:123, y:456} where x and y are the
         *        coordinates of the center of the circle
         * @param radius the radius of the circle
         * @param fill the fill color
         * @param stroke the stroke color
         * @return {ns.Timeline}
         * @private
         */
        _circle(center, radius, fill, stroke){
            this.ctx2d.fillStyle = fill;
            this.ctx2d.strokeStyle = stroke;
            this.ctx2d.beginPath();
            this.ctx2d.arc(center.x, center.y, radius, 0, Math.PI*2, true);
            this.ctx2d.closePath();
            this.ctx2d.fill();
            return this;
        }
        /**
         * Draw text on the timeline canvas
         * @param coords the origin of the text in the form {x:123, y:456} where x and y are the
         *        coordinates of the origin of the text
         * @param text the text to draw
         * @param fill the fill color
         * @param font the font to draw the text with
         * @param alignment the alignment policy for the text
         * @return {ns.Timeline}
         * @private
         */
        _text(coords, text, fill, font, alignment='left'){
            this.ctx2d.font = font;
            this.ctx2d.fillStyle = fill;
            this.ctx2d.textAlign = alignment;
            this.ctx2d.fillText(text, coords.x, coords.y);
            return this;
        }
        /**
         * Draw centered text on the timeline canvas
         * @param coords the origin of the text in the form {x:123, y:456} where x and y are the
         *        coordinates of the origin of the text. The text will be centered horizontally
         *        around this point.
         * @param text the text to draw
         * @param fill the fill color
         * @param font the font to draw the text with
         * @return {ns.Timeline}
         * @private
         */
        _centeredText(coords, text, fill, font){
            return this._text(coords, text, fill, font, 'center');
        }
        /**
         * Utility function to periodically update a transition in progress
         * @private
         */
        _updateTransition(){
            this._cancelTransition();
            if(this.transition !== null){
                let progress = (new Date().getTime() - this.transition.t0) / this.transition.duration;
                progress = ns.Timeline._constrain(progress, 0, 1);
                if(progress < 1.0) {
                    // transition in progress
                    let factor = this._easing(progress);
                    let newStart = this.transition.start.t0 + (this.transition.start.delta * factor);
                    let newEnd = this.transition.end.t0 + (this.transition.end.delta * factor);
                    this.transition.updateCount ++;
                    // update the visible range and render it, but don't only the tick scale every
                    // 10th update as it's too expensive to do it on *every* update of the animation
                    let shouldUpdateTicks = this.transition.updateCount % 10 === 0;
                    this.setVisibleRange(newStart, newEnd, true, shouldUpdateTicks);
                    this.transition.timer = setTimeout(this._updateTransition.bind(this),
                                                       this.transitionUpdateDelay);
                } else {
                    // transition complete
                    this._completeTransition();
                }
            }
        }
        /**
         * Utility function to put a transition into its final state.
         * @private
         */
        _completeTransition(){
            if(this.transition !== null)
            {
                this._cancelTransition();
                let newStart = this.transition.start.t0 + this.transition.start.delta;
                let newEnd = this.transition.end.t0 + this.transition.end.delta;
                this.setVisibleRange(newStart, newEnd, true, true);
                this.transition = null;
                this._fireTimelineTransitionComplete();
            }
        }
        /**
         * Utility function to cancel a transition in progress
         * @private
         */
        _cancelTransition(){
            if(this.transition !== null && this.transition.timer !== null){
                clearTimeout(this.transition.timer);
                this.transition.timer = null;
            }
        }
        /**
         * The easing function used for transitions
         * @param t the 'completion' of the transition, where 0.0 is the beginning and 1.0 is the
         *        end
         * @return {number} the multiplier to be applied
         * @private
         */
        _easing(t){
            // ease out cubic: full speed from the start, decelerating to the end
            // return (--t) * t * t + 1;
            // ease in/out: accelerate from a stop to full speed at the halfway
            // point then decelerate to a stop at the end
            // cubic
            // return t < 0.5 ? 4*t*t*t
            //                : (t-1)*(2*t-2)*(2*t-2)+1
            // quad
            // return t < 0.5 ? 2*t*t
            //                : -1+(4-2*t)*t;
            // quint
            return t < 0.5 ? 16*t*t*t*t*t
                           : 1+16*(--t)*t*t*t*t;
        }
        //------------------------------------------------------------------------------------------
        // STATIC METHODS
        //------------------------------------------------------------------------------------------
        static rgbs2web(rgbs){
            return rgbs.map(function(rgb){
                return ns.Timeline.rgb2web(rgb);
            });
        }

        /**
         * Convert an RGB color value to a web compatible reporesentation
         *
         * @param rgb the RGB color value of the form {r:12, g:34, b:56}
         * @return {string} the web color representation
         */
        static rgb2web(rgb){
            if(rgb.a !== undefined){
                return 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
            }
            return '#' +
                ns.Timeline._dec2hex(rgb.r) +
                ns.Timeline._dec2hex(rgb.g) +
                ns.Timeline._dec2hex(rgb.b);
        }

        /**
         * Creates a series of RGB color values for a colour gradient
         *
         * @param rgb0 the start color
         * @param rgb1 the end color
         * @param steps the number of steps in total for the gradient
         * @return {Array} an array containing 'steps' RGB values corresponding to the color
         *         gradient
         */
        static colorGradientRgb(rgb0, rgb1, steps){
            // the gradients tend to look "nicer" if we go via HSV
            let hsvs = ns.Timeline.colorGradientHsv(
                ns.Timeline.rgb2hsv(rgb0),
                ns.Timeline.rgb2hsv(rgb1),
                steps);

            // we know the first color because it was provided
            let rgbs = [rgb0];
            for(let idx = 1; idx<hsvs.length-1; idx++){
                rgbs.push(ns.Timeline.hsv2rgb(hsvs[idx]));
            }
            // we know the last color because it was provided
            rgbs.push(rgb1);
            // return the gradient RGB values
            return rgbs;
        }

        /**
         * Creates a series of HSV color values for a colour gradient
         *
         * @param hsv0 the start color
         * @param hsv1 the end color
         * @param steps the number of steps in total for the gradient
         * @return {Array} an array containing 'steps' HSV values corresponding to the color
         *         gradient
         */
        static colorGradientHsv(hsv0, hsv1, steps){
            // work out the 'distance' required for each component of the HSV color
            let dh = hsv1.h - hsv0.h;
            let ds = hsv1.s - hsv0.s;
            let dv = hsv1.v - hsv0.v;

            // initialise the array - we know the first color because it was provided
            let hsvs = [hsv0];
            let idx = 1;
            // we actually need (steps-1) steps because we know the start and end colors
            steps -= 1;
            while(idx < steps){
                let f = idx / steps;
                hsvs.push({h:hsv0.h+(dh*f), s:hsv0.s+(ds*f), v:hsv0.v+(dv*f)});
                idx++;
            }
            // we know the last color because it was provided
            hsvs.push(hsv1);
            // return the gradient values
            return hsvs;
        }

        /**
         * Convert an array of RGB colors to an array of HSV colors
         *
         * @param rgb
         * @param rgbs the array of RGB colors as JavaScript objects of the form {r:12, g:34, b:56}
         * @return {{h: number, s: number, v: number}} the array of equivalent HSV color
         *         specification
         */
        static rgbs2hsv(rgbs) {
            return rgbs.map(function(rgb){
                return ns.Timeline.rgb2hsv(rgb);
            });
        }

        /**
         * Convert an RGB color to an HSV color
         *
         * @param rgb the RGB color as a JavaScript object of the form {r:12, g:34, b:56}
         * @return {{h: number, s: number, v: number}} the equivalent HSV color specification
         */
        static rgb2hsv(rgb) {
            let min, max, delta;

            // We accept RGB arguments from 0 to 255 (because that's generally how people represent
            // those values. Internally, however, values are calculated from a range of 0.0 to 1.0,
            // so make that conversion now:
            let r = rgb.r / 255.0;
            let g = rgb.g / 255.0;
            let b = rgb.b / 255.0;

            min = Math.min(r, g, b);
            max = Math.max(r, g, b);
            delta = max - min;

            if (max === 0){
                // r = g = b = 0 = black
                // NOTE: saturation is 0, so the hue value is *actually* undefined, but go with 0
                return {h: 0, s: 0, v: 0};
            }

            let hue = 0;
            let saturation = delta / max;
            let value = max;

            if(r === max) {
                hue = (g - b) / delta;		// between yellow & magenta
            } else if (g === max) {
                hue = 2 + (b - r) / delta;	// between cyan & yellow
            } else {
                hue = 4 + (r - g) / delta;	// between magenta & cyan
            }

            hue *= 60;	// convert to degrees
            if (hue < 0){
                hue += 360;
            }

            return {h: hue, s: saturation*100.0, v: value*100.0};
        }

        /**
         * Convert an array of HSV colors to an array of RGB colors
         *
         * @param hsvs the array of HSV colors as JavaScript objects of the form {h:12, s:34, v:56}
         * @return {{r: number, g: number, b: number}} the array of equivalent RGB color
         *         specification
         */
        static hsvs2rgb(hsvs) {
            return hsvs.map(function(hsv){
                return ns.Timeline.hsv2rgb(hsv);
            });
        }

        /**
         * This implementation is based on Eugene Vishnevsky's Java algorithm which can be found
         * here:
         *     http://www.cs.rit.edu/~ncs/color/t_convert.html
         *
         * @param hsv a JavaScript object of the form {h:12, s:34, v:56} where...
         *     h the hue (color) value as an angle in degrees (on a colour wheel). For reference
         *       red, yellow, green, cyan, blue and magenta are at 0, 60, 120, 180, 240 and 300
         *       degrees respectively
         *     s the saturation the saturation (color intensity) from 0-100
         *     v the value (lightness) from 0-100
         * @return {*} an object of the form {r:12, g:34, b:56} containing the RGB values of the
         *         color
         */
        static hsv2rgb(hsv){
            // sanity check arguments
            // 'wrap' hue around into the 0-360 range, as it's a circle so -ve values and values
            // over 360 are actually "valid" once wrapping around the circle is taken into account
            let hue = ns.Timeline._wrapConstrain(hsv.h, 0, 360);
            // saturation and value must be between 0-100 (no wrapping!)
            let saturation = ns.Timeline._constrain(hsv.s, 0, 100);
            let value = ns.Timeline._constrain(hsv.v, 0, 100);

            if(saturation === 0) {
                // no saturation, so it's just a shade of grey - very simple to calculate
                let level = Math.round(value * 255);
                return [level, level, level];
            }

            // We accept saturation and value arguments from 0 to 100 (because that's generally how
            // people represent those values. Internally, however, the saturation and value are
            // calculated from a range of 0.0 to 1.0 - make that conversion now:
            saturation /= 100;
            value /= 100;

            // now we actually work out the RGB color
            hue /= 60; // sector 0 to 5
            let sector = Math.floor(hue);
            let remainder = hue - sector; // factorial part of hue
            // colour components
            let p = value * (1 - saturation);
            let q = value * (1 - saturation * remainder);
            let t = value * (1 - saturation * (1 - remainder));
            // RGB values depend on the sector
            let r, g, b;
            switch(sector) {
                case 0:
                    r = value;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = value;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = value;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = value;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = value;
                    break;
                default: // case 5:
                    r = value;
                    g = p;
                    b = q;
            }
            return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
        }

        /**
         * Utility function to constrain a value to within the given range (inclusive)
         * @param value the value to be constrained
         * @param min the minimum allowed value
         * @param max the maximum allowed value
         * @return {number} the constrained value
         * @private
         */
        static _constrain(value, min, max){
            // sanity check for min/max
            if(max < min) {
                let temp = min;
                min = max;
                max = temp;
            }
            return Math.min(max, Math.max(min, value));
        }
        /**
         * Utility function to constrain a value to within the given range (inclusive), "wrapping"
         * if the given value is lower than the minimum, or higher than the maximum.
         *
         * This can be useful for constraining angles to be within 0-360 degrees; 372 degrees is a
         * valid angle, but is equivalent to 12 degrees because it "wraps around" the circle.
         * Similarly, -12 degrees is a valid angle, but is equivalent to 348 degrees after wrapping
         * around the circle.
         *
         * @param value the value to be constrained
         * @param min the minimum allowed value
         * @param max the maximum allowed value
         * @return {number} the constrained value
         * @private
         */
        static _wrapConstrain(value, min, max){
            if(value >=min && value <=max){
                return value;
            }
            if(max < min) {
                let temp = min;
                min = max;
                max = temp;
            }
            let delta = max - min;
            let remainder = (value % delta);
            return (remainder > 0 ? min : max ) + remainder;
        }
        /**
         * Determine if the coordinates are within the bounds
         * @param coords the coordinates in the form {x:123, y:456}
         * @param bounds the bounds in the form {x0:12, y0:45, x1:67, y1:89}
         * @return {boolean} true if the coordinates are within the bounds, false otherwise
         */
        static _isWithinBounds(coords, bounds) {
            return (coords.x >= bounds.x0 && coords.x <= bounds.x1 &&
                    coords.y >= bounds.y0 && coords.y <= bounds.y1);
        }
        /**
         * Returns a "corrected" bounds object such that the (x0,y0) coordinate is guaranteed to be
         * the upper left, and the (x1,y1) coordinate is guaranteed to be the lower right. In other
         * words, x1 is greater than or equal to x0, and y1 is greater than or equal to y0.
         *
         * @param bounds the bounds {x0:12, y0:45, x1:67, y1:89}
         * @return the "corrected" bounds
         */
        static _correctedBounds(bounds) {
            return {
                x0: Math.min(bounds.x0, bounds.x1),
                y0: Math.min(bounds.y0, bounds.y1),
                x1: Math.max(bounds.x0, bounds.x1),
                y1: Math.max(bounds.y0, bounds.y1),
            };
        }
        /**
         * Merge two bounds. returns a bounds object which contains both provided bounds
         * @param boundsA the first bounds {x0:12, y0:45, x1:67, y1:89}
         * @param boundsB the second bounds {x0:12, y0:45, x1:67, y1:89}
         * @return the combined bounds
         */
        static _mergedBounds(boundsA, boundsB) {
            if(boundsA === null || boundsB === null) {
                return boundsA === null ? boundsB : boundsA;
            }
            return {
                x0: Math.min(boundsA.x0, boundsB.x0, boundsA.x1, boundsB.x1),
                y0: Math.min(boundsA.y0, boundsB.y0, boundsA.y1, boundsB.x1),
                x1: Math.max(boundsA.x0, boundsB.x0, boundsA.x1, boundsB.x1),
                y1: Math.max(boundsA.y0, boundsB.y0, boundsA.y1, boundsB.x1)
            };
        }
        /**
         * Define default groupings of major/minor tick spacings which are useful for the timeline.
         */
        static _makeTickSpacingGroups(){
            // convenient time intervals for readability of tick intervals defined below
            let ONE_HUNDREDTH_SECOND = 10;
            let ONE_TENTH_SECOND     = 100;
            let ONE_SECOND           = 1000;
            let FIVE_SECONDS         = 5 * ONE_SECOND;
            let TEN_SECONDS          = 10 * ONE_SECOND;
            let FIFTEEN_SECONDS      = 15 * ONE_SECOND;
            let THIRTY_SECONDS       = 15 * ONE_SECOND;
            let ONE_MINUTE           = 60 * ONE_SECOND;
            let FIVE_MINUTES         = 5 * ONE_MINUTE;
            let TEN_MINUTES          = 10 * ONE_MINUTE;
            let FIFTEEN_MINUTES      = 15 * ONE_MINUTE;
            let THIRTY_MINUTES       = 30 * ONE_MINUTE;
            let ONE_HOUR             = 60 * ONE_MINUTE;
            let THREE_HOURS          = 3 * ONE_HOUR;
            let SIX_HOURS            = 6 * ONE_HOUR;
            let TWELVE_HOURS         = 12 * ONE_HOUR;
            let ONE_DAY              = 24 * ONE_HOUR;
            let ONE_WEEK             = 7 * ONE_DAY;

            // must be in order of smallest time interval to largest time interval
            return [
                // Major ticks at...    Minor ticks at...
                // seconds
                {major:ONE_TENTH_SECOND, minor:ONE_HUNDREDTH_SECOND},
                {major:ONE_SECOND,       minor:ONE_TENTH_SECOND},
                {major:FIVE_SECONDS,     minor:ONE_SECOND},
                {major:TEN_SECONDS,      minor:ONE_SECOND},
                {major:FIFTEEN_SECONDS,  minor:FIVE_SECONDS},
                {major:THIRTY_SECONDS,   minor:FIVE_SECONDS},
                // minutes
                {major:ONE_MINUTE,       minor:FIFTEEN_SECONDS},
                {major:FIVE_MINUTES,     minor:ONE_MINUTE},
                {major:TEN_MINUTES,      minor:ONE_MINUTE},
                {major:FIFTEEN_MINUTES,  minor:FIVE_MINUTES},
                {major:THIRTY_MINUTES,   minor:FIVE_MINUTES},
                // hours
                {major:ONE_HOUR,         minor:FIFTEEN_MINUTES},
                {major:THREE_HOURS,      minor:ONE_HOUR},
                {major:SIX_HOURS,        minor:ONE_HOUR},
                {major:TWELVE_HOURS,     minor:SIX_HOURS},
                // days/weeks
                {major:ONE_DAY,          minor:SIX_HOURS},
                {major:ONE_WEEK,         minor:ONE_DAY},
            ];
        }

        /**
         * Convert a decimal number in the range 0-255 to a zero-padded hex value
         *
         * @param dec the decimal value
         * @return {string} the zero-padded hex value
         */
        static _dec2hex(dec){
            let hex = (+dec).toString(16).toUpperCase();
            return hex.length === 1 ? '0' + hex: hex;
        }
    };

    //==============================================================================================
    /**
     * A sort of 'wrapper' for a timeline that treats each timeline item as a source of video.
     *
     * It  coordinates playback of video from the timeline items on a 'video wall' as the timeline
     * is dragged, zoomed etc (active control by the user), and keeps the timeline in sync with the
     * current playback position of the videos as they play (passive viewing by the user).
     *
     * @type {TimelineVideoManager}
     */
    ns.TimelineVideoManager = class {
        //------------------------------------------------------------------------------------------
        // CONSTRUCTOR
        //------------------------------------------------------------------------------------------
        /**
         *
         * @param timeline a Timeline instance
         * @param videoElms the HTML5 <video> DOM elements which will act as 'slots' for the video
         *        wall
         * @param options
         */
        constructor(timeline, videoElms, options = {}) {
            this.timeline = timeline;
            this.videoElms = videoElms;

            let defaultOptions = {
                noVideoSrc: '',
                missingVideoSrc: '',
                defaultBackgroundColor:'#212121',
                // duration of transitions (zooming, moving to next item etc) in milliseconds
                transitionDuration: 1000,
                // playback rate choices in order from slowest to fastest
                // NOTE: both Firefox and Chrome browsers constrain the playback rates to
                //       be between 1/16x (or 0.0625x) and 16x 'normal' speed, so values
                //       outside this range are not going to have any effect.
                // Ref: lines 166-168 https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/html/media/HTMLMediaElement.cpp
                // Ref: lines 163-167 https://dxr.mozilla.org/mozilla-central/source/dom/html/HTMLMediaElement.cpp
                playbackRates: [
                    // slower than normal playback speed
                    {rate: 0.125, label: '⅛×'},
                    {rate: 0.25, label: '¼×'}, {rate: 0.5, label: '½×'},
                    // normal speed (i.e., 1x playback)
                    {rate: 1.0, label: '1×'},
                    // faster than normal playback speed
                    {rate: 2.0, label: '2×'}, {rate: 4.0, label: '4×'},
                    {rate: 8.0, label: '8×'}, {rate: 16.0, label: '16×'}
                ],
                // the playback rate to use by default (this is generally recommended to be
                // the 1x playback speed)
                defaultPlaybackRateIdx: 3,
                // ---------------------------------------------------------------------------------
                // Advanced ------------------------------------------------------------------------
                // ---------------------------------------------------------------------------------
                // min and max playback rates - note that Firefox, Chrome etc internally restrict
                // playback rates to between 1/16th normal speed and 16 times normal speed, so
                // setting values outside this range will eithetr have no effect, or cause
                // exceptions to be thrown, depending on the browser
                minPlaybackRate:0.0625,
                maxPlaybackRate:16.0,
                // set up the naming conventions for for events fired by this widget
                events:{
                    // the namespace (prefix) for the names of events fired by this widget (for
                    // example, 'timeline-play', timeline-pause', etc.. We use the timeline's
                    // namespace by default for consistency
                    namespace: this.timeline.options.events.namespace,
                    // the (suffix) names of events fired by this widget
                    names:{
                       // fired when playback is started
                       play:'play',
                       // fired when playback is paused
                       pause:'pause',
                       // fired when playback rate changes
                       playbackRateChanged:'playback-rate-changed',
                       // fired when a video element is clicked
                       videoClicked:'video-clicked'
                   }
                },
            };
            this.options = jQuery.extend(true, {}, defaultOptions, options);

            // various statuses that the video slots can be in
            this.VIDEO_STATUS = {
                NONE: 0,     // no video - not an error, just currently displaying no video
                ERROR: 1,    // no video due to an error fetching video
                LOADING: 2,  // currently fetching video
                AVAILABLE: 3 // video ready to play
            };

            // true if playback is currently active, false if stopped/paused
            this.playbackIsActive = false;
            // if true playback should automatically move on to the next item, otherwise it stops
            // once the current group of items has ceased playback (i.e., a "gap" between items is
            // reached)
            this.useContinuousPlayback = false;
            // the current playback speed
            this.currentPlaybackRateIdx = this.options.defaultPlaybackRateIdx;
            this.currentPlaybackRateSpecifier = this.options.playbackRates[this.currentPlaybackRateIdx];
            // used to track the timer which periodically updates the timeline during video playback
            this.timelineUpdateTimer = null;
            // tracks the current properties of each of the video slots, such as what item is
            // currently associated with the slot, and the video status (NONE, ERROR, LOADING,
            // AVAILABLE)
            this.videoSlotProperties = {};

            // initialise all the video "slots" based on the video elements passed in with the
            // arguments to the constructor
            for (let idx = 0; idx < this.videoElms.length; idx++) {
                let videoElm = this.videoElms[idx];
                // start with no video (not an error, just not displaying video at the moment)
                videoElm.src = this.options.noVideoSrc;
                // playback time is 0 (i.e., start of video)
                videoElm.currentTime = 0;
                // initialise properties for this video slot
                this.videoSlotProperties[videoElm.id] = {
                    videoStatus: this.VIDEO_STATUS.NONE,
                    item: null,
                };
                // add event handlers for video fetching and error events
                $(videoElm).on({
                    'loadstart': this._videoLoadStartHandler.bind(this),
                    'loadeddata': this._videoLoadedDataHandler.bind(this),
                    'error': this._videoErrorHandler.bind(this),
                    'click': this._videoClickedHandler.bind(this)
                });
            }

            // finally, add the listeners to the timeline we are using so that we can handle events
            // as required whenthe timeline is scrobbled, clicked, zoomed etc.
            this._addTimelineEventListeners();
        }
        /**
         * Determine if playback is currently cative
         *
         * @return {boolean} true if playback is active, false otherwise
         */
        isPlaybackActive(){
            return this.playbackIsActive;
        }
        /**
         * Determine if playback is continuous - that is, once all current videos are completed,
         * playback will be automatically advanced to the next item and started up again.
         *
         * @return {*|boolean} true if playback is continuous, false otherwise
         */
        playbackIsContinous(){
            return this.useContinuousPlayback;
        }
        /**
         * Turn continuous playback on or off. Wehn continuous is active, once all current videos
         * are completed, playback will be automatically advanced to the next item and started up
         * again.
         *
         * @param isActive if true, playback should be continuous, false if playback should end
         *        after the current items have completed playback.
         */
        setContinousPlayback(isActive){
            this.useContinuousPlayback = isActive;
        }
        /**
         * Start playback - all items will begin video playback.
         */
        startPlayback() {
            // it's important to start playing *before* we kick off the timeline updating because
            // timeline updating is ignored if no video is playing
            this._setPlaybackRate(this.currentPlaybackRateSpecifier);
            for (let idx = 0; idx < this.videoElms.length; idx++) {
                let videoElm = this.videoElms[idx];
                if (this._slotCanPlay(videoElm)) {
                    videoElm.play();
                }
            }
            this.playbackIsActive = true;
            this._timelineUpdater();
            // fire off an event to indicate that playback started
            this._firePlay();
        }
        /**
         * Pause playback - all items will pause their video playback.
         */
        pausePlayback() {
            this._stopTimelineUpdater();
            for (let idx = 0; idx < this.videoElms.length; idx++) {
                this.videoElms[idx].pause();
            }
            this.playbackIsActive = false;
            // fire off an event to indicate that playback paused
            this._firePause();
        }
        /**
         * Find the next item which begins after the current 'now' position on the timeline,
         * advance to it and and start playback.
         */
        playOnToNextItem() {
            let item = this.timeline.getTimelineItemAfter(this.timeline.getNow());
            if (item !== null) {
                $(this.timeline.container).one({
                    'timeline-transition-complete': function () {
                        this.startPlayback();
                    }.bind(this)
                });
                this.transitionToItem(item);
            }
        }
        /**
         * Increase the playback speed by one step (see this.options.playbackRates)
         */
        increasePlaybackRate(){
            this.setPlaybackRate(this.currentPlaybackRateIdx + 1);
        }
        /**
         * Decrease the playback speed by one step (see this.options.playbackRates)
         */
        decreasePlaybackRate(){
            this.setPlaybackRate(this.currentPlaybackRateIdx - 1);
        }
        /**
         * Set the playback speed to the default/normal playback speed (see this.options.playbackRates)
         */
        useDefaultPlaybackRate(){
            this.setPlaybackRate(this.options.defaultPlaybackRateIdx);
        }
        /**
         * Set the playback rate by its index in the configured playback rate options (see
         * this.options.playbackRates)
         *
         * @param playbackRateIndex the playback rate index
         */
        setPlaybackRate(playbackRateIndex){
            let newPlaybackRateIdx = Math.max(0, Math.min(playbackRateIndex,
                                           this.options.playbackRates.length-1));
            if(newPlaybackRateIdx !== this.currentPlaybackRateIdx){
                this.currentPlaybackRateIdx = newPlaybackRateIdx;
                let rateSpecifier = this.options.playbackRates[this.currentPlaybackRateIdx];
                this._setPlaybackRate(rateSpecifier);
            }
        }
        /**
         * Obtain the playback rates allowed
         *
         * @return {*} the currently configured playback rate specifiers
         */
        getPlaybackRates(){
            return this.options.playbackRates;
        }
        /**
         * Obtain the playback rate specifier for the current playback rate, which is a JavaScript
         * object of the form...
         *
         *         {rate: MULTIPLIER, label: LABEL}
         *
         * ...where MULTIPLIER is a double representing the playback speed multiplier from 0.0625
         * to 16.0 (with 1.0 being "normal" speed), and LABEL is a text label which can be
         * displayed to the user indicating the current playback speed (such as '2x' or similar)
         *
         * @return {*} the playback rate specifier for the current playback rate
         */
        getPlaybackRateSpecifier() {
            return this.currentPlaybackRateSpecifier;
        }
        /**
         * Obtain a reference to the underlying timeline (which rendered the timeline items)
         *
         * @return {*} a reference to the underlying timeline
         */
        getTimeline(){
            return this.timeline;
        }
        /**
         * Create a snapshot of the currently displayed frame in the specified video element
         *
         * @param videoElm the HTML5 video element from which the frame snapshot is to be obtained
         * @return {Element} an <img> element
         */
        getSnapshot(videoElm) {
            let canvas = document.createElement("canvas");
            canvas.width = videoElm.videoWidth;
            canvas.height = videoElm.videoHeight;
            canvas.getContext('2d').drawImage(videoElm, 0, 0, canvas.width, canvas.height);

            let img = document.createElement("img");
            img.crossOrigin = "anonymous";
            img.src = canvas.toDataURL();
            return img;
        }
        /**
         * Transition to the given timeline item - the timeline will smoothly move so that the 'now'
         * marker is aligned with the start of the specified item.
         *
         * NOTE: This is just a wrapper around the underlying timeline's transitionToItem() function
         *
         * @param item the item to transition to.
         */
        transitionToItem(item) {
            this.pausePlayback();
            this.timeline.transitionToItem(item, 1.2, this.options.transitionDuration);
        }
        /**
         * Transition to the given timeline items - the timeline will smoothly move so that the
         * 'now' marker is aligned with the start of the first of the specified items, and so that
         * the end of the last specified item is i view.
         *
         * NOTE: This is just a wrapper around the underlying timeline's transitionToItems() function
         *
         * @param items the items to transition to.
         */
        transitionToItems(items) {
            this.pausePlayback();
            this.timeline.transitionToItems(items, 1.2, this.options.transitionDuration);
        }
        /**
         * Smoothly transition the timeline from its current 'now' to a new 'now', rather than
         * jumping immediately to the new 'now'. Useful for maintaining visual context during jumps
         * over large duration differences.
         *
         * NOTE: This is just a wrapper around the underlying timeline's transitionToNow() function
         *
         * @param targetNow the target 'now' timestamp as a UNIX time in milliseconds
         */
        transitionNow(targetNow) {
            this.pausePlayback();
            this.timeline.transitionNow(targetNow, this.options.transitionDuration);
        }
        /**
         * Smoothly transition the timeline zoom level in or out from its zoom level to a new
         * zoom level, rather than jumping immediately to the new zoom level. Useful for maintaining
         * visual context during zooms over large zoom level differences.
         *
         * NOTE: This is just a wrapper around the underlying timeline's transitionZoom() function
         *
         * @param factor the amount to zoom in or out by - > 1.0 zooms in, < 1.0 zooms out. 1.0
         *        maintains the existing zoom level and is therefore ignored. Values of 0 or less
         *        are also ignored.
         */
        transitionZoom(factor) {
            this.pausePlayback();
            this.timeline.transitionZoom(factor, this.options.transitionDuration);
        }

        /**
         * Smoothly transition the timeline from its current visible range to a new visible
         * range, rather than jumping immediately to the new position. Useful for maintaining
         * visual context during jumps or zooms over large time range differences.
         *
         * NOTE: This is just a wrapper around the underlying timeline's transitionVisibleRange()
         *       function
         *
         * @param targetStart the target visible start time
         * @param targetEnd the target visible end time
         */
        transitionVisibleRange(targetStart, targetEnd) {
            this.pausePlayback();
            this.timeline.transitionVisibleRange(targetStart, targetEnd, this.options.transitionDuration);
        }
        //------------------------------------------------------------------------------------------
        // PRIVATE METHODS
        //------------------------------------------------------------------------------------------
        /**
         * Add event listeners to the underlying timeline so that we can respond to relevant events
         * as is appropriate.
         *
         * @private
         */
        _addTimelineEventListeners() {
            // we want to 'debounce' a few event handlers here because the events coming from the
            // timeline can in some cases (such as dragging etc) be quite "noisy". We don't want to
            // be hammering the browser trying to handle every single update in these cases so
            // define a few debounced functions here. We set the debounce timer to 30 milliseconds
            // (1/40th of a second) which is a decent compromise between responsiveness and
            // overloading the browser during "noisy" events, and is also just within the keyboard
            // 'repeat rate' range of ~30 milliseconds.
            let debounceTimeout = 25;

            // debounced handling for drag events - basically we just want to ensure that video
            // playback is paused here. The debounced event handler is invoked on the "leading edge"
            // of the events, rather than once things quiet down as would be the usual debounce
            // handling, since we want to pause the playback as soon as dragging starts.
            let debouncedDragHandler = ns.TimelineVideoManager._debounce(function(){
                this.pausePlayback();
            }.bind(this), debounceTimeout, {onLeadIn:true, onTrailOut:false});
            // debounced handling for when the visible range of the timeline changes - this can be
            // "noisy" during drag operations and timeline transitions, and on these events we are
            // trying to synchronize all the videos to the correct playback position, which can be
            // a reasonably intensive operation. The debounced event handler is invoked on the
            // trailing edge of the events (i.e., when things quiet down).
            let debouncedVisibleRangeChangedHandler = ns.TimelineVideoManager._debounce(function(){
                if (!this.playbackIsActive) {
                    for (let idx = 0; idx < this.videoElms.length; idx++) {
                        let videoElm = this.videoElms[idx];
                        if (this._slotHasVideoAvailable(videoElm)) {
                            this._syncAnomalyPlaybackToTimeline(videoElm);
                        }
                    }
                }
            }.bind(this), debounceTimeout, {onLeadIn:false, onTrailOut:true});
            // debounced handling for when the 'now items' of the timeline changes - this can be
            // "noisy" during drag operations and timeline transitions, and on these events we are
            // trying to update all the videos to the correct video and playback position, which
            // can be a reasonably intensive operation. The debounced event handler is invoked on
            // the leading *and trailing edge of the events, since initially we want to update
            // things ASAP.
            let debouncedTimelineNowItemsChangedHandler = ns.TimelineVideoManager._debounce(function(jQevt){
                let evt = jQevt.originalEvent;
                let items = evt.items;
                let occupiedSlots = {};
                if(items){
                    // slots with video
                    for (let idx = 0; idx < items.length; idx++) {
                        let videoItem = items[idx];
                        let slot = this.timeline.getSlotFor(videoItem);
                        occupiedSlots[slot] = true;
                        let videoElm = this.videoElms[slot % this.videoElms.length];
                        let currentSlotItem = this._getSlotVideoItem(videoElm);
                        if (currentSlotItem === null ||
                            (currentSlotItem !== null && currentSlotItem.pk !== videoItem.pk)) {
                            // currently unoccupied or has an item with a different PK
                            // which now needs to be replaced with the new one
                            this._setSlotVideoStatus(videoElm, this.VIDEO_STATUS.AVAILABLE);
                            this._setSlotVideoItem(videoElm, videoItem);
                            videoElm.style.backgroundColor = this.timeline.getSlotColor(videoItem);
                            videoElm.src = videoItem.getVideoSrc();
                            videoElm.playbackRate = this.currentPlaybackRateSpecifier.rate;
                            $(videoElm).off('canplay').one({
                                'canplay': function () {
                                    if(this._getSlotVideoStatus(videoElm) === this.VIDEO_STATUS.AVAILABLE){
                                        this._syncAnomalyPlaybackToTimeline(videoElm);
                                        if (this.playbackIsActive) {
                                            videoElm.play();
                                        }
                                    }
                                }.bind(this)
                            });
                        }
                    }
                }
                // slots with no video
                for (let idx = 0; idx < this.videoElms.length; idx++) {
                    if (occupiedSlots[idx] !== true) {
                        this._setNoVideoAvailable(this.videoElms[idx]);
                    }
                }
            }.bind(this), debounceTimeout, {onLeadIn:true, onTrailOut:true});

            // now we add the event handling functions
            $(this.timeline.container).on({
                'timeline-click': function () {
                    this.pausePlayback();
                }.bind(this),
                'timeline-double-click': function (jQevt) {
                    this.pausePlayback();
                    let evt = jQevt.originalEvent;
                    if (evt.clicked.length > 0) {
                        let item = evt.clicked[0];
                        this.transitionToItem(item);
                    }
                }.bind(this),
                'timeline-drag': function () {
                    debouncedDragHandler();
                }.bind(this),
                'timeline-visible-range-changed': function (jQevt) {
                    debouncedVisibleRangeChangedHandler();
                }.bind(this),
                'timeline-now-items-changed': function (jQevt) {
                    debouncedTimelineNowItemsChangedHandler(jQevt);
                }.bind(this)
            });
        }
        /**
         * Handler for when the HTML5 video element's 'loadstart' event fires (i.e., the video
         * source has been set, and the browser starts pulling down the video)
         *
         * @param jqEvt the jQuery event (used to obtain the original event)
         * @private
         */
        _videoLoadStartHandler(jqEvt) {
            let videoElm = jqEvt.originalEvent.target;
            if (videoElm.src.endsWith(this.options.noVideoSrc) ||
                videoElm.src.endsWith(this.options.missingVideoSrc)) {
                // we don't care about video load start events if it's for missing or no video
                return;
            }

            this._setSlotVideoStatus(videoElm, this.VIDEO_STATUS.LOADING);
        }
        /**
         * Handler for when the HTML5 video element's 'loadeddata' event fires (i.e., the browser
         * has pulled down the video)
         *
         * @param jqEvt the jQuery event (used to obtain the original event)
         * @private
         */
        _videoLoadedDataHandler(jqEvt) {
            let videoElm = jqEvt.originalEvent.target;
            if (videoElm.src.endsWith(this.options.noVideoSrc) ||
                videoElm.src.endsWith(this.options.missingVideoSrc)) {
                // we don't care about video loaded events if it's for missing or no video
                return;
            }

            let anomaly = this._getSlotVideoItem(videoElm);
            if (anomaly !== null) {
                this._setSlotVideoStatus(videoElm, this.VIDEO_STATUS.AVAILABLE);
                // make sure the playback position is in sync with the timeline
                videoElm.currentTime = (this.timeline.getNow() - anomaly.start) / 1000.0;
            }
        }
        /**
         * Handler for when the HTML5 video element's 'error' event fires (i.e., the browser has
         * not been able to retrieve the video from the specified source due to a 404, 500 or some
         * other error condition on the server side)
         *
         * @param jqEvt the jQuery event (used to obtain the original event)
         * @private
         */
        _videoErrorHandler(jqEvt) {
            let videoElm = jqEvt.originalEvent.target;
            // video file is missing (or corrupt?)
            this._setMissingVideo(videoElm);
        }
        /**
         * Handler for when the HTML5 video element's 'error' event fires (i.e., the browser has
         * not been able to retrieve the video from the specified source due to a 404, 500 or some
         * other error condition on the server side)
         *
         * @param jqEvt the jQuery event (used to obtain the original event)
         * @private
         */
        _videoClickedHandler(jqEvt) {
            let videoElm = jqEvt.originalEvent.target;
            // video file is missing (or corrupt?)
            let item = this._getSlotVideoItem(videoElm);
            this._fireVideoClicked(videoElm, item);
        }
        /**
         * Obtain the properties of the slot for a video element
         *
         * @param videoElm the video element whose slot properties are required
         * @return {*} the slot properties
         * @private
         */
        _getSlotProperties(videoElm){
            return this.videoSlotProperties[videoElm.id];
        }
        /**
         * Set the video status property of the slot for a video element
         *
         * @param videoElm the video element whose slot properties are to be altered
         * @param status the video status to set (one of NONE, ERROR, LOADING or AVAILABLE)
         * @private
         */
        _setSlotVideoStatus(videoElm, status) {
            let properties = this._getSlotProperties(videoElm);
            if(properties){
                properties.videoStatus = status;
            }
        }
        /**
         * Obtain the video status property of the slot for a video element
         *
         * @param videoElm the video element whose slot properties are to be queried
         * @return the video status (one of NONE, ERROR, LOADING or AVAILABLE)
         * @private
         */
        _getSlotVideoStatus(videoElm) {
            return this._getSlotProperties(videoElm).videoStatus;
        }
        /**
         * Set the video item property of the slot for a video element
         *
         * @param videoElm the video element whose slot properties are to be altered
         * @param videoItem the video item to set
         * @private
         */
        _setSlotVideoItem(videoElm, videoItem) {
            let properties = this._getSlotProperties(videoElm);
            if(properties){
                properties.item = videoItem;
            }
        }
        /**
         * Obtain the video item property of the slot for a video element
         *
         * @param videoElm the video element whose slot properties are to be queried
         * @return the video item associated with the slot, or null if there is no associated
         *         video item
         * @private
         */
        _getSlotVideoItem(videoElm) {
            return this._getSlotProperties(videoElm).item;
        }
        /**
         * Determine if a slot has video available and ready to play
         *
         * @param videoElm the video element whose slot properties are to be queried
         * @return {boolean} true if the slot's video is ready to play, false otherwise
         * @private
         */
        _slotHasVideoAvailable(videoElm) {
            return this._getSlotVideoStatus(videoElm) === this.VIDEO_STATUS.AVAILABLE;
        }
        /**
         * Determine if a slot is currently loading video
         *
         * @param videoElm the video element whose slot properties are to be queried
         * @return {boolean} true if the slot is currently loading video, false otherwise
         * @private
         */
        _slotIsLoadingVideo(videoElm) {
            return this._getSlotVideoStatus(videoElm) === this.VIDEO_STATUS.LOADING;
        }
        /**
         * Determine if a slot is able to be played (must be currently paused and have video
         * available)
         *
         * @param videoElm the video element whose properties are to be queried
         * @return {boolean} true if the slot's video can be played, false otherwise
         * @private
         */
        _slotCanPlay(videoElm) {
            return videoElm.paused && this._slotHasVideoAvailable(videoElm);
        }
        /**
         * Determine if a slot is able to be played (must be currently paused and have video
         * available)
         *
         * @param videoElm the video element whose properties are to be queried
         * @return {boolean} true if the slot's video is playing, false otherwise
         * @private
         */
        _slotIsPlaying(videoElm) {
            return !videoElm.paused;
        }
        /**
         * Synchronise the playback position of the video with the current position of the timeline
         *
         * @param videoElm the video element to synchronise
         * @private
         */
        _syncAnomalyPlaybackToTimeline(videoElm) {
            let anomaly = this._getSlotVideoItem(videoElm);
            if (anomaly !== null) {
                let tdelta = (this.timeline.getNow() - anomaly.start);
                let duration = anomaly.end - anomaly.start;
                let maxRenderedDuration = this.timeline.options.maxRenderedDuration;
                if (maxRenderedDuration > 0 && duration > maxRenderedDuration) {
                    duration = maxRenderedDuration;
                }
                if (tdelta > duration) {
                    this._setNoVideoAvailable(videoElm);
                } else {
                    this._setPlaybackOffset(videoElm, tdelta / 1000.0);
                }
            } else {
                this._setNoVideoAvailable(videoElm);
            }
        }
        /**
         * Set teh playback rate using a rate specifier
         *
         * @param rateSpecifier the rate specifier, which is a JavaScript object of the form...
         *
         *         {rate: MULTIPLIER, label: LABEL}
         *
         *     ...where MULTIPLIER is a double representing the playback speed multiplier from
         *     0.0625 to 16.0 (with 1.0 being "normal" speed), and LABEL is a text label which can
         *     be displayed to the user indicating the current playback speed (such as '2x' or
         *     similar)
         *
         *     Playback rates smaller that 0.0625 and higher than 16.0 will be corrected to 1.0,
         *     and the label adjusted to '1x'
         * @private
         */
        _setPlaybackRate(rateSpecifier) {
            let rateMultiplier = rateSpecifier.rate;

            // sanity check playback rates
            if(rateSpecifier.rate === undefined || rateSpecifier.rate === null ||
                rateSpecifier.rate < this.options.minPlaybackRate ||
                rateSpecifier.rate > this.options.maxPlaybackRate) {
                // null, undefined, or outside the allowed playback speed range - return to
                // default for the sake of everyone's sanity
                this.currentPlaybackRateIdx = this.options.defaultPlaybackRateIdx;
                rateSpecifier = this.options.playbackRates[this.currentPlaybackRateIdx];
            }

            if(this.currentPlaybackRateSpecifier.rate !== rateMultiplier){
                this.currentPlaybackRateSpecifier = rateSpecifier;

                for (let idx = 0; idx < this.videoElms.length; idx++) {
                    let videoElm = this.videoElms[idx];
                    if (videoElm.playbackRate !== rateSpecifier.rate) {
                        let wasPlaying = this._slotIsPlaying(videoElm);
                        if (wasPlaying) {
                            videoElm.pause();
                        }
                        videoElm.playbackRate = rateSpecifier.rate;
                        if (wasPlaying) {
                            videoElm.play();
                        }
                    }
                }
                // fire an event to notify listeners that the playback rate has changed
                this._firePlaybackRateChanged(rateSpecifier);
            }
        }
        /**
         * Set the video source to point to the "no video available" URL to indicate that there is
         * no video for the video element.
         *
         * NOTE: This is not considered to be an "error" condition, simply that the slot is not
         * displaying any video at this time, as intended.
         *
         * @param videoElm the video element to update
         * @private
         */
        _setNoVideoAvailable(videoElm) {
            // only put the "no video" video up if it's not already showing, otherwise
            // we get annoying flickers from the video element
            if (this._getSlotVideoStatus(videoElm) !== this.VIDEO_STATUS.NONE) {
                videoElm.pause();
                this._setSlotVideoStatus(videoElm, this.VIDEO_STATUS.NONE);
                this._setSlotVideoItem(videoElm, null);
                videoElm.style.backgroundColor = this.options.defaultBackgroundColor;
                videoElm.src = this.options.noVideoSrc;
                videoElm.currentTime = 0;
            }
        }
        /**
         * Set the video source to point to the "video missing" URL to indicate that the expected
         * video for the video element was not present.
         *
         * NOTE: This is considered to be an "error" condition - the slot *should* be playing a
         * video, but cannot because the expected video was not present/could not be fetched.
         *
         * @param videoElm the video element to update
         * @private
         */
        _setMissingVideo(videoElm) {
            if (this._getSlotVideoStatus(videoElm) !== this.VIDEO_STATUS.ERROR) {
                videoElm.pause();
                this._setSlotVideoStatus(videoElm, this.VIDEO_STATUS.ERROR);
                this._setSlotVideoItem(videoElm, null);
                videoElm.src = this.options.missingVideoSrc;
                videoElm.currentTime = 0;
            }
        }
        /**
         * Determine if there is at least one video slot playing, and what the maximum playback
         * timestamp currently is.
         *
         * Used during video playback to align the timeline to the current playback position of the
         * videos to keep it in sync.
         *
         * @return {{currentlyPlaying: boolean, maxTimestamp: *}} where...
         *             - currentlyPlaying is true if at least one slot currently has video
         *               playing, false otherwise.
         *             - maxTimestamp is the timestamp of the playback position of the 'most
         *               advanced' video if at least one video slot is currently playing video,
         *               and is null otherwise.
         * @private
         */
        _anySlotsArePlaying() {
            let currentlyPlaying = false;
            let maxTimestamp = null;
            let maxRenderedDuration = this.timeline.options.maxRenderedDuration;

            for (let idx = 0; idx < this.videoElms.length; idx++) {
                let videoElm = this.videoElms[idx];
                if (!videoElm.paused) {
                    let playbackPosition = videoElm.currentTime;
                    let anomaly = this._getSlotVideoItem(videoElm);
                    if (anomaly !== null) {
                        let start = anomaly.start;
                        let end = anomaly.end;
                        let duration = end - start;
                        // take into account the maximum rendered duration, if any
                        if (maxRenderedDuration > 0 && duration > maxRenderedDuration) {
                            end = start + maxRenderedDuration;
                        }
                        let timestamp = start + (playbackPosition * 1000.0);
                        if (timestamp <= end) {
                            currentlyPlaying = true;
                            maxTimestamp = maxTimestamp === null ? timestamp : Math.max(maxTimestamp, timestamp);
                        }
                    }
                }
            }
            return {currentlyPlaying: currentlyPlaying, maxTimestamp: maxTimestamp};
        }
        /**
         * Check if any the video slots are currently in the process of fetching video
         *
         * @return {boolean} true if at least one slot is currently loading video, false otherwise
         * @private
         */
        _anySlotsAreLoading() {
            for (let idx = 0; idx < this.videoElms.length; idx++) {
                let videoElm = this.videoElms[idx];
                if (this._slotIsLoadingVideo(videoElm)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * This function is called periodically during playback in order to keep the timeline in
         * sync with the video playback.
         *
         * @private
         */
        _timelineUpdater() {
            this._stopTimelineUpdater();
            if (this.playbackIsActive) {
                let playingSlots = this._anySlotsArePlaying();
                if (playingSlots.currentlyPlaying) {
                    // at least one video is still in the middle of playback
                    this.timeline.setNow(playingSlots.maxTimestamp);
                    this.timelineUpdateTimer = setTimeout(this._timelineUpdater.bind(this), 25);
                } else if (this._anySlotsAreLoading()) {
                    // at least one slot is still waiting for its video to load - check in
                    // again in a bit
                    this.timelineUpdateTimer = setTimeout(this._timelineUpdater.bind(this), 25);
                } else {
                    // nothing is playing or waiting for video - we're done
                    this.pausePlayback();
                    if (this.useContinuousPlayback) {
                        this.playOnToNextItem();
                    }
                }
            }
        }
        /**
         * This function is called when there is a need to immediately halt any scheduled periodic
         * timeline updates (such as when playback is stopped)
         *
         * @private
         */
        _stopTimelineUpdater() {
            if (this.timelineUpdateTimer !== null) {
                clearTimeout(this.timelineUpdateTimer);
                this.timelineUpdateTimer = null;
            }
        }
        /**
         * Set the playback position of the given video element to the given offset (in seconds)
         * from the start of the video.
         *
         * @param videoElm the video element to set the playback position of
         * @param offset the offset, in seconds, from the playback start
         * @private
         */
        _setPlaybackOffset(videoElm, offset) {
            let videoDuration = isNaN(videoElm.duration) ? 0 : videoElm.duration;
            videoElm.currentTime = Math.max(0.0, Math.min(offset, videoDuration));
        }
        /**
         * Utility method to create 'namespaced' event names for the timeline video manager
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName){
            return this.options.events.namespace + eventName;
        }
        /**
         * Utility method to fire a custom event when playback starts
         *
         * @return {ns.TimelineVideoManager}
         * @private
         */
        _firePlay(){
            return this._fireEvent(
                this.timeline.container,
                this._makeEventName(this.options.events.names.play),
                {}
            );
        }
        /**
         * Utility method to fire a custom event when playback is paused
         *
         * @return {ns.TimelineVideoManager}
         * @private
         */
        _firePause(){
            return this._fireEvent(
                this.timeline.container,
                this._makeEventName(this.options.events.names.pause),
                {}
            );
        }
        /**
         * Utility method to fire a custom event when the playback rate changes
         *
         * @return {ns.TimelineVideoManager}
         * @param rateSpecifier the playback rate specifier
         * @private
         */
        _firePlaybackRateChanged(rateSpecifier){
            return this._fireEvent(
                this.timeline.container,
                this._makeEventName(this.options.events.names.playbackRateChanged),
                {rate:rateSpecifier.rate, label:rateSpecifier.label}
            );
        }
        /**
         * Utility method to fire a custom event when the playback rate changes
         *
         * @param videoElm the video element that was clicked
         * @param item the item associated with the video element
         * @return {ns.TimelineVideoManager}
         * @private
         */
        _fireVideoClicked(videoElm, item){
            return this._fireEvent(
                videoElm,
                this._makeEventName(this.options.events.names.videoClicked),
                {item:item}
            );
        }
        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.TimelineVideoManager}
         * @private
         */
        _fireEvent(targetElm, eventName, eventProperties={}){
            if(targetElm){
                let event; // The custom event that will be created
                if (document.createEvent) {
                    event = document.createEvent("HTMLEvents");
                    event.initEvent(eventName, true, true);
                } else {
                    event = document.createEventObject();
                    event.eventType = eventName;
                }

                event.eventName = eventName;
                event.timelineVideoManager = this;
                jQuery.extend(event, eventProperties);

                // note that events are fired from the playback managed timeline's container
                if (document.createEvent) {
                    targetElm.dispatchEvent(event);
                } else {
                    targetElm.fireEvent("on" + event.eventType, event);
                }
            }
            return this;
        }
        /**
         * Advanced debouncing function, to avoid multiple calls to the same function in rapid
         * succession, such as may occur when handling events related to dragging, zooming and so
         * on.
         *
         * By default, it creates a function which will only be invoked until it has *not* been
         * invoked for a certain timeout - more concretely, the function will be called after it
         * *stops* being called for 'wait' milliseconds.
         *
         * NOTE:
         *   - If the `onTrailOut` option is true (default), the function will be triggered once
         *     when things "quiet down" at the end of the wait cycle (i.e., once the rapid
         *     succession of events ceases).
         *   - If `onLeadIn` is true, the function will be triggered once, immediately (i.e., as
         *     the rapid succession of events begins).
         *   - If `onLeadIn` and `onTrailOut` are *both* true, the function will be triggered
         *     once immediately, and then once again when things quiet down.
         *
         * Example usage:
         *
         *      var debouncedFunction = window.portal.debounce(function() {
         *	        // something time consuming
         *      }, 250);
         *      window.addEventListener('resize', debouncedFunction);
         *
         * @param func the function to be 'debounced'
         * @param wait the time to wait for "non-execution" before actually calling the function
         * @param options a JavaScript object which specifies when the debounced function should be
         *        called in the context of the start or end of the rapid succession of events. It
         *        is of the form...
         *
         *            {onLeadIn:{boolean}, onTrailOut:{boolean}}
         *
         *        ...where
         *            onTrailOut if true (default) call on the 'end' of the wait cycle, if false do
         *                       *not* call on the end of the wait cycle
         *            onLeadIn if true call on the 'start' of the wait cycle, if false (default)
         *                     do *not* call on the start of the wait cycle.
         * @return {Function}
         */
        static _debounce(func, wait, options={onLeadIn:false, onTrailOut:true}) {
            let timeout = null;
            return function() {
                let context = this, args = arguments;
                let later = function() {
                    timeout = null;
                    if (options.onTrailOut === true) func.apply(context, args);
                };
                let callNow = (options.onLeadIn === true) && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow){
                    func.apply(context, args);
                }
            };
        }
    };
}(window.portal, jQuery));
