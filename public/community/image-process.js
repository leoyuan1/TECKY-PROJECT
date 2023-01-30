async function fileToDataURL(file) {
    console.log(file);
    const reader = new FileReader();

    reader.onload = function (event) {
        const dataURL = event.target.value;
        console.log(dataURL);
        // Now dataURL is here.
    };
    reader.readAsDataURL(file);
}


function getObjectURL(file) {
    const objectURL = URL.createObjectURL(file);
    console.log(objectURL)
    return objectURL
}


document.querySelector('.btn-btn-link [type=file]').addEventListener('change', (e) => {

    console.log('file field changed');
    let image = e.target.files[0]
    let imageURL = getObjectURL(image)
    document.querySelector('#preview').src = imageURL
})

function showPreview(event) {
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);
        let preview = document.getElementById('#preview');
        preview.src = src;
        preview.style.display = "block";
    }
}

showPreview();