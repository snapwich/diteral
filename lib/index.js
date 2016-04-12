
"use strict";

import {
    isPlainObject,
    type
} from "./util";

import {
    elementOpen,
    elementOpenStart,
    elementOpenEnd,
    elementClose,
    attributes,
    symbols,
    attr,
    text,
    patch
} from "incremental-dom";

// "style" is a special property as well but it's already handled by incremental-dom
const NODE_MODIFYING_ATTRS = ["classList", "dataset"];

function isDomLiteral( value ) {
    if ( !Array.isArray( value ) ) {
        return false;
    }
    if ( !value.length ) {
        return false;
    }
    return type( value[ 0 ] ) === "string";
}

function diteral( ...dit ) {
    if ( !isDomLiteral( dit ) ) {
        throw new Error("non-diteral type provided");
    }

    return function init ( state ) {

        if( typeof state === "undefined" ) {
            state = {};
        }

        let container;

        update.__nested_dit = ( parent ) => {
            create( dit );
            // update( parent );
        };
        return update;

        function update( newState ) {

            if( newState instanceof HTMLElement ) {
                container = newState;
                return update();
            }

            if ( typeof newState !== "undefined" ) {
                state = newState;
            }

            if( container ) {
                patch( container, create, dit );
            }

            return update;

        }

        // helper function used to make state object accessible to property setters
        function stateInjection( prop ) {
            if( prop instanceof State ) {
                return prop.cb( state, update );
            }
            return prop;
        }

        // diteral parser
        function create( dit ) {

            let [ name, ...rest ] = dit,
                deferred = {},
                elem = null;

            if ( rest[ 0 ] && isPlainObject( rest[ 0 ] ) ) {
                let attrs = rest[ 0 ],
                    key = null;

                // special property for incremental-dom reuse tracking when generating lists of items
                if ( attrs.key ) {
                    key = stateInjection( attrs.key );
                    delete attrs.key;
                }

                elementOpenStart( name, key );

                for ( let key in attrs ) {
                    if ( attrs.hasOwnProperty( key ) ) {
                        let value = attrs[ key ];

                        value = stateInjection( value );

                        if( NODE_MODIFYING_ATTRS.indexOf( key ) !== -1 && typeof value == "function" ) {
                            deferred[ key ] = value;
                            continue;
                        }

                        attr( key, value );
                    }
                }

                elem = elementOpenEnd( name );

            } else {
                elem = elementOpen( name );
            }

            // loops recursively through self and nested-arrays in a flattening type effect
            (function loop( children ) {

                children.forEach( ( child ) => {

                    (function parse( child ) {
                        if ( child instanceof State ) {
                            parse( child.cb( state, update ) )

                        } if ( type( child ) === "function" ) {
                            if ( child.__nested_dit ) {
                                child.__nested_dit( elem );
                            } else {
                                parse( child( elem ) );
                            }

                        } else if ( Array.isArray( child ) && !isDomLiteral( child ) ) {
                            loop( child );

                        } else if ( isDomLiteral( child ) ) {
                            create( child );

                        } else if ( type( child ) === "string" ) {
                            text( child );
                        }

                    })( child );

                });

            })( rest );

            elementClose( name );

            // special time for attributes to modify the element or access special element attributes
            // outside of incremental-dom
            for ( let key in deferred ) {
                if ( deferred.hasOwnProperty( key ) ) {
                    deferred[ key ].call( elem, elem[ key ] );
                }
            }

        }
    };

}

class State {
    constructor(cb) {
        this.cb = cb;
    }
}

diteral.state = function(cb) {
    return new State(cb);
};

export { diteral, State };