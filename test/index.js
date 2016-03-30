
import { diteral as d } from "../lib";

var items = [];

var dom = d(
    ["div", {
        className: "test"
    },
        ["button", {
            onclick: () => {
                items.push([
                    "p", "a new item!"
                ]);
                dom(items);
            }
        },
            "add item!"
        ],
        () => {
            return items;
        }
    ]
)(document.body);

dom(items);