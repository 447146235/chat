var express=require('express');
var app=express();

//公式

var http =require('http').Server(app);
var io =require('socket.io')(http);

var session =require('express-session');
app.use(session({
	secret:'keyboard cat',
	resave:false,
	saveUninitialized:true
}));
app.set("view engine","ejs");
app.use(express.static('./public'));

var alluser=[];
app.get("/",function(req,res,next){
	res.render("index");
})

app.get("/check",function(req,res,next){
	console.log(req.query.username);
	var username =req.query.username;
	if(!username){
		res.send("必须填写用户名");
		return;
	}
	if(alluser.indexOf(username)!=-1){
		res.send("用户名已经被占用");
	}
	alluser.push(username);
	//写入session
	req.session.username=username;
	res.redirect("/chat");
});

app.get("/chat",function(req,res,next){
	
	if(!req.session.username){
		res.redirect("/");
		return;
	}
	
	res.render("chat",{
		"username":req.session.username
	});
});
io.on("connection",function(socket){
	socket.on("chat",function(msg){
		console.log(msg);
		io.emit("chat",msg);
	});
}); 
http.listen(3001,"14.20.200.107");