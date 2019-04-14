function getData() {
	var xml = new XMLHttpRequest();
	xml.open('get','./data.json',true);
	xml.send();
	xml.onreadystatechange = function() {
		if(xml.readyState != 4) return;
		if(xml.status != 200){
			alert(xml.status + ': ' + xml.statusText);
		}else{
			var products = JSON.parse(xml.responseText);
			products = products.items;
			startShop(products);
		};
	}
}
getData();
function startShop(products) {

	var currency = "$";
	/***** View products *****/
	var count, price;
	var content = document.getElementsByClassName('content');
	var content2 = content[0].cloneNode(true);
	var item = content[0].getElementsByClassName('item');
	var itemClone;
	function showProduct(){
		var symbol = " ";
		if(products.length>0){
			itemClone = item[0].cloneNode(true);
			content[0].innerHTML = " ";
			content[0].appendChild(itemClone);
			item[0].style.display = 'block';
			var productList = document.createDocumentFragment();
			products.forEach(function (argument, index) {
				itemClone = item[0].cloneNode(true);
				itemClone.dataset.number = index + 1;
				itemClone.firstElementChild.innerText = argument.name;
				if(argument.image){
					var bg = 'url(img/' + argument.image + ') center center no-repeat';
					itemClone.firstElementChild.nextSibling.nextSibling.style.background = bg;
					itemClone.firstElementChild.nextSibling.nextSibling.style.backgroundSize = "contain";
				}
				count = itemClone.getElementsByClassName('count');
				count[0].innerText = argument.quatity;
				price = itemClone.getElementsByClassName('price');
				price[0].innerText = formatPrice(argument.price, symbol) + " " + currency;
				productList.appendChild(itemClone);
			});
			content[0].appendChild(productList);
			item[0].style.display = 'none';
		};
	}
	showProduct();

	/***** View price*****/
	function formatPrice(arg, symbol) {
		var name = arg.toString();
		var name1;
		for(var i=0; i<name.length; ){
			if(i == 0){
				var j = name.length%3;
				if(j == 0){
					name1 = name.substr(i, 3) + symbol;
					i = i + 3;
				}else{
					name1 = name.substr(i, j) + symbol;
					i = i + j;
				}
			}else{
				name1 = name1 + name.substr(i, 3) + symbol;
				i = i + 3;
			}
		};
		return name = name1.substr(0, name1.length -1);
	}

	/***** Search product *****/
	var searchBlock = document.getElementsByClassName('search');
	var buttonSearch = searchBlock[0].getElementsByTagName('button');
	buttonSearch[0].onclick = startSearch;
	function startSearch() {
		var search = searchBlock[0].getElementsByTagName('input')[0].value.toLowerCase();
		if(search.length>1){
			products = products.filter(function(item) {
				if(item.name.toLowerCase().indexOf(search) != -1){
					return true;
				}
			});
		}
		var widthSection = document.getElementsByTagName('section');
		if(products.length == 3){
			widthSection[0].style.width = '934px';
		}
		if(products.length == 2){
			widthSection[0].style.width = '612px';
		}
		if(products.length == 1){
			widthSection[0].style.width = '300px';
		}
		
		showProduct();
		findAddClick();
	}

	/***** Sort products *****/
	var select = document.getElementsByTagName('select');
	select[0].onchange = changeSelect;
	function changeSelect() {
		var option = select[0].getElementsByTagName('option');
		for(var i=0; i<option.length; i++){
			if(i == 0){
				if(option[i].selected){
					products = products.sort(compareNumeric);
					showProduct();
				}
			}else{
				if(option[i].selected){
					products = products.sort(compareName);
					showProduct();
				}
			}
		}
		findAddClick();
	}
	function compareName(a, b) {
	  if (a.name > b.name) return 1;
	  if (a.name < b.name) return -1;
	}
	function compareNumeric(a, b) {
	  if (a.price > b.price) return 1;
	  if (a.price < b.price) return -1;
	}

	/***** Count current item *****/
	var productPlus = document.getElementsByClassName('plus');
	var productMinus = document.getElementsByClassName('minus');

	for(var i=0; i<productPlus.length; i++){
		productPlus[i].onclick = changeCount;
	};
	for(var j=0; j<productMinus.length; j++){
		productMinus[j].onclick = changeCount;
	};
	function changeCount(){
		var count;
		var currentClick = this;
		var currentItem = currentClick.parentNode.parentNode.parentNode.parentNode;
		var number = currentItem.dataset.number - 1;
		number = +number;
		products.forEach(function (argument, index) {
			if(index == number){
				if(currentClick.className == 'plus'){
					argument.quatity = argument.quatity + 1;
				}else{
					if(argument.quatity > 1){
						argument.quatity = argument.quatity - 1;
					}
				}
				count = currentItem.getElementsByClassName('count');
				count[0].innerText = argument.quatity;
			}
		});
	}

	/***** Products in shopping cart *****/
	var selectedProduct = [];
	var cart = document.getElementById('cart');
	var countProductsSelected = 0;
	cart.innerText = countProductsSelected;
	var buttonClick = content[0].getElementsByTagName('button');
	function findAddClick() {
		for(var j=0; j<buttonClick.length; j++){
			buttonClick[j].onclick = addProduct;
		}
	}
	findAddClick();
	function addProduct(){
		countProductsSelected = 0;
		var currentItem = this.parentNode.parentNode.parentNode;
		var indexClone = {};
		for (var key in products[currentItem.dataset.number - 1]) {
			indexClone[key] = products[currentItem.dataset.number - 1][key];
		}
		selectedProduct.forEach(function (argument, index, selectedProduct) {
			if (argument.name == indexClone.name) {
				if (argument.image == indexClone.image) {
					if (argument.price == indexClone.price) {
						indexClone.quatity = indexClone.quatity + argument.quatity;
						selectedProduct.splice(index, 1);
					}
				}
			}
		});
		selectedProduct.push(indexClone);
		try{
			console.log(selectedProduct[indexClone].quatity);
		}catch(e){

		}
		countProductsSelected = selectedProduct.length
		cart.innerText = countProductsSelected;
		addProductList();
	}

	/***** Show sopping cart *****/
	var noneScroll = document.getElementsByTagName('body');
	var cartShow = document.getElementsByClassName('shoping');
	cart.parentNode.onclick = showCart;
	cart.parentNode.parentNode.lastElementChild.onclick = showCart;
	function showCart() {
		cartShow[0].style.display = 'block';
		noneScroll[0].style.cssText = "overflow-y:hidden;";
	}
	var closeCart = document.getElementById('close-cart');
	closeCart.onclick = closeShoppingCart;
	function closeShoppingCart() {
		cartShow[0].style.display = 'none';
		noneScroll[0].style.cssText = "overflow-y:visible;";
	}

	/***** Shopping cart lists *****/
	var items= document.getElementsByClassName('items');
	var listProduct = items[0].firstElementChild;
	listProduct.style.display = 'none';
	var productClone, quatityProduct;
	function addProductList() {
		var symbol = " ";
		for(var i=0; i<items.length; i++){
			items[i].innerHTML = " ";
		}
		selectedProduct.forEach(function (argument, index, selectedProduct) {
			productClone = listProduct.cloneNode(true);
			productClone.style.display = "block";
			var countPoduct = productClone.firstElementChild.firstElementChild;
			if(index < 9){
				countPoduct.innerText = "0" + (index + 1) + ".";
			}else{
				countPoduct.innerText = index + 1 + ".";
			}
			var nameProduct = productClone.firstElementChild.lastElementChild;
			nameProduct.innerText = argument.name;
			quatityProduct = productClone.getElementsByClassName('quatity');
			quatityProduct[0].innerText = argument.quatity;
			var priceProduct = productClone.getElementsByClassName('price');
			priceProduct[0].innerText = formatPrice(argument.price, symbol) + " " + currency;
			items[0].appendChild(productClone);
			priceTotal();
			activeButtton();
			findRemoveClick();
		});
	}

	/***** Remove product from cart *****/
	var removeProduct = items[0].getElementsByClassName('remove');
	function findRemoveClick() {
		for(var j=0; j<removeProduct.length; j++){
			removeProduct[j].onclick = remove;
		}
	}
	function remove() {
		var product = this.parentNode.parentNode;
		var productNumber = product.firstElementChild.firstElementChild.innerText;
		productNumber = Number(productNumber) - 1;
		selectedProduct.forEach(function (argument, index, arr) {
			if(productNumber == index){
				selectedProduct.splice(index, 1);
			}
			products.forEach(function (elem, i) {
				if(selectedProduct[index] != elem){
					item[i].dataset.selected = "false";
				}
			});
		});
		countProductsSelected -= 1;
		if(countProductsSelected == 0){
			totalPrice = 0;
			total[0].innerText = totalPrice +" $";
		}
		cart.innerText = countProductsSelected;
		addProductList();
		activeButtton();
	}


	/***** Total price *****/
	var total = cartShow[0].getElementsByClassName('total');
	var totalPrice = 0;
	total[0].innerText = totalPrice +" " + currency;
	function priceTotal() {
		var symbol = ",";
		totalPrice = 0;
		selectedProduct.forEach(function (argument, index, arr) {
			var cost = argument.price.toString();
			var count = Number(argument.quatity);
			cost = parseInt(cost.replace(/^\s+|\s+|\s+$/g, ''));
			totalPrice += cost * count;
		});
		total[0].innerText = formatPrice(totalPrice, symbol) + " " + currency;
	}

	/***** Buy products *****/
	var hiddenCart = cartShow[0].getElementsByClassName('shoping-cart');
	var viewCanceled = cartShow[0].getElementsByClassName('buy-canceled');
	var buy = hiddenCart[0].getElementsByTagName('button');
	function activeButtton(){
		if(countProductsSelected == 0){
			buy[0].setAttribute("disabled", "true");
		}else{
			buy[0].removeAttribute("disabled");
		}
	}
	buy[0].onclick = productBuy;
	function productBuy(){
		hiddenCart[0].style.display = 'none';
		viewCanceled[0].style.display = 'block';
	}

	/***** Close cart *****/
	var clickClose = viewCanceled[0].getElementsByClassName('close');
	var clickButton = viewCanceled[0].getElementsByTagName('button');
	clickClose[0].onclick = cartClose;
	clickButton[0].onclick = cartClose;
	function cartClose(){
		hiddenCart[0].style.display = 'block';
		viewCanceled[0].style.display = 'none';
		cartShow[0].style.display = 'none';
		noneScroll[0].style.cssText = "overflow-y:visible;";
		for(var j=0; j<removeProduct.length; ){
			if(countProductsSelected.length!=0){
				removeProduct[j].click();
				j = 0; 
			}
		}
	}	
}
