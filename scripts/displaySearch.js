var socket = io.connect('http://localhost');
    socket.on('results', function (data) {
    //console.log(data);
    var result = JSON.parse(data);
    console.log(result);
    var product = result[0][0].name;
    console.log(product);
    display();
    //socket.emit('test', { my: 'data' });
});

function display(){

  var price = "Cena";
  var listLength = product_array.length;
  var sp1 = document.createElement("SPAN");
  var title = document.getElementById('r1');
  sp1.classList.add("font-weight-bold");
  sp1.innerHTML = price;
  title.innerHTML = "Zestaw 1 - ";
  title.appendChild(sp1);
  for(i=0; i<listLength; i++ ){
    displayItem();
  }
}

function displayItem(){
  var name = document.getElementById('productName').value;
  var prodPrice = "Price";
  var sp2 = document.createElement("SPAN");
  var node = document.createElement("A");
  sp2.style= "float:right";
  sp2.innerHTML = prodPrice;
  node.innerHTML = name;
  node.appendChild(sp2);
  node.setAttribute("href", "#");
  node.classList.add("list-group-item", "list-group-item-action");
  document.getElementById('resultList1').appendChild(node);
}
