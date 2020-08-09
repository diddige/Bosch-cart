
$(document).ready(function () {
    addToShop();
    displayShop();
    displayCart();
    displayOrder();
    outOfStock();
    droppableShop();
    droppableCart();
    $(".setDate").click(function () {
        dateSearch();
    });
    $(".shopping-list").on("click", ".shopping-item", function () {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        } else
            $(this).addClass("selected");
    });
    $(".cart-body").on("click", ".cart-item", function () {
        if ($(this).hasClass("removed")) {
            $(this).removeClass("removed");
        } else
            $(this).addClass("removed");
    });
    $(".addCart-button").click(function () {
        selectedItems();
        $(".shopping-item").removeClass("selected");
        outOfStock();
    });
    $(".removeCart-button").click(function () {
        removedItems();
        $(".cart-item").removeClass("removed");
        outOfStock();
    });
    $(".checkOut").on("click", ".checkOut-button", function () {
        checkOut();
        displayCart();
        displayShop();
        displayOrder();
        outOfStock();
    });
    $(".reset").on("click", ".reset-button", function () {
        reset();
    })
    $(".order-body").on("click",".edit-button",function (){
        console.log($(this).parents(".order").html())
        $(this).parents(".order").find(".subtract-quantity").attr("disabled",false);
        $(this).parents(".order").find(".add-quantity").attr("disabled",false);
        $(".order-body").on("click",".subtract-quantity",function(){
            
        });
});
});
// add initial shop items
function addToShop() {
    var shoppingItems = getShopList();
    if (!shoppingItems) {
        shoppingItems = [];
        var tool1 = { id: "BOSCH001", title: "Power Hammer", price: 2750, quantity: 5, imgSrc: "images/Power Hammer.png" };
        shoppingItems.push(tool1);
        var tool2 = { id: "BOSCH002", title: "Power Drill", price: 2200, quantity: 5, imgSrc: "images/Drill machine.png" };
        shoppingItems.push(tool2);
        var tool3 = { id: "BOSCH003", title: "Power Grinder", price: 1750, quantity: 3, imgSrc: "images/gringing machine.png" };
        shoppingItems.push(tool3);
        var tool4 = { id: "BOSCH004", title: "Sabre Saw", price: 4500, quantity: 2, imgSrc: "images/Sabre Saw machine.png" };
        shoppingItems.push(tool4);
        var tool5 = { id: "BOSCH005", title: "Blower", price: 3750, quantity: 7, imgSrc: "images/Blowe machine.png" };
        shoppingItems.push(tool5);
        var tool6 = { id: "BOSCH006", title: "Marble Cutter", price: 5250, quantity: 4, imgSrc: "images/Power Cutter.png" };
        shoppingItems.push(tool6);
    }
    setShopList(shoppingItems);
}
// shopItems
function getShopList() {
    shoppingItems = JSON.parse(localStorage.getItem("shoppingItems"))
    return shoppingItems;
}
function setShopList(shoppingItems) {
    localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
}
function displayShop() {
    var Items = getShopList();
    var shoppingText = "";
    for (var i = 0; i < Items.length; i++) {
        shoppingText = displayShopItems(Items[i].imgSrc, Items[i].title, Items[i].id, Items[i].price, Items[i].quantity, shoppingText);
    }
    $(".shopping-list").html(shoppingText);
    draggableShop();

}
function displayShopItems(imgSrc, title, id, price, quantity, shoppingText) {
    shoppingText += `<div class="col-sm-6">
        <div class="shopping-item border p-3 my-2">
            <img src="${imgSrc}" alt="toolimage" class="shopping-image mr-3 mt-3" style="width:7rem;" />
            <h4 class="shopping-item-title">${title}</h4>
            <p class="shopping-item-id mb-0">${id}</p>
            <p class="shopping-item-price mb-0">Price: &#8377<span>${price}</span></p>
            <p class="shopping-item-quantity mb-0">Quantity Available: <span>${quantity}</span></p>
        </div>
    </div>`
    return shoppingText;
}
// selected shop items
function selectedItems() {
    var selectedDivisions = $(".selected");
    var selectedIds = [];
    var selectedQuantities = [];
    selectedDivisions.each(function () {
        var saveId = $(this).find(".shopping-item-id").text();
        var saveQuantity = $(this).find(".shopping-item-quantity").find("span").text();
        selectedQuantities.push(saveQuantity);
        selectedIds.push(saveId);
    });

    addToCart(selectedIds, selectedQuantities);

}
//add to cart
function addToCart(selectedIds, selectedQuantities) {
    if (selectedIds.length < 1) {
        alert("Shop item not selected");
    } else {

        for (var i = 0; i < selectedIds.length; i++) {
            if (selectedQuantities[i] > 0) {
                var shopItems = getShopList();
                var key = selectedIds[i];
                var tempItem;
                for (var j = 0; j < shopItems.length; j++) {
                    if (key == shopItems[j].id) {
                        tempItem = shopItems[j];
                        shopItems[j].quantity--;
                        setShopList(shopItems);
                        break;
                    }
                }
                if (!getCartList()) {
                    var cartItems = [];
                    tempItem.quantity = 1;
                    cartItems.push(tempItem);
                    setCartList(cartItems);
                }
                else {
                    var cartItems = getCartList();
                    isPresent = false;
                    for (var k = 0; k < cartItems.length; k++) {
                        if (key == cartItems[k].id) {
                            tempItem.quantity = cartItems[k].quantity;
                            cartItems.splice(k, 1);
                            tempItem.quantity++;
                            cartItems.push(tempItem);
                            setCartList(cartItems);
                            isPresent = true;

                            break;
                        }
                    }
                    if (!isPresent) {
                        tempItem.quantity = 1;
                        cartItems.push(tempItem);
                        setCartList(cartItems);
                    }

                }
                displayCart();
                displayShop();
                //window.location.assign(window.location.href);
            } else {
                alert("out of stock item is selected");
                break;
            }
        }
    }
}
//cartItems
function displayCart() {
    if (!getCartList()) {
        cartText = `<tr><td class="empty" colspan="5"><h3>Your cart is Empty</h3></td></tr>`
        $(".cart-body").html(cartText);
        return;
    }
    else {
        var cartItems = getCartList();
        if (cartItems.length < 1) {
            cartText = `<tr><td class="empty" colspan="5"><h3>Your cart is Empty</h3></td></tr>`
            $(".cart-body").html(cartText);
            totalBill();
        }
        else {
            var cartText = "";
            for (var i = 0; i < cartItems.length; i++) {
                cartText = displayCartItems(cartItems[i].imgSrc, cartItems[i].id, cartItems[i].title, cartItems[i].price, cartItems[i].quantity, cartText);
            }
            $(".cart-body").html(cartText);
            totalBill();
            draggableCart();
        }
    }
}
function displayCartItems(imgSrc, id, title, price, quantity, cartText) {
    cartText += `<tr class="cart-item" >
    <td><img src="${imgSrc}" alt="toolcartimage" class="cart-image" style="width:5rem;" />
    <td class="cart-item-id">${id}</td>
    <td class="cart-item-title">${title}</td>
    <td class="cart-item-quantity">${quantity}</td>
    <td class="cart-item-price">${price}</td>
</tr>`
    return cartText;
}
function getCartList() {
    cartItems = JSON.parse(localStorage.getItem("cartItems"))
    return cartItems;
}
function setCartList(cartItems) {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
// removed cart items
function removedItems() {
    var removedDivisions = $(".removed");
    var removedIds = [];
    var removedQuantities = [];
    removedDivisions.each(function () {
        var saveId = $(this).find(".cart-item-id").text();
        var saveQuantity = $(this).find(".cart-item-quantity").text();
        removedQuantities.push(saveQuantity);
        removedIds.push(saveId);
    });
    removeFromCart(removedIds, removedQuantities);
}
// remove from cart
function removeFromCart(removedIds, removedQuantities) {
    if (removedIds < 1) {
        alert("Cart item is not selected");
    } else {
        var cartItems = getCartList();
        var shopItems = getShopList();

        for (var i = 0; i < removedIds.length; i++) {
            var key = removedIds[i];
            for (var j = 0; j < shopItems.length; j++) {
                if (key == shopItems[j].id) {
                    shopItems[j].quantity++;
                    setShopList(shopItems);
                    break;
                }
            }
            if (removedQuantities[i] == 1) {
                for (var k = 0; k < cartItems.length; k++) {
                    if (key == cartItems[k].id) {
                        cartItems.splice(k, 1);
                        setCartList(cartItems);

                    }
                }
            } else {
                for (var k = 0; k < cartItems.length; k++) {
                    if (key == cartItems[k].id) {
                        cartItems[k].quantity--;
                        setCartList(cartItems);
                    }
                }

            }
            displayCart();
            displayShop();
            // window.location.assign(window.location.href);
        }
    }
}
// total bill
function totalBill() {
    cartItems = getCartList();
    var totalAmount = 0;
    for (var i = 0; i < cartItems.length; i++) {
        totalAmount += (cartItems[i].quantity) * (cartItems[i].price);
    }
    $(".bill-amount").find("span").html(totalAmount);
    return (totalAmount);
}
// check out
function checkOut() {
    cartItems = getCartList();
    var orderId = Math.floor(Math.random() * (10 ** 10));
    date = new Date();
    var dateOfOrder = date.toString().substr(0, 24);
    var productsId = "";
    var productsName = "";
    var totalQuantity = 0;
    var totalPrice = 0;

    for (var i = 0; i < cartItems.length; i++) {
        productsId += cartItems[i].id + "<br>";
        productsName += cartItems[i].title + "" + "<button class='subtract-quantity  ml-2 mr-1 btn-light btn' disabled>-</button>" + cartItems[i].quantity + "<button class='add-quantity ml-1 btn btn-light' disabled>+</button>" + "<br>";
        totalQuantity += cartItems[i].quantity;
        totalPrice = totalBill();
    }

    var order = {
        "orderId": orderId,
        "dateOfOrder": dateOfOrder,
        "productsId": productsId,
        "productsName": productsName,
        "totalQuantity": totalQuantity,
        "totalPrice": totalPrice
    }

    if (!getOrdersList()) {
        var ordersList = [];
        ordersList.push(order);
        setOrderList(ordersList);
    }
    else {
        var ordersList = getOrdersList();
        ordersList.push(order);
        setOrderList(ordersList);
    }
    localStorage.setItem("cartItems", JSON.stringify([]));

    //window.location.assign(window.location.href);

}
// orderslist
function getOrdersList() {
    cartItems = JSON.parse(localStorage.getItem("orders"))
    return cartItems;
}
function setOrderList(ordersList) {
    localStorage.setItem("orders", JSON.stringify(ordersList));
}
function displayOrder() {
    if (!getOrdersList()) {
        return;
    } else {
        var ordersList = getOrdersList();
        var orderText = "";
        for (var i = 0; i < ordersList.length; i++) {
            orderText = displayOrderList(ordersList[i].orderId, ordersList[i].dateOfOrder, ordersList[i].productsId, ordersList[i].productsName, ordersList[i].totalQuantity, ordersList[i].totalPrice, orderText);
        }
        $(".order-body").html(orderText);
    }
}
function displayOrderList(orderId, dateOfOrder, productsId, productsName, totalQuantity, totalPrice, orderText) {
    orderText += `<tr class="order">
    <td class="order-unique-id">${orderId}</td>
    <td class="order-date">${dateOfOrder}</td>
    <td class="order-product-id">${productsId}</td>
    <td class="order-product-name">${productsName}</td>
    <td class="order-quantity">${totalQuantity}</td>
    <td class="order-price" >&#8377<span>${totalPrice}</span></td>\
    <td><button class='edit-button btn btn-primary '>Edit</button>
    <button class='delete-button btn btn-danger' >Delete</button></td>
</tr>`
    return orderText;
}
// out of stock
function outOfStock() {
    var shopItems = getShopList();
    for (var i = 0; i < shopItems.length; i++) {
        if (shopItems[i].quantity == 0) {
            text = ".shopping-item:eq(" + i + ")"
            $(text).addClass("blurred");
            if ($(text).hasClass("stock")) { }
            else {
                var text1 = $(text).html()
                text1 += `<h2 class="stock">Out of Stock</h2>`
                $(text).html(text1)
            }
        }
    }
}
// search 
function search() {
    var input, filter, table, tr, td, i, txtValue, selectInput;
    input = document.getElementById("searchInput");
    selectInput = document.getElementById("select").value;
    filter = input.value.toUpperCase();
    table = document.getElementById("myOrder");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        if (selectInput == "price")
            td = tr[i].getElementsByTagName("td")[5];
        else if (selectInput == "quantity")
            td = tr[i].getElementsByTagName("td")[4];
        else if (selectInput == "productId")
            td = tr[i].getElementsByTagName("td")[2];
        else if (selectInput == "productName")
            td = tr[i].getElementsByTagName("td")[3];
        else
            td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
// search by date
function dateSearch() {
    var fromDate = $(".date-search").find("input:eq(0)").val().toString();
    var toDate = $(".date-search").find("input:eq(1)").val().toString();
    fromMilli = Date.parse(fromDate);
    oneDay = 86400000;
    toMilli = Date.parse(toDate) + oneDay;
    var orders = getOrdersList();
    table = document.getElementById("myOrder");
    tr = table.getElementsByTagName("tr");
    var count = 0;
    for (var i = 0; i < orders.length; i++) {
        var temp = orders[i].dateOfOrder;
        tempMilliSeconds = Date.parse(temp);
        if (tempMilliSeconds >= fromMilli && tempMilliSeconds <= toMilli) {
            tr[i].style.display = "";
            count++;
        }
        else {
            tr[i].style.display = "none";
        }
    }

}
// draggable
function draggableShop() {
    $(function () {
        $(".shopping-item").draggable({
            start: function (event, ui) {
                $(this).addClass("dragToCart")
            },
            appendTo: "body",
            delay: 100,
            helper: "clone",
            opacity: 0.5,
            revert: "invalid",
            zIndex: 100,
            stop: function (event, ui) {
                $(this).removeClass("dragToCart");
            }

        });
    });
    outOfStock();
}
function draggableCart() {
    $(function () {
        $(".cart-item").draggable({
            start: function (event, ui) {
                $(this).addClass("dragToShop")
            },
            appendTo: "body",
            delay: 100,
            helper: "clone",
            opacity: 0.5,
            revert: "invalid",
            zIndex: 100,
            stop: function (event, ui) {
                $(this).removeClass("dragToShop");
            }

        });
    });
    outOfStock();
}
//droppable
function droppableCart() {
    $(function () {
        $("#droppable-cart").droppable({
            drop: function (event, ui) {
                var dragId = $(".shopping-list").find(".dragToCart").find(".shopping-item-id").text();
                var dragQuantity = $(".shopping-list").find(".dragToCart").find(".shopping-item-quantity").find("span").text();
                var selectedIds = [];
                var selectedQuantities = [];
                selectedIds.push(dragId);
                selectedQuantities.push(dragQuantity);
                addToCart(selectedIds, selectedQuantities);
            },
            hoverClass: "drop-hover"
        });
    });
    outOfStock();

}
function droppableShop() {
    $(function () {
        $("#droppable-shop").droppable({
            drop: function (event, ui) {
                var dragId = $(".cart-body").find(".dragToShop").find(".cart-item-id").text();
                var dragQuantity = $(".cart-body").find(".dragToShop").find(".cart-item-quantity").text();
                var removedIds = [];
                var removedQuantities = [];
                removedIds.push(dragId);
                removedQuantities.push(dragQuantity);
                removeFromCart(removedIds, removedQuantities);
                ;
            },
            hoverClass: "drop-hover"
        });
    });
    outOfStock();
}
// reset the items
function reset() {
    localStorage.removeItem("shoppingItems");
    localStorage.removeItem("cartItems");
    addToShop();
    displayShop();

}

