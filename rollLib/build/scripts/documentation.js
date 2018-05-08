const copydir = require('copy-dir');
const path = require('path');
const rm = require('rimraf');
const fs = require('fs');
const sass = require('node-sass');
const pathDoc = path.resolve(__dirname, '../../doc-website');
const pathDist = path.resolve(__dirname, '../../dist');
const folderDistMain = path.join(pathDist + '/docs');

function compileSass(options = {}) {
	// set default options
	options = Object.assign(
		{
			style: 'expanded'
		},
		options
	);
	// render the result
	let result = sass.renderSync({
		file: options.src,
		outputStyle: options.style
	});
	// write the result to file
	fs.writeFileSync(options.dest, result.css);
}

//Creates Folders:
if (!fs.existsSync(pathDist)) {
	fs.mkdirSync(pathDist);
}
if (!fs.existsSync(folderDistMain)) {
	fs.mkdirSync(folderDistMain);
}


//Removes all old information:
rm.sync(folderDistMain);
copydir.sync(pathDoc + '/assets', folderDistMain);

//Compile Sass:
compileSass({
	src: pathDoc + '/assets/sass/ghpages-materialize.scss',
	dest: folderDistMain + '/css/ghpages-materialize.css'
});
