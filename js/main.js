const cityIdArray = [];

async function showCitys() {
  //Fetch land.json file
  

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const landurl = "https://stader-och-lander-server-y55eo.ondigitalocean.app/land";
  const stadurl =  "https://stader-och-lander-server-y55eo.ondigitalocean.app/stad";// site that doesn’t send Access-Control-*
  
  var landResponse = await fetch(proxyurl + landurl);
  var landInfo = await landResponse.json();

  //Fetch stad.json file
  var cityResonce = await fetch(proxyurl + stadurl);
  var stadInfo = await cityResonce.json();

  // Print out the country
  for (let x = 0; x < landInfo.length; x++) {
    var countryButtons = document.getElementById("countryButtons");
    var createButton = document.createElement("button");
    createButton.setAttribute("id", landInfo[x].id);
    var createText = document.createTextNode(landInfo[x].countryname);
    countryButtons.appendChild(createButton).appendChild(createText);

    // If you click on a countrybutton
    createButton.addEventListener("click", function () {
      // Removes the created elements
      let element = document.getElementById("s");
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

      // Print out the cities
      for (let i = 0; i < stadInfo.length; i++) {
        if (stadInfo[i].countryid == this.id -1) {
          var node = document.createElement("BUTTON");
          var textNode = document.createTextNode(stadInfo[i].stadname);
          node.appendChild(textNode);
          node.id = stadInfo[i].id;
          document.getElementById("s").appendChild(node);

          // If you click on a city
          node.addEventListener("click", function () {
            // Removes the created elements
            let element = document.getElementById("details");
            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
            //Show the population and info
            if (this.id == stadInfo[i].id) {
              var node2 = document.createElement("p"); // Create a <p> element
              var textNode2 = document.createTextNode(
                // Create a text node for population
                stadInfo[i].stadname +
                  " är en stad i Sverige som har " +
                  stadInfo[i].population +
                  " invånare."
              ); // Append the text to <p>
              node2.appendChild(textNode2);
              document.getElementById("details").appendChild(node2);

              // Creates a visited button
              var node3 = document.createElement("BUTTON");
              var textNode3 = document.createTextNode("Besökt");
              node3.appendChild(textNode3);
              document.getElementById("details").appendChild(node3);

              // Set citys you visited to local storage
              node3.addEventListener("click", function () {
                // Check if city already is in the array
                if (cityIdArray.indexOf(stadInfo[i].id) == -1) {
                  cityIdArray.push(stadInfo[i].id);
                  localStorage.setItem("input", JSON.stringify(cityIdArray));
                }
              });
            }
          });
        }
      }
    });
  }
}

showCitys();

// Check if localStorage is not empty, if not then adds the values to the cityArray
var arrayValue = JSON.parse(localStorage.getItem("input"));
if (localStorage) {
  for (let i = 0; i < arrayValue.length; i++) {
    cityIdArray.push(arrayValue[i]);
  }
}

// Fetch tha data of stad.json again becouse I can not use it again from the first fetch
fetch("stad.json")
  .then(function (resp) {
    return resp.json();
  }) // Convert data to json
  .then(function (secondStadInfo) {
    //Get the array from localStorage
    var arrayValue = JSON.parse(localStorage.getItem("input"));
    var totalEncounter = 0;

    //Print out the citys and counts total encounter
    for (let x = 0; x < arrayValue.length; x++) {
      for (let i = 0; i < secondStadInfo.length; i++) {
        if (secondStadInfo[i].id == arrayValue[x]) {
          var visitedP = document.createElement("P");
          var visitedText = document.createTextNode(secondStadInfo[i].stadname);
          visitedP.appendChild(visitedText);
          document.getElementById("visitedList").appendChild(visitedP);
          totalEncounter += secondStadInfo[i].population;
        }
      }
    }

    var total = document.createElement("P");
    var textTotal = document.createTextNode(totalEncounter);
    total.appendChild(textTotal);
    document.getElementById("encounter").appendChild(total);
  });

// Empty local storage
document.getElementById("clear").addEventListener("click", function () {
  window.localStorage.clear();
});
