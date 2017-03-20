
export function fireEvent(elem, eventName) {
    let event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, false, true);
    elem.dispatchEvent(event);
}

export function fireOnChange(elem) {
    fireEvent(elem, 'change');
}



export function elementType(elem) {
    return elem.tagName === 'TEXTAREA' || elem.tagName === 'SELECT' || (elem.tagName === 'INPUT' && elem.type === 'text') ? 'simple' : 'checkbox';
}

export function $(selector) {
    let elements = [].slice.call(document.querySelectorAll(selector)),
        proxy = new Proxy({}, {
            get: (target, name) => {
                if(!elements[0]) return null;

                if(typeof elements[0][name] === 'function') {
                    return (...args) => {
                        return elements.map(element => element[name](...args))[0];
                    }
                } else {
                    return elements[0][name];
                }
            },
            set: (target, name, value) => {
                for(let element of elements) {
                    element[name] = value;
                }
                return true;
            }
        });

    return proxy;
}
