// query selectors
let headerSelectorExpander = document.querySelector('#header-selector-expender');
// let mfilterHeadingElems = document.querySelectorAll('.mfilter-heading');

// add event listeners
headerSelectorExpander.addEventListener('click', expandSelector);
// for (let mfilterHeadingElem of mfilterHeadingElems) {
//     mfilterHeadingElem.addEventListener('click', expandMfilter);
// }

// for headerSelectorExpander
function expandSelector() {
    if ($('#header-selector').hasClass('collapse')) {
        $('#header-selector').removeClass('collapse');
        $('#expender-arrow').removeClass('arrow-down');
        $('#expender-arrow').addClass('arrow-up');
    } else {
        $('#header-selector').addClass('collapse');
        $('#expender-arrow').removeClass('arrow-up');
        $('#expender-arrow').addClass('arrow-down');
    }
}

function expandMfilter() {

}