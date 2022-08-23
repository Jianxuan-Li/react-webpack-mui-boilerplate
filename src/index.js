import "core-js/stable";
import ReactDOM from "react-dom";
import React from "react";
import App from "./app";

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById("app"));
};

render(App);

if (module.hot) {
  module.hot.accept("./app", () => {
    render(App);
  });
}
