
import { diteral as d } from "../lib";

let getItems = d.state(( items ) => {
    return items;
});

class Todo {
    constructor() {
        this.items = [{name: "test", completed: false}, {name: "test2", completed: true}];
    }
    addTodo( name ) {
        this.items.push({
            name,
            completed: false
        });
    }
    markCompleted( i ) {
        this.items[i].completed = true;
    }
}

let todo = new Todo();


let newView = d(
    "div",
        [ "input", { type: "text", onkeyup: d.state( ( name, update ) => (ev) => { update( ev.target.value ) } ) } ],
        [ "button", { onclick: d.state( name => () => {
                todo.addTodo( name );
                todoView( todo.items )
            } ) },
            d.state( name => "Add " + name)
        ]
);

let itemView = d(
    "div",
        [ "input", { type: "checkbox" } ], " ",
        d.state( item => item.name )
);

let todoView = d(
    "div",
        newView(),
        d.state( items =>
            items.map( ( item ) => itemView( item ) )
        )
)( todo.items )( document.body );
