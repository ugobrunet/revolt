var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { Container, Item } from "../UI/Grid";
import IconButton from "@material-ui/core/IconButton";
import IconVersus from "../icons/Versus";
export var DetachedButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-left: 4px;\n  }\n"], ["\n  && {\n    margin-left: 4px;\n  }\n"])));
export var DetachedContainer = styled(Container)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 4px;\n"], ["\n  margin-top: 4px;\n"])));
export var AlignCenterItem = styled(Item)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  text-align: center;\n"], ["\n  text-align: center;\n"])));
export var AlignLeftItem = styled(Item)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  text-align: left;\n"], ["\n  text-align: left;\n"])));
export var AlignRightItem = styled(Item)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  text-align: right;\n"], ["\n  text-align: right;\n"])));
var VersusTag = /** @class */ (function (_super) {
    __extends(VersusTag, _super);
    function VersusTag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VersusTag.prototype.render = function () {
        return (<AlignCenterItem flex={2}>
        <IconButton disabled>
          <IconVersus />
        </IconButton>
      </AlignCenterItem>);
    };
    return VersusTag;
}(Component));
export { VersusTag };
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=elements.js.map