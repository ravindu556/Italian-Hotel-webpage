// payment.js

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsList = document.getElementById('payment-cart-items');
    const cartTotalElement = document.getElementById('payment-total');
    const orderSummaryTitle = document.getElementById('order-summary-title');
    const checkoutForm = document.querySelector('form');
    const fullNameInput = document.querySelector('.input-box input[placeholder="Ravindu dilhara"]');
    const emailInput = document.querySelector('.input-box input[placeholder="ravindu@gmail.com"]');
    const addressInput = document.querySelector('.input-box input[placeholder="agulana,colombo"]');
    const cityInput = document.querySelector('.input-box input[placeholder="moratuwa"]');
    const stateInput = document.querySelector('.input-box input[placeholder="Western"]');
    const nameOnCardInput = document.querySelector('.input-box input[placeholder="Ravindu Edirisingha"]');
    const cardNumberInput = document.querySelector('.input-box input[placeholder="1111 2222 3333 4444"]');
    const expMonthInput = document.querySelector('.input-box input[placeholder="octomber"]');
    const expYearInput = document.querySelector('.input-box input[placeholder="2028"]');
    const cvnInput = document.querySelector('.input-box input[placeholder="111"]');
    const errorMessages = {
        fullName: document.getElementById('fullNameError'),
        email: document.getElementById('emailError'),
        address: document.getElementById('addressError'),
        city: document.getElementById('cityError'),
        state: document.getElementById('stateError'),
        nameOnCard: document.getElementById('nameOnCardError'),
        cardNumber: document.getElementById('cardNumberError'),
        expMonth: document.getElementById('expMonthError'),
        expYear: document.getElementById('expYearError'),
        cvn: document.getElementById('cvnError')
    };

    // Retrieve cart data from localStorage
    const storedCart = localStorage.getItem('shoppingCart');
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // Display cart items
    if (cart.length > 0) {
        if (orderSummaryTitle) {
            orderSummaryTitle.textContent = 'Your Order:';
        }
        let total = 0;
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - ${item.price}`;
            cartItemsList.appendChild(listItem);
            total += parseFloat(item.price.replace('$', ''));
        });
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    } else {
        if (orderSummaryTitle) {
            orderSummaryTitle.textContent = 'Your Order:';
        }
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalElement.textContent = `$0.00`;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            let isValid = true;

            // Reset error messages
            for (const key in errorMessages) {
                if (errorMessages.hasOwnProperty(key)) {
                    errorMessages[key].textContent = '';
                }
            }

            // Validate Full Name
            if (fullNameInput && fullNameInput.value.trim() === '') {
                errorMessages.fullName.textContent = 'Full Name is required.';
                errorMessages.fullName.style.color = 'red';
                isValid = false;
            }


            if (emailInput && emailInput.value.trim() === '') {
                errorMessages.email.textContent = 'Email is required.';
                errorMessages.email.style.color = 'red';
                isValid = false;
            } else if (emailInput && !isValidEmail(emailInput.value.trim())) {
                errorMessages.email.textContent = 'Invalid email format.';
                errorMessages.email.style.color = 'red';
                isValid = false;
            }


            if (addressInput && addressInput.value.trim() === '') {
                errorMessages.address.textContent = 'Address is required.';
                errorMessages.address.style.color = 'red';
                isValid = false;
            }


            if (cityInput && cityInput.value.trim() === '') {
                errorMessages.city.textContent = 'City is required.';
                errorMessages.city.style.color = 'red';
                isValid = false;
            }


            if (stateInput && stateInput.value.trim() === '') {
                errorMessages.state.textContent = 'State is required.';
                errorMessages.state.style.color = 'red';
                isValid = false;
            }


            if (nameOnCardInput && nameOnCardInput.value.trim() === '') {
                errorMessages.nameOnCard.textContent = 'Name on Card is required.';
                errorMessages.nameOnCard.style.color = 'red';
                isValid = false;
            }


            if (cardNumberInput && cardNumberInput.value.trim() === '') {
                errorMessages.cardNumber.textContent = 'Card Number is required.';
                errorMessages.cardNumber.style.color = 'red';
                isValid = false;
            } else if (cardNumberInput && !/^\d{12,19}$/.test(cardNumberInput.value.trim())) {
                errorMessages.cardNumber.textContent = 'Invalid Card Number format (numbers only, 12-19 digits).';
                errorMessages.cardNumber.style.color = 'red';
                isValid = false;

            }


            if (expMonthInput && expMonthInput.value.trim() === '') {
                errorMessages.expMonth.textContent = 'Expiration Month is required.';
                errorMessages.expMonth.style.color = 'red';
                isValid = false;
            }


            if (expYearInput && expYearInput.value.trim() === '') {
                errorMessages.expYear.textContent = 'Expiration Year is required.';
                errorMessages.expYear.style.color = 'red';
                isValid = false;
            } else if (expYearInput && !/^\d{4}$/.test(expYearInput.value.trim())) {
                errorMessages.expYear.textContent = 'Invalid Expiration Year format (YYYY).';
                errorMessages.expYear.style.color = 'red';
                isValid = false;
            } else if (expYearInput) {
                const currentYear = new Date().getFullYear();
                const enteredYear = parseInt(expYearInput.value);
                if (enteredYear < currentYear) {
                    errorMessages.expYear.textContent = 'Expiration Year cannot be in the past.';
                    errorMessages.expYear.style.color = 'red';
                    isValid = false;
                }
            }


            if (cvnInput && cvnInput.value.trim() === '') {
                errorMessages.cvn.textContent = 'CVN is required.';
                errorMessages.cvn.style.color = 'red';
                isValid = false;
            } else if (cvnInput && !/^\d{3,4}$/.test(cvnInput.value.trim())) {
                errorMessages.cvn.textContent = 'Invalid CVN format (3 or 4 digits).';
                errorMessages.cvn.style.color = 'red';
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            } else {
                alert('Checkout successful! Ordered items: ' + cart.map(item => item.name).join(', ') + '. Total: $' + parseFloat(cartTotalElement.textContent.replace('$', '')).toFixed(2));

                // Clear the cart from localStorage after successful (simulated) payment
                localStorage.removeItem('shoppingCart');


                window.location.href = 'index.html';
            }
        });
    }


    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});