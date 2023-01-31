async function init() {

  let toID = 0;

  // socket.io section
  const socket = io.connect("localhost:8080");

  socket.on("reload-people", (data) => {
    const people = data.data;
    console.log("loaded people = ", people);
    showPeople(people);
  });

  // find user's ID
  const userID = await getUserID();
  console.log(`User id: ${userID} has opened msg box.`);

  // query selectors
  const writeElem = document.querySelector('.write');
  const peopleListElem = document.querySelector('.people');

  await loadPeople();
  //  await loadMsgs();

  //event listeners
  writeElem.addEventListener('change', sendMsg);

  function daysDiff(date_1, date_2) {
    let difference = date_1.getTime() - date_2.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return totalDays;
  }

  function showPeople(people) {

    peopleListElem.innerHTML = '';
    for (let person of people) {
      const date = person.last_date.split('T')[0];
      const time = person.last_date.split('T')[1].split('.')[0];
      const image = person.icon ? person.icon : "default_profile_image.png";
      const fromIcon = person.from_id === userID ? '>>' : '<<';
      peopleListElem.innerHTML += `
        <li class="person" data-chat="person-${person.id}" id="person-${person.id}">
          <img src="/user-img/${image}" alt="" />
          <div class="name">${person.username}</div>
          <span class="date">${date}</span>
          <span class="time">${time}</span>
          <span class="preview">${fromIcon} ${person.last_message}</span>
        </li>
      `;
    }

    // setPeopleListener
    const peopleElems = document.querySelectorAll('.people > li');
    for (let peopleElem of peopleElems) {
      peopleElem.addEventListener('click', async (event) => {

        const personElem = event.currentTarget;
        toID = parseInt(personElem.id.replace('person-', ''));
        await listMsgs();

        // using library for chatroom's style
        console.log('person: ', personElem.id);
        console.log(document.querySelector(`.chat`));
        document.querySelector(`.chat[data-chat=${personElem.id}`).classList.add('active-chat');
        document.querySelector(`.person[data-chat=${personElem.id}]`).classList.add('active');
        libraryFunction();

      });
    }

  }

  async function listMsgs() {

    // const personElem = document.querySelector(`#person-${toID}`);

    // get to-user's name
    const res1 = await fetch(`msgs/username/${toID}`);
    const result1 = await res1.json();
    const toUsername = result1.data.username;

    // get all relevant msgs
    const res2 = await fetch(`msgs/to-user-id/${toID}`);
    const result2 = await res2.json();
    const msgs = result2.data;

    // process html
    const topElem = document.querySelector('#to-whom');
    const chatElem = document.querySelector('.chat')
    chatElem.setAttribute('data-chat', `person-${toID}`);
    topElem.innerHTML = `
        <span>To: <span class="name">${toUsername}</span></span>
      `;
    chatElem.innerHTML = '';
    let lastDate = new Date(0, 0, 0);
    for (let msg of msgs) {
      let bubbleTarget = 'me';
      console.log('from_id = ', msg.from_id);
      if (msg.from_id === toID) { bubbleTarget = 'you' }
      const msgTime = new Date(msg.created_at);
      if (daysDiff(msgTime, lastDate) >= 1) {
        lastDate = new Date(msg.created_at);
        chatElem.innerHTML += `
            <div class="conversation-start">
              <span>${msg.created_at}</span>
            </div>
          `;
      }
      chatElem.innerHTML += `
        <div class="bubble ${bubbleTarget}">
          ${msg.content}
        </div>
      `;
    }

  }

  async function getUserID() {
    const res = await fetch('user-id');
    const id = (await res.json()).data;
    return id;
  }

  async function loadPeople() {
    const res = await fetch('/msgs/people');
    const result = await res.json();
    console.log('result = ', result.message);
  }

  async function sendMsg() {

    if (toID === 0) {
      Swal.fire('Please select a person to start conversation.');
      return;
    }

    const msgWritten = document.querySelector('.write > input')

    const fetchDetails = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: msgWritten.value
      })
    }

    const res = await fetch(`/msgs/to-user-id/${toID}`, fetchDetails);
    const result = await res.json();

    console.log('result = ', result.message);
    if (result.message === 'msg sent') {
      msgWritten.value = "";
      await loadPeople();
      await listMsgs();
    }

  }

}

function libraryFunction() {

  /*********************************/
  /*** codes from library starts ***/
  /*********************************/

  // document.querySelector('.chat[data-chat=person]').classList.add('active-chat')
  // document.querySelector('.person[data-chat=person]').classList.add('active')

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
    console.log('chat.person = ', chat.person);
    // chat.container.querySelector(`[data-chat="${chat.person}"]`).classList.add('active-chat')
    friends.name = f.querySelector('.name').innerText
    chat.name.innerHTML = friends.name
  }

  /*******************************/
  /*** codes from library ends ***/
  /*******************************/

}

init();
// libraryFunction();
