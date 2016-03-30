
import { diteral as d } from "../lib";

var dom = d(
    [
        "div", {
            className: "test",
            onclick: function(ev) { console.log(this, ev) }
        },
        "content"
    ]
);

document.body.appendChild(dom);