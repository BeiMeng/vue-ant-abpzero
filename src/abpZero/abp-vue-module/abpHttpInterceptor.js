import { MessageService } from './message/message.service';
import { LogService } from './log/log.service';
import { TokenService } from './auth/token.service';
import { UtilsService } from './utils/utils.service';
let AbpHttpConfiguration = class AbpHttpConfiguration {
    constructor() {
        this._messageService = new MessageService();
        this._logService = new LogService();
        this.defaultError = {
            message: 'An error has occurred!',
            details: 'Error details were not sent by server.'
        };
        this.defaultError401 = {
            message: 'You are not authenticated!',
            details: 'You should be authenticated (sign in) in order to perform this operation.'
        };
        this.defaultError403 = {
            message: 'You are not authorized!',
            details: 'You are not allowed to perform this operation.'
        };
        this.defaultError404 = {
            message: 'Resource not found!',
            details: 'The resource requested could not be found on the server.'
        };
    }
    logError(error) {
        this._logService.error(error);
    }
    showError(error) {
        if (error.details) {
            return this._messageService.error(error.details, error.message || this.defaultError.message);
        }
        else {
            return this._messageService.error(error.message || this.defaultError.message);
        }
    }
    handleTargetUrl(targetUrl) {
        if (!targetUrl) {
            location.href = '/';
        }
        else {
            location.href = targetUrl;
        }
    }
    handleUnAuthorizedRequest(messagePromise, targetUrl) {
        const self = this;
        if (messagePromise) {
            messagePromise.done(() => {
                this.handleTargetUrl(targetUrl || '/');
            });
        }
        else {
            self.handleTargetUrl(targetUrl || '/');
        }
    }
    handleNonAbpErrorResponse(response) {
        const self = this;
        switch (response.status) {
            case 401:
                self.handleUnAuthorizedRequest(self.showError(self.defaultError401), '/');
                break;
            case 403:
                self.showError(self.defaultError403);
                break;
            case 404:
                self.showError(self.defaultError404);
                break;
            default:
                self.showError(self.defaultError);
                break;
        }
    }
    handleAbpResponse(response, ajaxResponse) {
        var newResponse;
        if (ajaxResponse.success) {
            if (ajaxResponse.targetUrl) {
                this.handleTargetUrl(ajaxResponse.targetUrl);
                ;
            }
        }
        else {
            if (!ajaxResponse.error) {
                ajaxResponse.error = this.defaultError;
            }
            this.logError(ajaxResponse.error);
            this.showError(ajaxResponse.error);
            if (response.status === 401) {
                this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
            }
        }
        return ajaxResponse.result;
    }
    getAbpAjaxResponseOrNull(response) {
        if (!response || !response.headers) {
            return null;
        }
        var contentType = response.headers["content-type"];
        if (!contentType) {
            this._logService.warn('Content-Type is not sent!');
            return null;
        }
        if (contentType.indexOf("application/json") < 0) {
            this._logService.warn('Content-Type is not application/json: ' + contentType);
            return null;
        }
        var responseObj = JSON.parse(JSON.stringify(response.data));
        if (!responseObj.__abp) {
            return null;
        }
        return responseObj;
    }
    handleResponse(response) {
        var ajaxResponse = this.getAbpAjaxResponseOrNull(response);
            
        if (ajaxResponse != null) {
            return this.handleAbpResponse(response, ajaxResponse);
        } else {
            return this.handleNonAbpErrorResponse(response);
        }        
    }
    blobToText(blob) {
        return new Observable((observer) => {
            if (!blob) {
                observer.next("");
                observer.complete();
            }
            else {
                let reader = new FileReader();
                reader.onload = function () {
                    observer.next(this.result);
                    observer.complete();
                };
                reader.readAsText(blob);
            }
        });
    }
};
export { AbpHttpConfiguration };


let AbpHttpInterceptor = class AbpHttpInterceptor {
    constructor(configuration) {
        this._tokenService = new TokenService();
        this._utilsService = new UtilsService();
        this._logService = new LogService();
        this.configuration = configuration;
    }
    normalizeRequestHeaders(headers) {
        headers["Pragma"]="no-cache";
        headers["Cache-Control"]="no-cache";
        headers["Expires"]="Sat, 01 Jan 2000 00:00:00 GMT";        
        this.addXRequestedWithHeader(headers);
        this.addAuthorizationHeaders(headers);
        this.addAspNetCoreCultureHeader(headers);
        this.addAcceptLanguageHeader(headers);
        this.addTenantIdHeader(headers);
    }
    addXRequestedWithHeader(headers) {
        if (headers) {
            headers["X-Requested-With"]="XMLHttpRequest";
        }
    }
    addAspNetCoreCultureHeader(headers) {
        let cookieLangValue = this._utilsService.getCookieValue("Abp.Localization.CultureName");
        if (cookieLangValue && headers && headers['.AspNetCore.Culture']==null) {
            headers[".AspNetCore.Culture"]=cookieLangValue;
        }
    }
    addAcceptLanguageHeader(headers) {
        let cookieLangValue = this._utilsService.getCookieValue("Abp.Localization.CultureName");
        if (cookieLangValue && headers && headers['Accept-Language']==null) {
            headers["Accept-Language"]=cookieLangValue;
        }
    }
    addTenantIdHeader(headers) {
        let cookieTenantIdValue = this._utilsService.getCookieValue('Abp.TenantId');
        if (cookieTenantIdValue && headers && headers['Abp.TenantId']==null) {
            headers["Abp.TenantId"]=cookieTenantIdValue;
        }
    }
    addAuthorizationHeaders(headers) {
        let authorizationHeaders = headers ? headers['Authorization'] : null;
        if (!authorizationHeaders) {
            authorizationHeaders = [];
        }
        if (!this.itemExists(authorizationHeaders, (item) => item.indexOf('Bearer ') == 0)) {
            let token = this._tokenService.getToken();
            if (headers && token) {
                headers["Authorization"]='Bearer ' + token
            }
        }
    }
    itemExists(items, predicate) {
        for (let i = 0; i < items.length; i++) {
            if (predicate(items[i])) {
                return true;
            }
        }
        return false;
    }
};
export { AbpHttpInterceptor };
