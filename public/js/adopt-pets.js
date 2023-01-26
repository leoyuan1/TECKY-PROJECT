async function init() {

    let selectedAnimalID = 0;

    // query selectors for loading page
    const pet_list = document.querySelector('#pet-list');
    const animal_list = document.querySelector('#animal-list');
    const species_list = document.querySelector('#species-list');

    await adoptPets_loadPets();
    await adoptPets_loadAnimals();
    await adoptPets_loadSpecies();

    // query selectors after loading page
    // const headerSelectorExpander = document.querySelector('#header-selector-expender');
    const animalElems = document.querySelectorAll('#animal-list .filter > a');

    // add event listeners
    // headerSelectorExpander.addEventListener('click', expandSelector);
    for (let animalElem of animalElems) {
        animalElem.addEventListener('click', filterPetsByAnimal);
    }

    // for headerSelectorExpander
    // function expandSelector() {
    //     if ($('#header-selector').hasClass('collapse')) {
    //         $('#header-selector').removeClass('collapse');
    //         $('#expender-arrow').removeClass('arrow-down');
    //         $('#expender-arrow').addClass('arrow-up');
    //     } else {
    //         $('#header-selector').addClass('collapse');
    //         $('#expender-arrow').removeClass('arrow-up');
    //         $('#expender-arrow').addClass('arrow-down');
    //     }
    // }

    function monthDiff(d1, d2) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    function showPetList(pets) {
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
            if (pet.post_species_id) {
                htmlString += `<div>品種: ${pet.post_species_id}</div>`;
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
        if (animalID == 'all') {
            await adoptPets_loadPets();
            return;
        }
        animalID = parseInt(animalID);
        selectedAnimalID = animalID;

        const res = await fetch(`/pets/all-pets?pet_type_id=${animalID}`);
        const result = await res.json();
        const pets = result.data;

        // refresh pet-list
        showPetList(pets);

        // change species panel
        await adoptPets_loadSpecies();

        // set species query selector and event listener
        const speciesElem = document.querySelector('#species-list > select');
        speciesElem.addEventListener('change', filterPetsBySpecies);

    }

    function filterPetsBySpecies(event) {
        // console.log(event.target);
        console.log(event.target.value);
    }

    async function adoptPets_loadPets() {

        const res = await fetch('/pets/all-pets');
        const result = await res.json();
        const pets = result.data;

        // refresh pet-list
        showPetList(pets);

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

        if (selectedAnimalID == 0) {
            species_list.innerHTML = `
                <select class="filter" name="selectThis" id="selectThis">
                    <option value="">選擇品種</option>
                </select>`
            return;
        }

        const res = await fetch(`/pets/pet-type-id/${selectedAnimalID}/species`);
        const result = await res.json();
        const species = result.data;

        // clear the list
        species_list.innerHTML = ""

        // prepare html
        let htmlString = `
            <select class="filter" name="selectThis" id="selectThis">
                <option value="">選擇品種</option>
                <option value=".species-all">所有品種</option>`;

        for (let specie of species) {
            const id = specie.species_id;
            const species_name = specie.species_name;
            htmlString += `
                <option value=".species-${id}">${species_name}</option>`
        }

        htmlString += "</select>"

        // insert html
        species_list.innerHTML = htmlString;

    }

}

init();