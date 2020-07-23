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

  // server sending message to clients
  nsSocket.on("messageToClients", (msg) => {
    // console.log(msg);
    const newMsg = buildHTML(msg);
    document.getElementById("messages").innerHTML += newMsg;
  }); // if message comes from server

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission); // listener for form, so if user sends a message will go to server
}

// f

function formSubmission(event) {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target));
  const newMessage = formData.text;
  const newFile = formData.file;
  // console.log(newFile);
  let filePassed = false;

  if (newFile.size !== 0) {
    filePassed = true;

    var reader = new FileReader();
    reader.onload = function (event) {
      const filemsg = {};
      filemsg.file = event.target.result;
      filemsg.fileName = newFile.name;
      filemsg.test = "Hello";
      console.log(filemsg.fileName);
      nsSocket.emit("newMessageToServer", { file: filemsg });
    };
    reader.readAsDataURL(newFile);
  }
  // if (newMessage.length > 0 && filePassed === true) {
  //   nsSocket.emit("newMessageToServer", { text: newMessage, file: newFile });
  // } else if (newMessage.length > 0) {
  //   nsSocket.emit("newMessageToServer", { text: newMessage });
  // } else if (filePassed === true) {
  //   nsSocket.emit("newMessageToServer", { file: newFile });
  // }
  nsSocket.emit("newMessageToServer", { text: newMessage });
  console.log("filepassed: " + filePassed);
  event.target.reset();
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `<li>
            <div class="user-image">
              <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
              <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
              <div class="message-text">${msg.text}</div>
              <img src=${msg.file} alt="" />
            </div>
          </li>`;

  return newHTML;
}
