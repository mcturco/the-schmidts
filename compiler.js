const sass = require('node-sass');
const fs = require('fs');
const path = require('path');

// Input and output directories
const inputDir = 'scss';
const outputDir = 'scss';
const entryFile = 'style.scss'; // Your main SCSS file

// Function to compile SCSS files
function compileSass() {
    const inputFile = path.join(inputDir, entryFile);
    const outputFile = path.join(outputDir, path.basename(entryFile, '.scss') + '.css');

    sass.render({
        file: inputFile,
        outFile: outputFile,
        sourceMap: true,
    }, (err, result) => {
        if (err) {
            console.error(`Error compiling ${entryFile}: ${err.formatted}`);
        } else {
            fs.writeFileSync(outputFile, result.css);
            console.log(`Successfully compiled ${entryFile} to ${outputFile}`);
        }
    });
}

// Function to watch for changes in SCSS files
function watchFiles() {
    const filePath = path.join(inputDir, entryFile);
    fs.watch(filePath, (event, filename) => {
        if (event === 'change') {
            console.log(`File ${entryFile} changed. Recompiling...`);
            compileSass();
        }
    });
}

// Compile initially and then watch for changes
compileSass();
watchFiles();
