window.jsPDF = window.jspdf.jsPDF

//Generate Item Cards
fetch('items.json')
.then(response=>response.json())
.then(data=>{
    //Extract JSON objects
    const items=data.items;
    //HTML template
    const catalogueTemplate=items.map(item=>{
        let selected = "";
        if(item.status === 'in-stock'){
            selected = " selected";
        }
        return `
        <div class="item selectable">
            <img src="images/${item.image}" alt="${item.description}">
            <h2>${item.name}</h2>
            <p>Price: ${item.price}¥</p>
            <div class="content">
                <p class="description">${item.description}</p>
                <p class="status">${item.status == "in stock" ? "In Stock" : "Out of Stock"}</p>
            </div>
        </div>
        `;
    }).join("");
    //Insert into page
    const catalogue = document.querySelector(".catalogue");
    catalogue.innerHTML=catalogueTemplate;
});

//Submit button state
const orderButton = document.getElementById("order-button");
function checkform() {
    const formElements = document.forms["order-form"].elements;
    let submitBtnActive = true;
    for (let inputEl = 0; inputEl < formElements.length; inputEl++) {
        if (formElements[inputEl].value.length == 0) submitBtnActive = false;
    }
      if (submitBtnActive) {
        orderButton.disabled = false;
    } else {
        orderButton.disabled = "disabled";
    }
}
  

//Make card clickable, and add to form
const formItems = document.querySelector('#itemsf');
const catalogue = document.querySelector(".catalogue");
catalogue.addEventListener('click', function(e) {
    if(e.target.classList.contains('item')) {
        if (e.target.classList.contains('selected')) {
            e.target.classList.remove('selected');
        } else {
            e.target.classList.add('selected');
        }
        updateItemsField();
    }
});
function updateItemsField(){
    const selectedItems = document.querySelectorAll('.selected h2');
    let itemsValue = "";
    selectedItems.forEach(item => {
        itemsValue += item.innerText + ', ';
    });
    formItems.value = itemsValue.slice(0,-2);
}

//Process order
orderButton.addEventListener("click", function(event) {
    event.preventDefault();
    const haveItBuilt = document.getElementById("select-button").value;
    let buttonsHTML = "";
    if(haveItBuilt === "yes"){
        buttonsHTML = `
            <p>Your order will be processed shortly. Thank you for shopping with us!</p>
            <button id="download-invoice" onclick="generateInvoice()">Download Invoice</button>
            <button id="close-popup" onclick="document.querySelector('.popup').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; return false;">Close</button>
        `;
    }else{
        buttonsHTML = `
            <p>Your order will be processed shortly. Thank you for shopping with us!</p>
            <button id="download-instructions">Download Instructions</button>
            <button id="download-invoice" onclick="generateInvoice()">Download Invoice</button>
            <button id="close-popup" onclick="document.querySelector('.popup').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; return false;">Close</button>
        `;
    }
    const popup = document.createElement("div");
    popup.innerHTML = buttonsHTML;
    popup.classList.add("popup");
    document.body.appendChild(popup);
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";

    popup.addEventListener("click", function(event) {
        if (event.target.id === "close-popup") {
            document.getElementById("name").value = "";
            document.getElementById("discord-username").value = "";
            document.getElementById("address").value = "";
            document.getElementById("itemsf").value = "";
            document.getElementById("select-button").selectedIndex = 0;

            const selectedItems = document.querySelectorAll('.selected');
            for(let i=0; i<selectedItems.length; i++) {
                selectedItems[i].classList.remove('selected');
            }


            this.remove();
        }
    });
    
});

//Function to generate the invoice
function generateInvoice() {
    //Get the form data
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const itemsInput = document.getElementById("itemsf").value;
    let selectedItems = itemsInput.split(", ");
    //Get the items data
    fetch('items.json')
    .then(response=>response.json())
    .then(data=>{
        const items = data.items;
        //Initialize the PDF document
        const pdf = new jsPDF("p", "mm", "a4");

        //Add the company information
        pdf.setFontSize(14);
        pdf.text("Aikia", 14, 22);
        pdf.text("Matsuri-Machi Mall, Enganchika", 14, 32);

        //Add the invoice title
        pdf.setFontSize(18);
        pdf.text("Invoice", 14, 50);

        //Add the customer information
        pdf.setFontSize(14);
        pdf.text("Name: " + name, 14, 70);
        pdf.text("Address: " + address, 14, 80);

        //Add the invoice items table header
        pdf.setFontSize(12);
        pdf.text("Description", 14, 100);
        pdf.text("Price", 100, 100);

        //Add the items and prices
        var y = 110;
        items.forEach(function(item) {
            if(selectedItems.indexOf(item.name) !== -1) {
                pdf.setFontSize(12);
                pdf.text(item.name, 14, y);
                pdf.text(item.price + "¥", 100, y);
                y += 10;
            }
        });

        //Add the dividing line
        pdf.setLineWidth(1);
        pdf.line(10, y, 200, y);
        y += 10;

        //Add the total cost
        pdf.setFontSize(14);
        pdf.text("Amount to be paid: ", 14, y);
        var totalCost = 0.0;
        items.forEach(function(item) {
            if(selectedItems.indexOf(item.name) !== -1) {
                totalCost += parseFloat(item.price);
            }
        });
        pdf.text(totalCost.toFixed(2) + "¥", 100, y);
        y += 10;

        //Save the PDF
        pdf.save("invoice.pdf");
    });
}