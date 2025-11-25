document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const menuItemsContainer = document.querySelector('.menu-items');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const orderButton = document.getElementById('view-cart-button');
    let allMenuItems = [];
    let cart = [];

    // Function to update the cart display
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item-details">
                    ${item.name} <span>(${item.price})</span>
                </div>
                <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(listItem);
            total += parseFloat(item.price.replace('$', ''));
        });
        cartTotalElement.textContent = `$${total.toFixed(2)}`;

        // Add event listeners for remove buttons
        const removeButtons = document.querySelectorAll('.remove-from-cart-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.dataset.index);
                removeFromCart(indexToRemove);
            });
        });
    }

    // Function to add an item to the cart
    function addToCart(name, price) {
        cart.push({ name: name, price: price });
        updateCartDisplay();

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Function to remove an item from the cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    fetch('menu_data.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const categories = xmlDoc.querySelectorAll('category');

            categories.forEach(category => {
                const categoryName = category.getAttribute('name');
                const items = category.querySelectorAll('item');
                items.forEach(item => {
                    const name = item.querySelector('name').textContent;
                    const price = item.querySelector('price').textContent;
                    const description = item.querySelector('description').textContent;
                    const image = item.querySelector('image').textContent;
                    allMenuItems.push({ category: categoryName, name: name, price: price, description: description, image: image });
                });
            });

            // Display all items on initial load
            displayMenuItems(allMenuItems);

            // Load cart from localStorage if available
            const storedCart = localStorage.getItem('shoppingCart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
                updateCartDisplay();
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing XML:', error);
            menuItemsContainer.innerHTML = '<p>Failed to load menu data.</p>';
        });

    function displayMenuItems(items) {
        menuItemsContainer.innerHTML = '';
        items.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item', item.category);
            menuItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
                <p class="description">${item.description}</p>
                <button class="add-to-cart-btn" data-item-name="${item.name}" data-item-price="${item.price}">Add to Cart</button>
            `;
            menuItemsContainer.appendChild(menuItemDiv);
        });

        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.dataset.itemName;
                const itemPrice = this.dataset.itemPrice;
                addToCart(itemName, itemPrice);
            });
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (category === 'all') {
                displayMenuItems(allMenuItems);
            } else {
                const filteredItems = allMenuItems.filter(item => item.category === category);
                displayMenuItems(filteredItems);
            }
        });
    });

    // Add event listener to the ORDER button
    if (orderButton) {
        orderButton.addEventListener('click', function() {

            window.location.href = 'payment.html';
        });
    }
});