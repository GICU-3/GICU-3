const Fuse = require('fuse.js')
const fs = require('fs')

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

document.getElementById("search").onkeyup = function () {
    fuseSearch()
    if (!document.getElementById("search").value) {
        summonAllEmpty();
    }
};

document.getElementById("search").onfocus = async function () {
    document.getElementById("searchResult").style.display = "block";
    //console.log("focused");

    if (!document.getElementById("search").value) {
        summonAllEmpty();
    }
};
document.getElementById("search").onblur = async function () {
    await sleep(100);
    document.getElementById("searchResult").style.display = "none";
    console.log("offfocused");
};
function fuseSearch() {
    // 1. List of items to search in
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
        let booksOutput =[];
        books.forEach(function (obj) {
            let booksAfter = {};
            booksAfter.item = obj;

             booksOutput.push(booksAfter);
            
        });
        //console.log(booksOutput);
        summonBar(booksOutput);
}

function summonBar(inputJson) { // Reads the JSONdata and makes it magically appear under Search
    document.getElementById("searchResult").innerHTML = "";
    inputJson.forEach(function (obj) {
        //console.log(obj);
        
        let newDiv = document.createElement("div");
        let contentDiv = document.createElement("div");
        let contentDivDescription = document.createElement("div");
        //newDiv.className = "menubarAContainer";

        var root = process.cwd(); // Grab application directory

        newElement = document.createElement("a");
        newElement.innerHTML = obj.item.utility;
        newElement.style.display = "relative";

        newElementDescription = document.createElement("a");
        newElementDescription.innerHTML = obj.item.description;
        newElementDescription.style.display = "relative";


        newImage = document.createElement("img");
        newImage.src = obj.item.icon;
        
        
        
        newDiv.addEventListener("click", function() {window.location.href = root + '\\public' + obj.item.redirect;})
        //newDiv.onClick = "console.log(yoo);";
        newDiv.className = "aaaa";

        console.log(root + '\\public' + obj.item.redirect);
        //console.log(root + "/public" + obj.item.redirect)
        

        // Any Changes To Le Elements
        
        contentDiv.className = "searchContentDiv";
        contentDivDescription.className = "searchContentDivDescription";


        if (obj.item.favourite == "true") {
            contentDiv.className = "searchContentDiv favourite";
            newImage.className = "favourite";
            newDiv.className = "aaaa favourite";
            console.log("here")
        }


        
        document.querySelector("#searchResult").appendChild(newDiv);

        newDiv.appendChild(contentDiv);
        newDiv.appendChild(newImage);
        newDiv.appendChild(contentDivDescription);
        
        contentDiv.appendChild(newElement);
        contentDivDescription.appendChild(newElementDescription);
        

        console.log(obj.item.utility)
    });
}