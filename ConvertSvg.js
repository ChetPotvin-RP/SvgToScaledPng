const { createConverter }  = require('convert-svg-to-png');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const converter = createConverter();
const size_array = [16, 24, 32, 48, 128];
const outputDirectory = './FontAwesome/';


(async() => {
    
    initDirectories();

    try{
        await exportDirectory('./fa/brands/');
        await exportDirectory('./fa/regular/');
        await exportDirectory('./fa/solid/');
    } finally {
        await converter.destroy();
    }
})();

function initDirectories () {
    rimraf.sync(outputDirectory);
    fs.mkdirSync(outputDirectory);

    for (var size in size_array) {
        var directoryName = outputDirectory + size_array[size] + 'x' + size_array[size] + '/';       
        fs.mkdirSync(directoryName);
    }
}

async function exportDirectory(inputDirectory) {

    var files = fs.readdirSync(inputDirectory);
    for (var file in files) {
        await exportAllSizes(inputDirectory, path.parse(files[file]).name)
    }

}

async function exportAllSizes(inputDirectory, imageName){

    for (var size in size_array) {
        await exportWithResize(inputDirectory, size_array[size], imageName);
    }

}

async function exportWithResize(inputDirectory, size, imageName) {

    var options = {
        height: size,
        width: size,
        outputFilePath: outputDirectory + size + 'x' + size + '/' + imageName + '.png'
    };

    var inputFilePath = inputDirectory + imageName + '.svg';
    var outputFilePath = await converter.convertFile(inputFilePath, options);
    console.log(outputFilePath);

}