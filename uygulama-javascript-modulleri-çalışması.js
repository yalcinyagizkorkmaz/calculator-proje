//Storage Controller//kullanıcıdan aldığımız bilgileri tarayıcıya aktaracağımız kısım,
const StorageController = (function () {
    return {
        storeProduct:function(product){
            let products;
            if(localStorage.getItem('products')===null){
                  products=[];
                  products.push(product);
                  localStorage.setItem('products',JSON.stringify(products))
            }else{
               products=JSON.parse(localStorage.getItem('products'));
               products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
        },getProducts:function(){
            let products;
            if(localStorage.getItem('products')===null){
                   products=[];
            }else{
                     products=JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },updateProduct:function(){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
              if(products.id==prd.id){
                  products.splice(index,1,products);
              }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },deleteProduct:function(){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
              if(id==prd.id){
                  products.splice(index,1);
              }
            });
            localStorage.setItem('products',JSON.stringify(products));
        }

    }
})();

//Product Controller

const ProductController = (function () {
  //private
  const Product = function (id, name, price) {
    //product constructor
    this.id = id;
    this.name = name;
    this.price = price;
  };
  const data = {//veri listesi
    //data giriş
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };

  //public
  return {
    getProducts: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
      let product = null;

      data.products.forEach(function (prd) {
        //data productlar in içine prd atıyoruz
        if (prd.id == id) {
          product = prd;
        }
      });
      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    addProduct: function (name, price) {
      let id;

      if (data.products.length >= 0) {
        id = data.products.length + 1;
      } else {
        id = 0;
      }
      const newProduct = new Product(id, name, parseFloat(price)); //parse float ondalıklı bir sayıyı işin içine atar
      data.products.push(newProduct);
      return newProduct;
    },
    updateProduct: function (name, price) {
      //gelecek olan productu prd olarak bekleyeceğiz
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });

      return product;
    },deleteProduct:function(product){
           data.products.forEach(function(prd,index){
               if(prd.id==product.id){
                   data.products.splice(index,1);
               }
           })
    },
    getTotal: function () {
      let total = 0;

      data.products.forEach(function (item) {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();

//UI Controller//ui etiketleriyle
const UIController = (function () {
  const Selector = {
    //çok yerde kullanıcağımız için//html sayfasında göstereceğimiz datalar uı modulunde
    productsList: "#item-list",
    productListItems:"#item-list tr",
    addButton: ".addBtn",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTL: "#total-tl",
    totalDolar: "#total-dolar",
    
  };
  return {
    creatProductList: function (products) {
      let html = "";

      products.forEach((prd) => {
        html += `
        <tr>
        <td>${prd.id}</td>
        <td>${prd.name}</td>
        <td>${prd.price}$</td>
        <td class="text-right">
            <i class="fas fa-edit edit-product "></i>
        </td>
        </tr>
        `;
      });

      //document.querySelector(Selector.productsList).innerHTML=html;
    },
    getSelectors: function () {
      return Selector;//ihtiyacımız olduğunda direkt UI üzerinden ulaşabiliriz
    },
    addProduct: function (product) {
      document.querySelector(Selector.productCard).style.display = "block";
      var item = `
        <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}$</td>
        <td class="text-right">
           <i class="fas fa-edit edit-product "></i>
        </td>
        </tr>
        `;
      document.querySelector(Selector.productsList).innerHTML += item;
    },updateProduct:function(prd){
        
        let updatedItem=null;
     
        let items=document.querySelectorAll(Selector.productListItems);
         items.forEach(function(item){
             if(item.classList.contains('bg-warning')){
                 
                 item.children[1].textContent=prd.name;
                 item.children[2].textContent=prd.price+'$';
                updatedItem=item;
             }
             console.log('Update name '+prd.name+' Update price '
             +prd.price);
         });
       return updatedItem;
       

    },
    clearInputs: function () {
      document.querySelector(Selector.productName).value = "";
      document.querySelector(Selector.productPrice).value = "";
    },clearWarnings:function(){
    const items=   document.querySelectorAll(Selector.productListItems);
    items.forEach(function(item){
          if(item.classList.contains('bg-warning')){//contains var mı yok mu diye sorgular
            item.classList.remove('bg-warning');

          }
    });

    } ,hideCard: function () {
      document.querySelector(Selector.productCard).style.display = "none";
    
    },
    showTotal: function (total) {
      document.querySelector(Selector.totalDolar).textContent = total;
      document.querySelector(Selector.totalTL).textContent = total * 15;
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selector.productName).value = selectedProduct.name;
      document.querySelector(Selector.productPrice).value =
        selectedProduct.price;
    },deleteProduct:function(){
        let items=document.querySelectorAll(Selector.productListItems);
        items.forEach(function(item){
            if(item.classList.contains('bg-warning')){
                item.remove();
            }
        });
    },
    addingState: function (item) {
    UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selector.addButton).style.display = "inline";
      document.querySelector(Selector.updateButton).style.display = "none";
      document.querySelector(Selector.deleteButton).style.display = "none";
      document.querySelector(Selector.cancelButton).style.display = "none";
    },
    editState: function (tr) {
     
      tr.classList.add("bg-warning");
      document.querySelector(Selector.addButton).style.display = "none";
      document.querySelector(Selector.updateButton).style.display = "inline";
      document.querySelector(Selector.deleteButton).style.display = "inline";
      document.querySelector(Selector.cancelButton).style.display = "inline";
    },
  };
})();

//Api Controller
const ApiController = (function (ProductCtrl, UICtrl,StorageCtrl) {
  //app içine parametre olarak prodctCtrl ve UıCtrl gönderdiğimiz için onlar aracılığıyla işlem yapmak daha iyi

  const UISelectors = UICtrl.getSelectors();

  //Load Event Listeners
  const loadEventListener = function () {
    //add product event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener("click", productAddSubmit);

    //edit product click
    document
      .querySelector(UISelectors.productsList)
      .addEventListener("click", productEditClick);
    //edit product submit
    document
      .querySelector(UISelectors.updateButton)
      .addEventListener("click", productEditSubmit);

      //cancel button click
      document.querySelector(UISelectors.cancelButton).addEventListener("click",cancelUpdate);

      //delete button click
      document.querySelector(UISelectors.deleteButton).addEventListener("click",deleteProductSubmit);

  };

  const productAddSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      //add products
      const newProduct = ProductCtrl.addProduct(productName, productPrice);
      //add item to list
      UIController.addProduct(newProduct);

      //add product to local storage
     StorageCtrl.storeProduct(newProduct);

      //get total
      const total = ProductCtrl.getTotal();
      console.log(total);

      //show total
      UIController.showTotal(total);

      //clear inputs
      UIController.clearInputs();
    }

    console.log(productName, productPrice);

    e.preventDefault();
  };

  const productEditClick = function (e) {
    if (e.target.classList.contains("edit-product")) {
      //eger event parametresi hedefi classlistteki contains butonu oluyorsa
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent; //istediğimiz bir elemanın edit-productuğuna tıkladığımızda onun id si geliyor

      //get selected  product
      const product = ProductCtrl.getProductById(id);

      //set current product
      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      //add product to UI
      UICtrl.addProductToForm();

      UICtrl.editState(e.target.parentNode.parentNode);
    }

    e.preventDefault();
  };

  const productEditSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      //update product
      const updatedProduct = ProductController.updateProduct(productName,productPrice
      );
      //update ui
     let item= UIController.updateProduct(updatedProduct);
     

      //get total
      const total = ProductCtrl.getTotal();
      console.log(total);

      //show total
      UIController.showTotal(total);

      //update storage
      StorageCtrl.updateProduct(updatedProduct);

      UIController.addingState();


    }

    e.preventDefault();
  };

  const cancelUpdate=function(e){

    UICtrl.addingState();
    UICtrl.clearWarnings();
    
    

    e.preventDefault();
  }

  const deleteProductSubmit=function(e){

    //get selected product
    const selectedProduct=ProductCtrl.getCurrentProduct();
    //delete product
    ProductCtrl.deleteProduct(selectedProduct);

    //delete ui
    UIController.deleteProduct();
     //get total
     const total = ProductCtrl.getTotal();
     console.log(total);

     //show total
     UIController.showTotal(total);

     //delete from storage
     StorageCtrl.deleteProduct(selectedProduct.id);

     UIController.addingState();

     if(total==0){
         UICtrl.hideCard();
     }

      e.preventDefault();
  }
  
  return {
    //init uygulama ilk çalıştığı andaki reaksiyon
    init: function () {
      console.log("Starting App...");
      UICtrl.addingState();
      const products = ProductCtrl.getProducts(); //product bilgilerini aldık

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.creatProductList(products); //products bilgilerini gösterecek
      }

      //load event listener
      loadEventListener();
    },
  };
})(ProductController, UIController,StorageController);

ApiController.init();
