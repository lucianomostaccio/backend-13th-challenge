function removeProductFromCart(event, cartId, productId) {
  event.preventDefault();
  console.log("Cart ID:", cartId); 
  console.log("Product ID:", productId); 

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'removeProduct',
      productId: productId,
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Product removed:', data);
    window.location.reload();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function removeCart(event, cartId) {
  event.preventDefault();

  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.ok) {
      console.log("Cart cleared successfully");
      window.location.reload();
    } else {
      throw new Error('Failed to clear cart');
    }
  })
  .catch(error => {
    console.error("Error clearing cart:", error);
    alert("Error clearing cart. Please try again.");
  });
}

