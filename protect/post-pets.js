


// // from others
// function checkAdopted(adoptionItemNum, cid) {
//     var url = ($('#is-adopted-' + adoptionItemNum).is(':checked')) ? "catalog/controller/adoption/mark_adopted.php" : "catalog/controller/adoption/unmark_adopted.php";
//     $.post(url, {
//         adoption_item_id: adoptionItemNum,
//         customer_id: cid
//     });
// }

// // from others
// function confirmDeleteAdoptionItem(formNum) {
//     $("#notification .modal-title").html('確定');
//     $("#notification .modal-footer button").html('取消');
//     $("#notification .modal-footer button").attr('data-dismiss', 'modal');
//     $("#notification .modal-footer button").addClass('red-text')
//     $("#notification .modal-footer a").html('確定');
//     $("#notification .modal-footer a").attr('href', 'https://www.pethaven.com.hk/index.php?route=adoption/animal/delete&path=adoption&adoption_item_id=' + formNum);
//     $("#notification .modal-footer a").css('background-color', '#e52226')
//     $("#notification .modal-footer").show();
//     $("#notification").modal('show');
//     $("#notification .modal-body p").html('確定删除待領養資料?');
// }

async function postData() {
    let res = await fetch('/pets/posted-pets')
    let data = await res.json()
    if (data.message == 'no post') {
        return
    }
    let dataResults = data.postData
    for (let dataResult of dataResults) {
        if (dataResult.status == 'hidden') {
            document.querySelector('#post-table').innerHTML += `
            <tr>
                <td class="name-col">${dataResult.pet_name}</td>
                <td class="add-date-col">${dataResult.created_at}</td>
                <td class="status-col">${dataResult.status}</td>

                <td class="change-status-col"> 
                <label class="switch">
                <input type="checkbox">
                <span class="slider round" id="status-${dataResult.id}"></span>
                </label>
                </td>
            </tr>
                `
        } else {
            document.querySelector('#post-table').innerHTML += `
        <tr>
            <td class="name-col">${dataResult.pet_name}</td>
            <td class="add-date-col">${dataResult.created_at}</td>
            <td class="status-col">${dataResult.status}</td>

            <td class="change-status-col">            
            <label class="switch">
            <input type="checkbox" checked>
            <span class="slider round" id="status-${dataResult.id}"></span>
            </label>
            </td>
        </tr>
            `
        }
    }
}

async function init() {
    await postData()
    const elems = document.querySelectorAll('.slider.round');
    console.log('elems =', elems);

    for (let elem of elems) {
        console.log(elem);
        elem.addEventListener('click', getElm)
    }
}
init()



async function getElm(event) {
    let id = event.target.id.replace('status-', '');
    console.log(id);
    let res = await fetch(`/pets/post-status/${id}`, {
        method: 'put'
    })
    let result = await res.json()
    console.log(result);
    if (result.message == 'update succeed') {
        location.reload('/post-pets.html')
    }
}

// document.querySelector('#circle-check').addEventListener('click', async () => {
//     let res = await fetch('/o-logo')
//     let result = await res.json()
//     if (result.message == 'updated') {
//         postData()
//     }
// })