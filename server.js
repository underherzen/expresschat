var PORT = 8889;
var express = require('express'),
	app = express(),
    fs = require('fs'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    multiparty = require('multiparty');

module.exports = (function(){
   function inner(){
      this.start = function (whatToDo){
          app.use(express.static('public'));

		  app.get('/page', function(req, res){
			  res.send('<h1>Hey it works!</h1>');
		  });

		  io.on('connection', function(socket){
		  		      console.log('a user connected!');
                      var ID = (socket.id).toString().substr(0, 5);



              socket.on('file message', function(msg) {
                  console.log(msg.substring(0,10));
                  if (msg.substring(0,10) == 'data:image') {
                      socket.emit('file message push', '<p>me: </p><br> <img style="width:50%" class="img-thumbnail img-rounded" src=" ' + msg + '"/>');
                      socket.broadcast.emit('file message push', '<p>' + 'АНОНИМУС' + '</p><br> <img style="width:50%" class="img-thumbnail img-rounded" src=" ' + msg + '"/>');
                  }
                  else {
                      socket.emit('chat message push', 'Вы пытались загрузuть не картинку, ай-яй-яй');
                  }
              })
              socket.broadcast.emit('chat message push', '>> a user ' + ID + ' connected '); //everyone except the new one
			  socket.emit('chat message push', 'Добро пожаловать в чат <strong>2.0</strong> Уляшева Артура!'); //only the newcomer

				      //message from client - recast to others
				      socket.on('chat message', function(msg){
				            console.log('message: ' + msg);
				            socket.broadcast.emit('chat message push', 'АНОНИМУС' + ":" + msg);
				            socket.emit('chat message push', 'me:' + msg );
				      });



				      socket.on('disconnect', function(){
				         console.log('a user disconnected!');
				         socket.broadcast.emit('chat message push', '>> a user disconnected ');
				      });
          });
      /*   app.post('/upload', function (req, res) {


                  // создаем форму
                  var form = new multiparty.Form();
                  //здесь будет храниться путь с загружаемому файлу, его тип и размер
                  var uploadFile = {uploadPath: '', type: '', size: 0};
                  //максимальный размер файла
                  var maxSize = 10 * 1024 * 1024; //10MB
                  //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
                  var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
                  //массив с ошибками произошедшими в ходе загрузки файла
                  var errors = [];

                  //если произошла ошибка
                  form.on('error', function (err) {
                      if (fs.existsSync(uploadFile.path)) {
                          //если загружаемый файл существует удаляем его
                          fs.unlinkSync(uploadFile.path);
                          console.log('error');
                      }
                  });

                  form.on('close', function () {
                      //если нет ошибок и все хорошо
                      if (errors.length == 0) {
                          //сообщаем что все хорошо
                          res.send({status: 'ok', text: 'Success'});
                      }
                      else {
                          if (fs.existsSync(uploadFile.path)) {
                              //если загружаемый файл существует удаляем его
                              fs.unlinkSync(uploadFile.path);
                          }
                          //сообщаем что все плохо и какие произошли ошибки
                          res.send({status: 'bad', errors: errors});
                      }
                  });

                  // при поступление файла
                  form.on('part', function (part) {

                      //читаем его размер в байтах
                      uploadFile.size = part.byteCount;
                      //читаем его тип
                      uploadFile.type = part.headers['content-type'];
                      //путь для сохранения файла
                      uploadFile.path = "public/" + part.filename;
                      console.log(uploadFile.path);
                      uploadFile.pathtwo = part.filename;

                      //проверяем размер файла, он не должен быть больше максимального размера
                      if (uploadFile.size > maxSize) {
                          errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
                      }

                      //проверяем является ли тип поддерживаемым
                      if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
                          errors.push('Unsupported mimetype ' + uploadFile.type);
                      }

                      //если нет ошибок то создаем поток для записи файла
                      if (errors.length == 0) {
                          var out = fs.createWriteStream(uploadFile.path);
                          part.pipe(out);
                      }
                      else {
                          //пропускаем
                          //вообще здесь нужно как-то остановить загрузку и перейти к onclose
                          part.resume();
                      }
                    if(uploadFile.size>0)
                   //   io.sockets.emit('file message push',' <img style="width:50%" class="img-thumbnail img-rounded" src = "' + uploadFile.pathtwo + '">');
                      console.log(uploadFile.pathtwo);
                      // socket.broadcast.emit('file message push', '<img class="img-thumbnail" src = "' + uploadFile.pathtwo + '">');
                      // fs.unlinkSync(uploadFile.path);
                      uploadFile.path = "";
                      uploadFile.pathtwo = '';


                  });

                  // парсим форму




                  form.parse(req);
              }) */


		  app.get('/chat', function(req, res){
			  res.sendFile(__dirname + '/public/chat.html');

		  });
          app.use('/file', function(req,res) {
              res.set({'Content-Type' : 'text/plain'});
             res.sendFile(__dirname + '/server.js');
          });
          app.use('/file2', function(req, res) {
              res.set({'Content-Type' : 'text/plain'});
              res.sendFile(__dirname + '/public/chat.html');
          })


		  http.listen(process.env.port || PORT, function(){
			  console.log(PORT);
		  });
      };

    }
  return new inner;
})();
