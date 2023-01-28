import { birthdayToYearAndMonthOld } from './adopt-pets-util.js';

async function init() {

    const postID = document.URL.split('?')[1];

    async function getPet() {

        const res = await fetch(`/pets/all-pets?${postID}`);
        const result = await res.json();
        return result.data[0];

    }

    const pet = await getPet();

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

}

init();