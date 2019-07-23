
let FeatureCheckerService = class FeatureCheckerService {
    get(featureName) {
        return abp.features.get(featureName);
    }
    getValue(featureName) {
        return abp.features.getValue(featureName);
    }
    isEnabled(featureName) {
        return abp.features.isEnabled(featureName);
    }
};

export { FeatureCheckerService };
