import { AppConsts } from '@/abpZero/shared/AppConsts';
import { FormattedStringValueExtracter } from '@/abpZero/shared/helpers/FormattedStringValueExtracter';
export class SubdomainTenancyNameFinder {
    getCurrentTenancyNameOrNull(rootAddress) {
        if (rootAddress.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) < 0) {
            // Web site does not support subdomain tenant name
            return null;
        }
        const currentRootAddress = document.location.href;
        const formattedStringValueExtracter = new FormattedStringValueExtracter();
        const values = formattedStringValueExtracter.IsMatch(currentRootAddress, rootAddress);
        if (!values.length) {
            return null;
        }
        return values[0];
    }
}
