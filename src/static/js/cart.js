function removeProductFromCart(event, cartId, productId) {
  event.preventDefault();

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "removeProduct",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Product removed:", data);
      window.location.reload(); //or remove product from DOM without refreshing the window
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
