function joinRoom(roomName) {
  // send this roomName to the server
  nsSocket.emit("joinRoom", roomName, (newNumberofMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberofMembers} <span class="glyphicon glyphicon-user"></span
        >`;
  });
  // history, only resets if the server is reset
  nsSocket.on("historyCatchUp", (history) => {
    // console.log(history);
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight); // scroll to bottom
  });
  //update the room member total now that we have joined
  nsSocket.on("updateMembers", (numMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span
        >`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

  // searchbox
  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    console.log(e.target.value);
    let messages = Array.from(document.getElementsByClassName("message-text"));
    console.log(messages);
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
