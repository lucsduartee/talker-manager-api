const express = require('express');
const rescue = require('express-rescue');
const { getTalkers } = require('./fs-utils');

const router = express.Router();

router.get('/', rescue(async (_req, res) => {
  const fileContent = await getTalkers();

  if (fileContent.length === 0) return res.status(200).json([]);
  res.status(200).json(fileContent);
}));

router.get('/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const fileContent = await getTalkers();
  
  const talkerFound = fileContent.find((talker) => talker.id === +id);

  if (!talkerFound) {
    return res.status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }

  res.status(200).json(talkerFound);
}));

module.exports = router;
