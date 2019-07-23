export class UrlHelper {
    static getQueryParameters() {
        return UrlHelper.getQueryParametersUsingParameters(document.location.search);
    }
    static getQueryParametersUsingParameters(search) {
        return search.replace(/(^\?)/, '').split('&').map(function (n) { return n = n.split('='), this[n[0]] = n[1], this; }.bind({}))[0];
    }
    static getQueryParametersUsingHash() {
        return document.location.hash.substr(1, document.location.hash.length - 1).replace(/(^\?)/, '').split('&').map(function (n) { return n = n.split('='), this[n[0]] = n[1], this; }.bind({}))[0];
    }
    static getInitialUrlParameters() {
        let questionMarkIndex = UrlHelper.initialUrl.indexOf('?');
        if (questionMarkIndex >= 0) {
            return UrlHelper.initialUrl.substr(questionMarkIndex, UrlHelper.initialUrl.length - questionMarkIndex);
        }
        return '';
    }
    static getReturnUrl() {
        const queryStringObj = UrlHelper.getQueryParametersUsingParameters(UrlHelper.getInitialUrlParameters());
        if (queryStringObj.returnUrl) {
            return decodeURIComponent(queryStringObj.returnUrl);
        }
        return null;
    }
    static getSingleSignIn() {
        const queryStringObj = UrlHelper.getQueryParametersUsingParameters(UrlHelper.getInitialUrlParameters());
        if (queryStringObj.ss) {
            return queryStringObj.ss;
        }
        return false;
    }
    static isInstallUrl(url) {
        return url && url.indexOf('app/admin/install') >= 0;
    }
}
/**
 * The URL requested, before initial routing.
 */
UrlHelper.initialUrl = location.href;
