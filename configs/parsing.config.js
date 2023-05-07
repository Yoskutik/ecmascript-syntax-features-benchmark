const { createConfigs } = require('./utils');

module.exports = (argv, { env: { entry, mobile } }) => {
  const entries = {
    [entry.match(/src\/(.+)\.ts/)[1]]: `./${entry.replace('.ts', '.parsing.ts')}`,
  };

  return createConfigs('parsing', entries, !!mobile);
};
