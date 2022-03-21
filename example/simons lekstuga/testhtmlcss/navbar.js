

var fs = require('fs');
var navbarData = JSON.parse(fs.readFileSync('navbar.json', 'utf8'));
/*
let navbarData = [{
        "text": "Dashboard",
        "redirect": "index.html"
    },

    {
        "text": "Devices",
        "redirect": "devices.html"
    },

    {
        "text": "Settings",
        "redirect": "#",
        "dropdown": [{
                "text": "Scripts",
                "redirect": "scripts.html"
            },
            {
                "text": "Log",
                "redirect": "log.html"
            }
        ]
    },
]
*/



navbarData.forEach(function (obj) {
    //<div class="menubarAContainer">
    //console.log(obj);
    let dropDowndiv = document.createElement("div");
    let newDiv = document.createElement("div");
    newDiv.className = "menubarAContainer menubarAContainerHover";


    newElement = document.createElement("a");
    newElement.innerHTML = obj.text;

    if (obj.redirect) {
    var root = process.cwd(); // Grab application directory
    newElement.href = root+"/public"+obj.redirect;
    }

    if (obj.dropdown) {
        //<div class="dropdown-content">
        newDiv.className = "menubarAContainer menubarAContainerHover dropdownMenu";
        dropDowndiv.className = "dropdown-content";

        for (let i = 0; i < obj.dropdown.length; i++) { //gets the dropdown values

            let emptyNewDiv = document.createElement("div");
            emptyNewDiv.className = "menubarAContainer menubarAContainerHover";

            let dropdownA = document.createElement("a");


            
            dropdownA.innerHTML = obj.dropdown[i].text;
            

            if (obj.dropdown[i].redirect) {
                var root = process.cwd(); // Grab application directory
                newElement.href = root+"/public"+obj.dropdown[i].redirect;
                }

            emptyNewDiv.appendChild(dropdownA);
            dropDowndiv.appendChild(emptyNewDiv);
        }




        // newElement.style.background = "green";
    }

    document.querySelector("#menubarContainer").appendChild(newDiv);
    if (obj.input) {
        newElement = document.createElement("input");
        newElement.placeholder = obj.text;
        newElement.id = obj.input;

        newDiv.style.display = "block";

        dropDowndiv.style.maxHeight = "500px";
        dropDowndiv.style.overflow = "auto";
        dropDowndiv.id = "searchResult";
        dropDowndiv.style.display = "none";
            console.log("aaaaaaaa");

            newDiv.className = "menubarAContainer";
        document.querySelector("#menubarContainer").appendChild(newDiv);
    }

    
    newDiv.appendChild(newElement);
    newDiv.appendChild(dropDowndiv);
});


// Toolbar
const remote = require('electron').remote;

document.getElementById("minimise").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    window.minimize();
});

document.getElementById("windowed").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
});

document.getElementById("close").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    window.close();
});