(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ImageSequence = factory());
}(this, (function () { 'use strict';

    var ImageSequence = function () {

        let sources = [];
        let frames = [];
        let canvasElement = null;
        let currentLocation = 0;
        let currentFrame = 0;
        let playBoardPercent = 0;
        let context = null;
        let canvasHeight = null;
        let canvasWidth = null;

        let options = {
            repeat: false,
            topDelay: 0,
            bottomDelay: 0,
            playSpeed: 1,
            mouseWheelHandlerCallback: function (currentFrame, currentLocation) {}
        };

        function setCanvas (canvasEl, w, h) {
            canvasElement = canvasEl;
            canvasWidth = w;
            canvasHeight = h;
            canvasElement.setAttribute('width', canvasWidth)
            canvasElement.setAttribute('height', canvasHeight)
            context = canvasElement.getContext('2d');
        }

        function setSources (newSources) {
            sources = newSources
        }

        function createFrames () {
            const sourcesCount = sources.length
            for (let i = 0; i < sourcesCount; i++) {
                frames.push({
                    image: new Image,
                    src: sources[i]
                });
            }
        }

        function getLoadFrameTempo () {
            const tempo = parseInt(Math.atan(sources.length/100)*8)
            if (tempo > 0) {
                return tempo
            }
            return 1
        }

        function loadFrameSource (location) {
            frames[location].image.src = frames[location].src
        }

        function loadSomeFrames () {
            const sourcesCount = sources.length
            for (let i = 0; i < sourcesCount; i = i + getLoadFrameTempo()) {
                loadFrameSource(i)
            }
        }

        function loadAllFrames () {
            const sourcesCount = sources.length
            for (let i = 0; i < sourcesCount; i++) {
                if (!frames[i].image.src) {
                    loadFrameSource(i)
                }
            }
        }

        function loadFrames () {
            createFrames()
            loadSomeFrames()
            loadAllFrames()
        }

        function drawImageOnCanvas (location) {
            if (typeof location == 'undefined') {
                location = 0
            }
            context.drawImage(frames[location].image, 0, 0, canvasWidth, canvasHeight);
        }

        function scrollHandler (e) {
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
            const boundingClientRect = canvasElement.getBoundingClientRect()
            if (boundingClientRect.top + options.bottomDelay >= windowHeight) {
                return
            }
            if (boundingClientRect.bottom - options.topDelay < 0) {
                return
            }

            const newPlayBoardPercent = (windowHeight + boundingClientRect.height - boundingClientRect.bottom) * 100 / (windowHeight + boundingClientRect.height)
            const playBoardPercentDiff = newPlayBoardPercent - playBoardPercent
            playBoardPercent = newPlayBoardPercent
            currentLocation += playBoardPercentDiff * options.playSpeed;
            if (currentLocation < 0) {
                if (!options.repeat) {
                    currentLocation = 0;
                } else {
                    currentLocation = frames.length - 1;
                }
            }
            if (currentLocation >= frames.length) {
                if (!options.repeat) {
                    currentLocation = frames.length - 1;
                } else {
                    currentLocation = 0;
                }
            }

            currentFrame = Math.round(currentLocation)
            drawImageOnCanvas(currentFrame);
            options.mouseWheelHandlerCallback(currentFrame, currentLocation);
        }

        function setEvents () {
            window.addEventListener('scroll', scrollHandler, false);
        }

        function setOptions (newOptions) {
            Object.assign(options, newOptions)
        }

        function init (canvasEl, w, h, newSources, newOptions) {
            setCanvas(canvasEl, w, h)
            setSources(newSources)
            loadFrames()
            setEvents()
            drawImageOnCanvas()
            setOptions(newOptions)
        }

        return {
            init
        }
    }();

    return ImageSequence;

})));
