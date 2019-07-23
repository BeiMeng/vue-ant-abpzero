
let LogService = class LogService {
    debug(logObject) {
        abp.log.debug(logObject);
    }
    info(logObject) {
        abp.log.info(logObject);
    }
    warn(logObject) {
        abp.log.warn(logObject);
    }
    error(logObject) {
        abp.log.error(logObject);
    }
    fatal(logObject) {
        abp.log.fatal(logObject);
    }
};

export { LogService };
