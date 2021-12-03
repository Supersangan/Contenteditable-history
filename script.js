"use strict";

const redactor = document.querySelector('.el_redactor');
const btnRedact = document.querySelector('.el_redact');
const btnSave = document.querySelector('.el_save');
const btnCancel = document.querySelector('.el_cancel');

if (Object.keys(getSavedVersions()).length === 0) {
    saveNewVersion();
} else {
    setLastVersion();
    createSelect();
}

// редактирование
btnRedact.addEventListener('click', function () {
    redactor.contentEditable = true;
    redactor.classList.add('redactor_editable');
    btnRedact.disabled = true;
    btnSave.disabled = false;
    btnCancel.disabled = false;
});

// сохранение
btnSave.addEventListener('click', function () {
    saveNewVersion();
    redactor.contentEditable = false;
    redactor.classList.remove('redactor_editable');
    btnRedact.disabled = false;
    btnSave.disabled = true;
    btnCancel.disabled = true;
});

// отмена
btnCancel.addEventListener('click', function () {
    setLastVersion();
    redactor.contentEditable = false;
    redactor.classList.remove('redactor_editable');
    btnRedact.disabled = false;
    btnSave.disabled = true;
    btnCancel.disabled = true;
});

// получение сохраненных версий
function getSavedVersions() {
    let savedVersions = window.localStorage.getItem('savedVersions') || '{}';

    // парсим строку с версиями в объект
    savedVersions = JSON.parse(savedVersions);
    return savedVersions;
}

// сохранение новой версии
function saveNewVersion() {
    let savedVersions = getSavedVersions();
    let text = redactor.textContent;
    let now = new Date().toLocaleString();
    let newTextVersion = {
        date: now,
        text: text
    };

    // добавляем новую версию
    savedVersions[Object.keys(savedVersions).length] = newTextVersion;
    // сохраняем новую версию
    window.localStorage.setItem('savedVersions', JSON.stringify(savedVersions));
}

// создание выпадающего списка
function createSelect() {
    let savedVersions = getSavedVersions();
    let container = document.querySelector('.container');
    let label = document.createElement('label');
    let select = document.createElement('select');

    label.classList.add('select-label');
    label.for = 'select';
    label.textContent = 'Выберите сохраненную версию:';

    select.classList.add('select');

    for (let i = Object.keys(savedVersions).length - 1; i >= 0; i--) {
        let option = document.createElement('option');

        option.textContent = savedVersions[i].date;
        option.value = i;
        select.append(option);
    }

    label.append(select);
    container.append(label);

    select.addEventListener('change', function () {
        let version = this.value;
        redactor.textContent = savedVersions[version].text;
    });
}

function setLastVersion() {
    let savedVersions = getSavedVersions();
    redactor.textContent = savedVersions[Object.keys(savedVersions).length - 1].text;
}