export function initSimpleTemplate() {
    for(let usage of document.querySelectorAll('template[use]')) {
        let template = document.querySelector(usage.getAttribute('use')).content,
            parent = usage.parentNode,
            next = usage.nextSibling,
            lastContent = document.importNode(template, true);

        let data = usage.dataset;

        updateContent(lastContent, Object.assign({ index: 0 }, data));

        parent.replaceChild(lastContent, usage);

        let repeat = parseInt(usage.getAttribute('repeat') || '1');

        for(let i = 1; i <= repeat; ++i) {
            let content = document.importNode(template, true);
            updateContent(content, Object.assign({ index: i }, data));
            if(!next) {
                parent.appendChild(content);
            } else {
                parent.insertBefore(content, next);
            }
            lastContent = content;
        }
    }

    function updateContent(d, context) {
        for(let ele of d.querySelectorAll('[name]')) {
            let name = ele.getAttribute('name');
            for(let key of Object.keys(context)) {
                name = name.replace(new RegExp(`{{${key}}}`, 'g'), context[key]);
            }
            ele.setAttribute('name', name);
        }
    }
}
