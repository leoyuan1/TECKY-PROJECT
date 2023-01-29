async function init() {

    // query selectors
    const petTypeElem = document.querySelector('#input-adoption-pet-type');
    const speciesChoiceElem = document.querySelector('#input-adoption-species-choice');
    const speciesNameElem = document.querySelector('#input-adoption-species-name');
    const ageTypeElem = document.querySelector('#input-adoption-pet-age-type');
    const ageElem = document.querySelector('#input-adoption-pet-age');
    const imageInputElems = document.querySelectorAll('.input-adoption-pet-image');
    const postPetElem = document.querySelector('#add-adoption-pet-form');

    // event listeners
    petTypeElem.addEventListener('change', changeSpeciesChoice);
    speciesChoiceElem.addEventListener('change', showSpeciesNameInputBox);
    ageTypeElem.addEventListener('change', showAgeInputBox);
    for (let imageInputElem of imageInputElems) {
        imageInputElem.addEventListener('change', previewImage);
    }
    postPetElem.addEventListener('submit', postPets);

    // functions
    async function postPets_loadPetTypes() {
        const res = await fetch('/pets/pet-types');
        const petTypes = (await res.json()).data;

        petTypeElem.innerHTML = "<option value disabled selected hidden>--- 請選擇類別 ---</option>";
        // petTypeElem.innerHTML += `<option value="">不知道類別</option>`;
        for (let petType of petTypes) {
            petTypeElem.innerHTML += `<option value="${petType.id}">${petType.type_name}</option>`;
        }

    }

    async function changeSpeciesChoice() {
        const petTypeID = petTypeElem.value;
        if (petTypeID == '') {
            speciesChoiceElem.innerHTML = "<option value disabled selected hidden>--- 選擇品種 ---</option>";
            return;
        }

        const res = await fetch(`/pets/pet-type-id/${petTypeID}/species`);
        const species = (await res.json()).data;

        speciesChoiceElem.innerHTML = "<option value disabled selected hidden>--- 選擇品種 ---</option>";
        speciesChoiceElem.innerHTML += `<option value="">不知道品種</option>`;
        for (let each of species) {
            speciesChoiceElem.innerHTML += `<option value="${each.id}">${each.species_name}</option>`;
        }
        speciesChoiceElem.innerHTML += `<option value="define">自定義品種名稱</option>`;
        showSpeciesNameInputBox();
    }

    function showSpeciesNameInputBox() {
        const species = speciesChoiceElem.value;
        if (species == 'define') {
            speciesChoiceElem.style = "display:inline-block;width:34%;";
            speciesNameElem.style = "display:inline-block;width:65%;";
        } else {
            speciesChoiceElem.style = "display:inline-block;width:100%;";
            speciesNameElem.style = "display:none";
        }
    }

    function showAgeInputBox() {
        const ageType = ageTypeElem.value;
        if (ageType !== '') {
            ageTypeElem.style = "display:inline-block;width:34%;";
            ageElem.style = "display:inline-block;width:65%;";
        } else {
            ageTypeElem.style = "display:inline-block;width:100%;";
            ageElem.style = "display:none";
        }
    }

    function previewImage(event) {
        const file = event.target.files[0];
        const imageInputID = event.target.id.replace('input-image-', '');
        const previewElem = document.querySelector(`#preview-image-${imageInputID}`);
        if (file) {
            previewElem.src = URL.createObjectURL(file);
        } else {
            previewElem.src = "";
        }
    }

    async function postPets(event) {

        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const res = await fetch('/pets', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json();
        alert(data.message);

    }

    await postPets_loadPetTypes();

}

init();