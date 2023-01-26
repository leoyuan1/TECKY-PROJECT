async function init() {

    let selectedAnimal;

    // query selectors for loading page
    const pet_list = document.querySelector('#pet-list');
    const animal_list = document.querySelector('#animal-list');

    await adoptPets_loadPets();
    await adoptPets_loadAnimals();

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

        const res = await fetch(`/pets/all-pets/by-pet-type/${animalID}`);
        const result = await res.json();
        const pets = result.data;

        showPetList(pets);

    }

    async function adoptPets_loadPets() {

        const res = await fetch('/pets/all-pets');
        const result = await res.json();
        const pets = result.data;

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
            const id = animal.pet_type_id
            const type = animal.pet_type_name
            htmlString += `
            <li class="filter" data-filter=".animal-${id}">
            <a href="#0" data-type="animal-${id}" id="animal-${id}">${type}</a>
            </li>`
        }

        animal_list.innerHTML = htmlString;

    }

}

init();