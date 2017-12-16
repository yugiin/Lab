/**
 * Reset places in #type
 * @param disabled {string} - css selector
 */
function resetTypes(disabled){
    var inp = document.querySelectorAll('#type .places input');
    if(disabled){
        var ardis = disabled.split(',');
    }
    $('.train-type label.place.act-ive').removeClass('act-ive');
    $('.train-type label.place.dis-l').removeClass('dis-l');
    for(var i=0;i<inp.length;i++){
        inp[i].checked = false;
        inp[i].disabled = false;
        inp[i].removeAttribute('checked');
        inp[i].removeAttribute('disabled');
        if(disabled && ardis.indexOf(inp[i].value)!==-1){
            inp[i].disabled = true;
            inp[i].setAttribute('disabled','disabled');
            $('.train-type label[for="inp-place-'+inp[i].value+'"]').addClass('dis-l');
        }
    }
}
/**
 * Reset form
 * @param selector {string} - css selector
 */
function resetForms(selector){
    $(selector).find('input:text, input:password, textarea').each(function () {
        $(this).val('');
        simulateEvent('change',this);
    });
    $(selector).find('input:radio, input:checkbox').each(function(){
        $(this).prop('checked', false);
        simulateEvent('change',this);
    });
    $(selector).find('select').each(function(){
        $(this).prop('selectedIndex',0);
        simulateEvent('change',this);
    });
}
/**
 * simulateEvent
 * @param name {string} - event name
 * @param el {object} - DOM Element for firing the event
 */
function simulateEvent(name,el) {
    var event = new MouseEvent(name, {
        view: window,
        bubbles: true,
        cancelable: true
    });
    var cancelled = !el.dispatchEvent(event);
    if (cancelled) {
        // A handler called preventDefault.
        console.error("Event "+name+" in "+el+" cancelled");
    } else {
        // None of the handlers called preventDefault.
        console.info("Event "+name+" in "+el+" fired");
    }
}
/**
 * Basicaly used for checkboxes with dependence elements to set required for elements if checked
 * @param list {string} - css selector
 * @param switcher {boolean} - set|Unset required
 */
function setRequired(list,switcher){
    var ls = document.querySelectorAll(list);
    for(var i=0;i<ls.length;i++){
        ls[i].required = switcher;
        switcher && ls[i].setAttribute('required','');
        !switcher && ls[i].removeAttribute('required');
    }
}
/**
 * validate form for filling required fields (by attribute required) and 'required one of' (by class .inp-required-one-of)
 * @param section {object} - DOM Element - form for validation
 * @param base {string} - selector for base disabled buttons
 * @param valid {boolean} - get field validation in fire
 */
function validRequired(section,base,valid){
    base = base || '';
    valid = (typeof valid === 'boolean' ? valid : true);
    var list = $(section).find('*[required],.inp-required-one-of'),
        count = 0,
        oneOfFlag = section.querySelectorAll('.inp-required-one-of').length ? false : null;
    list.each(function () {
        if(this.type === "checkbox" && this.checked){// TODO: think about radio
            count++;
            this.classList.contains('inp-required-one-of') && (oneOfFlag = true);
        }else if(this.value !== '' && this.type !== "checkbox"){
            count++;
            this.classList.contains('inp-required-one-of') && (oneOfFlag = true);
        }else if(this.classList.contains('inp-required-one-of')){
            count++;
        }
    });
    var btn = section.querySelectorAll('input.btn-primary'+base); // get next-step button in section; submit one of they;
    for(var i=0; i<btn.length; i++){
        if(valid && count === list.length && (oneOfFlag === null || oneOfFlag)){
            btn[i] && (btn[i].disabled = false);
            btn[i] && btn[i].removeAttribute('disabled');
        }else{
            btn[i] && (btn[i].disabled = true);
            btn[i] && btn[i].setAttribute('disabled','');
        }
    }
}
/**
 * set content
 * @param value {string} - content
 * @param el {string} - css selector for where put content
 */
function setContent(value,el){
    var dataRelList = document.querySelectorAll(el);
    for(var i=0; i<dataRelList.length; i++){
        dataRelList[i].innerHTML = value;
    }
}
/**
 * reset by F5
 */
resetForms('#tickets-desc');
/**
 * set disabled for 'next button' by F5
 */
validRequired(document.getElementById('tickets-desc'),'.base-disabled');
/**
 * change events for base form
 */
