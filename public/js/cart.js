let cart = {};

document.querySelectorAll('.add-to-cart').forEach((item)=>{
    item.onclick = addToCart;
});

if(localStorage.getItem('cart')){
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodsInfo();
}

function addToCart(e) {
    e.preventDefault();
    let goodsId = this.dataset.goods_id;
    if(cart[goodsId]){
        cart[goodsId]++;
    }else {
        cart[goodsId] = 1;
    }
    ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
    updateLocalStorageCart();
    fetch("/get-goods-info", {
        method: "POST",
        body: JSON.stringify({key: Object.keys(cart)}),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
        .then((res)=>{
            return res.text();
        })
        .then((body)=>{
            showCart(JSON.parse(body));
        })
}

function showCart(data){
    let out = `<table class="highlight"><tbody>`;
    let total = 0;
    for(let key in cart){
        out += `<tr><td><a href="/goods?id=${key}">${data[key]['name']}</a><br>`;
        out += `<a class="waves-effect waves-light btn cart-minus" data-goods_id="${key}">-</a>&nbsp;&nbsp;`;
        out += `${cart[key]}&nbsp;&nbsp;`;
        out += `<a class="waves-effect waves-light btn cart-plus" data-goods_id="${key}">+</a>&nbsp;&nbsp;`;
        out += `${data[key]['cost'] * cart[key]} mdl`;
        out += `</td></tr>`;
        total += cart[key] * data[key]['cost'];
    }
    out += `<tr><td>Total: ${total}</td></tr>`;
    out += '</tbody></table>';
    document.querySelector("#cart-nav").innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach((item)=>{
        item.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach((item)=>{
        item.onclick = cartPlus;
    });
}

function cartPlus(){
    let goodsId = this.dataset.goods_id;
    cart[goodsId]++;
    ajaxGetGoodsInfo();
}

function cartMinus() {
    let goodsId = this.dataset.goods_id;
    if(cart[goodsId] - 1 > 0){
        cart[goodsId]--
    }else{
        delete cart[goodsId];
    }
    ajaxGetGoodsInfo();
}

function updateLocalStorageCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

//popup cart
const popup = document.querySelector(".popup-block");
let opened = false;
document.querySelectorAll('.popup-btn').forEach((btn)=>{
   btn.addEventListener('click', ()=>{
    if (opened){
        popup.style.right = "-9999px";
        opened = false;
    }else{
        popup.style.right = 0;
        opened = true;
    }
   });
});

