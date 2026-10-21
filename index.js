import http from "node:http";

const port = 8080;

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function collectBody(req, callback) {
  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');

    if (raw === '') {
      return callback(null, undefined);
    }

    try {
      callback(null, JSON.parse(raw));
    } catch (err) {
      callback(err);
    }
  });

  req.on('error', (err) => {
    callback(err);
  });
}

function getMain(req, res) {
  sendJson(res, 200, {
    name: "Master 2 Mosig",
    _links: {
      students: { href: "/students" },
      profs: { href: "/profs" },
      modules: { href: "/modules" },
    },
  });
}

function toRouteRegex(path) {
    const keys = [];
    const pattern = path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        keys.push(key);
        return '([a-zA-Z0-9-]+)';
  });

    const suffix = path.endsWith('/') ? '' : '/?';
    return {regex: new RegExp(`^${pattern}${suffix}$`), keys};

}

function getStudents(req, res) {
  sendJson(res, 200, { message: 'students' });
}

function getStudent(req, res) {
  sendJson(res, 200, { ine: req.params.ine, query: req.query });
}

function getProfs(req, res) {
  sendJson(res, 200, { message: 'profs' });
}

function getProf(req, res) {
  sendJson(res, 200, { number: req.params.number });
}

function getModules(req, res) {
  sendJson(res, 200, { message: 'modules' });
}

function getModule(req, res) {
  sendJson(res, 200, { code: req.params.code_module });
}

function createStudent(req, res) {
  if (!req.body || typeof req.body !== 'object' || !req.body.ine) {
    return sendJson(res, 400, { error: 'ine is required' });
  }

  sendJson(res, 201, req.body);
}

function updateStudent(req, res) {
  if (!req.body || typeof req.body !== 'object') {
    return sendJson(res, 400, { error: 'a JSON body is required' });
  }

  sendJson(res, 200, { ...req.body, ine: req.params.ine });
}


const router = {
  routes: [], // Array to store registered routes

  add(method, path, handler){
    const {regex, keys} = toRouteRegex(path);
    this.routes.push({method, path, regex, keys, handler});
  },

  get(path, handler) {
    this.add( "GET", path, handler ); // Register GET route
  },

  post(path, handler) {
    this.add( "POST", path, handler );
  },

  put(path, handler) {
    this.add( "PUT", path, handler );
  },

  dispatch(req, res) {
    const url = new URL(req.url, 'http://localhost');

    for (const route of this.routes){
        if(route.method !== req.method) continue;

        const match = url.pathname.match(route.regex);
        if(!match) continue;

        req.params = {}; // Initialize req.params object
        route.keys.forEach((key, index) => {
            req.params[key] = match[index + 1] // Populate req.params with matched values
        });

        req.query = Object.fromEntries(url.searchParams);

        return route.handler(req, res);
    }

    sendJson(res, 404, {error: 'Not found'});
  },
};

router.get('/', getMain);
router.get('/students', getStudents);
router.get('/students/:ine', getStudent);
router.get('/profs', getProfs);
router.get('/profs/:number', getProf);
router.get('/modules', getModules);
router.get('/modules/:code_module', getModule);

router.post('/students', createStudent);
router.put('/students/:ine', updateStudent);


const server = http.createServer((req, res) => {
    collectBody(req, (err, body) => {
        if (err) {
            console.error(err);
            return sendJson(res, 400, { error: 'Invalid JSON payload' });
        }

        req.body = body;
        router.dispatch(req, res);
    });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
