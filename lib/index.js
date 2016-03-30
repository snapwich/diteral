
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

function isDomLiteral( value ) {
    if ( !Array.isArray( value ) ) {
        return false;
    }
    if ( !value.length ) {
        return false;
    }
    return type( value[ 0 ] ) === "string";
}

export function diteral( dit ) {
    if( !isDomLiteral( dit ) ) {
        throw new Error("non-diteral type provided");
    }

    return function renderTo( container ) {

        return function update( state ) {

            patch(container, create, dit)

            function create( dit ) {

                let [ name, ...rest ] = dit;

                if (rest[0] && isPlainObject(rest[0])) {
                    let attrs = rest[0];

                    elementOpenStart(name);

                    attributes[symbols.default] = function(elem, key, value) {
                        switch ( type( elem[ key ] ) ) {

                            case "object":
                                value.call( elem[ key ], elem[ key ] );
                                break;

                            case "null":
                            case "function":
                                elem[ key ] = value;
                                break;

                            default:
                                if ( type( value ) === "function" ) {
                                    elem[ key ] = value( elem[ key ] );
                                } else {
                                    elem[ key ] = value;
                                }

                        }
                    };

                    for ( let key in attrs ) {
                        if ( attrs.hasOwnProperty( key ) ) {
                            attr( key, attrs[ key ] );
                        }
                    }

                    elementOpenEnd( name) ;

                } else {
                    elementOpen( name );
                }

                // loops recursively through self and nested-arrays in a flattening type effect
                (function loop( children ) {

                    children.forEach( ( child ) => {

                        (function parse( child ) {
                            if (type( child ) === "function") {
                                parse( child.call( state ) );

                            } else if (Array.isArray( child ) && !isDomLiteral( child ) ) {
                                loop( child );

                            } else if ( isDomLiteral( child ) ) {
                                create( child );

                            } else if (type( child ) === "string") {
                                text( child );
                            }

                        })(child);

                    });

                })(rest);

                elementClose(name);

            }

        }

    };

}