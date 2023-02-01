


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
            <tr id="post-table-${dataResult.id}">
                <td class="name-col">${dataResult.pet_name}</td>
                <td class="add-date-col">${dataResult.created_at.replace('T', " ").split('.')[0]}</td>
                <td class="status-col" id="renew-status-${dataResult.id}">${dataResult.status}</td>
                <td class="change-status-col"> 
                <label class="switch">
                <input type="checkbox">
                <span class="slider round" id="status-${dataResult.id}"></span>
                </label>
                </td>
            <td class="detail-status-col"><i type='button' class="fa-solid fa-book" id="detail-${dataResult.id}"></i></td>
            <td class="delete-col"><i type="button"class="fa-solid fa-trash" id="delete-${dataResult.id}"></i></td>
            </tr>
                `
        } else if (dataResult.status == 'active') {
            document.querySelector('#post-table').innerHTML += `
        <tr id="post-table-${dataResult.id}">
            <td class="name-col">${dataResult.pet_name}</td>
            <td class="add-date-col">${dataResult.created_at.replace('T', " ").split('.')[0]}</td>
            <td class="status-col" id="renew-status-${dataResult.id}">${dataResult.status}</td>
            <td class="change-status-col">            
            <label class="switch">
            <input type="checkbox" checked>
            <span class="slider round" id="status-${dataResult.id}"></span>
            </label>
            </td>
            <td class="detail-status-col"><i type='button' class="fa-solid fa-book" id='detail-${dataResult.id}'></i></td>
            <td class="delete-col""><i type="button" class="fa-solid fa-trash" id="delete-${dataResult.id}"></i></td>
        </tr>
            `
        } else {
            document.querySelector('#post-table').innerHTML += `
            <tr id="post-table-${dataResult.id}">
                <td class="name-col">${dataResult.pet_name}</td>
                <td class="add-date-col">${dataResult.created_at.replace('T', " ").split('.')[0]}</td>
                <td class="status-col" id="renew-status-${dataResult.id}">${dataResult.status}</td>
                <td class="change-status-col">            
                </td>
                <td class="detail-status-col"><i type='button' class="fa-solid fa-book" id='detail-${dataResult.id}'></i></td>
                <td class="delete-col""><i type="button" class="fa-solid fa-trash" id="delete-${dataResult.id}"></i></td>
            </tr>
                `
        }
    }
    applicationStatus()
}

async function applicationStatus() {
    let res = await fetch('/pets/application-status')
    let data = await res.json()
    let results = data.applicationRequest
    for (let result of results) {
        document.querySelector('#request-table').innerHTML += `
        <tr>
        <td class="name-col">${result.pet_name}</td>
        <td class="add-date-col">${result.created_at.replace('T', " ").split('.')[0]}</td>
        <td class="status-col">${result.status}</td>
        </tr>`
    }
}

function detailRequest() {
    const requestStatusOs = document.querySelectorAll('.O-logo')
    const requestStatusXs = document.querySelectorAll('.X-logo')
    for (let requestStatusO of requestStatusOs) {
        requestStatusO.addEventListener('click', changeRequestStatusO)
    }
    for (let requestStatusX of requestStatusXs) {
        requestStatusX.addEventListener('click', changeRequestStatusX)
    }
}
async function init() {
    await postData()
    const elems = document.querySelectorAll('.slider.round');
    const requestDetails = document.querySelectorAll('.fa-solid.fa-book')
    const deletePosts = document.querySelectorAll('.fa-solid.fa-trash')
    // console.log(deletePosts);
    for (let elem of elems) {
        elem.addEventListener('click', getElm)
    }
    for (let requestDetail of requestDetails) {
        requestDetail.addEventListener('click', detail)
    }
    for (let deletePost of deletePosts) {
        deletePost.addEventListener('click', deletePostItem)
    }
}
init()



async function getElm(event) {
    let id = event.target.id.replace('status-', '');
    // console.log(id);
    let res = await fetch(`/pets/post-status/${id}`, {
        method: 'put'
    })
    let result = await res.json()
    if (result.message == 'update succeed') {
        document.querySelector(`#renew-status-${id}`).innerHTML = result.status[0].status
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
        Swal.fire({
            title: '沒有收到請求申請',
            showConfirmButton: true
        })
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
                <td class="add-date-col">${resultData.created_at.replace('T', " ").split('.')[0]}</td>
                <td class="request-name-col">${resultData.username}</td>
                <td class="status-col" id="status-col-${resultData.id}">${resultData.status}</td>
                <td class="buttons-col"><i type="button" class="fa-solid fa-circle-check O-logo" id="request-status-O-${resultData.id}"></i>   <i type="button" class="fa-solid fa-circle-xmark X-logo" id="request-status-X-${resultData.id}"></i></td>
            </tr>`
        if (resultData.status == 'approval') {
            document.querySelector(`#request-status-X-${resultData.id}`).style.display = 'none'
            document.querySelector(`#request-status-O-${resultData.id}`).className = 'fa-solid fa-circle-check'
        } else if (resultData.status == 'not approval') {
            document.querySelector(`#request-status-O-${resultData.id}`).style.display = 'none'
            document.querySelector(`#request-status-X-${resultData.id}`).className = 'fa-solid fa-circle-xmark'
        }
    }
    detailRequest()
}

