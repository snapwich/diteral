
import { diteral as d } from "../lib";

let onClick = d.state((state, update) => {
    return (ev) => {
        if(!state.items) {
            state.items = [];
        }
        state.items.push([
            "p", "a new item!"
        ]);
        update();
    }
});

let getItems = d.state(( state ) => {
    return state.items;
});

var dom = d(
    "div", {className: "test"},
        ["button", {onclick: onClick},
            "add item!"
        ],
    getItems
)(document.body)();