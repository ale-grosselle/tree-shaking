/**
 * Generate sprite sheet before import into the app.
 */
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const xml = require('node-xml-lite');

/**
 * Parse an SVG file, alter it to work as a sprite symbol and return its XML
 */
function parseSVGXML(file) {
	var data, output = '';

	// read data and parse into an object
	data = xml.parseBuffer(
		fs.readFileSync(file)
	);

	// mutate the SVG to work as a <symbol> tag
	if (data.name === 'svg') {
		// a valid SVG element - continue
		data.name = 'symbol';
		data.attrib = data.attrib || {};
		data.attrib.id = (path.basename(file)).replace(/.svg/, '-sprite');
		data.attrib.width = null;
		data.attrib.height = null;
		data.attrib.xmlns = null;

		// concatenate to output string as XML (using JSONtoXML)
		output += JSONtoXML(data);
	}

	return output;
}

/**
 * Generically returns an XML element given a JS Object.
 */
function JSONtoXML(data) {
	var key, markup, node;

	markup = '';
	node = '<' + data.name;

	// add attributes
	if (data.attrib) {
		for (key in data.attrib) {
			if (data.attrib.hasOwnProperty(key) && data.attrib[key] !== null) {
				node += ' ' + key + '="' + data.attrib[key].replace(/"/, '\"') + '"';
			}
		}
	}

	if (data.childs && data.childs.length > 0) {
		// add children
		node += '>';

		data.childs.forEach(function(child) {
			if (typeof child === 'object') {
				node += JSONtoXML(child);
			}
		});

		node += '</' + data.name + '>';
		markup += node;
	} else {
		// close off single tag
		node += '/>';
		markup += node;
	}

	return markup;
}

/**
 * Returns JSON-based sprite data and a glyph map
 */
module.exports = function(svgFolder, outputFolder, jsonName) {
	var data = {
		glyphs: [],
		svg: ''
	};

	return new Promise(function(resolve, reject) {
		// find svg files and fill in sprite
		glob(svgFolder, function(error, files) {
			if (error) reject(error);

			files.forEach((file) => {
				data.svg += parseSVGXML(file);
				data.glyphs.push(
					path.basename(file).replace(/\.svg$/, '-sprite')
				);
			});
      
      if (fs.existsSync(outputFolder)) {
        fs.writeFileSync(outputFolder + jsonName, JSON.stringify(data));
        fs.copyFileSync('build/scripts/svgSprites/_copyToSrcSvgSprite.js', outputFolder + '/svgSprite.js');
      }

			resolve();
		});
	});
};
