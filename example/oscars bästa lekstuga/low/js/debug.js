document.onkeydown = keydown;


var debugOn = 0;

function keydown(evt) {
    if (!evt) evt = event;
    if (evt.ctrlKey && evt.keyCode == 68) { //CTRL+D
        if (debugOn == 0) {
            let dropDowndiv = document.createElement("div");
            let newDiv = document.createElement("div");
            newDiv.className = "menubarAContainer";
            newDiv.id = "debugContainer"
            newDiv.style.backgroundColor = "#26911a";

            newElement = document.createElement("a");
            newElement.innerHTML = "Debug";
            newElement.href = "debug.html";
            document.querySelector("#menubarContainer").appendChild(newDiv);
            newDiv.appendChild(newElement);
            newDiv.appendChild(dropDowndiv);

            debugOn = 1;
        } else {
            document.getElementById("debugContainer").remove();
            debugOn = 0;
        }
    }
    else if (evt.ctrlKey && evt.keyCode == 82) {
        location.reload();
    }
    else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 73 || evt.keyCode == 123) {
        var window = remote.getCurrentWindow();
        window.webContents.toggleDevTools();
    }
}