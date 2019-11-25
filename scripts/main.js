window.onload = function() {
  //alert("JS działa.")

  document.getElementById('d2').style.display="none";
  document.getElementById('d1').style.display="block";
};
var a = 0;
var b = 0;

class Product {
  constructor(name, p_min, p_max, id){
    this.name = name;
    this.p_min = p_min;
    this.p_max = p_max;
    this.id = id;
  }
}
var product_array = [];



function hide(){
  if(a>0){
    var x = document.getElementById('d1');
    var y = document.getElementById('d2');
    if(x.style.display === "block"){
      x.style.display="none";
      y.style.display="block";
    }else{
      x.style.display="block";
      y.style.display="none";
    }
  }
}

function addProduct(name, p_min, p_max, id) {
  const product = new Product(name, p_min, p_max, id);
  product_array.push(product);
}

function deleteFromArray(no) {
  //no +=1;
  product_array.splice(no, 1);
}

function appendToList(){
  //var index = b;
  var name = document.getElementById('productName').value;
  var p_min = document.getElementById('cmin').value;
  var p_max = document.getElementById('cmax').value;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(name);
  //var  button_name = "closeBtn" + a
  var closeBtn = document.createElement("BUTTON");
  closeBtn.innerHTML = "&times;";
  closeBtn.classList.add("close");
  closeBtn.setAttribute("id", b);
  closeBtn.setAttribute("onclick", "removeFromList()");
  node.classList.add("list-group-item");
  if(a<5){
    a++;
    node.appendChild(textnode);
    node.appendChild(closeBtn);
    document.getElementById('productList').appendChild(node);
    addProduct(name, p_min, p_max, b);
    b++;
  }
}
function removeFromList(){
  a--;
  var target = event.target;
  //var id = target.parentNode.id;
  console.log("blaaa");
  console.log(target.id);
  var index = parseInt(target.id);
  //index += 1;
  var found = false;
  var array_index = -1;
  for(var i =0; i < product_array.length; i++) {
    if(product_array[i].id == index) {
      found = true;
      array_index = i;
      break;
    }
  }

  //var k = id_array.indexOf(index);
  //console.log(k);
  console.log(array_index);
  deleteFromArray(array_index);
  //console.log(name_array);
  //console.log(id_array);
  console.log(product_array);
  document.getElementById('productList').removeChild(target.parentNode);
}
