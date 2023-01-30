


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
            <td class="detail-status-col"><i type='button' class="fa-solid fa-book" id="detail-${dataResult.id}"></i></td>
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
            <td class="detail-status-col"><i type='button' class="fa-solid fa-book" id='detail-${dataResult.id}'></i></td>
        </tr>
            `
        }
    }
}

async function init() {
    await postData()
    const elems = document.querySelectorAll('.slider.round');
    const requestDetails = document.querySelectorAll('.fa-solid.fa-book')
    const requestStatusOs = document.querySelectorAll('.fa-solid.fa-circle-check')
    const requestStatusXs = document.querySelectorAll('.fa-solid.fa-circle-xmark')
    for (let elem of elems) {
        elem.addEventListener('click', getElm)
    }
    for (let requestDetail of requestDetails) {
        requestDetail.addEventListener('click', detail)
    }
    for (let requestStatusO of requestStatusOs) {
        requestStatusO.addEventListener('click', changeRequestStatus)
    }
    for (let requestStatusX of requestStatusXs) {
        requestStatusX.addEventListener('click', changeRequestStatus)
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

async function detail(event) {
    let id = event.target.id.replace('detail-', '')
    let res = await fetch(`/pets/request-detail`, {
        method: 'post',
        body: JSON.stringify({ id }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let result = await res.json()
    if (result.message == 'no request') {
        alert('沒有申請')
        return
    }
    let resultDatas = result.data

    document.querySelector('#request-usertable').innerHTML = `           
    <thead>
    <tr>
    <td class="name-col">名稱/標題</td>
    <td class="add-date-col">請求日期</td>
    <td class="request-name-col">請求用戶</td>
    <td class="status-col">狀態</td>
    <td class="buttons-col">接受/拒絕</td>
    </tr>
    </thead>
    <tbody>
    </tbody>`
    for (let resultData of resultDatas) {
        document.querySelector('#request-usertable').innerHTML +=
            `<tr>
                <td class="name-col">${resultData.pet_name}</td>
                <td class="add-date-col">${resultData.created_at}</td>
                <td class="request-name-col">${resultData.username}</td>
                <td class="status-col">${resultData.status}</td>
                <td class="buttons-col"><i type="button" class="fa-solid fa-circle-check" id="request-status-${resultData.id}"></i>   <i type="button" class="fa-solid fa-circle-xmark" id="request-status-${resultData.id}"></i></td>
            </tr>`
    }
}

async function changeRequestStatus() {

}