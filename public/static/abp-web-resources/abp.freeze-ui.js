var abp = abp || {};
(function () {

    abp.ui.setBusy = function (element, text) {
        FreezeUI({ element: element, text: text ? text : ' ' });
    };

    abp.ui.clearBusy = function (element) {
        UnFreezeUI({ element: element });
    };

})();
