import { BrowserRouter, Route, Link } from "react-router-dom";
import { createHistory } from "history";
import { createLocation } from 'history-v4'

import { createElement as h } from "react";
import ReactDOM from "react-dom";

const customHistory = createHistory();

console.log(createLocation());

const App = h(BrowserRouter, { history: customHistory }, [
  h(Route, { key: "home", exact: true, path: "/" }, [
    h('h1', null, "Home"),
    h(Link, { to: "/about" }, 'about'),
  ]),
  h(Route, { key: 'about', exact: true, path: "/about" }, [
    h('h1', null, "About"),
    h(Link, { to: "/" }, 'home'),
  ],)
]);

ReactDOM.render(App, document.querySelector("#app"));
