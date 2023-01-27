


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
    let data = res.json()
    if (data.message == 'no post') {
        return
    }
    let dataResults = data.postData
    for (let dataResult of dataResults) {
        document.querySelector('#post-table > table').innerHTML += `
            <tr>
                <td class="name-col">${dataResult.pet_name}</td>
                <td class="add-date-col">${dataResult.post_created_at}</td>
                <td class="status-col">${dataResult.post_status}</td>
                <td class="buttons-col"><i class="fa-sharp fa-solid fa-circle-check"></i><i class="fa-solid fa-circle-xmark"></i></td>
            </tr>
            `
    }
}

postData()