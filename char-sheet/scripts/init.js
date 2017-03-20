import { fireOnChange } from './helper.js'
import { initSimpleTemplate } from "./simple-templates.js";
import { initMenu } from "./menu.js";
import { getAllElements, get, load, update, initCalculatedData } from "./data.js";

export function init() {
    "use strict";

    initSimpleTemplate();
    initMenu();
    load();
    initCalculatedData();

    let data = {};
    for(let elem of getAllElements()) {
        elem.addEventListener('change', () => {
            data[elem.getAttribute('name')] = get(elem);

            update(data);
        });
    }

    for(let elem of document.querySelectorAll('input[type=checkbox].m-circle')) {
        elem.addEventListener('change', () => {
            let r = elem;
            if(elem.checked) {
                while(r.previousElementSibling && r.previousElementSibling.matches('input[type=checkbox].m-circle')) {
                    r = r.previousElementSibling;
                    r.checked = true;
                    fireOnChange(r);
                }
            } else {
                while(r.nextElementSibling && r.nextElementSibling.matches('input[type=checkbox].m-circle')) {
                    r = r.nextElementSibling;
                    r.checked = false;
                    fireOnChange(r);
                }
            }
        })
    }





}

init();
