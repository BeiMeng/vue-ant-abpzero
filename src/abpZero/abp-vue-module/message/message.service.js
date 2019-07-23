
let MessageService = class MessageService {
    info(message, title, isHtml) {
        return abp.message.info(message, title, isHtml);
    }
    success(message, title, isHtml) {
        return abp.message.success(message, title, isHtml);
    }
    warn(message, title, isHtml) {
        return abp.message.warn(message, title, isHtml);
    }
    error(message, title, isHtml) {
        return abp.message.error(message, title, isHtml);
    }
    confirm(message, titleOrCallBack, callback, isHtml) {
        if (typeof titleOrCallBack == 'string') {
            return abp.message.confirm(message, titleOrCallBack, callback, isHtml);
        }
        else {
            return abp.message.confirm(message, undefined, titleOrCallBack, isHtml);
        }
    }
};

export { MessageService };
