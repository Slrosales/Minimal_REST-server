import http from "node:http";

const port = 8080;

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
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

function getStudents(req, res) {
  sendJson(res, 200, { message: "students" });
}

function getProfs(req, res) {
  sendJson(res, 200, { message: "profs" });
}

function getModules(req, res) {
  sendJson(res, 200, { message: "modules" });
}

const router = {
  routes: [], // Array to store registered routes

  get(path, handler) {
    this.routes.push({ method: "GET", path, handler }); // Register GET route
  },

  post(path, handler) {
    this.routes.push({ method: "POST", path, handler });
  },

  dispatch(req, res) {
    const path = req.url.split("?")[0]; // Extract the path from the URL
                                        // turns /students?module=WEB01 into /students

    const route = this.routes.find(
      (r) => r.method === req.method && r.path === path, // Find the matching route
    );

    if (!route) {
      sendJson(res, 404, { error: "Not Found" });
      return;
    }

    route.handler(req, res); // Call the handler for the matched route
  },
};

router.get('/', getMain);
router.get('/students', getStudents);
router.get('/profs', getProfs);
router.get('/modules', getModules);

const server = http.createServer((req, res) => {
    router.dispatch(req, res); // Dispatch the request to the router
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
