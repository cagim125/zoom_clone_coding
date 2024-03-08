const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form")
const room = document.getElementById("room");



room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);

}

function handleMessageSubmit(event) {
    // 이벤트 기본 동작을 중단시킴 (폼이 서버로 전송되지 않도록 함)
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    // 이벤트 기본 동작을 중단시킴 (폼이 서버로 전송되지 않도록 함)
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
    
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}


function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    roomName = input.value;
    socket.emit("enter_room", roomName, showRoom);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived`);
})

socket.on("bye", (left) => {
    addMessage(`${left} left ㅜㅜ`);
})

socket.on("new_message", addMessage);







 




















/* const messageList = document.querySelector("ul");  
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = {type, payload}
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server 🤞");
}
socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close", () => {
    console.log("Disconnected to Server 😂");
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNicSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNicSubmit); */