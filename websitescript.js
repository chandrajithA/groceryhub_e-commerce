            //to get the data from the .json file 
            async function getdata(){
                
                let response = await fetch("productlist.json");
                let  data = await response.json();
                return data;

                
            }



            





            async function startwebsite(){
                
                const data = await getdata();

                //to filter the unique categories from the data list
                const uniqueByCategory = [
                    ...new Map(data.map(item => [item["category"] , { title : item["category"]  , image : item["category-image"] }])).values()
                ];

                displaycategory(uniqueByCategory);

                
                const instantfood = data.filter(item => item.category === "Ready To Eat" || item.category === "Ready To Cook");
                const dairyproducts = data.filter(item => item["sub-category"] === "Butter & Cheese" || item["sub-category"] === "Paneer" || item["sub-category"] === "Milk & Curd" || item["sub-category"] === "Ice Creams");
                const cerealandmasala = data.filter(item => item["sub-category"] === "Cereals & Dals" || item["sub-category"] === "Masalas & Spices");
                    
                    

//to display selected catagory or sub-category products in home page for quick purchase
// syntax format - displayindividualproduct(datalist,"categoryName","sub-categoryName",document.getElementById("id of the display area"),"slider container id for scrolling the products");
                displayindividualproduct(instantfood,"","",document.getElementById("quickpurchase1"),"slider1");
                displayindividualproduct(dairyproducts,"","",document.getElementById("quickpurchase2"),"slider2");
                displayindividualproduct(cerealandmasala,"","",document.getElementById("quickpurchase3"),"slider3");
                displayindividualproduct(data,"Fruits and Vegetables","Fruits",document.getElementById("quickpurchase4"),"slider4");
            }
                    







            // to display the dynamic category section
            function displaycategory(uniquecategorylist){
                const productcategories = document.getElementById("productcategories");

                productcategories.innerHTML = "";
                uniquecategorylist.forEach(category => {
                productcategories.innerHTML += 
                    `
                    <div class="individualcategory" onclick="displayproductbycategory('${category.title}','')">
                            <div class="individualcategoryimgarea" id="individualcategoryimgarea">
                                <img src="${category.image}" alt="${category.title} category image" class="individualcategoryimg">
                            </div>
                            <div class="individualcategorytitlearea" id="individualcategorytitlearea">
                                <p class="individualcategorytitle" id="individualcategorytitle">${category.title}</p>
                            </div>
                            
                        </div>
                    `;
                });
            }




            //to display the products in product page based on the clicking in category area in the main page
            //also to navigate to the products section on clicking see all btn in quick purchase area
            function displayproductbycategory(selectedcategoryname, selectedsubcategoryname){
                
                sessionStorage.setItem("categoryname", selectedcategoryname);
                sessionStorage.setItem("subcategoryname", selectedsubcategoryname);
                window.location.href = `products.html`;
                
                
            }






            

            //to display the individual products on main page for quick purchase based on reuired pre-defined categories or sub-categories
