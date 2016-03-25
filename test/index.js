
import { diteral as d } from "../lib";

var dom = d(
    ["div", {className: "class1 class2", onclick: function() { console.log("hi"); }},
        ["p", "content"]
    ]
);

document.body.appendChild(dom);