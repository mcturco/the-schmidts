const sass = require('node-sass');
const fs = require('fs');
const { promises: fsPromises } = require('fs');
const path = require('path');
const Watcher = require('node-sass-watcher');

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


async function getScssFiles() {
    try {
        // Open the directory
        const dir = await fsPromises.opendir(inputDir);

        // Read the contents of the directory
        const files = [];
        for await (const dirent of dir) {
            if (dirent.isFile() && dirent.name.endsWith('.scss')) {
                files.push(path.join(inputDir, dirent.name));
            }
        }

        return files;
    } catch (error) {
        console.error(`Error reading directory: ${error}`);
        return [];
    }
}

async function watchFiles() {
    const scssFilePaths = await getScssFiles();

    scssFilePaths.forEach(filePath => {
        fsPromises.watch(filePath, { persistent: true })
            .then(watcher => {
                watcher.on('change', (event, filename) => {
                    console.log(`File ${filePath} changed. Recompiling...`);
                    compileSass();
                });
            })
            .catch(error => {
                console.error(`Watcher error for ${filePath}: ${error}`);
            });
    });
}

// Renderer
function render() {
    console.warn('Rendering "' + inputDir + '" file...');

    sass.render({file: inputDir}, function(err, result) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }
    });
}

// Compile initially and then watch for changes
compileSass();

// Start watching
// const watcher = new Watcher(inputDir);
// watcher.on('init', render);
// watcher.on('update', render);
// watcher.run();
