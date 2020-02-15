document.querySelector('#lite-shop-order').onsubmit = function(e){
    e.preventDefault();
    const userName = document.querySelector('#username').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const email = document.querySelector('#email').value.trim();
    const address = document.querySelector('#address').value.trim();

    if(!document.querySelector('#rule').checked){
        console.log("не согласен с условиями");
        return false;
    }

    if(userName === '' || phone === '' || email === '' || address === ''){
        console.log("есть не заполненные поля");
        return false;
    }

    fetch(`/finish-order`, {
        method: 'POST',
        body: JSON.stringify({
            username: userName,
            phone: phone,
            email: email,
            address: address,
            key: JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then((response)=>{
        return response.text();
    }).then((body)=>{
        // console.log(body);
        if (+body === 1){
            // console.log('ok')
            document.querySelector('#lite-shop-order').innerHTML = "<h2>Спасибо за заказ!</h2>";
        } else {

        }
    });
};