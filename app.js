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
    } else if (url === '/posts') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ data: posts }));
    } else if (url.startsWith('/users')) {
      const userId = parseInt(url.split('/')[2]);
      const userPost = users.find((user) => user.id === userId); // user는 유일하므로 find 하나의 값만 찾는 고차함수
      userPost['postings'] = posts.filter((post) => post.userId === userId); //포스트는 여러개 이므로 filter

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ data: userPost }));
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
        const isExist = users.some((user) => user.id === post.userId);
        const isAlreadyPost = posts.some((postObj) => postObj.id === post.id);
        console.log(isAlreadyPost);
        if (isExist && !isAlreadyPost) {
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
          response.end(
            JSON.stringify(
              '존재하지 않는 유저 아이디 또는 유효하지 않은 포스트 id 입니다'
            )
          );
        }
      });
    }
  } else if (method === 'PATCH') {
    if (url.startsWith('/posts')) {
      const postId = parseInt(url.split('/')[2]);
      let rawData = '';

      request.on('data', (data) => (rawData += data));
      request.on('end', () => {
        const post = JSON.parse(rawData);

        let target = posts.find((postObj) => {
          return postObj.id === postId && postObj.userId === post.userId;
        });
        console.log(target);

        if (target === undefined) {
          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify('잘못된 접근 입니다'));
        } else {
          target.title = post.title;
          target.content = post.content;
          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ data: posts }));
        }
      });
    }
  } else if (method === 'DELETE') {
    if (url.startsWith('/posts')) {
      const postId = parseInt(url.split('/')[2]); //    /posts/10
      const postIndex = posts.findIndex((obj) => obj.id === postId);
      if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'postingDeleted' }));
      } else {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({ message: '존재하지 않는 게시물 입니다.' })
        );
      }
    }
  }
};

server.on('request', httpRequestListener);

server.listen(8000, '127.0.0.1', () => {
  console.log(`Server Listening on port 8000 ...`);
});