document.getElementById('tickets-desc').addEventListener('change',function(ev){
    /**
     * collapse toggle relatives blocks
     * here only for checkbox
     */
    ev.target.type === 'checkbox' && ev.target.dataset.collapseRelative && $(ev.target.dataset.collapseRelative).collapse(ev.target.checked ? 'show' : 'hide');
    /** set attr required if it dependence from cehckbox changed
     * !! no checking about element type
     **/
    if(ev.target.classList.contains('inp-use-required')){
        setRequired(ev.target.dataset.useRequired, ev.target.checked);
    }
    /** run validation */
    if(ev.target.tagName === 'INPUT' || ev.target.tagName === 'SELECT' || ev.target.tagName === 'TEXTAREA'){
        if(!ev.target.checkValidity()){
            ev.target.dataset.label && (document.getElementById('error').innerHTML = '\''+ev.target.dataset.label+'\' '+ev.target.validationMessage);
        }else{
            document.getElementById('error').innerHTML = '';
        }
        document.getElementById('error').innerHTML.length && document.getElementById('error').classList.remove('hide'),document.getElementById('error').classList.add('show');
        !document.getElementById('error').innerHTML.length && document.getElementById('error').classList.remove('show'),document.getElementById('error').classList.add('hide');
        validRequired($(ev.target).closest('fieldset.section')[0],'',ev.target.checkValidity());
    }
    /** set legend or #trains-list */
    if(ev.target.classList.contains('train-number')){
        setContent(ev.target.dataset.number,'.train-number-content');
        setContent(ev.target.dataset.time,'.train-time-content');
    }
    /** write data to relative content
     * used in #points
     * moved to btn next click
     **/
    // if(ev.target.classList.contains('inp-with-content')){
    //     document.getElementById(ev.target.dataset.content).innerHTML = ev.target.value;
    // }
    /** train type | track number | place */
    if(ev.target.id === 'inp-type'){
        resetTypes();
        setRequired('.inp-type-track',false);
        setRequired('#inp-type-track-'+ev.target.value,true);
        validRequired($(ev.target).closest('fieldset.section')[0]);
        $('.type-track, .train-type').collapse('hide');
        if(ev.target.value){
            $('#type-track-'+ev.target.value+',#type-'+ev.target.value).collapse('show');
            var actSel = document.querySelector('#inp-type-track-'+ev.target.value);
            var dis = actSel && actSel.options[actSel.options.selectedIndex].dataset.disabled;
            dis && resetTypes(dis);
        }
    }
    if(ev.target.classList.contains('inp-type-track')){
        resetTypes(ev.target.options[ev.target.options.selectedIndex].dataset.disabled);
        setContent(ev.target.value,ev.target.dataset.content);
        validRequired($(ev.target).closest('fieldset.section')[0]);
    }
});
/**
 * select the places in track
 */
document.getElementById('type').addEventListener('click',function (ev) {
    if(ev.target.classList.contains('place') && !ev.target.classList.contains('dis-l')){
        ev.target.classList.toggle('act-ive');
    }
});
/**
 * click event handler
 */
document.addEventListener('click',function(ev){
    /**
     * run btn-back resets
     */
    if(ev.target.classList.contains('btn-back')){
        resetForms(ev.target.dataset.reset);
    }
    /**
     * btn-next
     */
    if(ev.target.classList.contains('btn-primary') && ev.target.type !== 'submit'){
        /**
         * write data to relative content
         * use data-content="{css selector}"
         */
        var formSection = $(ev.target).closest('fieldset.section');
        formSection.find('.inp-with-content').each(function () {
            setContent(this.value,this.dataset.content);
        });
        /**
         * write data to relative content exception
         * for .type-track
         */
        if(formSection[0].id === 'type'){
            var TT = formSection[0].querySelector('#inp-type-track-'+formSection[0].querySelector('#inp-type').value);
            setContent(TT.value,TT.dataset.content);
        }
    }
});
/**
 * places click handler
 */
document.getElementById('places').addEventListener('change',function(ev){
    if(ev.target.classList.contains('inp-place')){
        var plList = this.querySelectorAll('.inp-place'),
            selected = '';
        for(var i=0; i<plList.length; i++){
            plList[i].checked && (selected = selected+plList[i].value+'; ')
        }
        selected.length && setContent(selected,this.dataset.content);
    }
});

/**
 * autocompletes
 */
$( function() {
    var City = [
        "New York",
        "Kyiv",
        "Moscow",
        "Istambul",
        "London",
        "Berlin",
        "Sudan",
        "Ierusalim",
        "Paris",
        "Warshava",
        "Zytomyr",
        "Sevastopol",
        "Helsenki",
        "Rome",
        "Zabygor",
        "Bugorza",
        "Maza",
        "Phaza",
        "Phazenda Diadi Toma",
        "Kusinovile",
        "Nikovile",
        "Supervile"
    ];
    $("#inp-from,#inp-to,#inp-city").autocomplete({
        source: City
    });
    /**
     * set pattern for From & To
     */
    $("#inp-from,#inp-to").attr('pattern',City.join('|'));
} );

/**
 * set min Date (for HTML5)
 */
(function(){
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;
    $('#inp-date').attr('min', maxDate);
})();