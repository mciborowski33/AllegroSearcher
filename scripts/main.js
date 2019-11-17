window.onload = function() {
  //alert("JS działa.")

  $("#d2").hide();
  $("#searchProducts").click(function(){
    $("#d1").hide();
    $("#d2").show();
  });
  $("#back").click(function(){
    $("#d2").hide();
    $("#d1").show();
  });

};
