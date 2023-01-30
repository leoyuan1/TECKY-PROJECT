async function init() {

  // find user's ID
  const userIDx = await fetch('/user-id');
  console.log(userIDx);

  //  await loadMsgs();

  const writeElem = document.querySelector('.write');

  writeElem.addEventListener('change', async () => {

    const msgWritten = document.querySelector('.write > input')
    console.log(`user is writing...\n${msgWritten.value}`);

    const userID = 1;
    const fetchDetails = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: msgWritten.value
      })
    }
    const res = await fetch(`/msgs/user-id/${userID}`, fetchDetails);

    console.log('res = ', res);
    console.log('res.ok = ', res.ok);

    msgWritten.value = "";

  })

  const socket = io.connect("localhost:8080");
  socket.on("msg-sent", (data) => {
    console.log('testing socket...');
    console.log('data = ', data);
  });

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