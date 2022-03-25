var myLink = document.getElementById('sendcommandbutton');

myLink.onclick = function(){
    var theip = document.getElementById('theip').value;
    var theport = document.getElementById('theport').value;
    var thecommand = document.getElementById('thecommand').value;
    if (theip=="" || theport=="" || thecommand=="") {
        alert("One or more boxes are empty!");
    }
    else {
        alert("Sending...", theip,theport,thecommand);
        console.log(theip,theport,thecommand);
    }
    

}