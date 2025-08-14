const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.querySelector(".filter");
const clearBtn = document.getElementById("clear");
const addBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(event) {
  event.preventDefault();

  let itemName = itemInput.value;

  if (itemName === "") {
    alert("Please add an item!");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    itemToEdit.classList.remove("edit-mode");
    removeItem(itemToEdit, itemToEdit.innerText);
    isEditMode = false;
  } else {
    if (checkIfItemsExists(itemName)) {
      alert("Item already exsists!");
      return;
    }
  }

  addItemToDOM(itemName);
  addItemToStorage(itemName);

  itemInput.value = "";
  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.textContent = item;

  const btn = document.createElement("button");
  btn.classList.add("remove-item", "btn-link", "text-red");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-xmark");

  btn.appendChild(icon);
  li.appendChild(btn);
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function onClickItem(event) {
  const item = event.target.closest("li");
  const isDeleteClicked = Boolean(event.target.closest(".remove-item"));

  if (isDeleteClicked) {
    removeItem(item, item.innerText);
  } else {
    setItemToEdit(item);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  addBtn.innerHTML = '<i class= "fa-solid fa-pen"></i>  Update Item';
  itemInput.value = item.textContent;
  addBtn.style.backgroundColor = "#228B22";
}

function removeItem(item, itemName) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== itemName);
  item.remove();

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
  checkUI();
}

function clearAll() {
  if (confirm("Are you sure?")) {
    while (itemList.firstChild) {
      itemList.firstChild.remove();
    }
    localStorage.removeItem("items");
    checkUI();
  }
}

function checkUI() {
  itemInput.value = "";

  const items = document.querySelectorAll("li");
  const hasItems = items.length > 0;
  if (hasItems) {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  } else {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  }

  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  addBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

function debounce(func, delay) {
  let timerId;

  return function (event) {
    const text = event.target.value.toLowerCase();
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func(text);
    }, delay);
  };
}

function filterItems(searchText) {
  const items = document.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(searchText) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkIfItemsExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function init() {
  const debouncedFilter = debounce(filterItems, 300);

  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAll);
  itemFilter.addEventListener("input", debouncedFilter);
  document.addEventListener("DOMContentLoaded", displayItems);
}

init();
