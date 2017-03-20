import { elementType, fireEvent } from "./helper.js";

export function getAllElements() {
    return [].slice.call(document.querySelectorAll('input[name][type=checkbox], input[name][type=text], textarea[name], select[name]'));
}

export function get(elem) {
    switch(elementType(elem)) {
        case 'simple':
            return elem.value;
        case 'checkbox':
            return elem.checked;
    }
}

export function set(elem, value, fireOnChange) {
    switch(elementType(elem)) {
        case 'simple':
            elem.value = value;
            break;
        case 'checkbox':
            elem.checked = !!value;
            break;
    }
    if(fireOnChange !== false) {
        fireEvent(elem, 'change');
    }
}

export function setAll(data, fireOnChange) {
    for(let key of Object.keys(data)) {
        let elem = document.querySelector(`[name="${key}"]`);

        set(elem, data[key], fireOnChange);
    }
}

export function load() {
    if(localStorage.getItem('current')) {
        let data = JSON.parse(localStorage.getItem('current'));
        setAll(data);
    }
}

export function update(data) {
    let d = JSON.parse(localStorage.getItem('current'));

    store(Object.assign(d, data));
}

export function store(data) {
    localStorage.setItem('current', JSON.stringify(data));
}



const deps = [
    [ 'initiative-basis', [ 'in', 'k', 'g' ] , (v) => v.in + v.k + v.g ],
    [ 'initiative', [ ':initiative-basis', ':initiative-bonus' ] , (v) => v['initiative-basis'] + v['initiative-bonus'] ],
    [ 'wound-threshold-basis', [ 'str', 'ko', 'k' ], (v) => Math.round((v.str + v.ko * 2 + v.k)/5) ],
    [ 'wound-threshold', [ ':wound-threshold-basis', ':wound-threshold-bonus' ], (v) => v['wound-threshold-basis'] + v['wound-threshold-bonus'] ],
    [ 'mana-basis', [ 'kl', 'in', 'mu', 'g', 'm' ], v => {
        if(!v.m) { return '' }
        return (v.kl + v.in + v.mu + v.g + v.m + v.m) * 5
    }],
    [ 'mana-max', [ ':mana-basis', ':mana-bonus', ':mana-buy' ], v => v['mana-basis'] + v['mana-bonus'] + v['mana-buy']]
];

export function updateCalculatedData() {
    for(let [ target, sources, fn ] of deps) {
        let elem = document.getElementsByName(target)[0];
        updateValues(elem, sources, fn);
    }
}

export function initCalculatedData() {
    for(let [ target, sources, fn ] of deps) {
        let elem = document.getElementsByName(target)[0];
        updateValues(elem, sources, fn);
        let selectors = [];
        for(let src of sources) {
            if(':' === src.charAt(0)) {
                selectors.push(`[name="${src.substr(1)}"]`);
            } else {
                selectors.push(`[name^="${src}-"]`);
            }
        }

        for(let e of document.querySelectorAll(selectors.join(', '))) {
            e.addEventListener('change', () => {
                updateValues(elem, sources, fn);
            });
        }
    }
}




function updateValues(targetElement, sources, fn) {
    targetElement.value = fn(getValues(sources)) || '';
    fireEvent(targetElement, 'change');
}

function getValues(names) {
    let result = {};
    for(let name of names) {
        result[name.replace(/^:/, '')] = getValue(name);
    }
    return result;
}

function getValue(name) {
    if(':' === name.charAt(0)) {
        return document.getElementsByName(name.substr(1))[0].value|0;
    } else {
        for (let i = 5; i > 0; i--) {
            let elem = document.getElementsByName(`${name}-${i}`)[0];
            if (elem && elem.checked) {
                return i;
            }
        }
        return 0;
    }
}
