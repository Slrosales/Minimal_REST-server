import express from 'express';
import ModuleController from './controllers/ModuleController.js';
import ProfController from './controllers/ProfController.js';
import StudentController from './controllers/StudentController.js';
import MainController from './controllers/MainController.js';

const app = express();
const port = 3000;

app.get('/', MainController.getMain);

app.get('/students', StudentController.getAll)
app.get('/students/:ine', StudentController.getOne)

app.get('/profs', ProfController.getAll)
app.get('/profs/:number', ProfController.getOne)

app.get('/modules', ModuleController.getAll)

app.use((req, res) => res.status(404).json({ error: 'Not Found'}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
