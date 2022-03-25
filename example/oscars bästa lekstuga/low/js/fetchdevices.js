const {
    strict
} = require('assert');
const {
    BrowserWindow
} = require('electron');


var myLink = document.getElementById('AddDeviceButton');



function CreateTableFromJSON() {
    var fs = require('fs');
    var devicesData = JSON.parse(fs.readFileSync('./public/js/devices.json', 'utf8'));



    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < devicesData.length; i++) {
        for (var key in devicesData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1); // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    ///////////////// Extra row for delete box
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = "";
    tr.appendChild(th);

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < devicesData.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = devicesData[i][col[j]];
            
            if (j == 5 && devicesData[i][col[j]] == "true") {
                tabCell.style.background = "var(--activedevice)";
                
                tabCell.style.cursor = "pointer";
                var theid = i;
                tabCell.setAttribute("id", theid);
                tabCell.onclick = function () {
                    FlipActive(this.id);
                };
            } else if (j == 5 && devicesData[i][col[j]] == "false") {
                tabCell.style.background = "var(--inactivedevice)";

                tabCell.style.cursor = "pointer";
                var theid = i;
                tabCell.setAttribute("id", theid);
                tabCell.onclick = function () {
                    FlipActive(this.id);
                };
            }
            
        }
        ///////////////// Extra row for delete box
        var delCell = tr.insertCell(-1);
        delCell.innerHTML = "X";
        delCell.style.background = "var(--titlebarexitcolor)";
        delCell.style.textAlign = "center";
        delCell.style.width = "30.4px";
        delCell.style.cursor = "pointer";
        var theid = i;
        delCell.setAttribute("id", theid);
        delCell.onclick = function () {
            DeleteTableFromJSON(this.id);
        };
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("WifiDevicesshowData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

function FlipActive(thetable) {
    var fs = require('fs');
    var devicesData = JSON.parse(fs.readFileSync('./public/js/devices.json', 'utf8'));

    thevalue = devicesData[thetable]['active'];
    console.log(thevalue);

    if (thevalue == "true") {
        devicesData[thetable]['active'] = 'false';
    } else {
        devicesData[thetable]['active'] = 'true';
    }   


    const data = JSON.stringify(devicesData, null, 4);
    try {
        fs.writeFileSync('./public/js/devices.json', data);
        console.log("JSON data is saved.");
    } catch (error) {
        console.error(err);
    }
    CreateTableFromJSON();

}



function DeleteTableFromJSON(thetable) {
    const dialog  = require('electron').remote.dialog
    
    
      dialog.showMessageBox(
        null,
        {
            icon: 'public/images/icon.ico',
          message: "Are you sure?",
          buttons: ["Yes", "Cancel"],
          defaultId: 0, // bound to buttons array
          cancelId: 1 // bound to buttons array
        })
        .then(result => {
          if (result.response === 0) {
            // bound to buttons array
            var fs = require('fs');
            var devicesData = JSON.parse(fs.readFileSync('./public/js/devices.json', 'utf8'));

            console.log(devicesData);
            devicesData.splice(thetable, 1);



            const data = JSON.stringify(devicesData, null, 4);
            try {
                fs.writeFileSync('./public/js/devices.json', data);
                console.log("JSON data is saved.");
            } catch (error) {
                console.error(err);
            }

            console.log("Removed");
            CreateTableFromJSON();
          } else if (result.response === 1) {
            // bound to buttons array
            console.log("Cancelled");
          }
        }
      );
        
    
}


myLink.onclick = function () {
    var fs = require('fs');
    var devicesData = JSON.parse(fs.readFileSync('./public/js/devices.json', 'utf8'));

    var theip = document.getElementById('theip').value;
    var theport = document.getElementById('theport').value;
    var thetype = document.getElementById('theledtype').value;
    var thecount = document.getElementById('theledcount').value;
    var thedescription = document.getElementById('thedescription').value;
    if (theip == "" || theport == "" || thetype == "" || thetype == "Led Type" || thecount == "" || thedescription == "") {
        var {
            dialog
        } = require('electron').remote
        dialog.showMessageBox(null, {
            message: 'One or more boxes are empty!',
            icon: 'public/images/icon.ico'
        });

    } else {
        var obj = {};
        obj['ip'] = theip;
        obj['port'] = theport;
        obj['led-type'] = thetype;
        obj['led-count'] = thecount;
        obj['description'] = thedescription;
        obj['active'] = "true";

        devicesData.push(obj);
        const data = JSON.stringify(devicesData, null, 4);
        try {
            fs.writeFileSync('./public/js/devices.json', data);
            console.log("JSON data is saved.");
        } catch (error) {
            console.error(err);
        }

        CreateTableFromJSON();
        document.getElementById('theip').value = "";
        document.getElementById('theport').value = "";
        document.getElementById('theledcount').value = "";
        document.getElementById('thedescription').value = "";
    }
}


window.onload = CreateTableFromJSON;