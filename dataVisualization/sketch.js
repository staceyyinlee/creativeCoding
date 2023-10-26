let apiKey = 'AIzaSyCrOFZ_ieui4PxdwXatwNPeaMdrDaxIwNI';
let coffeeShops = [];

function setup() {
  createCanvas(800, 600);
  searchCoffeeShops();
}

function draw() {
  background(220);
  //displays list of coffee shops
  textSize(16);
  fill(0);
  for (let i = 0; i < coffeeShops.length; i++) {
    const place = coffeeShops[i];
    text(place.name, 10, 40 + i * 30);
    console.log(place.name);
  }
}

function searchCoffeeShops() {
  const city = 'Brooklyn, NY';
  const request = {
    location: { lat: 40.6782, lng: -73.9442 }, //Brooklyn, NY coordinates
    radius: 5000, //5000 m
    keyword: 'coffee shop',
  };

  const service = new google.maps.places.PlacesService(createDiv());

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      coffeeShops = results;
    }
  });
}
