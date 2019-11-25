var socket = io.connect('http://localhost');
    socket.on('results', function (data) {
    console.log(data);
    display();
    //socket.emit('test', { my: 'data' });
});

function display(){
  document.getElementById('r1').innerHTML = "Zestaw 1 <span>Cena</span>";
  var name = document.getElementById('productName').value;
  var price;
  var node = document.createElement("A");
  var textnode = document.createTextNode(name);
  node.classList.add("list-group-item");
  node.appendChild(textnode);
  node.setAttribute("href", "#");
  node.classList.add("list-group-item", "list-group-item-action");
  document.getElementById('resultList1').appendChild(node);

}
