async function init() {

    let selected = {
        pet_type_id: null,
        species_id: null,
        pet_gender: null
    }

    // query selectors
    const pet_list = document.querySelector('#pet-list');
    const animal_list = document.querySelector('#animal-list');
    const species_list = document.querySelector('#species-list');
    const gender_list = document.querySelector('#gender-list');

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

    function monthDiff(d1, d2) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    function setSpeciesListener() {
        const speciesElem = document.querySelector('#species-list > select');
        speciesElem.addEventListener('change', filterPetsBySpecies);
    }

    function showPetPreview(pets) {
        // clear the list
        pet_list.innerHTML = ""

        // add pets
        for (let i = 1; i <= pets.length; i++) {

            const pet = pets[i - 1];

            // add birthday
            let years = 0;
            let months = 0;
            if (pet.pet_birthday) {
                const now = new Date();
                const birthday = new Date(pet.pet_birthday);
                months = monthDiff(birthday, now);
                if (months > 11) {
                    years = Maths.floor(months / 12);
                    months %= 12;
                }
            }

            // prepare html
            let htmlString = `
                <li class="pet-preview mix" style="display: inline-block;">
                    <img src="/uploads/pet-img/cat.jpg" alt="Image ${i}">
                    <div>編號: ${pet.post_id}</div>
                    <div>名稱: ${pet.pet_name}</div>`
            if (pet.post_pet_type_id) {
                htmlString += `<div>物種: ${pet.pet_type_name}</div>`;
            } else {
                htmlString += '<div>物種: 不知道</div>';
            }
            if (pet.post_species_id) {
                htmlString += `<div>品種: ${pet.species_name}</div>`;
            } else {
                htmlString += '<div>品種: 不知道</div>';
            }
            if (pet.pet_birthday) {
                if (years !== 0) {
                    htmlString += `<div>年齡: ${years}歲 ${months}月</div>`;
                } else if (months !== 0) {
                    htmlString += `<div>年齡: ${months}月</div>`;
                }
            } else {
                htmlString += '<div>年齡: 不知道</div>';
            }
            if (pet.pet_gender) {
                htmlString += `<div>性別: ${pet.pet_gender}</div>`;
            } else {
                htmlString += '<div>性別: 不知道</div>';
            }
            htmlString += "</li>";

            pet_list.innerHTML += htmlString;

        }

        pet_list.innerHTML += `
            <li class="gap"></li>
            <li class="gap"></li>
            <li class="gap"></li>`

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
            selected.pet_gender = null;
        } else {
            selected.pet_gender = gender;
        }

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
        showPetPreview(pets);

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
            const id = animal.pet_type_id;
            const type_name = animal.pet_type_name;
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
                    <option value="">選擇品種</option>
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
                <option value="">選擇品種</option>
                <option value="species-all">所有品種</option>`;

        for (let specie of species) {
            const id = specie.species_id;
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