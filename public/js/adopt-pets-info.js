import { birthdayToYearAndMonthOld } from './adopt-pets-util.js';

const postID = document.URL.split('?')[1].replace('id=', "");

async function getPet() {

    const res = await fetch(`/pets/all-pets?id=${postID}`);
    const result = await res.json();
    return result.data[0];

}
async function getMedia() {
    const res = await fetch(`/pets/one-pet/${postID}/media`);
    const result = await res.json();
    return result.data;
}

async function init() {
    let pet = await getPet();
    const media = await getMedia();
    console.log('media = ', media);

    console.log(pet);

    // prepare updated date format
    const createdAt = pet.created_at.split('T')[0];
    document.querySelector('#updated_at').textContent = createdAt;

    document.querySelector('#pet_name').textContent = pet.pet_name;
    document.querySelector('#type_name').textContent = pet.type_name;

    if (pet.species_id) {
        document.querySelector('#species_name').textContent = pet.species_name;
    } else {
        document.querySelector('#species_name').textContent = '不知道';
    }

    if (pet.gender) {
        document.querySelector('#gender').textContent = pet.gender;
    } else {
        document.querySelector('#gender').textContent = '不知道';
    }

    if (pet.birthday) {
        const old = birthdayToYearAndMonthOld(pet.birthday);
        document.querySelector('#year').textContent = old.years;
        document.querySelector('#year_name').textContent = '歲';
        document.querySelector('#month').textContent = old.months;
        document.querySelector('#month_name').textContent = '月';
    } else {
        document.querySelector('#year').textContent = '?';
        document.querySelector('#month').textContent = '?';
    }

    const featureElem = document.querySelector('#features');
    featureElem.innerHTML = "";

    let hasFeature = false;
    if (pet.pet_fine_with_children) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與小孩子相處</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_fine_with_cat) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與貓咪相處</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_fine_with_dog) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與狗狗相處</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_need_outing) {
        featureElem.innerHTML += `<span class="adoption-details-info">每天要出外散步</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_know_hygiene) {
        featureElem.innerHTML += `<span class="adoption-details-info">懂得指定地方大小便</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_know_instruc) {
        featureElem.innerHTML += `<span class="adoption-details-info">懂得聽簡單指令</span><br>`;
        hasFeature = true;
    }
    if (pet.pet_neutered) {
        featureElem.innerHTML += `<span class="adoption-details-info">已絕育</span><br>`;
        hasFeature = true;
    }
    if (!hasFeature) {
        featureElem.innerHTML = `<span class="adoption-details-info">無</span><br>`;
    }

    if (pet.pet_description) {
        document.querySelector('#pet_description').textContent = pet.pet_description;
    } else {
        document.querySelector('#pet_description').textContent = '沒有';
    }

    if (media.length > 0) {
        for (let i = 0; i < media.length; i++) {
            if (media[i].media_type === "image") {
                document.querySelector(`#image_${i}`).src = `/pet-img/${media[i].file_name}`;
            }
            if (media[i].media_type === "video") {
                document.querySelector('#pet_video').src = `/pet-img/${media[i].file_name}`;
            }
        }
    }

}

init();

document.querySelector('.form-submit-button').addEventListener('click', async () => {
    let post = await getPet()
    let postIDResult = post.id
    if (post.status == "adopted") {
        Swal.fire('已被領養');
        return
    }
    let res = await fetch(`/pets/request`, {
        method: 'post',
        body: JSON.stringify({ postIDResult }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    // send msg to owner
    await fetch(`msgs/to-user-id/${post.user_id}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `自動訊息: 已申請領養你的"${post.pet_name}" 請到寵物列表確認` })
    })

    let result = await res.json()
    if (result.message == 'request fail') {
        Swal.fire('自己post都申請?');
        return
    }
    if (result.message == 'requested') {
        Swal.fire('已申請');
        return
    }
    if (result.message == 'request info') {
        Swal.fire('申請成功');
    } else {
        Swal.fire('請先登入');
    }
})

// document.querySelector('#request-usertable').innerHTML +=
//     `<tr>
//     <td class="name-col">${postData.pet_name}</td>
//     <td class="add-date-col">${requestResult.updated_at}</td>
//     <td class="status-col"></td>
//     <td class="buttons-col">接受/拒絕</td>
// </tr>`