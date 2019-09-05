var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var pathNoQuery = parsedUrl.pathname
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  //console.log('方方说：得到HTTP的路径\n' + path)
  //console.log('方方说：查询字符串为\n' + query)
  //console.log('方方说：不含查询字符串的路径\n' + pathNoQuery)
  //console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  // if (path === '/') {
  //   var string = fs.readFileSync('./index.html', 'utf8')//如果访问根目录则打开index
  //   var amount = fs.readFileSync('./db', 'utf8')//获取根目录db文件的值
  //   string = string.replace('&&&amount&&&', amount)//将&&&amount&&&替换为变量amount
  //   response.setHeader('Content-Type', 'text/html;charset=utf-8')
  //   response.write(string)//将修改后的值通过write方法传递给浏览器
  //   response.end()
  // }


  if (path === '/pay.html') {
    var string = fs.readFileSync('./pay.html', 'utf8')
    var amount = fs.readFileSync('./db', 'utf8')//获取根目录db文件的值
    string = string.replace('&&&amount&&&', amount)//将&&&amount&&&替换为变量amount
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }
  else if (path === '/pay') {//浏览器动态创建script标签向服务器请求
    var amount = fs.readFileSync('./db', 'utf8');
    var newAmount = amount - 1;
    if (Math.random() > 0.5) {
      fs.writeFileSync('./db', newAmount);
      response.setHeader('Content-Type', 'application/javascript')
      response.statusCode = 200;
      response.write(
        `${query.callback}.call(undefined,'success')`
      );
    } else {
      response.write(
        `${query.callback}.call(undefined,'fail')`
      );
      response.statusCode = 400;
    }
    response.end();
  }
  else if (path === '/style.css') {
    var css = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(css)
    response.end()
  } else if (path === '/main.js') {
    var js = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'text/script')
    response.write(js)
    response.end()
  }
  else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜\n')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)