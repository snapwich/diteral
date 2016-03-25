
function isWindow( obj ) {
    return obj != null && obj === obj.window;
}

function type( obj ) {
    if ( obj == null ) {
        return obj + "";
    }
    
    return typeof obj === "object" || typeof obj === "function" ?
        {}[ toString.call( obj ) ] || "object" :
        typeof obj;
}

export function isPlainObject( obj ) {
    var key;

    if ( type( obj ) !== "object" || obj.nodeType || isWindow( obj ) ) {
        return false;
    }

    if ( obj.constructor &&
            !obj.hasOwnProperty("constructor") &&
            !{}.hasOwnProperty.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
        return false;
    }

    for ( key in obj ) {}

    return key === undefined || obj.hasOwnProperty( key );
}