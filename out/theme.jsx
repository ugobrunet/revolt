import red from "@material-ui/core/colors/red";
import { createMuiTheme } from "@material-ui/core/styles";
// A custom theme for this app
var theme = createMuiTheme({
    palette: {
        primary: {
            main: "#f50057",
        },
        secondary: {
            main: "#2196f3",
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#fff",
        },
    },
});
export default theme;
//# sourceMappingURL=theme.jsx.map