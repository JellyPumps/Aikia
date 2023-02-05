fetch('items.json')
  .then(response => response.json())
  .then(data => {
    const items = data.items
    const categories = [
      "Seating",
      "Sleeping or Lying",
      "Entertainment",
      "Tables",
      "Storage",
      "Bedroom",
      "Living",
      "Dining",
      "Vanity",
      "Patio"
    ];

    // Featured items on home page

    let categoryItem;

    const display = categories.map(category => {
      categoryItem = items.find(item => item.category === category);

      if (!categoryItem) {
        return `<div class="card seccard">
                  <h2>${category}</h2>
                  <p>Work In Progress</p>
                </div>`;
      }

      return `<div class="card">
                <h2>${category}</h2>
                <img src="${categoryItem.image}" alt="${categoryItem.name}" />
              </div>`;
    });

    document.querySelector(".featured-items").innerHTML = display.join("");

    // Search items

    const searchBtn = document.querySelector(".search-icon");
    const backBtn = document.querySelector(".back-button");
    const searchInput = document.querySelector(".search-box");
    const featuredItemsContainer = document.querySelector(".featured-items-container");
    const searchResult = document.querySelector(".search-result");
    const searchResultContainer = document.querySelector(".search-result-container");

    let cart = [];

    searchBtn.addEventListener("click", function() {
        const searchTerm = searchInput.value;
        // Hide the featured items container
        featuredItemsContainer.style.display = "none";

        //Show / Hide
        searchResultContainer.style.display = "flex";

        if (!searchTerm) {
            searchResultContainer.style.display = "none";
        }
    
        // Clear any previous search results
        searchResult.innerHTML = "";
    
        const filteredItems = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        // Add the filtered items as cards to the search result section
        filteredItems.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.image}" alt="${item.name}" />
            <p>${item.price} ¥</p>
            <p>${item.description}</p>
            <button class="add-to-cart">Add to Cart</button>
            `;
            searchResult.appendChild(card);

            card.querySelector(".add-to-cart").addEventListener("click", function() {
                cart.push(item.name);
                console.log(cart);
                if (localStorage.getItem("cart")===null) {
                    localStorage.setItem("cart", JSON.stringify(cart))
                } else {
                    const storedCart = JSON.parse(localStorage.getItem("cart"));
                    cart.forEach(item => {
                        // Check if the item is already in the storedCart
                        const index = storedCart.indexOf(item);
                        if (index === -1) {
                        // If not, add it to the storedCart
                        storedCart.push(item);
                        }
                    });
                    // Update localStorage with the new cart
                    localStorage.setItem("cart", JSON.stringify(storedCart));
                }
            });
        });
    });

    backBtn.addEventListener("click", function() {
        searchResultContainer.style.display = "none";
        featuredItemsContainer.style.display = "flex";
        document.querySelectorAll('.gen-sec').forEach(section=> {
            section.parentNode.removeChild(section);
        });
    });

    // Section pages
    const cards = document.querySelectorAll('.seccard');
    const navLinks = document.querySelectorAll('.navigation a');
    const sections = document.querySelectorAll('section');

    const createBodyContainer = function(headerText) {
        // Create the section element
        const bodyContainer = document.createElement('section');
        bodyContainer.classList.add('gen-sec','body-container');

        // Create the div for the header
        const bodyHeadContainer = document.createElement('div');
        bodyHeadContainer.classList.add('body-head-container');

        // Create the h1 element and set its value
        const bodyHead = document.createElement('h1');
        bodyHead.innerText = headerText;

        const bodyHeadContainerT = document.createElement('div');
        bodyHeadContainerT.classList.add('body-head-container');

        const backButton = document.createElement('i');
        backButton.classList.add('fa-solid', 'fa-backward', 'back-button');
        bodyHeadContainerT.appendChild(backButton);

        // Append the h1 to the div for the header
        bodyHeadContainer.appendChild(bodyHead);

        // Create the div for the main content
        const bodyMain = document.createElement('div');
        bodyMain.classList.add('body-main');

        // Append the header and main content divs to the section
        bodyContainer.appendChild(bodyHeadContainer);
        bodyContainer.appendChild(bodyHeadContainerT);
        bodyContainer.appendChild(bodyMain);

        // Append the section to the document
        document.body.appendChild(bodyContainer);

        sections.forEach(section => {
            if (section !== bodyContainer) {
                section.style.display = 'none';
            }
        });
    };

    for (let card of cards) {
        card.addEventListener('click', function() {
            createBodyContainer(this.querySelector('h2').innerText);
        });
    }

    for (let link of navLinks) {
        link.addEventListener('click', function() {
            createBodyContainer(this.innerText);
        });
    }
})
.catch(error => {
    console.error('Error reading JSON file:', error);
});
