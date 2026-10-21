import express from 'express';
import MainController from './controllers/MainController.js';

const app = express();
const port = 3000;

app.get('/', MainController.getMain);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
