
"use strict";

import { isPlainObject, type } from "./util";

function isDomLiteral( value ) {
    if( !Array.isArray( value ) ) {
        return false;
    }
    if( !value.length ) {
        return false;
    }
    return type( value[ 0 ] ) === "string";
}

export function diteral( dit ) {
    if( !isDomLiteral( dit ) ) {
        throw new Error("bad diteral type");
    }

    let [ name, ...rest ] = dit,
        dom = document.createElement( name );

    // loops recursively through self and nested-arrays in a flattening type effect
    (function loop( props ) {
        props.forEach( ( prop ) => {
            parse( prop );
        });

        function parse( prop ) {
            if( isPlainObject( prop ) ) {

                for( let key in prop ) {
                    if( prop.hasOwnProperty( key ) ) {
                        let value = prop[ key ];

                        switch( type( dom[ key ] ) ) {

                            case "object":
                                value.call( dom[ key ] , dom[ key ]);
                                break;

                            case "null":
                            case "function":
                                dom [ key ] = value;
                                break;

                            default:
                                if( type( value ) === "function" ) {
                                    dom[ key ] = value( dom[ key ] );
                                } else {
                                    dom[ key ] = value;
                                }

                        }
                    }
                }

            } else if( type( prop ) === "function" ) {

                parse( prop.call(dom) );

            } else if( Array.isArray( prop ) && !isDomLiteral( prop ) ) {

                loop( prop );

            } else if( isDomLiteral( prop ) ) {

                dom.appendChild( diteral( prop ) );

            } else if( type( prop ) === "string" ) {

                dom.appendChild( document.createTextNode( prop ) );

            }
            
        }

    })( rest );

    return dom;
}