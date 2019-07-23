// taken from https://raw.githubusercontent.com/alexradulescu/FreezeUI
// and modified
(function() {

    /**
     * Setup the freeze element to be appended
     */
    var freezeHtml = document.createElement('div');
    freezeHtml.classList.add('freeze-ui');

    /** 
    * Freezes the UI
    * options = {
    *   element: DOM object
    *   selector: '.class-name' -> Choose an element where to limit the freeze or leave empty to freeze the whole body. Make sure the element has position relative or absolute,
    *   text: 'Magic is happening' -> Choose any text to show or use the default "Loading". Be careful for long text as it will break the design.
    * }
    */
    window.FreezeUI = function(options) {
        if(!options){
            options = {};
        }

        var parent;

        if (options.element) {
            parent = options.element;
        } else {
            parent = document.querySelector(options.selector) || document.body;
        }

        freezeHtml.setAttribute('data-text', options.text || 'Loading');
        if (document.querySelector(options.selector) || options.element) {
            freezeHtml.style.position = 'absolute';
        }
        parent.appendChild(freezeHtml);
    };

    /**
     * Unfreezes the UI.
     */
    window.UnFreezeUI = function(options) {
        if(!options){
            options = {};
        }

        var freezeHtml;
        if(options.element){
            freezeHtml = options.element.querySelector('.freeze-ui');
        } else {
            freezeHtml = document.querySelector('.freeze-ui');
        }

        if (freezeHtml) {
            freezeHtml.classList.add('is-unfreezing');
            setTimeout(function() {
                if (freezeHtml) {
                    freezeHtml.classList.remove('is-unfreezing');
                    if (freezeHtml.parentElement) {
                        freezeHtml.parentElement.removeChild(freezeHtml);
                    }
                }
            }, 250);
        }
    };
})();
