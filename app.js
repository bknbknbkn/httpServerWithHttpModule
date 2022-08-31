const http = require('http');
const server = http.createServer();

const users = [
  {
    id: 1,
    name: 'Rebekah Johnson',
    email: 'Glover12345@gmail.com',
    password: '123qwe',
  },
  {
    id: 2,
    name: 'Fabian Predovic',
    email: 'Connell29@gmail.com',
    password: 'password',
  },
];

const posts = [
  {
    id: 1,
    title: '간단한 HTTP API 개발 시작!',
    content: 'Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.',
    userId: 1,
  },
  {
    id: 2,
    title: 'HTTP의 특성',
    content: 'Request/Response와 Stateless!!',
    userId: 1,
  },
];

const httpRequestListener = (request, response) => {
  const { url, method } = request;

  if (method === 'GET') {
    if (url === '/ping') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'pong' }));
    }
  } else if (method === 'POST') {
    if (url === '/users') {
      let rawData = '';
      request.on('data', (data) => (rawData += data));
      request.on('end', () => {
        const user = JSON.parse(rawData);
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.email,
        });
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'userCreated', users: users }));
      });
    }
  }
};

server.on('request', httpRequestListener);

server.listen(8000, '127.0.0.1', () => {
  console.log(`Server Listening on port 8000 ...`);
});
