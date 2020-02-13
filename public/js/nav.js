function getCategoryList() {
    fetch('/get-category-list', {
        method: 'POST'
    }).then((response)=>{
        return response.text();
    }).then((body)=>{
        showCategoryList(JSON.parse(body));
    });
}

function showCategoryList(data) {
    let out = '<ul class="category-list"><li><a href="/">Главная</a></li>';
    data.forEach((item)=>{
       out += `<li><a href="/cat?id=${item.id}">${item.category}</a></li>`;
    });
    out += '</ul>';
    document.querySelector('#category-list').innerHTML = out;
}
getCategoryList();