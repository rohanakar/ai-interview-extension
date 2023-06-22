// Sample data for demonstration
let defaultItemList = [
    { id: 1, role: "JS Developer", company:'Startup'},
    { id: 2, role: "Java Developer", company:'MNC'},
    { id: 3, role: "Senior Software Devloper", company:'Google'},
];

const generateDescription = (role,company) => {
    
    return `You are an interviewer hiring for a role of ${role} in ${company}. You would be interviewing me . The interview must be interactive i.e you will ask for a question than wait for my response before asking further questions . Try to ask follow up questions if you can for any particular question . Also dont provide any feedback at the end of my answers just give the answer a rating from 0 to 10 . keep the rating very strict . take the interview how a human would take it . Remeber you must wait for my response .` 
}
defaultItemList.forEach(e=>e['description']=generateDescription(e.role,e.company));


let itemList = [];

function saveItemListToStorage() {
    chrome.storage.sync.set({ itemList: itemList }, function () {
        console.log("Item list saved to storage:", itemList);
    });
}

function loadItemListFromStorage() {
    chrome.storage.sync.get(["itemList"], function (result) {
        if (result.itemList) {
            itemList = result.itemList;
            renderItemList();
        } else {
            // If itemList is not present in storage, use the defaultItemList
            reset();
        }
    });
}

function reset(){
    itemList = defaultItemList;
    saveItemListToStorage(); // Persist the default list to storage
    renderItemList();
}



const itemListElement = document.getElementById("itemList");
const addButton = document.getElementById("addButton");
const editScreen = document.getElementById("editScreen");
const editForm = document.getElementById("editForm");
const editroleInput = document.getElementById("editrole");
const editCompanyInput = document.getElementById("editCompany");
const editDescriptionTextarea = document.getElementById("editDescription");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");
const cancelButton = document.getElementById("cancelButton");

// Function to render the list of items
function renderItemList() {
    itemListElement.innerHTML = "";
    itemList.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("py-2", "flex", "items-center", "justify-between");
        listItem.innerHTML = `
      <div>
      <h3 class="text-lg text-white">${item.role}</h3>
      <h3 class="text-lg text-white">${item.company}</h3>
      <p class="text-gray-300">${item.description}</p>
      </div>
      <button data-id="${item.id}" class="editButton px-2 py-1 text-blue-500 hover:underline">Edit</button>
    `;
        itemListElement.appendChild(listItem);
    });
}

// Function to show the edit screen
function showEditScreen(id) {
    editScreen.classList.remove("hidden");
    editScreen.dataset.id = id;
}

// Function to hide the edit screen
function hideEditScreen() {
    editScreen.classList.add("hidden");
    editForm.reset();
}

// Function to handle adding an item
function addItem() {
    const id = itemList.length + 1;
    
    const company = document.getElementById("companyInput").value;
    const role = document.getElementById("roleInput").value;
    const description = generateDescription(role,company);

    itemList.push({ id, role, company, description });
    saveItemListToStorage();
    renderItemList();
}

// Function to handle editing an item
function editItem(id) {
    const item = itemList.find(item => item.id === id);
    if (item) {
        editroleInput.value = item.role;
        editCompanyInput.value = item.company;
        editDescriptionTextarea.value = item.description;
        showEditScreen(id);
    }
}

// Function to handle saving changes
function saveChanges(event) {
    event.preventDefault();
    const id = parseInt(event.target.parentElement.parentElement.dataset.id);
    const role = editroleInput.value;
    const company = editCompanyInput.value;

    const description = editDescriptionTextarea.value;
    const item = itemList.find(item => item.id === id);
    if (item) {
        item.role = role;
        item.description = description;
        item.company = company
        hideEditScreen();
        saveItemListToStorage();
        renderItemList();
    }
}

// Function to handle canceling changes
function cancelChanges() {
    hideEditScreen();
}

// Event listeners
addButton.addEventListener("click", addItem);
resetButton.addEventListener("click", reset);
itemListElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("editButton")) {
        const itemId = parseInt(event.target.dataset.id);
        editItem(itemId);
    }
});
editForm.addEventListener("submit", saveChanges);
cancelButton.addEventListener("click", cancelChanges);
loadItemListFromStorage();
