const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const passport = require('passport')
var bodyParser = require('body-parser')
const routes = require('./routes/index')
const acessRoutes = require('./routes/acessRoutes')
const indexGet = require('./routes/indexGet')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
var appChat = require('http').Server(app); // Criando o servidor
var fs = require('fs'); // Sistema de arquivos
var io = require('socket.io')(appChat); // Socket.IO
var usuarios = []; // Lista de usuários
var ultimas_mensagens = []; // Lista com ultimas mensagens enviadas no chat

//Configurações
  // Conecta-se ao banco mongoDB
  connectDB()

  

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

  // View Engine
  app.engine('handlebars', handlebars({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars')
  app.use(cors())
  // Sessão
  app.use(session({
    secret: "1a2b3c4dLeilonebom",
    resave: true,
    saveUninitialized: true
  }))
  app.use(flash())
  // Body Parser
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  // Routes
  app.use(routes)
  app.use(acessRoutes)
  app.use(indexGet)
  app.use(passport.initialize())
  // Static files
  app.use(express.static('views/images'))
  app.use(express.static('views/'))
  // Passport config
  require('./config/passport')(passport)
  // Middleware
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use((req,res,next) =>{
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      next()
  })

const PORT = process.env.PORT || 3000

appChat.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//appChat.listen(5000);


io.on("connection", function(socket){
	// Método de resposta ao evento de entrar
	socket.on("entrar", function(apelido, callback){
    
		if(!(apelido in usuarios)){
			socket.apelido = apelido;
			usuarios[apelido] = socket; // Adicionadno o nome de usuário a lista armazenada no servidor

			// Enviar para o usuário ingressante as ultimas mensagens armazenadas.
			for(indice in ultimas_mensagens){
				socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
			}


			var mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
			var obj_mensagem = {msg: mensagem, tipo: 'sistema'};

			io.sockets.emit("atualizar usuarios", Object.keys(usuarios)); // Enviando a nova lista de usuários
			io.sockets.emit("atualizar mensagens", obj_mensagem); // Enviando mensagem anunciando entrada do novo usuário

			armazenaMensagem(obj_mensagem); // Guardando a mensagem na lista de histórico

			callback(true);
		}else{
			callback(false);
		}
	});


	socket.on("enviar mensagem", function(dados, callback){
		var mensagem_enviada = dados.msg;
		var usuario = dados.usu;
		if(usuario == null)
			usuario = ''; // Caso não tenha um usuário, a mensagem será enviada para todos da sala

		mensagem_enviada = "[ " + pegarDataAtual() + " ] " + socket.apelido + " diz: " + mensagem_enviada;
		var obj_mensagem = {msg: mensagem_enviada, tipo: ''};
		socket.broadcast.emit("receive_message", obj_mensagem)

		if(usuario == ''){
			io.sockets.emit("atualizar mensagens", obj_mensagem);
			armazenaMensagem(obj_mensagem); // Armazenando a mensagem
		}else{
			obj_mensagem.tipo = 'privada';
			socket.emit("atualizar mensagens", obj_mensagem); // Emitindo a mensagem para o usuário que a enviou
			usuarios[usuario].emit("atualizar mensagens", obj_mensagem); // Emitindo a mensagem para o usuário escolhido
		}
		
		callback();
	});

	socket.on("disconnect", function(){
		delete usuarios[socket.apelido];
		var mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala";
		var obj_mensagem = {msg: mensagem, tipo: 'sistema'};


		// No caso da saída de um usuário, a lista de usuários é atualizada
		// junto de um aviso em mensagem para os participantes da sala		
		io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
		io.sockets.emit("atualizar mensagens", obj_mensagem);

		armazenaMensagem(obj_mensagem);
	});

});


// Função para apresentar uma String com a data e hora em formato DD/MM/AAAA HH:MM:SS
function pegarDataAtual(){
	var dataAtual = new Date();
	var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
	var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
	var ano = dataAtual.getFullYear();
	var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
	var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
	var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();

	var dataFormatada = dia + "/" + mes + "/" + ano + " " + (hora-3) + ":" + minuto + ":" + segundo;
	return dataFormatada;
}

// Função para guardar as mensagens e seu tipo na variável de ultimas mensagens
function armazenaMensagem(mensagem){
	if(ultimas_mensagens.length > 5){
		ultimas_mensagens.shift();
	}

	ultimas_mensagens.push(mensagem);
}