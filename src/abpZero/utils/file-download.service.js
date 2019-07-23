
import appconfig from '@/abpZero/appconfig'
let FileDownloadService = class FileDownloadService {
    downloadTempFile(file) {
        const url = appconfig.remoteServiceBaseUrl + '/File/DownloadTempFile?fileType=' + file.fileType + '&fileToken=' + file.fileToken + '&fileName=' + file.fileName;
        location.href = url; //TODO: This causes reloading of same page in Firefox
    }
};
export { FileDownloadService };
