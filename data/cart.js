export let cart = JSON.parse(localStorage.getItem("cart"));
if(!cart){
    cart = [
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
        }
    ];
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId)
{
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
        console.log(cart)
    }

    saveToStorage()
}

export function removeFromCart(productId)
{
    const newCart = [];

    cart.forEach((cartItem) => {
        if (productId !== cartItem.productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage()
}
