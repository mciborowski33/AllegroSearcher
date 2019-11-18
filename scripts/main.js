window.onload = function() {
  //alert("JS działa.")

  document.getElementById('d2').style.display="none";
  document.getElementById('d1').style.display="block";
};
var a = 0;

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

function appendToList(){
  var name = document.getElementById('productName').value;
  var c_min = document.getElementById('cmin').value;
  var c_max = document.getElementById('cmax').value;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(name);
  var closeBtn = document.createElement("BUTTON");
  closeBtn.innerHTML = "&times;";
  closeBtn.classList.add("close");
  closeBtn.setAttribute("id", "closeBtn");
  closeBtn.setAttribute("onclick", "removeFromList()");
  node.classList.add("list-group-item");
  if(a<5){
    a++;
    node.appendChild(textnode);
    node.appendChild(closeBtn);
    document.getElementById('productList').appendChild(node);
  }
}
function removeFromList(){
  a--;
  var target = event.target;
  var id = target.parentNode.id;
  document.getElementById('productList').removeChild(target.parentNode);
}
