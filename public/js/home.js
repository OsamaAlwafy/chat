console.log('chat.js file loaded!')

// IMPORTANT! By default, socket.io() connects to the host that
// served the page, so we dont have to pass the server url
var socket=io.connect() ;

document.getElementById("join").addEventListener("click",(e)=>{
  

//prompt to ask user's name
const username = prompt('Welcome! Please enter your name:')

// emit event to server with the user's name
socket.emit('new-connection', { username })
socket.emit('join',{username});

// captures welcome-message event from the server
socket.on('welcome-message', (data) => {
  console.log('received welcome-message >>', data)
  addMessage(data, false)
})

})



// receives two params, the message and if it was sent by yourself
// so we can style them differently
function addMessage(data, isSelf = false) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
  
    if (isSelf) {
      messageElement.classList.add('self-message')
      messageElement.innerText = `${data.message}`
    } else {
      if (data.user === 'server') {
        // message is from the server, like a notification of new user connected
        // messageElement.classList.add('others-message')
        messageElement.innerText = `${data.message}`
      } else {
        // message is from other user
        messageElement.classList.add('others-message')
        messageElement.innerText = `${data.user}: ${data.message}`
      }
    }
    // get chatContainer element from our html page
    const chatContainer = document.getElementById('chatContainer')
  
    // adds the new div to the message container div
    chatContainer.append(messageElement)
  }

  const messageForm = document.getElementById('messageForm')

messageForm.addEventListener('submit', (e) => {
  // avoids submit the form and refresh the page
  e.preventDefault()

  const messageInput = document.getElementById('messageInput')

  // check if there is a message in the input
  if (messageInput.value !== '') {
    let newMessage = messageInput.value
    //sends message and our id to socket server
    socket.emit('new-message', { user: socket.id, message: newMessage })
    // appends message in chat container, with isSelf flag true
    addMessage({ message: newMessage }, true)
    //resets input
    messageInput.value = ''
  } else {
    // adds error styling to input
    messageInput.classList.add('error')
  }
})

socket.on('broadcast-message', (data) => {
  console.log('📢 broadcast-message event >> ', data)
  // appends message in chat container, with isSelf flag false
  addMessage(data, false)
})

var list=document.getElementById("list");
socket.on("users",(allUser)=>{
    console.log("users  in list "+allUser);
    removeList();
    for(key in allUser)
    {
    console.log((key + ' = ' + allUser[key] + '\n'));
    var li="<li> " + allUser[key] +" </li>";
    list.innerHTML +=li;
    }
});
var disjoin=document.getElementById("disjoin");
disjoin.addEventListener("click",()=>{

  socket.emit("disjoin",{userID:socket.id});
})
socket.on("concel",(allUser)=>{
  removeList();
  addMessage(allUser);
  var li=document.getElementsByName("li");
  for(var i=0 ;i<li.length;i++)
  li[i].remove();
  console.log("users  in "+allUser.users);
  for(key in allUser.users)
  {
  console.log((key + ' = ' + allUser[key] + '\n'));
  var li="<li> " + allUser[key] +" </li>";
  list.innerHTML +=li;
  }
});
function removeList(){
  var li=document.getElementsByName("li");
  for(var i=0 ;i<li.length;i++)
  li[i].remove();
}


















// const appSocket=io("http://localhost:3000");
// appSocket.on("connection",()=>{

// });
// var btn=document.getElementById("sendBtn");
// var msgTXT=document.getElementById("messageInput");
// var chatDiv=document.getElementById("chatContainer");
// btn.addEventListener('click',sendToServer);

// appSocket.on("message",(serverMessage)=>{
//     chatDiv.innerHTML+=("<p style='background-color:#ccc;color:black'>"+serverMessage+"</p>");
//     //alert(serverMessage);
// });


// function sendToServer(){
//     chatDiv.innerHTML+=("<p style='background-color:blue;color:white'>"+msgTXT.value+"</p>");
   
//    // alert(msgTXT.value);
//     appSocket.emit("message",msgTXT.value);
//     msgTXT.value="";

  

// }
