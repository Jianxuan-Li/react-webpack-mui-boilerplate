function getChunk(reg, name) {
  return {
    test: reg,
    name: name,
    chunks: "all",
    reuseExistingChunk: true,
  };
}

let chunks = {
  react: getChunk(
    /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|redux|react-redux|@reduxjs|redux-thunk)[\\/]/,
    "react"
  ),
  moment: getChunk(/[\\/]node_modules[\\/](moment)[\\/]/, "moment"),
  core: getChunk(/[\\/]node_modules[\\/](core-js)[\\/]/, "core"),
  material: getChunk(/[\\/]node_modules[\\/](@mui|@material-ui|@emotion)[\\/]/, "material"),
  styles: {
    name: "styles",
    type: "css/mini-extract",
    chunks: "all",
    enforce: true,
  },
};

module.exports = chunks;