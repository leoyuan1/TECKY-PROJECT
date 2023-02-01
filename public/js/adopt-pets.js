import { birthdayToYearAndMonthOld } from "./adopt-pets-util.js";

async function init() {

    const defaultImage = 'unknown_animal.jpg';

    let selected = {
        pet_type_id: null,
        species_id: null,
        gender: null,
        pet_fine_with_children: false,
        pet_fine_with_cat: false,
        pet_fine_with_dog: false,
        pet_need_outing: false,
        pet_know_hygiene: false,
        pet_know_instruc: false,
        pet_neutered: false
    }

    // query selectors
    const pet_list = document.querySelector('#pet-list');
    const animal_list = document.querySelector('#animal-list');
    const species_list = document.querySelector('#species-list');
    const gender_list = document.querySelector('#gender-list');
    const featureElems = document.querySelectorAll('#feature-list > li > input');

    await adoptPets_loadPets();
    await adoptPets_loadAnimals();
    await adoptPets_loadSpecies();

    // query selectors after loading animal-list
    const animalElems = document.querySelectorAll('#animal-list .filter > a');

    // add event listeners
    for (let animalElem of animalElems) {
        animalElem.addEventListener('click', filterPetsByAnimal);
    }
    gender_list.addEventListener('change', filterPetsByGender);
    for (let featureElem of featureElems) {
        featureElem.addEventListener('click', filterPetsByFeatures)
    }

    function setSpeciesListener() {
        const speciesElem = document.querySelector('#species-list > select');
        speciesElem.addEventListener('change', filterPetsBySpecies);
    }

    async function showPetPreview(pets) {
        // clear the list
        pet_list.innerHTML = ""

        if (pets.length === 0) {
            pet_list.innerHTML = `<div class="not-found">沒有找到結果~TAT</div>`;
        }

        // loop pets
        for (let i = 1; i <= pets.length; i++) {

            // load pet from array
            const pet = pets[i - 1];

            // if (pet.status === 'hidden') { continue }

            // prepare media
            const post_id = pet.id;
            const media = await getMedia(post_id);
            let images = [];
            for (let eachMedia of media) {
                if (eachMedia.media_type === "image") {
                    images.push(eachMedia.file_name);
                }
            }

            // prepare birthday
            let years;
            let months;
            if (pet.birthday) {
                const old = birthdayToYearAndMonthOld(pet.birthday);
                years = old.years;
                months = old.months;
            }

            // prepare html
            let htmlString = `
                <a href="/adopt-pets-info.html?id=${post_id}">
                <li class="pet-preview mix" style="display: inline-block;" id="pet-${post_id}">`;
            if (images.length > 0) {
                htmlString += `<img src="/pet-img/${images[0]}" alt="Image ${i}" class="center">`;
            } else {
                htmlString += `<img src="/pet-img/${defaultImage}" alt="Image ${i}" class="center">`;
            }

            htmlString += `
                <div>編號: ${pet.id}</div>
                <div>名稱: ${pet.pet_name}</div>`;

            if (pet.species_id) {
                htmlString += `<div>品種: ${pet.species_name}</div>`;
            } else {
                htmlString += '<div>品種: 不知道</div>';
            }
            if (pet.birthday) {
                if (years !== 0) {
                    htmlString += `<div>年齡: ${years}歲 ${months}月</div>`;
                } else if (months !== 0) {
                    htmlString += `<div>年齡: ${months}月</div>`;
                }
            } else {
                htmlString += '<div>年齡: 不知道</div>';
            }
            if (pet.gender) {
                htmlString += `<div>性別: ${pet.gender}</div>`;
            } else {
                htmlString += '<div>性別: 不知道</div>';
            }
            if (pet.status == 'adopted') {
                htmlString += '<span class="adopted">已被領養</span>'
            }
            htmlString += "</li>";

            pet_list.innerHTML += htmlString;

        }

        pet_list.innerHTML += `
            <li class="gap"></li>
            <li class="gap"></li>
            <li class="gap"></li>
            </a>`

    }

    async function getMedia(post_id) {

        const res = await fetch(`/pets/one-pet/${post_id}/media`);
        const result = await res.json();
        const media = result.data;

        return media;

    }

    async function filterPetsByAnimal(event) {

        // get animal's ID
        let animalID = event.target.id;
        animalID = animalID.replace('animal-', '');
        if (animalID === 'all') {
            selected.pet_type_id = null;
        } else {
            animalID = parseInt(animalID);
            selected.pet_type_id = animalID;
        }

        await adoptPets_loadPets();

        // change species panel
        await adoptPets_loadSpecies();
        setSpeciesListener();

    }

    async function filterPetsBySpecies(event) {

        // get species' id
        let speciesID = event.target.value;
        speciesID = speciesID.replace('species-', '');
        if (speciesID === 'all') {
            selected.species_id = null;
        } else {
            speciesID = parseInt(speciesID);
            selected.species_id = speciesID;
        }

        await adoptPets_loadPets();

    }

    async function filterPetsByGender(event) {

        // get gender
        let gender = event.target.id;
        gender = gender.replace('gender-', '');
        if (gender === 'all') {
            selected.gender = null;
        } else {
            selected.gender = gender;
        }

        await adoptPets_loadPets();

    }

    async function filterPetsByFeatures(event) {

        const feature = event.target.id;
        selected[feature] = !selected[feature];

        await adoptPets_loadPets();

    }

    async function adoptPets_loadPets() {

        let fetchString = "/pets/all-pets";
        console.log("selected = ", selected);

        // check if there are any filters selected
        let queryAdded = 0;
        for (let selectedKey in selected) {
            if (selected[selectedKey]) {
                if (queryAdded === 0) {
                    fetchString += '?';
                }
                if (queryAdded > 0) {
                    fetchString += '&';
                }
                fetchString += `${selectedKey}=${selected[selectedKey]}`;
                queryAdded++;
            }
        }

        console.log(fetchString);

        const res = await fetch(fetchString);
        const result = await res.json();
        const pets = result.data;

        // refresh pet-list
        await showPetPreview(pets);

        // set pet-preview listeners
        // setPetPreviewListener();

    }

    async function adoptPets_loadAnimals() {

        const res = await fetch('/pets/pet-types');
        const result = await res.json();
        const animals = result.data;

        // clear the list
        animal_list.innerHTML = ""

        // prepare html
        let htmlString = `
            <li class="placeholder">
                <a data-type="all" href="#0">All</a> <!-- selected option on mobile -->
            </li>
            <li class="filter"><a class="selected" href="#0" data-type="all" id="animal-all">所有</a></li>`

        for (let animal of animals) {
            const id = animal.id;
            const type_name = animal.type_name;
            htmlString += `
            <li class="filter" data-filter=".animal-${id}">
            <a href="#0" data-type="animal-${id}" id="animal-${id}">${type_name}</a>
            </li>`
        }

        // insert html
        animal_list.innerHTML = htmlString;

    }

    async function adoptPets_loadSpecies() {

        if (!selected.pet_type_id) {  // if animal has not been selected, then do the following
            species_list.innerHTML = `
                <select class="filter" name="selectThis" id="selectThis">
                    <option value="species-all">所有品種</option>
                </select>`
            return;
        }

        const res = await fetch(`/pets/pet-type-id/${selected.pet_type_id}/species`);
        const result = await res.json();
        const species = result.data;

        // clear the list
        species_list.innerHTML = ""

        // prepare html
        let htmlString = `
            <select class="filter" name="selectThis" id="selectThis">
                <option value="species-all">所有品種</option>`;

        for (let specie of species) {
            const id = specie.id;
            const species_name = specie.species_name;
            htmlString += `
                <option value="species-${id}">${species_name}</option>`
        }

        htmlString += "</select>"

        // insert html
        species_list.innerHTML = htmlString;

    }

}

init();
