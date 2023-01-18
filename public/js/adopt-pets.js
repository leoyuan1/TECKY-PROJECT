// query selectors
let headerSelectorExpander = document.querySelector('#header-selector-expender');

// add event listeners
headerSelectorExpander.addEventListener('click', expendSelector);

// for headerSelectorExpander
function toggleCollapse() {

    // toggle selector between collaspe and expand
    document.querySelector('#header-selector').classList.toggle('collapse');

    // toggle arrow between up and down
    const expanderElem = document.querySelector('#expander-arrow');
    if (expanderElem.className === 'arrow-up') {
        expanderElem.className = 'arrow-down';
    } else {
        expanderElem.className = 'arrow-up';
    }

}

// for headerSelectorExpander
function expendSelector() {
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
