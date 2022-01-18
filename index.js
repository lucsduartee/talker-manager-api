const express = require('express');
const bodyParser = require('body-parser');
// const talkersRouter = require('./talkersRouter');
const rescue = require('express-rescue');
const { getTalkers, setTalker } = require('./fs-utils');
const {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkKeys,
} = require('./middlewares/validation');
const { tokenize } = require('./middlewares/token');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// app.use('/talker', talkersRouter);
app.get('/talker', rescue(async (_req, res) => {
  const fileContent = await getTalkers();
  if (fileContent.length === 0) return res.status(200).json([]);
  res.status(200).json(fileContent);
}));

app.get(
  '/talker/search',
  validateToken,
  rescue(async (req, res) => {
    const fileContent = await getTalkers();
    const { q } = req.query;
    const toReturn = fileContent.filter((talker) => talker.name.includes(q));
    if (!q || q === '') {
      return res.status(200).json(fileContent);
    }

    res.status(200).json(toReturn);
  }),
);

app.get('/talker/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const fileContent = await getTalkers();

  const talkerFound = fileContent.find((talker) => talker.id === +id);

  if (!talkerFound) {
    return res.status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  res.status(200).json(talkerFound);
}));

app.post(
  '/login',
  validateEmail,
  validatePassword,
  tokenize,
);

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkKeys,
  rescue(async (req, res) => {
    const fileContent = await getTalkers();
    const talker = req.body;
    talker.id = fileContent.length + 1;
    fileContent.push(talker);
    await setTalker(fileContent);
    res.status(201).json(talker);
  }),
);

app.put(
  '/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkKeys,
  rescue(async (req, res) => {
    const fileContent = await getTalkers();
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkerToChange = fileContent.find((talker) => talker.id === +id);
    const talkerChanged = { ...talkerToChange, name, age, talk };
    await setTalker([
      ...fileContent,
      talkerChanged,
    ]);
    return res.status(200).json(talkerChanged);
  }),  
);

app.delete(
  '/talker/:id',
  validateToken,
  rescue(async (req, res) => {
    const { id } = req.params;
    const fileContent = await getTalkers();
    const toReturn = fileContent.filter((talker) => talker.id !== +id);
    await setTalker(toReturn);
    res.status(204).end();
  }),
);

app.listen(PORT, () => {
  console.log('Online');
});
