window.onload = function() {
  //alert("JS działa.")

  document.getElementById('d1').style.display="block";
  document.getElementById("addToList").addEventListener("click", appendToList);
  document.getElementById("searchProducts").addEventListener("click", hide);
  document.getElementById("searchProducts").addEventListener("click", display);
  document.getElementById("back").addEventListener("click", hide);
  document.getElementById("back").addEventListener("click", clear);
};
var a = 0;
var b = 0;

class Product {
  constructor(id, name, p_min, p_max){
    this.id = id;
    this.name = name;
    this.p_min = p_min;
    this.p_max = p_max;
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

function addProduct(id, name, p_min, p_max) {
  const product = new Product(id, name, p_min, p_max);
  product_array.push(product);
}

function deleteFromArray(no) {
  //no +=1;
  product_array.splice(no, 1);
}

function appendToList(){
  //var index = b;
  var nameBox = document.getElementById('productName');
  var name = document.getElementById('productName').value;
  var p_min = document.getElementById('pmin').value;
  var p_max = document.getElementById('pmax').value;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(name);
  var sp = document.createElement("SPAN");
  //var  button_name = "closeBtn" + a
  var closeBtn = document.createElement("BUTTON");
  if(p_min == ""){
    p_min = 0;
  }
  if(p_max == ""){
    p_max = 0;
  }
  sp.innerHTML = " " + p_min + "-" + p_max + "zł";
  closeBtn.innerHTML = "&times;";
  closeBtn.classList.add("close");
  closeBtn.setAttribute("id", b);
  closeBtn.setAttribute("onclick", "removeFromList()");
  node.classList.add("list-group-item");
  if(a<5 && (p_max-p_min) >= 0){
    if(name != ""){
      nameBox.classList.remove("is-invalid", "my-placeholder");
      nameBox.setAttribute("placeholder", "Czego szukasz?");
      a++;
      node.appendChild(textnode);
      if(!(p_min == 0 && p_max == 0)){
          node.appendChild(sp);
      }
      node.appendChild(closeBtn);
      document.getElementById('productList').appendChild(node);
      addProduct(b, name, p_min, p_max);
      b++;
    }else{
      nameBox.classList.add("is-invalid", "my-placeholder");
      nameBox.setAttribute("placeholder", "To pole nie może być puste");
    }
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

document.getElementById('searchProducts').addEventListener("click", function(){
    //console.log(JSON.stringify(product_array));
    sendSearch(JSON.stringify({searchData: product_array}));
});

function clear(){
  var list = document.getElementById('resultList1');
  while( list.firstChild ){
    list.removeChild( list.firstChild );
  }
}

function isNumberKey(evt){
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)){
	   return false;
  }
	return true;
}

function isAllowedKey(evt){
  var charCode = (evt.witch) ? evt.which : evt.keyCode;
  if(charCode < 31 || charCode == 34 || charCode == 47 || charCode == 58 || charCode == 91 || charCode == 92 || charCode == 93 || charCode == 123 || charCode == 125){
    return false;
  }
  return true;
}
