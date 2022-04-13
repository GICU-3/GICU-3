const Fuse = require('fuse.js')
const fs = require('fs');
const { runInContext } = require('vm');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

document.getElementById("search").onkeyup = function() {
    fuseSearch()
    if (!document.getElementById("search").value) {
        summonAllEmpty();
    }
};

//AUTOMATISK SÖK VID KEYDOWN EVENT. FUNGERAR EJ. DEN NEDRE RADEN FUNGERAR
//OM DEN ÖVRE TAS BORT. MEN DEN FUNGERAR ENDAST VID OMLADDNING (CTRL+R)
//document.addEventListener("keydown").focus();
//document.getElementById("search").focus();

document.getElementById("search").onfocus = async function() {
    document.getElementById("searchResult").style.display = "block";
    //console.log("focused");

    if (!document.getElementById("search").value) {
        summonAllEmpty();
    }
};
document.getElementById("search").onblur = async function() {
    await sleep(100);
    add();
    document.getElementById("searchResult").style.display = "block";
    if (document.getElementById("search").value == 0) {
        document.getElementById("searchResult").style.display = "none";
        console.log("offfocused");
    }
};

function fuseSearch() {
    // 1. List of items to search in
    add();
    var books = JSON.parse(fs.readFileSync('utilities.json', 'utf8'));

    const options = {
        threshold: 0.0
    }

    // 2. Set up the Fuse instance
    const fuse = new Fuse(books, {
        keys: ['utility', 'keywords', 'description']
    })

    // 3. Now search!

    var outputJson = fuse.search(document.getElementById("search").value);
    //console.log(outputJson)
    summonBar(outputJson);
}

function summonAllEmpty() {
    var books = JSON.parse(fs.readFileSync('utilities.json', 'utf8'));
    let booksOutput = [];
    books.forEach(function(obj) {
        let booksAfter = {};
        booksAfter.item = obj;

        booksOutput.push(booksAfter);

    });
    //console.log(booksOutput);
    summonBar(booksOutput);
}

function summonBar(inputJson) { // Reads the JSONdata and makes it magically appear under Search
    document.getElementById("searchResult").innerHTML = "";
    inputJson.forEach(function(obj, i) {
        //console.log(obj);

        let newDiv = document.createElement("div");
        let contentDiv = document.createElement("div");
        let contentDivDescription = document.createElement("div");
        let contentcontainer = document.createElement("div");
        //newDiv.className = "menubarAContainer";

        var root = process.cwd(); // Grab application directory

        newDiv.className = i;
        newElement = document.createElement("a");
        newElement.innerHTML = obj.item.utility;
        newElement.style.display = "relative";

        newElementDescription = document.createElement("a");
        newElementDescription.innerHTML = obj.item.description;
        newElementDescription.style.display = "relative";

        newImage = document.createElement("img");
        newImage.src = obj.item.icon;

        contentDiv.className = "searchContentDiv";
        contentDivDescription.className = "searchContentDivDescription";
        newDiv.className = "aaaa";
        contentcontainer.className = "container";

        document.querySelector("#searchResult").appendChild(newDiv);

        contentcontainer.appendChild(contentDivDescription);
        contentcontainer.appendChild(newImage);
        newDiv.appendChild(contentDiv);
        newDiv.appendChild(contentcontainer);

        contentDiv.appendChild(newElement);
        contentDivDescription.appendChild(newElementDescription);
        var class_id = document.getElementsByClassName('aaaa');
        class_id[i].id = obj.item.Id; //Ger ett id för varje sökbara element

        var element_id = document.getElementById(class_id[i].id);

        element_id.addEventListener("click", sayhello); //säger vilket id div tillhör

        var del_history = document.getElementById("removeHistory");
        del_history.addEventListener("click", removebutton);

        function sayhello() {
            var selected = document.querySelectorAll(".chosen");
            let r = document.createElement("div");
            let image = document.createElement("img");
            image.src = "images/cross.svg";
            r.className = "chosen"
            document.querySelector("#searchHistory").appendChild(r);
            r.innerHTML = obj.item.utility;
            r.id = "chosen" + obj.item.Id;
            selected.forEach(function(div, e) {
                var a = document.getElementsByClassName("chosen")
                var b = document.getElementById(a[e].id)
                //console.log(a[e].id);
                //console.log(r.id);
                if (r.id == a[e].id) {
                    console.log("test")
                    try { b.parentNode.removeChild(b) } catch {};
                }
            })
            searchHistory.appendChild(r);
            r.appendChild(image);
        }
        function removebutton() {
            var selected = document.querySelectorAll(".chosen");
            selected.forEach(function(div, e) {
                var a = document.getElementsByClassName("chosen")
                var b = document.getElementById(a[e].id);
                try { b.parentNode.removeChild(b) } catch {};
            })
        }
        
        /*if (element_id !== sayhello().target && !element_id.contains(sayhello().target)) {    
            console.log('clicking outside the div');
            element_id.style.height == "160px";
        }*/
        console.log(obj.item.utility)
    });
}

function add() {
    var selected = document.querySelectorAll(".chosen");

    selected.forEach(function(div, i) {
        var a = document.getElementsByClassName("chosen")
        var b = document.getElementById(a[i].id)
        //let parent = document.querySelector(".chosen");
        b.addEventListener("click", remove);
        console.log(selected[i]);

        function remove() {
            try { b.parentNode.removeChild(b)} catch {};
        }
    })
}