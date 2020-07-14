const username = prompt("What is your username?");
// const socket = io("http://localhost:9000");
const socket = io("http://localhost:9000", {
  query: {
    username,
  },
}); // is the / namespace/endpoint

let nsSocket = "";

// listen for nsList, which is a list of all the namespaces
socket.on("nsList", (nsData) => {
  console.log("the list of namespaces");
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // Add a clicklistener for each namespace
  console.log(document.getElementsByClassName("namespace"));
  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (event) => {
        const nsEndpoint = element.getAttribute("ns");
        joinNs(nsEndpoint);
      });
    }
  );
  joinNs("/wiki");
});
