var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled from "styled-components";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
export var DetachedCard = styled(Card)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-right: 8px;\n    margin-left: 8px;\n    margin-top: 8px;\n    margin-bottom: 8px;\n  }\n"], ["\n  && {\n    margin-right: 8px;\n    margin-left: 8px;\n    margin-top: 8px;\n    margin-bottom: 8px;\n  }\n"])));
export var StyledAvatar = styled(Avatar)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    background-color: ", "\n"], ["\n  && {\n    background-color: ",
    "\n"])), function (props) {
    var color = "DarkSlateBlue";
    switch (props.position) {
        case 1:
            color = "gold";
            break;
        case 2:
            color = "silver";
            break;
        case 3:
            color = "#cd7f32";
            break;
        default:
            break;
    }
    return color;
});
export var CenteredCardContent = styled(CardContent)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    text-align: center;\n  }\n"], ["\n  && {\n    text-align: center;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=elements.js.map