
import { isPlainObject } from "./util";

function isDomLiteral( value ) {
    if( !Array.isArray( value ) ) {
        return false;
    }
    if( !value.length ) {
        return false;
    }
    return typeof value[ 0 ] === "string";
}

export function diteral( dit ) {
    if( !isDomLiteral( dit ) ) {
        throw new Error("bad diteral type");
    }

    let [ type, ...rest ] = dit,
        dom = document.createElement( type );

    (function loop( rest ) {
        rest.forEach( ( prop ) => {
            if( isPlainObject( prop ) ) {
                for( let key in prop ) {
                    if( prop.hasOwnProperty( key ) ) {
                        let value = prop[ key ];

                        // TODO: something smart here with computed properties
                        if( typeof value === "function" ) {
                            value.call( null, dom[ key ] ? dom[ key ] : null );
                        } else {
                            dom[ key ] = value;
                        }
                    }
                }
            }
            else if( Array.isArray( prop ) && !isDomLiteral( prop ) ) {
                loop( prop )
            }
            else if( isDomLiteral( prop ) ) {
                dom.appendChild( diteral( prop ) );
            }
            else if( typeof prop === "string" ) {
                dom.appendChild( document.createTextNode( prop ) );
            }
        });
    })( rest );

    return dom;
}