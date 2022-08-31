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
        response.end(JSON.stringify({ message: 'userCreated' }));
      });
    } else if (url === '/posts') {
      let rawData = '';
      request.on('data', (data) => (rawData += data));
      request.on('end', () => {
        const post = JSON.parse(rawData);
        //userId는 유일하다고 가정하여 찾은 첫번째 값을 반환하는 find함수를 사용-> 근데 이경우 만족하는 값을
        //반환 하게 되는데 만약 userId가 0이라면? if 분기에 넣었을 때 의도하지 않은 방식으로 동작 할 가능성 존재
        const isExist = users.some((user) => user.id === post.userId);
        if (isExist) {
          posts.push({
            id: post.id,
            title: post.title,
            content: post.content,
            userId: post.userId,
          });
          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ message: 'postCreated' }));
        } else {
          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify('존재하지 않는 유저 아이디 입니다'));
        }
      });
    }
  }
};

server.on('request', httpRequestListener);

server.listen(8000, '127.0.0.1', () => {
  console.log(`Server Listening on port 8000 ...`);
});
