const CryptoJS = require('crypto-js');

const tokenize = (req, res) => {
  const { email } = req.body;
  const hash = CryptoJS.SHA256(email).toString();
  let token = '';
  for (let i = 0; i < 16; i += 1) {
    const randomNumber = Math.round(Math.random() * 15);
    token += hash[randomNumber];
  }

  res.status(200).json({ token });
};

module.exports = {
  tokenize,
};
