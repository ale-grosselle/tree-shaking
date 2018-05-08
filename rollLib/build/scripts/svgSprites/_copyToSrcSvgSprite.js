import sprite_data from "./svg-sprite.json";

// get the document and define a replacement regex for glyph IDs
const document = window.document || null,
  glyph_re = new RegExp("-", "g");

let GLYPHS = {};

// initialise the 'length' property so it's not enumerable
Object.defineProperty(GLYPHS, "length", {
  writable: true
});

/**
 * @ignore
 * Attaches the currently defined SVGs into the document as a single sprite
 */
export function attachSVG() {
  if (document) {
    // add svg sprite data on dom load
    document.addEventListener("DOMContentLoaded", function() {
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      
      // set styles to hide
      svg.style.position = "absolute";
      svg.style.width = 0;
      svg.style.height = 0;
      
      
      // set innerHTML for svg data
      svg.innerHTML = sprite_data.svg;
      
      // inject svg into top of document
      document.body.insertBefore(svg, document.body.firstChild);
      
      // clean up
      sprite_data.svg = null;
    });
  }
}

if (!GLYPHS.length) {
  // loop through glyphs and create exportable reference object
  sprite_data.glyphs.forEach((glyph) => {
    // get key based on the first part of the glyph name
    // e.g. 'volume-off-sprite' becomes 'VOLUME-OFF'
    let key = (glyph.toString().slice(0, -7).toUpperCase());
    
    // replace dashes etc with underscores
    // e.g. 'VOLUME-OFF' becomes 'VOLUME_OFF'
    key = key.replace(glyph_re, "_");
    
    // use key as key of GLYPHS object with a value linking to the <symbol> ID
    GLYPHS[key] = "#" + glyph;
    
    // increment the length — this avoids unecessary regeneration
    GLYPHS.length += 1;
  });
}

export function showSVG(domId, svgId, w, h){
  // create the svg and use tags, using the appropriate namespace
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  let attachHere = document.querySelector("#" + domId);
  
  // create the width/height attributes on the svg
  svg.setAttribute("width", w ? w : 100);
  svg.setAttribute("height", h ? h : 100);
  
  // set the xhlink:href attribute of the use tag to match the glyph's ID
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", GLYPHS[svgId]);
  
  // insert use into svg, svg into the document
  svg.appendChild(use);
  
  if (attachHere) {
    attachHere.appendChild(svg);
  }
}

export default GLYPHS;
