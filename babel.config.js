module.exports = function (api) {
  // This caches the Babel config
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    "@babel/preset-env",
    // Enable development transform of React with new automatic runtime
    [
      "@babel/preset-react",
      { development: !api.env("production"), runtime: "automatic" },
    ],
  ];

  let plugins = [
    ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
    ["@babel/plugin-transform-runtime", { corejs: false }],
  ];

  // Applies the react-refresh Babel plugin on non-production modes only
  if (!api.env("production")) {
    plugins.push("react-refresh/babel");
  }

  return {
    presets,
    plugins,
  };
};
