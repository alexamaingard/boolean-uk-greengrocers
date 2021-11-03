const groceriesList = [
  {
    id: "001-beetroot",
    name: "beetroot",
    price: 0.75,
    type: 'vegetable'
  },
  {
    id: "002-carrot",
    name: "carrot",
    price: 0.55,
    type: 'vegetable'
  },
  {
    id: "003-apple",
    name: "apple",
    price: 0.35,
    type: 'fruit'  
  },
  {
    id: "004-apricot",
    name: "apricot",
    price: 0.45,
    type: 'fruit'
  },
  {
    id: "005-avocado",
    name: "avocado",
    price: 0.90,
    type: 'fruit'
  },
  {
    id: "006-bananas",
    name: "bananas",
    price: 0.75,
    type: 'fruit'
  },
  {
    id: "007-bell-pepper",
    name: "bell-pepper",
    price: 0.65,
    type: 'vegetable'
  },
  {
    id: "008-berry",
    name: "berry",
    price: 0.75,
    type: 'fruit'
  },
  {
    id: "009-blueberry",
    name: "blueberry",
    price: 0.25,
    type: 'fruit'
  },
  {
    id: "010-eggplant",
    name: "eggplant",
    price: 0.70,
    type: 'vegetable'
  }
]

// TOOL FUNCTIONS
function createElement(tag){
  const element = document.createElement(tag);
  return element;
}

function createElementWithText(tag, text){
  const element = document.createElement(tag);
  element.innerText = text;
  return element;
}

function createElementWithClass(tag, className){
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function createElementWithTextAndClass(tag, text, className){
  const element = createElementWithText(tag, text);
  element.className = className;
  return element;
}

function createImageElement(item, className = ''){
  const itemImg = createElementWithClass('img', className);
  itemImg.setAttribute('src', `assets/icons/${item.id}.svg`);
  itemImg.setAttribute('alt', item.name);
  return itemImg;
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

//MAIN FUNCTIONS/CODE
const groceriesListContainer = document.querySelector('.store--item-list');
const cartListContainer = document.querySelector('.cart--item-list');
const totalContainer = document.querySelector('.total-number');
let totalPrice = 0;

function increaseQuantityBy1(item){
  const index = myCart.indexOf(item);
  myCart[index].quantity++;
}

function decreaseQuantityBy1(item){
  const index = myCart.indexOf(item);
  myCart[index].quantity--;
}

function resetQuantityOfItem(item){
  const index = myCart.indexOf(item);
  myCart[index].quantity = 0;
}

function deleteItemFromCart(item){
  const index = myCart.indexOf(item);
  myCart.splice(index, 1);
}

function resetTotalPrice(){
  totalPrice = 0;
}

function addItem(item){
  increaseQuantityBy1(item);
  displayCart();
}

function removeItem(item){
  decreaseQuantityBy1(item);
  if (item.quantity < 1){
    resetQuantityOfItem(item);
    deleteItemFromCart(item);
  }
  displayCart();
}

function displayItemInCart(item){
  const element = createElement('li');
  const itemImg = createImageElement(item, 'cart--item-icon');
  const itemName = createElementWithText('p', item.name);
  const removeButton = createElementWithTextAndClass('button', '-', 'quantity-btn remove-btn center');
  removeButton.addEventListener('click', (event) => removeItem(item));
  const amount = createElementWithTextAndClass('span', item.quantity, 'quantity-text center');
  const addButton = createElementWithTextAndClass('button', '+','quantity-btn add-btn center');
  addButton.addEventListener('click', (event) => addItem(item));
  element.append(itemImg, itemName,removeButton, amount, addButton);
  cartListContainer.append(element);
}

function displayCart(){
  cartListContainer.innerText = '';
  myCart.forEach(itemInCart => {
    displayItemInCart(itemInCart);
  })
  resetTotalPrice();
  calculateTotalPrice();
  displayTotalPrice();
}

function calculateTotalPrice(){
  myCart.forEach(itemInCart => {
    totalPrice += itemInCart.price * itemInCart.quantity;
  })
}

function displayTotalPrice(){
  totalContainer.innerText = '£' + totalPrice.toFixed(2);
}

function addItemToCart(item){
  if(myCart.includes(item)){
    increaseQuantityBy1(item);
  }
  else{
    myCart.push(item);
    increaseQuantityBy1(item);
  }
  displayCart();
}

function addStoreItem(item){
  const liEl = createElement('li');
  const divEl = createElementWithClass('div', 'store--item-icon');
  const imgEl = createImageElement(item);
  const button = createElementWithText('button', 'Add to cart');
  button.id = item.name;
  liEl.append(divEl, button);
  divEl.append(imgEl);  
  groceriesListContainer.append(liEl);
}

function listenForAddToCartButtons(){
  groceriesListContainer.addEventListener('click', function(event){
    event.preventDefault();
    const itemToCart = event.target.id;
    const li = event.target.closest('li');
    let itemToAdd;
    if(!li){
      return;
    }
    groceriesList.forEach(item => {
      if (item.name === itemToCart){
        itemToAdd = item;
        return;
      }
    });
    addItemToCart(itemToAdd);
  })
}

function createQuantityKeys(){
  groceriesList.forEach(item => {
    Object.assign(item, {quantity: 0});
  })
}

function initializeStore(type){
  groceriesListContainer.innerText = '';
  groceriesList.forEach(item => {
    if(type === 'all'){
      addStoreItem(item);
    }
    else if(item.type === type){
        addStoreItem(item);
    }
  });
  createQuantityKeys();
}

function createFiltersForm(){
  const typesForm = createElementWithClass('form', 'center');
  const selectTypes = createElement('select');
  selectTypes.setAttribute('name', 'types');
  selectTypes.setAttribute('id', 'types');
  const selectFromOption = createElementWithText('option', 'Filter');
  selectFromOption.value = 'select';
  const fruitOption = createElementWithText('option', 'Fruits');
  fruitOption.value = 'fruit';
  const vegOption = createElementWithText('option', 'Vegetables');
  vegOption.value = 'vegetable';
  const allTypes = createElementWithText('option', 'All');
  allTypes.value = 'all';
  selectTypes.append(selectFromOption, fruitOption, vegOption, allTypes);
  typesForm.append(selectTypes);
  insertAfter(typesForm, document.querySelector('h1'));
  return typesForm;
}

function initializeForm(){
  const filtersForm = createFiltersForm();
  filtersForm.addEventListener('change', function(event){
    const selectedFilter = event.target.value;
    initializeStore(selectedFilter);
  });
}

let myCart = [];
initializeForm();
listenForAddToCartButtons();