import { cart, removeFromCart } from '../data/cart.js';
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const deliveryOptions = {};

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
});

function renderCartItems() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const product = products.find(p => p.id === productId);
        if (!product) return;

        cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatCurrency(product.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              
              <span class="link-primary js-update-link" data-product-id="${product.id}">Update</span>
              <input class="quantity-input js-quantity-input" data-product-id="${product.id}" type="number" min="1" value="${cartItem.quantity}">
              <span class="link-primary save-quantity-link js-save-link" data-product-id="${product.id}">Save</span>
              
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            <div class="delivery-option">
              <input type="radio" checked class="delivery-option-input" name="delivery-option-${product.id}" value="0">
              <div>
                <div class="delivery-option-date">Tuesday, June 21</div>
                <div class="delivery-option-price">FREE Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${product.id}" value="499">
              <div>
                <div class="delivery-option-date">Wednesday, June 15</div>
                <div class="delivery-option-price">$4.99 - Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${product.id}" value="999">
              <div>
                <div class="delivery-option-date">Monday, June 13</div>
                <div class="delivery-option-price">$9.99 - Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    });

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    attachDeleteListeners();
    attachUpdateListeners();
    attachSaveListeners()
    attachDeliveryOptionListeners();
    updateSummaryTotals();
}

function attachUpdateListeners() {
    document.querySelectorAll('.js-update-link').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const input = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
            const saveLink = document.querySelector(`.js-save-link[data-product-id="${productId}"]`);

            input.style.display = 'inline-block';
            saveLink.style.display = 'inline-block';
            button.style.display = 'none';
        });
    });
}

function attachSaveListeners() {
    document.querySelectorAll('.js-save-link').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const input = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
            const newQuantity = parseInt(input.value);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                const cartItem = cart.find(item => item.productId === productId);
                if (cartItem) {
                    cartItem.quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                }
            }
        });
    });
}


function attachDeleteListeners() {
    document.querySelectorAll('.js-delete-link').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            removeFromCart(productId);
            delete deliveryOptions[productId];

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            if (container) container.remove();

            updateSummaryTotals();
        });
    });
}

function attachDeliveryOptionListeners() {
    document.querySelectorAll('.delivery-option-input').forEach((input) => {
        input.addEventListener('change', () => {
            const productId = input.name.replace('delivery-option-', '');
            const shippingCents = parseInt(input.value);
            deliveryOptions[productId] = shippingCents;
            updateSummaryTotals();
        });
    });
}

function updateSummaryTotals() {
    let itemTotalCents = 0;
    let shippingCents = 0;
    let cartItems = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            itemTotalCents += product.priceCents * cartItem.quantity;
            cartItems += cartItem.quantity;

            const deliveryCost = deliveryOptions[cartItem.productId] ?? 0;
            shippingCents += deliveryCost;
        }
    });

    const subtotalCents = itemTotalCents + shippingCents;
    const taxCents = Math.round(subtotalCents * 0.10);
    const totalCents = subtotalCents + taxCents;

    document.getElementById('cart-count-header').innerText = cartItems;
    document.getElementById('summary-item-count').innerText = cartItems;
    document.getElementById('summary-item-total').innerText = formatCurrency(itemTotalCents);
    document.getElementById('summary-shipping').innerText = formatCurrency(shippingCents);
    document.getElementById('summary-subtotal').innerText = formatCurrency(subtotalCents);
    document.getElementById('summary-tax').innerText = formatCurrency(taxCents);
    document.getElementById('summary-total').innerText = formatCurrency(totalCents);
}
