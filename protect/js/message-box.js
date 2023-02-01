async function init() {

  // find user's ID
  const myID = await getUserID();
  let toID = 0;

  // socket.io section
  const socket = io.connect("localhost:8080");

  // socket.on("reload-people", (data) => {
  //   const people = data.data;
  //   console.log("people = ", people);
  //   showPeople(people);
  // });

  socket.on("receive-msg", async (data) => {
    console.log('received data: ', data);
    const msg = data.data;
    console.log('toID = ', toID);
    console.log('msg.to_id = ', msg.to_id);
    if (msg.to_id == myID) {
      await loadPeople();
      if (msg.from_id != toID) { return }
      listSingleMsg(msg);
      // scroll to bottom
      // console.log(document.querySelector('.chat'));
      // console.log('scrollHeight = ', document.querySelector('.chat').scrollHeight);
      document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;
    }
  });

  // query selectors
  const writeElem = document.querySelector('.write');
  const peopleListElem = document.querySelector('.people');

  await loadPeople();
  //  await loadMsgs();

  //event listeners
  writeElem.addEventListener('submit', sendMsg);

  function minsDiff(date_1, date_2) {
    let difference = date_1.getTime() - date_2.getTime();
    let totalMins = Math.ceil(difference / (1000 * 60));
    return totalMins;
  }

  function showPeople(people) {

    peopleListElem.innerHTML = '';
    for (let person of people) {
      console.log(person.last_date);
      const date = person.last_date.split('T')[0];
      const time = person.last_date.split('T')[1].split('.')[0];
      const image = person.icon ? person.icon : "default_profile_image.png";
      const fromIcon = person.from_id === myID ? '<<' : '>>';
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

        if (!isSendingMsg) {
          // using library for chatroom's style
          // console.log('person: ', personElem.id);
          // console.log(document.querySelector(`.chat`));
          document.querySelector(`.chat[data-chat=${personElem.id}`).classList.add('active-chat');
          document.querySelector(`.person[data-chat=${personElem.id}]`).classList.add('active');
          libraryFunction();
        }

        // scroll to bottom
        // console.log(document.querySelector('.chat'));
        // console.log('scrollHeight = ', document.querySelector('.chat').scrollHeight);
        document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;

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
      if (msg.from_id == toID) { bubbleTarget = 'you' }
      const msgTime = new Date(msg.created_at);
      if (minsDiff(msgTime, lastDate) > 5) {
        lastDate = new Date(msg.created_at);
        chatElem.innerHTML += `
            <div class="conversation-start">
              <span>${msg.created_at}</span>
            </div>
          `;
      }
      chatElem.innerHTML += `
        <div class="bubble ${bubbleTarget}">
          ${emoji.replace_colons(msg.content)}
        </div>
      `;
    }

  }

  async function listSingleMsg(msg) {

    console.log('listing msg: ', msg);

    let bubbleTarget = 'me';
    // msg_to_id = parseInt(msg.to_id);
    if (msg.to_id == myID) { bubbleTarget = 'you' }

    const chatElem = document.querySelector('.chat');
    chatElem.innerHTML += `
      <div class="bubble ${bubbleTarget}">${emoji.replace_colons(msg.content)}</div>
    `;

  }

  async function getUserID() {
    const res = await fetch('user-id');
    const id = (await res.json()).data;
    return id;
  }

  async function loadPeople() {

    const res = await fetch('/msgs/people');
    const result = await res.json();
    const people = result.data;
    // console.log('result = ', result.message);

    showPeople(people);

  }

  async function sendMsg(event) {

    event.preventDefault();

    if (toID == 0) {
      Swal.fire('Please select a person to start conversation.');
      return;
    }

    const msgWritten = document.querySelector('.write > input');

    console.log('msgWritten = ', msgWritten);

    const msg = {
      content: msgWritten.value,
      to_id: toID
    }

    console.log('msg.content = ', msg.content);

    const fetchDetails = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: msg.content
      })
    }

    const res = await fetch(`/msgs/to-user-id/${toID}`, fetchDetails);
    const result = await res.json();
    console.log('result = ', result.message);

    if (result.message === 'msg sent') {

      // await loadPeople();
      listSingleMsg(result.data);
      await loadPeople();

      // empty the input bar
      msgWritten.value = '';

      // scroll to bottom
      // console.log(document.querySelector('.chat'));
      // console.log('scrollHeight = ', document.querySelector('.chat').scrollHeight);
      document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;

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
    // console.log('chat.person = ', chat.person);
    // chat.container.querySelector(`[data-chat="${chat.person}"]`).classList.add('active-chat')
    friends.name = f.querySelector('.name').innerText
    chat.name.innerHTML = friends.name
  }

  /*******************************/
  /*** codes from library ends ***/
  /*******************************/

}
/*******************************/
/*** codes from library ends ***/
/*******************************/

let emojiLogo = document.querySelector('.emoji-picker')
let counter = false
document.querySelector('.write-link.smiley').addEventListener('click', () => {
  if (!counter) {
    counter = true
    emojiLogo.style.display = 'block'
  } else if (counter) {
    counter = false
    emojiLogo.style.display = 'none'
  }
})


document.querySelector('.message-box-container').addEventListener('click', (e) => {

  // console.log(e.target.getAttribute('class'));
  if (e.target.getAttribute('class') != "write-link smiley") {
    emojiLogo.style.display = 'none'
    counter = false
  }
})


const emoji = new EmojiConvertor();

let emojiElms = document.querySelectorAll('.em')

for (let emojiElm of emojiElms) {
  emojiElm.addEventListener('click', (e) => {
    document.querySelector('.message-input').value += `<i class="${e.srcElement.getAttribute('class')}"></i>`
  })
}


let input = document.querySelector('.message-input')
const emojiList = [':smile:', ':laughing:', ':blush:', ':smiley:',
  ':smirk:', ':heart_eyes:', ':kissing_heart:', ':kissing_closed_eyes:', ':flushed:',
  ':relieved:', ':satisfied:', ':grin:', ':wink:', ':stuck_out_tongue_winking_eye:', ':stuck_out_tongue_closed_eyes:',
  ':grinning:', ':kissing:', ':kissing_smiling_eyes:', ':stuck_out_tongue:', ':sleeping:', ':worried:',
  ':frowning:', ':anguished:', ':open_mouth:', ':grimacing:', ':confused:', ':hushed:', ':expressionless:',
  ':unamused:', ':sweat_smile:', ':sweat:', ':disappointed_relieved:', ':weary:', ':pensive:', ':disappointed:',
  ':confounded:', ':fearful:', ':cold_sweat:', ':persevere:', ':cry:', ':sob:',
  ':joy:', ':astonished:', ':scream:', ':tired_face:', ':angry:', ':rage:', ':triumph:', ':sleepy:',
  ':yum:', ':mask:', ':sunglasses:', ':dizzy_face:', ':imp:', ':smiling_imp:',
  ':neutral_face:', ':no_mouth:', ':innocent:', ':heart:'
]
let emojiListDiv = document.querySelector('.smiley-list')
for (let icon of emojiList) {
  let div = document.createElement('a')
  div.innerHTML = emoji.replace_colons(icon)
  div.addEventListener('click', () => {
    input.value += emoji.replace_colons(icon)
  })
  emojiListDiv.appendChild(div)
}

emoji.replace_mode = 'unified';
emoji.allow_native = true;

init();
// libraryFunction();
