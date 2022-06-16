window.addEventListener("load", function (e) {
  function toCurrency(price) {
    return new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "usd",
    }).format(price);
  }
  const countPrice = document.querySelectorAll(".count_price");
  const price = document.querySelectorAll(".price");
  const count = document.querySelectorAll(".count");
  const total = document.querySelector(".total");
  const cardContent = document.querySelectorAll(".card-content p");

  cardContent.forEach((card) => {
    card.innerHTML = toCurrency(card.innerHTML);
  });

  total.innerHTML = toCurrency(total.innerHTML);

  countPrice.forEach((product, index) => {
    product.innerHTML = toCurrency(
      price[index].innerHTML * count[index].innerHTML
    );
    price[index].innerHTML = toCurrency(price[index].innerHTML);
  });

  const cardBox = document.querySelector("#card");

  cardBox.addEventListener("click", (e) => {
    const contains = e.target.classList.contains("remove-btn");
    if (contains) {
      const id = e.target.getAttribute("id");
      fetch("/card/delete/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.products.length > 0) {
            const html = card.products
              .map((product) => {
                return `
                            <tr>
                                    <td>${product.type}</td>
                                    <td class="price">${toCurrency(
                                      product.price
                                    )}</td>
                                    <td class="count">${product.count}</td>
                                    <td class="count_price">${toCurrency(
                                      +product.price * product.count
                                    )}</td>
                                    <td>
                                        <button id="${product.id}" data-id="${
                  product.id
                }" class="btn remove-btn" style="background-color: red;">Delete</button>
                                    </td>
                                </tr>
                            `;
              })
              .join("");

            cardBox.querySelector("tbody").innerHTML = html;
            cardBox.querySelector(".total").innerHTML = toCurrency(card.price);
          } else {
            cardBox.innerHTML = "<h2>Card is empty</h2>";
          }
        });
    }
  });
});
