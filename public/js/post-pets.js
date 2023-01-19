function checkAdopted(adoptionItemNum, cid) {
    var url = ($('#is-adopted-' + adoptionItemNum).is(':checked')) ? "catalog/controller/adoption/mark_adopted.php" : "catalog/controller/adoption/unmark_adopted.php";
    $.post(url, {
        adoption_item_id: adoptionItemNum,
        customer_id: cid
    });
}

function confirmDeleteAdoptionItem(formNum) {
    $("#notification .modal-title").html('確定');
    $("#notification .modal-footer button").html('取消');
    $("#notification .modal-footer button").attr('data-dismiss', 'modal');
    $("#notification .modal-footer button").addClass('red-text')
    $("#notification .modal-footer a").html('確定');
    $("#notification .modal-footer a").attr('href', 'https://www.pethaven.com.hk/index.php?route=adoption/animal/delete&path=adoption&adoption_item_id=' + formNum);
    $("#notification .modal-footer a").css('background-color', '#e52226')
    $("#notification .modal-footer").show();
    $("#notification").modal('show');
    $("#notification .modal-body p").html('確定删除待領養資料?');
}