async function changeRequestStatusO(event) {
    Swal.fire({
        title: 'You confirm to accept the application?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let id = event.target.id.replace('request-status-O-', '')
            let res = await fetch(`/pets/change-request-O-status/${id}`, {
                method: 'put'
            })
            let requestResult = await res.json()
            let otherUserRequests = requestResult.otherRequest
            for (let otherUserRequest of otherUserRequests) {
                document.querySelector(`#request-status-O-${otherUserRequest.id}`).style.display = 'none'
                document.querySelector(`#status-col-${otherUserRequest.id}`).innerHTML = otherUserRequest.status
                document.querySelector(`#request-status-X-${otherUserRequest.id}`).className = 'fa-solid fa-circle-xmark'
            }
            if (requestResult.message == 'updated all data') {
                document.querySelector(`#request-status-X-${id}`).style.display = 'none'
                document.querySelector(`#status-col-${id}`).innerHTML = requestResult.requestResult.status
                document.querySelector(`#request-status-O-${id}`).className = 'fa-solid fa-circle-check'
                document.querySelector(`#renew-status-${requestResult.requestResult.post_id}`).innerHTML = 'adopted'
                document.querySelector(`#status-${requestResult.postStatus.id}`).remove()
            }
            Swal.fire(
                'Accepted!'
            )
        }
    })
    // if (requestResult.otherRequest)
}

async function changeRequestStatusX(event) {
    Swal.fire({
        title: 'You confirm to reject the application?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        let id = event.target.id.replace('request-status-X-', '')
        let res = await fetch(`/pets/change-request-X-status/${id}`, {
            method: 'put'
        })
        let requestResult = await res.json()
        if (requestResult.message == 'updated all data') {
            document.querySelector(`#request-status-O-${id}`).style.display = 'none'
            document.querySelector(`#status-col-${id}`).innerHTML = requestResult.requestResult.status
            document.querySelector(`#request-status-X-${id}`).className = 'fa-solid fa-circle-xmark'
        }
        Swal.fire(
            'Rejected!'
        )
    })
}

async function deletePostItem(event) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let id = event.target.id.replace('delete-', '')
            let res = await fetch(`/pets/${id}`, {
                method: 'delete'
            })
            let result = await res.json()
            if (result.message == 'deleted') {
                document.querySelector(`#post-table-${id}`).remove()
            }
            Swal.fire(
                'Deleted!',
                'Your post has been deleted.',
                'success'
            )
        }
    })
}

// let emojiValue = document.querySelectorAll('.em')
// console.log(emojiValue);