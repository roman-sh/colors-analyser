

function processImage(imgEl) {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    canvas.getContext('2d').drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

    const pixelData = canvas.getContext('2d').getImageData(0, 0, imgEl.width, imgEl.height).data;

    const pixels = {}
    for (let i=0; i<pixelData.length; i += 4) {
        let
            r = pixelData[i],
            g = pixelData[i+1],
            b = pixelData[i+2],
            a = pixelData[i+3]
        if (a === 0) continue   // do not include transparent colors
        let key = `${r},${g},${b}`
        pixels[key]
            ? pixels[key]++
            : pixels[key] = 1
    }

    let keys = Object.keys(pixels);
    keys.sort((a, b) => pixels[b] - pixels[a]);


    // Display results
    const totalPixels = imgEl.width * imgEl.height
    const firstFiveKeys = keys.slice(0, 5)

    firstFiveKeys.forEach(key => {
        const canvas = document.createElement('canvas');
        canvas.classList.add('result');
        canvas.width = 100;
        canvas.height = 50;
        
        const context = canvas.getContext('2d');
        context.fillStyle = `rgb(${key})`
        context.fillRect(0, 0, 100, 50);

        const percentage = Math.round(pixels[key] / totalPixels * 100)
        const invertedColor = invertColor(key)

        context.fillStyle =  `rgb(${invertedColor})`
        context.fillText(`rgb(${key})`, 10, 10)
        context.font = 'bold 24px serif'
        context.fillText(`${percentage} %`, 10, 40)

        document.querySelector('#canvas').appendChild(canvas)
    })

    function invertColor(key) {
        const colors = key.split(',')
        return colors.map(color => 255 - +color).join(',')
    }
}

const handleFiles = (files) => {
    /* Display image */
    const file = files[0]
    const imgEl = document.createElement('img')
    imgEl.src = window.URL.createObjectURL(file)
    imgEl.onload = function() {
        window.URL.revokeObjectURL(this.src);
        processImage(imgEl)
    }
    const imageContainer = document.querySelector('#image')
    imageContainer.appendChild(imgEl);
}