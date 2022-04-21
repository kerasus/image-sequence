# image-sequence


## Install

    npm install image-sequence --save

## Usage

something like this:


    <div style="height: 2500px;"></div>
    <canvas id="canvas"></canvas>
    <div style="height: 2500px;"></div>


    import CanvasAnimate from 'image-sequence'

    const newSources = []
    const totalImages = 600
    for (let i = 3; i < totalImages + 3; i++) {
      let fileName = 'Walking'
      if (i < 10) fileName += '00'
      else if (i < 100) fileName += '0'
      fileName += i + '.jpg'
      const srccc = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/325536/' + fileName
      newSources.push(srccc)
    }

    CanvasAnimate.init(document.getElementById('canvas'), 1280, 720, newSources, {
      repeat: false,
      topDelay: 0,
      bottomDelay: 0,
      playSpeed: 1
    })
    
## Author

[kerasus](https://github.com/kerasus/)


## License

MIT
editable polyline plugin extension for vue2-leaflet package
