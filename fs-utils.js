const fs = require('fs/promises');

const getTalkers = () => fs.readFile('./talker.json', 'utf-8')
  .then((fileContent) => JSON.parse(fileContent));

const setTalker = (talker) => fs.writeFile('./talker.json', JSON.stringify(talker));

module.exports = {
  getTalkers,
  setTalker,
};
