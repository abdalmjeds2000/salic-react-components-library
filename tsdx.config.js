// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, opts) {
    config.plugins = config.plugins.map(p =>
      p.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(opts.env),
            preventAssignment: true,
          })
        : p
    );
    return config; // always return a config.
  },
};
// module.exports = {
//   rollup(config, options) {
//     config.plugins.push(
//       postcss({
//         modules: true,
//         inject: true,
//         extract: false
//       })
//     );
//     return config;
//   },
// };

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        modules: true,
        inject: true,
        extract: false
      })
    );
    return config;
  },
};

