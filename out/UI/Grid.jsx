var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled, { css } from "styled-components";
export var Container = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: ", ";\n  flex-direction: ", ";\n  ", ";\n"], ["\n  display: flex;\n  justify-content: ",
    ";\n  flex-direction: ", ";\n  ",
    ";\n"])), function (props) {
    return props.left
        ? "flex-start"
        : props.right
            ? "flex-end"
            : props.center
                ? "center"
                : props.spaceBetween
                    ? "space-between"
                    : props.spaceAround
                        ? "space-around"
                        : "none";
}, function (props) { return (props.column ? "column" : "row"); }, function (props) {
    return props.alignItems && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      align-items: ", ";\n    "], ["\n      align-items: ", ";\n    "])), props.alignItems);
});
export var Item = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex: ", ";\n  ", ";\n"], ["\n  flex: ", ";\n  ",
    ";\n"])), function (props) { return props.flex || "none"; }, function (props) {
    return props.center && css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      margin: 0 auto;\n    "], ["\n      margin: 0 auto;\n    "])));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=Grid.jsx.map