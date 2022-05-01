(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ImageSequence = factory());
}(this, (function () {
    'use strict';

    class ImageSequence {
        constructor(canvasEl, w, h, newSources, newOptions) {
            this.sources = [];
            this.frames = [];
            this.canvasElement = null;
            this.currentLocation = 0;
            this.currentFrame = 0;
            this.playBoardPercent = 0;
            this.context = null;
            this.canvasHeight = null;
            this.canvasWidth = null;

            this.options = {
                repeat: false,
                topDelay: 0,
                bottomDelay: 0,
                playSpeed: 1,
                mouseWheelHandlerCallback: function (currentFrame, currentLocation) {
                }
            };

            this.setCanvas(canvasEl, w, h)
            this.setSources(newSources)
            this.loadFrames()
            this.setEvents()
            this.drawImageOnCanvas()
            this.setOptions(newOptions)
        }


        setCanvas(canvasEl, w, h) {
            this.canvasElement = canvasEl;
            this.canvasWidth = w;
            this.canvasHeight = h;
            this.canvasElement.setAttribute('width', this.canvasWidth)
            this.canvasElement.setAttribute('height', this.canvasHeight)
            this.context = this.canvasElement.getContext('2d');
        }

        setSources(newSources) {
            this.sources = newSources
        }

        createFrames() {
            const sourcesCount = this.sources.length
            for (let i = 0; i < sourcesCount; i++) {
                this.frames.push({
                    image: new Image,
                    src: this.sources[i]
                });
            }
        }

        getLoadFrameTempo() {
            const tempo = parseInt(Math.atan(this.sources.length / 100) * 8)
            if (tempo > 0) {
                return tempo
            }
            return 1
        }

        loadFrameSource(location) {
            this.frames[location].image.src = this.frames[location].src
        }

        loadSomeFrames() {
            const sourcesCount = this.sources.length
            for (let i = 0; i < sourcesCount; i = i + this.getLoadFrameTempo()) {
                this.loadFrameSource(i)
            }
        }

        loadAllFrames() {
            const sourcesCount = this.sources.length
            for (let i = 0; i < sourcesCount; i++) {
                if (!this.frames[i].image.src) {
                    this.loadFrameSource(i)
                }
            }
        }

        loadFrames() {
            this.createFrames()
            this.loadSomeFrames()
            this.loadAllFrames()
        }

        drawImageOnCanvas(location) {
            if (typeof location == 'undefined' || typeof this.frames[location] === 'undefined') {
                console.log('location', location)
                console.log('this.frames', this.frames)
                console.log('this.frames[location]', this.frames[location])
                location = 0
            }
            this.context.drawImage(this.frames[location].image, 0, 0, this.canvasWidth, this.canvasHeight);
        }

        scrollHandler(e) {
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
            const boundingClientRect = this.canvasElement.getBoundingClientRect()
            if (boundingClientRect.top + this.options.bottomDelay >= windowHeight) {
                return
            }
            if (boundingClientRect.bottom - this.options.topDelay < 0) {
                return
            }

            const newPlayBoardPercent = (windowHeight + boundingClientRect.height - boundingClientRect.bottom) * 100 / (windowHeight + boundingClientRect.height)
            const playBoardPercentDiff = newPlayBoardPercent - this.playBoardPercent
            this.playBoardPercent = newPlayBoardPercent
            this.currentLocation += playBoardPercentDiff * this.options.playSpeed;
            if (this.currentLocation < 0) {
                if (!this.options.repeat) {
                    this.currentLocation = 0;
                } else {
                    this.currentLocation = this.frames.length - 1;
                }
            }
            if (this.currentLocation >= this.frames.length) {
                if (!this.options.repeat) {
                    this.currentLocation = this.frames.length - 1;
                } else {
                    this.currentLocation = 0;
                }
            }

            this.currentFrame = Math.round(this.currentLocation)
            this.drawImageOnCanvas(this.currentFrame);
            this.options.mouseWheelHandlerCallback(this.currentFrame, this.currentLocation);
        }

        setEvents() {
            window.addEventListener('scroll', (e) => {
                this.scrollHandler(e)
            }, false);
        }

        setOptions(newOptions) {
            Object.assign(this.options, newOptions)
        }

    }
    return ImageSequence;

})));
