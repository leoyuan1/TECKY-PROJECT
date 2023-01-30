async function init() {

  // find user's ID
  const userID = await getUserID();
  console.log(`User id: ${userID} has opened msg box.`);

  //  await loadMsgs();

  // query selectors
  const writeElem = document.querySelector('.write');
  const people = document.querySelector('.people');

  //event listeners
  writeElem.addEventListener('change', sendMsg);

  // socket.io section
  const socket = io.connect("localhost:8080");
  socket.on("msg-sent", (data) => {
    console.log('testing socket...');
    console.log('data = ', data);
  });

  async function loadMsgs() { // in progress

    const res = await fetch('/msgs/people');

  }

  async function getUserID() {
    const res = await fetch('/user-id');
    const id = (await res.json()).data;
    return id;
  }

  async function sendMsg() {

    const msgWritten = document.querySelector('.write > input')

    const fetchDetails = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: msgWritten.value
      })
    }

    const toID = 2;

    const res = await fetch(`/msgs/to-user-id/${toID}`, fetchDetails);
    const result = await res.json();

    console.log('result = ', result.message);

    msgWritten.value = "";

  }

}

init();

/*********************************/
/*** codes from library starts ***/
/*********************************/
document.querySelector('.chat[data-chat=person2]').classList.add('active-chat')
document.querySelector('.person[data-chat=person2]').classList.add('active')

let friends = {
  list: document.querySelector('ul.people'),
  all: document.querySelectorAll('.left .person'),
  name: ''
},
  chat = {
    container: document.querySelector('.container .right'),
    current: null,
    person: null,
    name: document.querySelector('.container .right .top .name')
  }

friends.all.forEach(f => {
  f.addEventListener('mousedown', () => {
    f.classList.contains('active') || setAciveChat(f)
  })
});

function setAciveChat(f) {
  friends.list.querySelector('.active').classList.remove('active')
  f.classList.add('active')
  chat.current = chat.container.querySelector('.active-chat')
  chat.person = f.getAttribute('data-chat')
  chat.current.classList.remove('active-chat')
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat')
  friends.name = f.querySelector('.name').innerText
  chat.name.innerHTML = friends.name
}
/*******************************/
/*** codes from library ends ***/
/*******************************/