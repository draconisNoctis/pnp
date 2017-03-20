import { getAllElements, set, setAll, store, updateCalculatedData } from "./data.js";
import { $ } from "./helper.js"

export function initMenu() {
    let themeElements = document.getElementsByName('theme'),
        theme = localStorage.getItem('theme');
    themeElements[0].checked = true;
    for(let elem of themeElements) {
        elem.addEventListener('click', () => {
            setTheme(elem.value);
            localStorage.setItem('theme', elem.value);
        });
        if(theme && elem.value === theme) {
            elem.checked = true;
            setTheme(theme);
        }
    }


    document.querySelector('#export').addEventListener('click', () => {
        let data = localStorage.getItem('current');
        download('Charakter.json', data);
    });

    document.querySelector('#import').addEventListener('change', (event) => {
        for(let file of event.target.files) {
            let reader = new FileReader();

            reader.onload = () => {
                let data = JSON.parse(b64ToUtf8(reader.result));
                reset();
                setAll(data);
                store(data);
                updateCalculatedData();
            };

            reader.readAsText(file);
        }
    });

    $('#save').addEventListener('click', () => {
        let data = JSON.parse(localStorage.getItem('current')),
            key = `character::${data.name}`;

        if(!data.name) {
            return alert('Es wird ein Name benötigt.')
        }

        if(localStorage.getItem(key)) {
            if(!confirm(`Charakter "${data.name}" exisitiert schon, überschreiben?`)) {
                return;
            }
        }

        localStorage.setItem(key, JSON.stringify(data));

        updateAvailableChars();

        alert('Gespeichert');
    });

    document.querySelector('#reset').addEventListener('click', () => {
        reset();
        store({});
    });

    document.querySelector('#delete').addEventListener('click', () => {
        let data = JSON.parse(localStorage.getItem('current'));
        reset();
        store({});
        localStorage.removeItem(`character::${data.name}`);
        alert('Charakter gelöscht');
        updateAvailableChars();
    });

    updateAvailableChars();
}

function reset() {
    getAllElements().forEach(elem => set(elem, '', false));
    updateCalculatedData();
}

function download(filename, content) {
    const a = document.createElement('a');
    a.setAttribute('href', `data:application/json,${utf8ToB64(content)}`);
    a.setAttribute('download', filename);
    a.click();
}

function setTheme(theme) {
    document.documentElement.setAttribute('theme', theme);
}

function utf8ToB64(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function b64ToUtf8(data) {
    return decodeURIComponent(escape(window.atob(data)));
}

function updateAvailableChars() {
    let elem = $('#available-chars');

    elem.innerHTML = '';

    let keys = Object.keys(localStorage).filter(key => key.startsWith('character::'));

    for(let key of keys) {
        let name = key.substr(11),
            li = document.createElement('li'),
            span = document.createElement('span');

        li.classList.add('m-menubar__item');
        span.classList.add('m-menubar__label');

        span.innerText = name;

        li.appendChild(span);

        li.addEventListener('click', () => {
            let data = JSON.parse(localStorage.getItem(key));
            reset();
            setAll(data, false);
            updateCalculatedData();
            store(data);
        });

        elem.appendChild(li);
    }
}
