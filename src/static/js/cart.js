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
