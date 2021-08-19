document.addEventListener("DOMContentLoaded", onReady);

let list;
let input;
let toDoList = JSON.parse(localStorage.getItem("list") ?? "{}");

function onReady() {
    list = document.querySelector("ul");

    input = document.querySelector(".input-wrapper > input");
    input.onkeyup = ev => {
        if(ev.keyCode === 13)
            addNewItem();
    };

    const dateOptions = { 
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    document.querySelector("#date")
        .textContent = new Date().toLocaleDateString("tr", dateOptions);

    Object.keys(toDoList)
        .sort((a, b) => toDoList[a].checked ? -1 : 1)
        .forEach((elId => 
        addNewItem(elId, toDoList[elId].text, toDoList[elId].checked)));
}

function addNewItem(curId, text, checked) {
    const textContent = text ?? input.value;

    if(!textContent)
        return;

    const elId = curId ?? `check-${Date.now()}`;

    const li = document.createElement("li");
    if(checked)
        li.className = "completed";

    // Create label.
    const label = document.createElement("label");
    label.textContent = textContent;
    label.htmlFor = elId;

    // Create checkbox.
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked ?? false;
    checkbox.id = elId;

    // Create checkmark div
    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    
    li.appendChild(checkbox);
    li.appendChild(checkmark);
    li.appendChild(label);

    li.oncontextmenu = ev => renameItem(ev, label, checkbox.checked);
    checkbox.onchange = () => onItemClick(li, checkbox.checked);

    list.appendChild(li);

    input.value = "";

    if(!curId) {
        toDoList[elId] = {
            text: textContent,
            checked: checkbox.checked
        };
        updateLocalStorage();
    }
}

function renameItem(ev, label, checked) {
    ev.preventDefault();
    
    const elId = label.previousSibling.previousSibling.id;

    if(!checked) {
        const text = prompt("Rename", label.innerText);
        if(text) {
            label.textContent = text;
            toDoList[elId].text = text;
        }
    } else {
        if(confirm("Do you want to delete!")) {
            list.removeChild(label.parentElement);
            delete toDoList[elId];
        }
    }
    
    updateLocalStorage();
}

function onItemClick(li, checked) {
    if(checked) {
        li.classList.add("completed");
        list.insertBefore(li, list.children[0]);
    } else {
        li.classList.remove("completed");
        list.appendChild(li);
    }

    const elIndex = li.querySelector("input").id;
    toDoList[elIndex].checked = checked;

    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("list", JSON.stringify(toDoList));
}