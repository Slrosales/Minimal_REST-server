import http from "node:http";

const port = 8080;

function onRequest(req, res) {
  console.log(`${req.method} ${req.url}`);

  const data = {
    message: "Hello world",
    method: req.method,
    url: req.url,
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(onRequest);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
