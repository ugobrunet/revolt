import axios from "axios";
import intl from "react-intl-universal";
export var SUPPORTED_LOCALES = {
    en: "en",
    fr: "fr",
};
export default (function () {
    var currentLocale = intl.determineLocale({
        cookieLocaleKey: "lang",
    });
    if (!SUPPORTED_LOCALES[currentLocale]) {
        currentLocale = "fr";
    }
    return axios
        .get(process.env.PUBLIC_URL + "/locales/" + currentLocale + ".json")
        .then(function (res) {
        var _a;
        return intl.init({
            currentLocale: currentLocale,
            locales: (_a = {},
                _a[currentLocale] = res.data,
                _a),
        });
    });
});
//# sourceMappingURL=InitLocale.jsx.map