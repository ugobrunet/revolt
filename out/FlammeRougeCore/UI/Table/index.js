var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled from "styled-components";
var DEFAULT_BORDER = 1;
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: table;\n  border: ", "px solid gray;\n"], ["\n  display: table;\n  border: ", "px solid gray;\n"])), DEFAULT_BORDER);
export var Row = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: table-row;\n"], ["\n  display: table-row;\n"])));
export var Cell = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: table-cell;\n  line-height: ", "px;\n  height: ", "px;\n  width: ", "px;\n  text-align: center;\n  border: ", "px solid gray;\n"], ["\n  display: table-cell;\n  line-height: ", "px;\n  height: ", "px;\n  width: ", "px;\n  text-align: center;\n  border: ", "px solid gray;\n"])), function (props) { return props.cellRadius; }, function (props) { return props.cellRadius; }, function (props) { return props.cellRadius; }, DEFAULT_BORDER);
export var DoubleCell = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: table-cell;\n  line-height: ", "px;\n  height: ", "px;\n  width: ", "px;\n  text-align: center;\n  border: ", "px solid gray;\n"], ["\n  display: table-cell;\n  line-height: ", "px;\n  height: ", "px;\n  width: ", "px;\n  text-align: center;\n  border: ", "px solid gray;\n"])), function (props) { return 2 * props.cellRadius; }, function (props) { return 2 * props.cellRadius; }, function (props) { return props.cellRadius; }, DEFAULT_BORDER);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=index.js.map