function displayindividualproduct(data, categoryname,subcategoryname, displayarea, slider) {
            
            let products;
            if(subcategoryname){
                products = data.filter(items => items["sub-category"] === subcategoryname);
                
            }else if(categoryname){
                products = data.filter(items=> items.category === categoryname);
            }else{
                products = data;
            }
            
            displayarea.innerHTML = "";

            products.forEach(item => {
                let discountprice = (item.discount / 100) * item.price ;
                let finalprice = item.price - discountprice;

                const productDiv = document.createElement("div");
                productDiv.className = "individualproduct";
                

                const imgArea = document.createElement("div");
                imgArea.className = "productimgarea";
                imgArea.onclick = () => displaysingleproductinfo(item);

                if (item.discount !== "") {
                    const badge = document.createElement("div");
                    badge.className = "discountpercentdisplayarea";
                    badge.textContent = `${item.discount}% off`;
                    imgArea.appendChild(badge);
                }

                const img = document.createElement("img");
                img.src = item.image;
                img.alt = `${item.name} image`;
                img.className = "productimg";
                imgArea.appendChild(img);
                productDiv.appendChild(imgArea);

                const titleArea = document.createElement("div");
                titleArea.className = "producttitlearea";
                titleArea.onclick = () => displaysingleproductinfo(item);
                const title = document.createElement("p");
                title.className = "producttitle";
                title.textContent = item.name;
                titleArea.appendChild(title);
                productDiv.appendChild(titleArea);

                const qtyDiv = document.createElement("div");
                qtyDiv.className = "productqty";
                const qty = document.createElement("p");
                qty.className = "productqtyvalue";
                qty.textContent = item.quantity;
                qtyDiv.appendChild(qty);
                const wishlisticonarea = document.createElement("span");
                wishlisticonarea.className = "wishlistheart";

                wishlisticonarea.innerHTML = `<img src="images/heartempty.png" id="wishlistimg${item.name}">`;
                wishlisticonarea.onclick = () => toggleWishlist(wishlisticonarea,item);
                qtyDiv.appendChild(wishlisticonarea);
                productDiv.appendChild(qtyDiv);

                let wishlistitem = JSON.parse(localStorage.getItem("wishlistitems")) || [];
                wishlistitem.forEach(wishitem => {
                    if(wishitem.name === item.name){
                        wishlisticonarea.classList.toggle("active");
                        wishlisticonarea.innerHTML = `<img src="images/heartfull.png" id="wishlistimg${item.name}">`;
                    }
                });
                

                const priceDiv = document.createElement("div");
                if (item.discount !== "") {
                    const originalPrice = document.createElement("span");
                    originalPrice.className = "productprice";
                    originalPrice.textContent = `₹${item.price.toFixed(2)}`;
                    priceDiv.appendChild(originalPrice);
                }

                const discountedPrice = document.createElement("span");
                discountedPrice.className = "productdisprice";
                discountedPrice.textContent = `₹${finalprice.toFixed(2)}`;

                priceDiv.appendChild(discountedPrice);
                productDiv.appendChild(priceDiv);


                const btnarea = document.createElement("span");
                btnarea.className = "addtocartbtnarea";

                let cartItems = JSON.parse(localStorage.getItem("cartitems")) || [];
                    let matchedItem = cartItems.find(cartitem => cartitem.name === item.name);

                    if (matchedItem) {
                        // Already in cart: show increment/decrement buttons
                        const purchasebtnarea = document.createElement("span");
                        purchasebtnarea.className = "addtocartbtnareaselect";
                        purchasebtnarea.innerHTML = `
                            <span class="cartitemcountdecbtn" id="cartitem${item.name}deccountdecbtn" onclick="decreaseitemcountinproductcard('${item.name}')" >-</span>
                            <span class="cartitemcounttext" id="cartitem${item.name}purchasecounttext">${matchedItem.purchasecount}</span>
                            <span class="cartitemcountincbtn" id="cartitem${item.name}inccountincbtn" onclick="increaseitemcountinproductcard('${item.name}')">+</span>
                        `;

                        btnarea.appendChild(purchasebtnarea);


                    } else {

                        // Not in cart: show "Add to Cart" button
                        const btn = document.createElement("span");
                        btn.className = "addtocartbtn";
                        btn.id = `cartitem${item.name}addcartbtn`;
                        btn.innerHTML = "Add to Cart";
                        btn.onclick = () => addToCart(item);
                        btnarea.appendChild(btn);
                    }

                    priceDiv.appendChild(btnarea);
                    displayarea.appendChild(productDiv);
                              
                                                
                });

                if(slider !==""){
                checkOverflow(slider);
            }
            
        }




                //to remove each item separately in the cart page by index
function removeitemfromcartinproductcard(selecteditemname){
    let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        cartItems.forEach((item,index) =>{
            if(item.name === selecteditemname){
                cartItems.splice(index,1);
                localStorage.setItem("cartitems",JSON.stringify(cartItems));
                
            }
        })
        
        
}
        



//to decrease the cart item count in the cart page by index
function decreaseitemcountinproductcard(selecteditemname){
        let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        cartItems.forEach(item=>{
            if(item.name === selecteditemname){

                if(item.purchasecount === 1){
            removeitemfromcartinproductcard(selecteditemname);
            window.location.reload();
        }else{
            item.purchasecount = item.purchasecount - 1;
            localStorage.setItem("cartitems",JSON.stringify(cartItems));
            window.location.reload();
        }


            }
            
        })
        
}



