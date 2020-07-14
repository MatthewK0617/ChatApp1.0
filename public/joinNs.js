function joinNs(endpoint) {
  if (nsSocket) {
    // check to see if this actually is a socket
    nsSocket.close();
    // remove event listener before it is added again
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }
  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
        // console.log(glyph);
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`; // not working
    });
    // add a click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((element) => {
      element.addEventListener("click", (e) => {
        // console.log("someone clicked on", e.target.innerText);
        joinRoom(e.target.innerText);
      });
    });
    // add room automatically... first time here

    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    // console.log(topRoomName);
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    const newMsg = buildHTML(msg);
    document.getElementById("messages").innerHTML += newMsg;
  }); // if message comes from server

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission); // listener for form, so if user sends a message will go to server
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.getElementById("user-message").value;
  nsSocket.emit("newMessageToServer", { text: newMessage });
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
    <li>
            <div class="user-image">
              <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
              <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
              <div class="message-text">${msg.text}</div>
            </div>
          </li>`;

  return newHTML;
}
