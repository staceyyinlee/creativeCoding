let map;
let placesService;
let mapMarkers = [];

function setup() {
  createCanvas(800, 600);
  noLoop();

  //input and button elements
  const cityInput = select("#cityInput");
  const searchButton = select("#searchButton");

  //click event listener for search button
  searchButton.mousePressed(() => searchCoffeeShops(cityInput.value()));
}

function searchCoffeeShops(cityInput) {
  //displays loading message in list container
  select("#list-container").html("Loading coffee shop data...");

  //replaces spaces with plus signs in city name for URL encoding
  const city = cityInput.replace(/\s/g, '+');
  const mapIframe = select("#map-iframe");

  //displays Google Map in iframe and sets its content
  mapIframe.style("display", "block");
  mapIframe.attribute("srcdoc", `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Map</title>
        <!-- includes Google Maps JavaScript API with API key and libraries -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBY-8-3Bp-HFoVpoBryFs-rKVLKJVDyO3s&libraries=places"></script>
      </head>
      <body>
        <div id="map-container" style="width: 400px; height: 400px;"></div>
        <script>
          let map;
          let placesService;

          //initializes map with default location
          function initMap(location) {
            const options = {
              center: { lat: 0, lng: 0 }, //default coordinates
              zoom: 14,
            };

            map = new google.maps.Map(document.getElementById("map-container"), options);

            //geocodes city input and sets map center
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': location }, function (results, status) {
              if (status === 'OK' && results[0]) {
                map.setCenter(results[0].geometry.location);
                searchCoffeeShopsNearby(location);
              } else {
                console.log('Geocoding failed: ' + status);
              }
            });
          }

          //search for coffee shops near map's center
          function searchCoffeeShopsNearby(location) {
            placesService = new google.maps.places.PlacesService(map);
            const request = {
              location: map.getCenter(),
              radius: 5000, // 5000 meters or 3 miles
              keyword: 'coffee shop',
            };

            //searches for coffee shops
            placesService.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                //makes a simplified list of coffee shop data
                const coffeeShops = results.map(place => {
                  return { name: place.name, rating: place.rating, address: place.vicinity };
                });

                //passes coffee shop data to parent page
                parent.postMessage({ coffeeShops }, '*');

                //displays map markers and info windows
                results.forEach(result => {
                  const marker = new google.maps.Marker({
                    position: result.geometry.location,
                    map: map,
                    title: result.name
                  });

                  //makes info window for each marker
                  const infoWindow = new google.maps.InfoWindow({
                    content: '<strong>' + result.name + '</strong><br>Rating: ' + (result.rating || 'N/A') + '<br>Address: ' + result.vicinity
                  });

                  //opens info window when marker is clicked
                  marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                  });
                });
              } else {
                console.log('Failed to find coffee shops: ' + status);
              }
            });
          }

          //initializes map with user's input city
          initMap("${cityInput}");
        </script>
      </body>
    </html>
  `);
}

//listens for messages from iframe
window.addEventListener('message', (event) => {
  if (event.data && event.data.coffeeShops) {
    const coffeeShops = event.data.coffeeShops;
    //displays coffee shops on the parent page
    displayCoffeeShops(coffeeShops);
  }
});

//displays list of coffee shops on parent page
function displayCoffeeShops(coffeeShops) {
  //clears existing content in list container
  select("#list-container").html("");
  const ul = createElement("ul");
  ul.style("list-style-type: none;");

  //sorts coffee shops by rating
  coffeeShops.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  //iterates through first 10 coffee shops and displays them 1 - 10
  for (let i = 0; i < 10 && i < coffeeShops.length; i++) {
    const li = createElement("li", (i + 1) + '. ' + coffeeShops[i].name + ' - Rating: ' + (coffeeShops[i].rating || 'N/A'));
    ul.child(li);
  }

  ul.parent("list-container");
}
