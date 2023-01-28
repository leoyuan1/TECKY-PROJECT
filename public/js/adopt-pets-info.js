import { birthdayToYearAndMonthOld } from './adopt-pets-util.js';

async function init() {

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

    const pet = await getPet();
    const media = await getMedia();
    console.log('media = ', media);

    console.log(pet);

    document.querySelector('#updated_at').textContent = pet.updated_at;
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
        document.querySelector('#month').textContent = old.months;
    } else {
        document.querySelector('#year').textContent = '?';
        document.querySelector('#month').textContent = '?';
    }

    const featureElem = document.querySelector('#features');
    featureElem.innerHTML = "";
    if (pet.pet_fine_with_children) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與小孩子相處</span><br>`;
    } else if (pet.pet_fine_with_cat) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與貓咪相處</span><br>`;
    } else if (pet.pet_fine_with_dog) {
        featureElem.innerHTML += `<span class="adoption-details-info">可與狗狗相處</span><br>`;
    } else if (pet.pet_need_outing) {
        featureElem.innerHTML += `<span class="adoption-details-info">每天要出外散步</span><br>`;
    } else if (pet.pet_know_hygiene) {
        featureElem.innerHTML += `<span class="adoption-details-info">懂得指定地方大小便</span><br>`;
    } else if (pet.pet_know_instruc) {
        featureElem.innerHTML += `<span class="adoption-details-info">懂得聽簡單指令</span><br>`;
    } else if (pet.pet_neutered) {
        featureElem.innerHTML += `<span class="adoption-details-info">已絕育</span><br>`;
    } else {
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