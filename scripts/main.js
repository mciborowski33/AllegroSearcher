window.onload = function() {
  //alert("JS działa.")

  document.getElementById('d2').style.display="none";
  document.getElementById('d1').style.display="block";
};
var a = 0;
var b = 0;
var name_array = [];
var c_min_array = [];
var c_max_array = [];
var id_array = [];

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

function addProduct(name, c_min, c_max, id) {
  name_array.push(name);
  c_min_array.push(c_min);
  c_max_array.push(c_max);
  id_array.push(id);
}

function deleteFromArray(no) {
  //no +=1;
  name_array.splice(no,1);
  c_min_array.splice(no,1);
  c_max_array.splice(no,1);
  id_array.splice(no,1);
}

function appendToList(){
  //var index = b;
  var name = document.getElementById('productName').value;
  var c_min = document.getElementById('cmin').value;
  var c_max = document.getElementById('cmax').value;
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
    addProduct(name, c_min, c_max, b);
    b++;
  }
}
function removeFromList(){
  a--;
  var target = event.target;
  //var id = target.parentNode.id;
  console.log("blaaa");
  console.log(target.id);
  var indeks = parseInt(target.id);
  //indeks += 1;
  var k = id_array.indexOf(indeks);
  //console.log(k);
  deleteFromArray(k);
  console.log(name_array);
  console.log(id_array);
  console.log(c_min_array);



  //console.log(id);
  document.getElementById('productList').removeChild(target.parentNode);
}
