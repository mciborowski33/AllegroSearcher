var socket = io.connect('http://localhost');
    socket.on('results', function (data) {
    console.log(data);
    display();
    //socket.emit('test', { my: 'data' });
});

function display(){
  var name = document.getElementById('productName').value;
  var price;

  var node = document.createElement("LI");
  var textnode = document.createTextNode(name);
  node.classList.add("list-group-item");
  node.appendChild(textnode);
  document.getElementById('resultList1').appendChild(node);
}
