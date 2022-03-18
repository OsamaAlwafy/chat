const express=require("express");
const { all } = require("express/lib/application");
const app=express();
const server=require('http').createServer(app);
const io=require("socket.io")(server,{cors:{origin:"*"}})
app.set('view engine','ejs');
app.use(express.static("public/css"));
app.use(express.static("public/js"));


app.get("/",(req,res)=>{
    res.render("home");
    //res.send("<h1>hello Coding Acadmey</h1>")
})

server.listen("3000");
console.log("server connected ");



var users = {}
var allUser={};

io.on('connection', (socket) => {
  console.log('👾 New socket connected! >>', socket.id)


  // handles new connection
  socket.on('new-connection', (data) => {
    // captures event when new clients join
    console.log(`new-connection event received`, data)
    
    // adds user to list
    //socket.broadcast.emit("")
    allUser[socket.id]=data.username;
    users[socket.id] = data.username
    console.log('users :>> ', users)
    console.log("all",allUser);
    // socket.broadcast.emit("users",allUser);
    socket.emit("users",allUser);
    // emit welcome message event
    socket.emit('welcome-message', {
      user: 'server',
      message: `Welcome to chat ${data.username}. There are ${
        Object.keys(users).length
      } users connected`,
    })
  })

  socket.on('join', (userx) => {
    console.log(`👾 join from ${userx.username}`)
    // broadcast message to all sockets except the one that triggered the event
    socket.broadcast.emit('broadcast-message', {
      user: userx.username,
      message:"join to chating",
    })
  })

  socket.on("disjoin",(data)=>{
    console.log("disjoin "+data);
    //userAll.remove(data.userId);
    userdelete=allUser[data.userID];
    delete allUser[data.userID];
  
    socket.broadcast.emit("concel",{
    user:userdelete,
      users:allUser,
    message:"leave the chat"
    }
     );

  })


  // handles message posted by client
  socket.on('new-message', (data) => {
    console.log(`👾 new-message from ${data.user}`)
    // broadcast message to all sockets except the one that triggered the event
    socket.broadcast.emit('broadcast-message', {
      user: users[data.user],
      message: data.message,
    })
  })
})








// io.on("connection",(s)=>{

// console.log("user connected sucessful with socket id : "+s.id);

// s.on("message",(msg)=>{
//     console.log("from user : "+msg);

//     s.broadcast.emit("message",msg);
// });



// });