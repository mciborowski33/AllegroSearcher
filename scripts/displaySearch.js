var socket = io.connect('http://localhost');
    socket.on('results', function (data) {
    console.log(data);
    display();
    //socket.emit('test', { my: 'data' });
});

function display(){
  var name = document.getElementById('productName').value;
  var price = "Cena";
  var prodPrice = "Price";
  var sp1 = document.createElement("SPAN");
  var sp2 = document.createElement("SPAN");
  var node = document.createElement("A");
  var title = document.getElementById('r1');
  sp1.classList.add("font-weight-bold");
  sp1.innerHTML = price;
  sp2.style= "float:right";
  sp2.innerHTML = prodPrice;
  title.innerHTML = "Zestaw 1 - ";
  title.appendChild(sp1);
  node.innerHTML = name;
  node.appendChild(sp2);
  node.setAttribute("href", "#");
  node.classList.add("list-group-item", "list-group-item-action");
  document.getElementById('resultList1').appendChild(node);
}