//to increase the cart item count in the cart page by index
function increaseitemcountinproductcard(selecteditemname){
        let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        
        cartItems.forEach(item => {
            if( item.name === selecteditemname ){
                if(item.purchasecount < item.availablestock){
                    item.purchasecount = item.purchasecount + 1;
                    localStorage.setItem("cartitems",JSON.stringify(cartItems));
                    window.location.reload();
                }else{
                    alert(`"${item.name}" has only ${item.availablestock} stock.`)
                }
            }
        })
        
            
            
        
}
                
                 
                
            
            
            


                 //to scroll the products in main page if it has more products
                function scrollCarousel(sliderId,direction) {
                    const container = document.getElementById(sliderId);
                    const itemWidth = 260;

                    if (direction === "left") {
                        container.scrollBy({ left: -itemWidth, behavior: "smooth" });
                    } else {
                        container.scrollBy({ left: itemWidth, behavior: "smooth"});
                    }
                }






                //to show or hide scroll button on main page for quick purchase products based on products overflow 
            function checkOverflow(sliderid) {
                const slider = document.getElementById(sliderid);
                
                
                const leftBtn = document.getElementById(sliderid+"leftscrollbtn");
                const rightBtn = document.getElementById(sliderid+"rightscrollbtn");
                const seeallbtn = document.getElementById(sliderid+"seeallcategoryitemsbtn");

                
                if (slider.scrollWidth > slider.clientWidth) {
                    leftBtn.style.display = "block";
                    rightBtn.style.display = "block";
                    seeallbtn.style.display = "block";
                } else {
                    leftBtn.style.display = "none";
                    rightBtn.style.display = "none";
                    seeallbtn.style.display = "none";
                }
            }






            //to add the product to the cart
            function addToCart(item){
               

              let productsincart = JSON.parse(localStorage.getItem("cartitems")) || [];
              
                item.purchasecount = 1;
                productsincart.push(item);
                localStorage.setItem("cartitems",JSON.stringify(productsincart));
                updatecartcount();
                window.location.reload();
              
            
                
            }



            
            //to update cartcount count
            function updatecartcount(){
                let productsincart = JSON.parse(localStorage.getItem("cartitems")) || [];
                const cartitemcount = document.getElementById("cartitemcount");  
                let totalcartcount = 0;
                productsincart.forEach(item =>{
                    totalcartcount += item.purchasecount;
                })
                cartitemcount.innerText = totalcartcount ;
            }



            function toggleWishlist(element,item) {

                
                element.classList.toggle("active");
                if(element.classList.contains("active")){
                    element.innerHTML = `<img src="images/heartfull.png" id="wishlistimg${item.name}">`;
                    addtowishlist(item);

                }else{
                    element.innerHTML = `<img src="images/heartempty.png" id="wishlistimg${item.name}">`;
                    let wishlistItems = JSON.parse(localStorage.getItem("wishlistitems"));
                    wishlistItems.forEach((items,index) =>{
                        if(items.name === item.name){
                            wishlistItems.splice(index,1);
                            localStorage.setItem("wishlistitems",JSON.stringify(wishlistItems));
                            updatewishlistcount();
                        }
                    })

                }

            }


            function addtowishlist(item){
                let productsinwishlist = JSON.parse(localStorage.getItem("wishlistitems")) || [];
                    if(productsinwishlist.find(items => items.name === item.name)){
                            alert(`Product "${item.name}" already available in wishlist`);
                    }else{
                        productsinwishlist.push(item);
                        localStorage.setItem("wishlistitems",JSON.stringify(productsinwishlist));
                        updatewishlistcount();
                    }
            }



            //to update wishlist count
            function updatewishlistcount(){
                let productsinwishlist = JSON.parse(localStorage.getItem("wishlistitems")) || [];
                const wishitemcount = document.getElementById("wishitemcount");  
                wishitemcount.innerText = productsinwishlist.length;
            }


            function removeitemfromwishlist(index){
                let wishItems = JSON.parse(localStorage.getItem("wishlistitems"));
                    wishItems.splice(index,1);
                    localStorage.setItem("wishlistitems",JSON.stringify(wishItems));
                    updatewishlistcount();
            }






    

             //to display the product details when the image or product name is clicked
            function displaysingleproductinfo(item){
                // window.location.href = `productdetailinfo.html`;
                 
    
                
            }





            
            


