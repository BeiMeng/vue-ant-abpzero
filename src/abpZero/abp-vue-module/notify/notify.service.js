
let NotifyService = class NotifyService {
    info(message, title, options) {
        abp.notify.info(message, title, options);
    }
    success(message, title, options) {
        abp.notify.success(message, title, options);
    }
    warn(message, title, options) {
        abp.notify.warn(message, title, options);
    }
    error(message, title, options) {
        abp.notify.error(message, title, options);
    }
};
export { NotifyService };
