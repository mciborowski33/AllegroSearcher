var socket = io.connect('http://localhost');
    socket.on('results', function (data) {
    //console.log(data);
    var result = JSON.parse(data);
    console.log(result);
    hide();
    display(result);
    //socket.emit('test', { my: 'data' });
});

function display(result){
  var listLength = product_array.length;
  console.log(listLength);
  for(i=0; i<3; i++){
    var price = 0;
    for(j=0; j<listLength; j++){
    var product = result[i][j];
    price = price + product.price;
    var sp = document.createElement("SPAN");
    var id = 'r' + (i+1);
    var title = document.getElementById(id);
    sp.classList.add("font-weight-bold");
    sp.innerHTML = price + "zł";
    title.innerHTML = "Zestaw " + (i+1).toString() + " - ";
    title.appendChild(sp);
    displayItem(product, i);
    }
  }
}

function displayItem(product, i){
  var name = product.name;
  var prodPrice = product.price;
  var sp = document.createElement("SPAN");
  var node = document.createElement("A");
  var id = 'resultList' + (i+1);
  var link = product.link;
  sp.style= "float:right";
  sp.innerHTML = prodPrice + "zł";
  node.innerHTML = name;
  node.appendChild(sp);
  node.setAttribute("href", link);
  node.setAttribute("target", "_blank")
  node.classList.add("list-group-item", "list-group-item-action");
  document.getElementById(id).appendChild(node);
}