/***********************************  products page *************************************************************************************/
            



            //to display the category and sub-category filter area
            async function categorynavbar() {
                let products = await getdata();
                const filtercondtionname = document.getElementById("filtercondtionname");
                const categoryMap = {};

                // Group subcategories by category
                products.forEach(product => {
                    const category = product.category;
                    const subCategory = product["sub-category"];

                    if (!categoryMap[category]) {
                        categoryMap[category] = new Set();
                    }
                    categoryMap[category].add(subCategory);
                });


                // Render to HTML
                const container = document.getElementById("categorylistbox");
                container.innerHTML = ""; // Clear any previous content

                const categoryDivs = {}; // Store references for auto-click

                const selectedCategory = sessionStorage.getItem("categoryname") || "";
                const selectedSubCategory = sessionStorage.getItem("subcategoryname") || "";

                
                

                for (let category in categoryMap) {
                    const categoryDiv = document.createElement("div");
                    categoryDiv.className = `categoryNameBar`;
                    categoryDiv.dataset.category = category; // used to match for auto-click
                    
                    categoryDiv.innerHTML = `
                        <span>${category}</span>
                        <span><img src="images/downarrow.png" alt="arrow icon" class="arrowiconimage"></span>
                    `;

                    categoryDiv.style.cursor = "pointer";

                    const subList = document.createElement("ul");
                    subList.className = "subcategoryList";
                    subList.style.display = "none";

                    const subArray = Array.from(categoryMap[category]);
                
                    
                    subArray.forEach((sub, index) => {
                        const li = document.createElement("li");
                        li.className = `subcategoryNameBar`;
                        li.textContent = sub;
                        li.style.cursor = "pointer";

                        

                        li.onclick = () => {
                            sessionStorage.setItem("subcategoryname", sub);
                            sessionStorage.setItem("categoryname", category);
                            filtercondtionname.innerText = `${category} - ${sub}`;
                            showproductinproductpage();

                            document.querySelectorAll(".subcategoryNameBar").forEach(el => {
                                el.classList.remove("active-subcategory");
                            });
                            li.classList.add("active-subcategory");
                        };

                        subList.appendChild(li);
                        
                        
                        

                        if (index !== subArray.length - 1) {
                            const hr = document.createElement("hr");
                            hr.style.marginLeft = "10px";
                            hr.style.marginRight = "10px";
                            subList.appendChild(hr);
                        }
                    });

                    categoryDiv.onclick = () => {
                        // Save to session
                        sessionStorage.setItem("categoryname", category);
                        sessionStorage.setItem("subcategoryname", "");
                        filtercondtionname.innerText = category;

                        // Collapse all others
                        document.querySelectorAll(".categoryNameBar").forEach(div => {
                            if (div !== categoryDiv) {
                                div.style.backgroundColor = "#f7fef0";
                                div.style.color = "#4f9300";
                                const icon = div.querySelector("img");
                                icon.src = "images/downarrow.png";
                            }
                        });

                        document.querySelectorAll(".subcategoryList").forEach(ul => {
                            if (ul !== subList) {
                                ul.style.display = "none";
                            }
                        });

                        document.querySelectorAll(".subcategoryNameBar").forEach(el => {
                                el.classList.remove("active-subcategory");
                            });

                        // Toggle this one
                        if (subList.style.display === "none") {
                            subList.style.display = "block";
                            categoryDiv.style.backgroundColor = "#4f9300";
                            categoryDiv.style.color = "#FFFFFF";
                            const icon = categoryDiv.querySelector("img");
                            icon.src = "images/uparrow-white.png"
                        }else{
                            subList.style.display = "none";
                            categoryDiv.style.backgroundColor = "#f7fef0";
                            categoryDiv.style.color = "#4f9300";
                            const icon = categoryDiv.querySelector("img");
                            if (icon) icon.src = "images/downarrow.png";
                        }

                        showproductinproductpage();
                    };

                    container.appendChild(categoryDiv);
                    container.appendChild(subList);

                    categoryDivs[category] = categoryDiv; // save for auto-click later
                }


                // const checkselectedSubCategory = sessionStorage.getItem("backupsubcategory") || "";
                // Auto-click the saved category
                if (selectedCategory && categoryDivs[selectedCategory]) {
                    categoryDivs[selectedCategory].click();

                        setTimeout(() => {
                            
                            const allSubLis = document.querySelectorAll(".subcategoryNameBar");
                            allSubLis.forEach(li => {
                                if (li.textContent === selectedSubCategory) {
                                    li.click();
                                }
                            });
                        }, 100);
                }
               
            
        }

        

                

      

        
        // to display  all products in the product page based on saved category and sub-category and filter condition
    async function showproductinproductpage(){
          let data = await getdata();
          
          let sortby = sessionStorage.getItem("sortbycondition") || "";
            if(sortby === "Price - Low to High"){
                data.sort((item1, item2) =>  (item1.price - ( (item1.discount/100) * item1.price )) - (item2.price - ( (item2.discount/100) * item2.price )));
                
            }else if(sortby === "Price - High to Low"){
                data.sort((item1, item2) => (item2.price - ( (item2.discount/100) * item2.price )) - (item1.price - ( (item1.discount/100) * item1.price )));
                
            }else if(sortby === "Offer - Low to High"){
                data.sort((item1, item2) => item1.discount - item2.discount);
                
            }else if(sortby === "Offer - High to Low"){
                data.sort((item1, item2) => item2.discount - item1.discount);
                
            }else{
                data;
            }



            const individualproductdisplayarea = document.getElementById("individualproductdisplayarea");
            let categoryname = sessionStorage.getItem("categoryname") || "";
            let subcategoryname = sessionStorage.getItem("subcategoryname") || "";

            //call function to generate individual products
            displayindividualproduct(data, categoryname, subcategoryname, individualproductdisplayarea, ""); 
            
        

    }



    // to clear the whole cart
    function clearfilterproducts(){
        sessionStorage.removeItem("subcategoryname");
        sessionStorage.removeItem("categoryname");
        sessionStorage.removeItem("sortbycondition");
        window.location.href = `products.html`;

    }



    /********************************************   cart page **********************************************************************/


    

    
    //to create layout for addtocart page
    function createCartLayout(cartItems) {
        let totalbill = 0;
        let totalwithoutdiscount = 0
    const cartDisplayArea = document.createElement("div");
    cartDisplayArea.id = "cartdisplayarea";
    cartDisplayArea.className = "cartdisplayarea";

    // 1. Cart Heading Area
    const cartHeadingArea = document.createElement("div");
    cartHeadingArea.className = "cartheadingarea";
    cartHeadingArea.id = "cartheadingarea";

    const titleContainer = document.createElement("div");

    const title = document.createElement("span");
    title.className = "carttitle";
    title.textContent = "Cart";

    const itemCount = document.createElement("span");
    itemCount.className = "cartitemcountdisplay";
    itemCount.id = "cartitemcountdisplay";
    let totalcartcount = 0;
    cartItems.forEach(item =>{
        totalcartcount += item.purchasecount;
    })
    itemCount.innerText=`(${totalcartcount})`;
    
    

    titleContainer.appendChild(title);
    titleContainer.appendChild(itemCount);

    const clearBtn = document.createElement("button");
    clearBtn.className = "clearcartbtn";
    clearBtn.textContent = "Clear Cart";
    clearBtn.onclick = () =>{
        localStorage.removeItem("cartitems");
        totalbill = 0;
        totalwithoutdiscount = 0
        window.location.reload();
    };

    cartHeadingArea.appendChild(titleContainer);
    cartHeadingArea.appendChild(clearBtn);

    const hr = document.createElement("hr");




    // 2. Cart Items Display Area with each cart item display
    const cartItemsDisplayArea = document.createElement("div");
    cartItemsDisplayArea.className = "cartitemsdisplayarea";
    cartItemsDisplayArea.id = "cartitemsdisplayarea";

    cartItems.forEach((item, index) => {
        
        
    let discountprice = item.price - ( (item.discount / 100) * item.price );
        
         
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "cartsingleitemdisplay";
    itemWrapper.id = `cartsingleitem${index}`;

    const img = document.createElement("img");
    img.className = "cartitemimage";
    img.src = item.image;
    img.alt = item.name;

    const description = document.createElement("div");
    description.className = "cartitemdescription";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cartitemname";
    nameSpan.id = `cartitem${index}name`;
    nameSpan.textContent = item.name;

    const quantitySpan = document.createElement("span");
    quantitySpan.className = "cartitemquantity";
    quantitySpan.id = `cartitem${index}quantity`;
    quantitySpan.textContent = item.quantity;

    description.appendChild(nameSpan);
    description.appendChild(quantitySpan);

    const priceDiscount = document.createElement("div");
    priceDiscount.className = "cartitempriceanddiscount";

    const discount = document.createElement("div");
    discount.className = "cartitemdiscountprice";
    discount.id = `cartitem${index}discountprice`;
    discount.textContent = `₹ ${discountprice.toFixed(2)}`;

    const price = document.createElement("div");
    price.className = "cartitemprice";
    price.id = `cartitem${index}price`;

    if(discountprice !== item.price){
        price.textContent = `₹ ${item.price.toFixed(2)}`;
    }
    else{
        price.innerText = "";
    }
    

    priceDiscount.appendChild(discount);
    priceDiscount.appendChild(price);

    const countArea = document.createElement("div");
    countArea.className = "cartitemcountarea";

    const decBtn = document.createElement("div");
    decBtn.className = "cartitemcountdecbtn";
    decBtn.id = `cartitem${index}countdecbtn`;
    decBtn.textContent = "-";
    decBtn.onclick = () => decreaseitemcount(index);

    const countText = document.createElement("div");
    countText.className = "cartitemcounttext";
    countText.id = `cartitem${index}counttext`;
    countText.textContent = item.purchasecount;

    const incBtn = document.createElement("div");
    incBtn.className = "cartitemcountincbtn";
    incBtn.id = `cartitem${index}countincbtn`;
    incBtn.textContent = "+";
    incBtn.onclick = () => increaseitemcount(index);

    countArea.appendChild(decBtn);
    countArea.appendChild(countText);
    countArea.appendChild(incBtn);

    const finalDiv = document.createElement("div");
    finalDiv.className = "cartitemfinalprice";
    finalDiv.id = "cartitemfinalprice";

    const finalPriceSpan = document.createElement("span");
    finalPriceSpan.className = "cartitemfinalprice";
    finalPriceSpan.id = `cartitem${index}finalprice`;
    let finalpricewithquantity = (discountprice * item.purchasecount);
    
    finalPriceSpan.textContent = `₹ ${finalpricewithquantity.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "removeitembtn";
    removeBtn.textContent = "Remove Item";
    removeBtn.onclick = () => {
        totalbill -= finalpricewithquantity;
        totalwithoutdiscount -= item.price;
        removeitemfromcart(index);
        

        window.location.reload();
    };

    finalDiv.appendChild(finalPriceSpan);
    finalDiv.appendChild(removeBtn);

    itemWrapper.appendChild(img);
    itemWrapper.appendChild(description);
    itemWrapper.appendChild(priceDiscount);
    itemWrapper.appendChild(countArea);
    itemWrapper.appendChild(finalDiv);
    cartItemsDisplayArea.appendChild(itemWrapper);
        totalbill  += finalpricewithquantity;
        totalwithoutdiscount += item.price * item.purchasecount;
    });

    // 3. Cart Total Display Area with summary
    const cartTotalDisplayArea = document.createElement("div");
    cartTotalDisplayArea.className = "carttotaldisplayarea";

    const continueShoppingArea = document.createElement("div");
    continueShoppingArea.className = "continueshoppingbtnarea";

    const continueLink = document.createElement("a");
    continueLink.className = "continueshoppingbtn";
    continueLink.href = "products.html";
    continueLink.textContent = "Continue Shopping";

    continueShoppingArea.appendChild(continueLink);

    const cartTotalDetails = document.createElement("div");
    cartTotalDetails.className = "carttotaldetails";

    const detail1 = document.createElement("div");
    detail1.className = "carttotaldetail1";

    const totalName = document.createElement("span");
    totalName.className = "carttotalname";
    totalName.textContent = "Total";

    const totalFinal = document.createElement("span");
    totalFinal.className = "carttotalfinalpice";
    totalFinal.id = "carttotalfinalpice";
    totalFinal.innerText = `₹ ${totalbill.toFixed(2)}`;

    detail1.appendChild(totalName);
    detail1.appendChild(totalFinal);

    const detail2 = document.createElement("div");
    detail2.className = "carttotaldetail2";

    const totalCount = document.createElement("span");
    totalCount.className = "carttotalitemcount";
    totalCount.id = "carttotalitemcount";
    totalCount.innerText = `${totalcartcount} items`

    const totalDiv = document.createElement("div");
    totalDiv.style.display = "inline-flex";
    totalDiv.style.gap = "10px";

    const savedAmount = document.createElement("span");
    savedAmount.className = "carttotalsavedamount";
    savedAmount.id = "carttotalsavedamount";
    if(totalwithoutdiscount !== totalbill){
        savedAmount.innerText = `₹ ${(totalwithoutdiscount - totalbill).toFixed(0)} OFF`;
    }else{
        savedAmount.style.display ="none";
    }
    

    const totalAmount = document.createElement("span");
    totalAmount.className = "carttotalamount";
    totalAmount.id = "carttotalamount";
    if(totalwithoutdiscount !== totalbill){
        totalAmount.innerText = `₹ ${totalwithoutdiscount.toFixed(2)}`;
    }else{
        savedAmount.style.display ="none";
    }
    

    totalDiv.appendChild(savedAmount);
    totalDiv.appendChild(totalAmount);

    detail2.appendChild(totalCount);
    detail2.appendChild(totalDiv);

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkoutbtn";
    checkoutBtn.id = "checkoutbtn";
    checkoutBtn.textContent = "Check Out";
    checkoutBtn.style.cursor = "pointer";
    checkoutBtn.onclick = ()=>{
        let isloginstatus = sessionStorage.getItem("islogin") || "";
        if(isloginstatus === "login"){
            window.location.href = "shippingaddress.html";
        }else{
            window.location.href = "login.html";
        }
    }

    cartTotalDetails.appendChild(detail1);
    cartTotalDetails.appendChild(detail2);
    cartTotalDetails.appendChild(checkoutBtn);

    cartTotalDisplayArea.appendChild(continueShoppingArea);
    cartTotalDisplayArea.appendChild(cartTotalDetails);

    // Append all to main
    cartDisplayArea.appendChild(cartHeadingArea);
    cartDisplayArea.appendChild(hr);
    cartDisplayArea.appendChild(cartItemsDisplayArea);
    cartDisplayArea.appendChild(cartTotalDisplayArea);

    if(cartItems.length === 0){
        cartItemsDisplayArea.innerHTML = `
        <img src = "image/empty-cart.png" alt = "empty cart image" >
        <p>Your cart is empty</p>
        `;
        cartTotalDetails.style.display = "none";
        continueShoppingArea.style.margin = "auto";
        clearBtn.style.display = "none";
    }
    return cartDisplayArea;
}



//to remove each item separately in the cart page by index
function removeitemfromcart(index){
    let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        cartItems.splice(index,1);
        localStorage.setItem("cartitems",JSON.stringify(cartItems));
}
        



//to decrease the cart item count in the cart page by index
function decreaseitemcount(index){
        let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        if(cartItems[index].purchasecount === 1){
            removeitemfromcart(index);
            window.location.href = "cartpage.html";
        }else{
            cartItems[index].purchasecount = cartItems[index].purchasecount - 1;
            localStorage.setItem("cartitems",JSON.stringify(cartItems));
            window.location.href = "cartpage.html";
        }
}



//to increase the cart item count in the cart page by index
function increaseitemcount(index){
        let cartItems = JSON.parse(localStorage.getItem("cartitems"));
        if(cartItems[index].purchasecount < cartItems[index].availablestock){

            cartItems[index].purchasecount = cartItems[index].purchasecount + 1;
            localStorage.setItem("cartitems",JSON.stringify(cartItems));

            window.location.href = "cartpage.html";

        }else{
            alert(`"${cartItems[index].name}" has only ${cartItems[index].availablestock} stock.`)
        }
            
            
        
}



/*******************************Wishlist page content ***********************************************************/


//to create layout for addtocart page
    function createwishLayout(wishItems) {
        
    const wishDisplayArea = document.createElement("div");
    wishDisplayArea.id = "wishdisplayarea";
    wishDisplayArea.className = "washlistdisplayarea";

    // 1. Cart Heading Area
    const wishHeadingArea = document.createElement("div");
    wishHeadingArea.className = "cartheadingarea";
    wishHeadingArea.id = "wishheadingarea";

    const wishtitleContainer = document.createElement("div");

    const wishtitle = document.createElement("span");
    wishtitle.className = "carttitle";
    wishtitle.textContent = "Wishlist";

    const wishitemCount = document.createElement("span");
    wishitemCount.className = "cartitemcountdisplay";
    wishitemCount.id = "wishitemcountdisplay";
    wishitemCount.innerText=`(${wishItems.length})`;
    
    

    wishtitleContainer.appendChild(wishtitle);
    wishtitleContainer.appendChild(wishitemCount);

    const wishclearBtn = document.createElement("button");
    wishclearBtn.className = "clearcartbtn";
    wishclearBtn.textContent = "Clear Wishlist";
    wishclearBtn.onclick = () =>{
        localStorage.removeItem("wishlistitems");
        window.location.href = "wishlist.html";
    };

    wishHeadingArea.appendChild(wishtitleContainer);
    wishHeadingArea.appendChild(wishclearBtn);

    const wishhr = document.createElement("hr");




    // 2. Cart Items Display Area with each wishlist item display
    const wishItemsDisplayArea = document.createElement("div");
    wishItemsDisplayArea.className = "cartitemsdisplayarea";
    wishItemsDisplayArea.id = "wishitemsdisplayarea";

    wishItems.forEach((item, index) => {
        
        
    let discountprice = item.price - ( (item.discount / 100) * item.price );
        
         
    const wishitemWrapper = document.createElement("div");
    wishitemWrapper.className = "cartsingleitemdisplay";
    wishitemWrapper.id = `wishsingleitem${index}`;

    const wishimg = document.createElement("img");
    wishimg.className = "cartitemimage";
    wishimg.src = item.image;
    wishimg.alt = item.name;

    const wishdescription = document.createElement("div");
    wishdescription.className = "cartitemdescription";

    const wishnameSpan = document.createElement("span");
    wishnameSpan.className = "cartitemname";
    wishnameSpan.id = `wishitem${index}name`;
    wishnameSpan.textContent = item.name;

    const wishquantitySpan = document.createElement("span");
    wishquantitySpan.className = "cartitemquantity";
    wishquantitySpan.id = `wishitem${index}quantity`;
    wishquantitySpan.textContent = item.quantity;

    wishdescription.appendChild(wishnameSpan);
    wishdescription.appendChild(wishquantitySpan);

    const wishpriceDiscount = document.createElement("div");
    wishpriceDiscount.className = "cartitempriceanddiscount";

    const wishdiscount = document.createElement("div");
    wishdiscount.className = "cartitemdiscountprice";
    wishdiscount.id = `wishitem${index}discountprice`;
    wishdiscount.textContent = `₹ ${discountprice.toFixed(2)}`;

    const wishprice = document.createElement("div");
    wishprice.className = "cartitemprice";
    wishprice.id = `wishitem${index}price`;

    if(discountprice !== item.price){
        wishprice.textContent = `₹ ${item.price.toFixed(2)}`;
    }
    else{
        wishprice.innerText = "";
    }
    

    wishpriceDiscount.appendChild(wishdiscount);
    wishpriceDiscount.appendChild(wishprice);



    const wishfinalDiv = document.createElement("div");
    wishfinalDiv.className = "cartitemfinalprice";
    wishfinalDiv.id = "wishitemfinalprice";


    const wishremoveBtn = document.createElement("button");
    wishremoveBtn.className = "removeitembtn";
    wishremoveBtn.textContent = "Remove Item";
    wishremoveBtn.onclick = () => {
        removeitemfromwishlist(index);
        window.location.href="wishlist.html";
    };

    wishfinalDiv.appendChild(wishremoveBtn);

    wishitemWrapper.appendChild(wishimg);
    wishitemWrapper.appendChild(wishdescription);
    wishitemWrapper.appendChild(wishpriceDiscount);
    wishitemWrapper.appendChild(wishfinalDiv);
    wishItemsDisplayArea.appendChild(wishitemWrapper);
    });

    // 3. Cart Total Display Area with summary
    const wishTotalDisplayArea = document.createElement("div");
    wishTotalDisplayArea.className = "carttotaldisplayarea";

    const wishcontinueShoppingArea = document.createElement("div");
    wishcontinueShoppingArea.className = "continueshoppingbtnarea";

    const wishcontinueLink = document.createElement("a");
    wishcontinueLink.className = "continueshoppingbtn";
    wishcontinueLink.href = "products.html";
    wishcontinueLink.textContent = "Continue Shopping";

    wishcontinueShoppingArea.appendChild(wishcontinueLink);
    wishTotalDisplayArea.appendChild(wishcontinueShoppingArea);

    // Append all to main
    wishDisplayArea.appendChild(wishHeadingArea);
    wishDisplayArea.appendChild(wishhr);
    wishDisplayArea.appendChild(wishItemsDisplayArea);
    wishDisplayArea.appendChild(wishTotalDisplayArea);

    if(wishItems.length === 0){
        wishItemsDisplayArea.innerHTML = `
        <img src = "image/empty-cart.png" alt = "empty cart image" >
        <p>Your Wishlist is empty</p>
        `;
        wishclearBtn.style.display = "none";
    }
    return wishDisplayArea;
}



function updateloginstatus(){
    

    let logincurrentstatus = sessionStorage.getItem("islogin") || "";
    if(logincurrentstatus === "login"){
        userloginstatusdisplayarea.textContent = "Logout";
    }else if(logincurrentstatus === "logout" || logincurrentstatus === ""){
        userloginstatusdisplayarea.textContent = "Login";
    }
}












       




        

                

            


            
            