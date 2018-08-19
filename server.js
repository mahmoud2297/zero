const http = require('http');

function hamza (number){
    console.log(number)
}
var hamza = function(saasas){
    console.log(hamza)
}
var hamza = (number)=>{
    
}
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello hamza!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
