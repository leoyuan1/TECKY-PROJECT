async function init() {

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
  const peopleElem = document.querySelector('.people');

  await loadPeople();
  //  await loadMsgs();

  //event listeners
  writeElem.addEventListener('change', sendMsg);

  function showPeople(people) {
    peopleElem.innerHTML = '';
    for (let person of people) {
      const date = person.last_date.split('T')[0];
      const time = person.last_date.split('T')[1].split('.')[0];
      const image = person.icon ? person.icon : "default_profile_image.png";
      const fromIcon = person.from_id === userID ? '>>' : '<<';
      // peopleElem.innerHTML += `
      //   <li class="person" data-chat="person" id="people-${person.id}">
      //     <img src="/user-img/${image}" alt="" />
      //     <div class="name">${person.username}</div>
      //     <span class="date">${date}</span>
      //     <span class="time">${time}</span>
      //     <span class="preview">${fromIcon} ${person.last_message}</span>
      //   </li>
      // `;
    }
  }

  async function getUserID() {
    const res = await fetch('/user-id');
    const id = (await res.json()).data;
    return id;
  }

  async function loadPeople() {

    const res = await fetch('/msgs/people');
    const result = await res.json();
    console.log('result = ', result.message);

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

    const toID = 3;

    const res = await fetch(`/msgs/to-user-id/${toID}`, fetchDetails);
    const result = await res.json();

    console.log('result = ', result.message);
    if (result.message === 'msg sent') {
      msgWritten.value = "";
      await loadPeople();
    }

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

  console.log(e.target.getAttribute('class'));
  if (e.target.getAttribute('class') != "write-link smiley") {
    emojiLogo.style.display = 'none'
    counter = false
  }
})


var emoji = new EmojiConvertor();

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