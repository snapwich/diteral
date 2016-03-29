
import { diteral as d } from "../lib";

var dom = d(
    ["div", {
        id: "test",
        className: function() {return "test"},
        onclick: function(ev) { console.log("click", this, ev) },
        classList: function() { console.log("classList", this) }
    },
        ["p", "content"]
    ]
);

document.body.appendChild(dom);