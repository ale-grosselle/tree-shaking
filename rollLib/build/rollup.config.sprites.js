const params = require('./params');

const BUILD_FOR_PRODUCTION = process.env.BUILD === 'production';
const BASE_URL = BUILD_FOR_PRODUCTION ? params.prod.baseUrl : params.dev.baseUrl;
const OUTPUT_PATH = "images/sprite.png";

module.exports = {
  src: {
    cwd: "src/static/images/sprite",
    glob: "**/*.png"
  },
  target: {
    image: "src/static/" + OUTPUT_PATH,
    css: "src/sprite.scss"
  },
  cssImageRef: BASE_URL + "/" + OUTPUT_PATH
};
