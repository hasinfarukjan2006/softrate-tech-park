document.addEventListener("DOMContentLoaded", () => {
  // Listen for the custom route load event
  document.addEventListener("perDiemRouteLoaded", () => {
    initPerDiemPage();
  });

  // Comprehensive Rates Database for 2026 (A-Z USA Cities) - Exactly 500 Cities
  const cityDatabase = {
  "Aberdeen, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Akron, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Alamogordo, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Albany, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Albany, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Albuquerque, New Mexico": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Alexandria, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Alexandria, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Allentown, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Altoona, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Ames, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Anaconda, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Anaheim, California": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Anchorage, Alaska": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Ankeny, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Ann Arbor, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Annapolis, Maryland": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Appleton, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Arlington, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Arvada, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Athens, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Atlanta, Georgia": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Auburn, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Auburn, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Augusta, Georgia": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Augusta, Maine": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Aurora, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Aurora, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Austin, Texas": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Badger, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bakersfield, California": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Baltimore, Maryland": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Bangor, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Barre, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bartlett, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Baton Rouge, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Beaverton, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Beckley, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bellevue, Nebraska": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Bellevue, Washington": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Bend, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bentonville, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bethlehem, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Biddeford, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Billings, Montana": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Biloxi, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Birmingham, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bismarck, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bloomington, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bloomington, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Blue Springs, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Boise, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bossier City, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Boston, Massachusetts": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Boulder City, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bowie, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bowling Green, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bozeman, Montana": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Bridgeport, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Bristol, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Brockton, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Broken Arrow, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Brookings, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Brooklyn Park, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Brunswick, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Buffalo, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Burlington, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Butte, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Caldwell, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cambridge, Massachusetts": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Canton, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Canton, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cape Coral, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Carmel, Indiana": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Carson City, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cary, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Casper, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cedar Rapids, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Centennial, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Champaign, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Chandler, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Charleston, South Carolina": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Charleston, West Virginia": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Charlotte, North Carolina": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Chattanooga, Tennessee": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Chesapeake, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cheyenne, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Chicago, Illinois": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Cincinnati, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Clarksburg, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Clarksville, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cleveland, Ohio": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Clinton, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Clinton, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Clovis, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cody, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Coeur d'Alene, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "College Park, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "College, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Colorado Springs, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Columbia, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Columbia, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Columbus, Georgia": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Columbus, Nebraska": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Columbus, Ohio": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Concord, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Concord, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Conway, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Corpus Christi, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Corvallis, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Council Bluffs, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Coventry, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Covington, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cranston, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cumberland, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Cumberland, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dallas, Texas": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Danbury, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Davenport, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dayton, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dearborn, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Decatur, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Denver, Colorado": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Derry, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Des Moines, Iowa": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Detroit, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dickinson, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dothan, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dover, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Dover, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Duluth, Minnesota": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Durham, North Carolina": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Eagan, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "East Honolulu, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "East Providence, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Eau Claire, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Edison, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Edmond, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "El Paso, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Elgin, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Elizabeth, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Elko, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Elsmere, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Enid, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Erie, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Essex Junction, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Eugene, Oregon": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Evanston, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Evansville, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Everett, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Ewa Gentry, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fairbanks, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fairmont, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fall River, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fargo, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Farmington, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fayetteville, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fayetteville, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Federal Way, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fernley, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fishers, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Florence, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Florence, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fort Collins, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fort Lauderdale, Florida": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Fort Smith, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fort Wayne, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fort Worth, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Franklin, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Frederick, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fremont, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Fresno, California": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gaithersburg, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gary, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Georgetown, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Georgetown, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gilbert, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gillette, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Glendale, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Goose Creek, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Grand Forks, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Grand Island, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Grand Rapids, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Great Falls, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Green Bay, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Green River, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Greenbelt, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Greensboro, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Greenville, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Greenville, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Greer, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gresham, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Gulfport, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hamilton, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hammond, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hampton, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Harrisburg, Pennsylvania": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Hartford, Connecticut": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Hastings, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hattiesburg, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Havre, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Helena, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Henderson, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hialeah, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "High Point, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hillsboro, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hobbs, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Honolulu, Hawaii": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Hoover, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Hopkinsville, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Houma, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Houston, Texas": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Hudson, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Huntington, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Huntsville, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Huron, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Idaho Falls, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Independence, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Indianapolis, Indiana": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Iowa City, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jackson, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jackson, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jacksonville, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jamestown, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Janesville, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jersey City, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Johns Creek, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Johnson City, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Johnston, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Joliet, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Jonesboro, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Juneau, Alaska": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Kahului, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kailua, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kalispell, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kaneohe, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kansas City, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kansas City, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kearney, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kenner, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kenosha, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kent, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Ketchikan, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Kihei, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Knik-Fairview, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Knoxville, Tennessee": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Lafayette, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lafayette, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lake Charles, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lakes, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lakewood, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lakewood, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lancaster, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lansing, Michigan": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Laramie, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Las Cruces, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Las Vegas, Nevada": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Lawrence, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lawton, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Layton, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lee's Summit, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lenexa, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lewiston, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lewiston, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lexington, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lincoln, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Little Rock, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Livonia, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Londonderry, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Long Beach, California": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lorain, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Los Angeles, California": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Louisville, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lowell, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lubbock, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Lynn, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Macon, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Madison, Alabama": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Madison, Wisconsin": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Manchester, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mandan, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Manhattan, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Maple Grove, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Martinsburg, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Medford, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Memphis, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Meriden, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Meridian, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Meridian, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Merrimack, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mesa, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mesquite, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Miami, Florida": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Middletown, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Midwest City, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Miles City, Montana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Milford, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mililani Town, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Millcreek, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Milwaukee, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Minneapolis, Minnesota": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Minot, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Missoula, Montana": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Mitchell, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mobile, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Monroe, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Montgomery, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Montpelier, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Moore, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Morgantown, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mount Pleasant, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Mount Vernon, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Murfreesboro, Tennessee": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Nampa, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Naperville, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Nashua, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Nashville, Tennessee": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "New Bedford, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "New Britain, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "New Castle, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "New Haven, Connecticut": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "New Orleans, Louisiana": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "New Rochelle, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "New York, New York": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Newark, Delaware": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Newark, New Jersey": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Newport News, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Newport, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Nicholasville, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Norfolk, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Norfolk, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Norman, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "North Charleston, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "North Las Vegas, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "North Little Rock, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "North Platte, Nebraska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Norwalk, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "O'Fallon, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Oakland, California": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Ogden, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Oklahoma City, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Olathe, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Olive Branch, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Omaha, Nebraska": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Orem, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Orlando, Florida": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Oshkosh, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Overland Park, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Owensboro, Kentucky": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Parkersburg, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Parma, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Paterson, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pawtucket, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pearl City, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Peoria, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Peoria, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Philadelphia, Pennsylvania": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Phoenix, Arizona": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Pierre, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pine Bluff, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pittsburgh, Pennsylvania": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Plano, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Plymouth, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pocatello, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Port St. Lucie, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Portland, Maine": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Portland, Oregon": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Portsmouth, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Post Falls, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Providence, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Provo, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Pueblo, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Quincy, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Racine, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Raleigh, North Carolina": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Rapid City, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Reading, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Reno, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Renton, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Richmond, Kentucky": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Richmond, Virginia": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Rio Rancho, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Riverton, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Roanoke, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rochester, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rochester, New Hampshire": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rochester, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rock Hill, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rock Springs, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rockford, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rockville, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rogers, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Roswell, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Roswell, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Rutland, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Saco, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sacramento, California": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Salem, New Hampshire": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Salem, Oregon": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Salina, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Salisbury, Maryland": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Salt Lake City, Utah": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "San Antonio, Texas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "San Diego, California": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "San Francisco, California": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "San Jose, California": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Sandy Springs, Georgia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sandy, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sanford, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Santa Fe, New Mexico": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Savannah, Georgia": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Schenectady, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Scottsdale, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Scranton, Pennsylvania": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Seaford, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Seattle, Washington": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Shawnee, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sheridan, Wyoming": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Shreveport, Louisiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sioux City, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sioux Falls, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sitka, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Smyrna, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "South Bend, Indiana": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "South Burlington, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "South Kingstown, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "South Portland, Maine": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "South Valley, New Mexico": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Southaven, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Sparks, Nevada": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Spokane, Washington": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Springdale, Arkansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Springfield, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Springfield, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Springfield, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Springfield, Oregon": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. Albans, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. Charles, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. George, Utah": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "St. Joseph, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. Louis, Missouri": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. Paul, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "St. Petersburg, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Stamford, Connecticut": {
    "lodging": 220,
    "meals": 74,
    "incidentals": 5
  },
  "Sterling Heights, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Stillwater, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Suffolk, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Summerville, South Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Surprise, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Syracuse, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tacoma, Washington": {
    "lodging": 130,
    "meals": 59,
    "incidentals": 5
  },
  "Tallahassee, Florida": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tampa, Florida": {
    "lodging": 165,
    "meals": 64,
    "incidentals": 5
  },
  "Tanaina, Alaska": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tempe, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Thornton, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Toledo, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Toms River, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Topeka, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Trenton, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tucson, Arizona": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tulsa, Oklahoma": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tupelo, Mississippi": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Tuscaloosa, Alabama": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Twin Falls, Idaho": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Utica, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Vancouver, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Vergennes, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Vermillion, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Virginia Beach, Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Wahpeton, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Waipahu, Hawaii": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Warren, Michigan": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Warwick, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Waterbury, Connecticut": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Waterloo, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Watertown, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Waukegan, Illinois": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Waukesha, Wisconsin": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Weirton, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "West Des Moines, Iowa": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "West Fargo, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "West Jordan, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "West Valley City, Utah": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Westminster, Colorado": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Wheeling, West Virginia": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Wichita, Kansas": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Williston, North Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Wilmington, Delaware": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Wilmington, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Winooski, Vermont": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Winston-Salem, North Carolina": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Woodbridge, New Jersey": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Woodbury, Minnesota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Woonsocket, Rhode Island": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Worcester, Massachusetts": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Yakima, Washington": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Yankton, South Dakota": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Yonkers, New York": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  },
  "Youngstown, Ohio": {
    "lodging": 110,
    "meals": 54,
    "incidentals": 5
  }
};

  const sortedCityNames = Object.keys(cityDatabase).sort();
  let rowCounter = 1;

  function initPerDiemPage() {
    const itineraryRows = document.getElementById("itineraryRows");
    const btnAddItinerary = document.getElementById("btnAddItinerary");
    const btnCalculate = document.getElementById("btnCalculatePerDiem");

    if (!itineraryRows) return;

    // Reset rows to default single row
    itineraryRows.innerHTML = "";
    rowCounter = 0;
    addItineraryRow();

    // Bind Add button
    if (btnAddItinerary) {
      btnAddItinerary.onclick = (e) => {
        e.preventDefault();
        addItineraryRow();
      };
    }

    // Bind Calculate button
    if (btnCalculate) {
      btnCalculate.onclick = (e) => {
        e.preventDefault();
        calculatePerDiem();
      };
    }

    // Initialize lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function addItineraryRow() {
    const itineraryRows = document.getElementById("itineraryRows");
    if (!itineraryRows) return;

    const rowId = rowCounter++;
    const row = document.createElement("div");
    row.className = "itinerary-row";
    row.dataset.rowId = rowId;

    // Default dates: Today and 3 days later
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    const threeDaysLaterStr = threeDaysLater.toISOString().split("T")[0];

    row.innerHTML = `
      <div class="pd-form-grid">
        <div class="pd-form-group pd-autocomplete-wrapper">
          <label>Destination City *</label>
          <input type="text" class="pd-city-input" placeholder="Search city (e.g. Austin, Texas)..." required autocomplete="off">
          <div class="pd-suggestions-dropdown hide"></div>
        </div>
        <div class="pd-form-group">
          <label>Start Date *</label>
          <input type="date" class="pd-start-date" value="${todayStr}" required>
        </div>
        <div class="pd-form-group">
          <label>End Date *</label>
          <input type="date" class="pd-end-date" value="${threeDaysLaterStr}" required>
        </div>
        <div class="pd-action-col">
          <button type="button" class="btn-delete-itinerary" title="Remove Itinerary">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;

    itineraryRows.appendChild(row);

    // Bind Autocomplete suggestion logic
    bindAutocomplete(row);

    // Bind delete button
    const deleteBtn = row.querySelector(".btn-delete-itinerary");
    deleteBtn.onclick = () => {
      row.remove();
      updateDeleteButtons();
      // Auto-recalculate if results are currently shown
      const resultsBox = document.getElementById("perDiemResults");
      if (resultsBox && !resultsBox.classList.contains("hide")) {
        calculatePerDiem();
      }
    };

    updateDeleteButtons();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function bindAutocomplete(row) {
    const input = row.querySelector(".pd-city-input");
    const dropdown = row.querySelector(".pd-suggestions-dropdown");

    if (!input || !dropdown) return;

    let activeIndex = -1;

    // Focus handler
    input.addEventListener("focus", () => {
      renderSuggestions(input.value.trim());
      dropdown.classList.remove("hide");
      activeIndex = -1;
    });

    // Input/typing handler
    input.addEventListener("input", () => {
      renderSuggestions(input.value.trim());
      dropdown.classList.remove("hide");
      activeIndex = -1;
    });

    // Keydown arrow navigation & select handler
    input.addEventListener("keydown", (e) => {
      const items = dropdown.querySelectorAll(".pd-suggestion-item");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        highlightItem(items, activeIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        highlightItem(items, activeIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          items[activeIndex].click();
        } else if (items.length > 0) {
          // Select first suggestion if none highlighted and Enter is pressed
          items[0].click();
        }
      } else if (e.key === "Escape") {
        dropdown.classList.add("hide");
        input.blur();
      }
    });

    // Document click to close when clicking outside
    document.addEventListener("click", (e) => {
      if (!row.contains(e.target)) {
        dropdown.classList.add("hide");
      }
    });

    function highlightItem(items, index) {
      items.forEach(it => it.classList.remove("active"));
      if (items[index]) {
        items[index].classList.add("active");
        items[index].scrollIntoView({ block: "nearest" });
      }
    }

    function renderSuggestions(query) {
      dropdown.innerHTML = "";
      let matches = [];

      if (!query) {
        // Show ALL 500 cities to allow smooth A-Z scrolling
        matches = sortedCityNames;
      } else {
        const lowerQuery = query.toLowerCase();
        matches = sortedCityNames.filter(c => c.toLowerCase().includes(lowerQuery));
      }

      if (matches.length > 0) {
        matches.forEach(cityName => {
          const item = document.createElement("div");
          item.className = "pd-suggestion-item";
          item.textContent = cityName;
          item.onclick = () => {
            input.value = cityName;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(item);
        });

        // Add custom text option if exact query is not in database
        if (query && !cityDatabase[query]) {
          const customItem = document.createElement("div");
          customItem.className = "pd-suggestion-item custom-item";
          customItem.textContent = `Use manual: "${query}"`;
          customItem.onclick = () => {
            input.value = query;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(customItem);
        }
      } else {
        // No matches at all
        const noResults = document.createElement("div");
        noResults.className = "pd-suggestion-no-results";
        noResults.textContent = "No standard US cities found.";
        dropdown.appendChild(noResults);

        if (query) {
          const customItem = document.createElement("div");
          customItem.className = "pd-suggestion-item custom-item";
          customItem.textContent = `Use manual: "${query}"`;
          customItem.onclick = () => {
            input.value = query;
            dropdown.classList.add("hide");
            autoRecalculate();
          };
          dropdown.appendChild(customItem);
        }
      }
    }

    function autoRecalculate() {
      const resultsBox = document.getElementById("perDiemResults");
      if (resultsBox && !resultsBox.classList.contains("hide")) {
        calculatePerDiem();
      }
    }
  }

  function updateDeleteButtons() {
    const rows = document.querySelectorAll(".itinerary-row");
    rows.forEach(r => {
      const btn = r.querySelector(".btn-delete-itinerary");
      if (rows.length === 1) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  }

  function calculatePerDiem() {
    const rows = document.querySelectorAll(".itinerary-row");
    let totalLodging = 0;
    let totalMeals = 0;
    let totalIncidentals = 0;
    let totalDaysAll = 0;
    let totalNightsAll = 0;

    let hasErrors = false;

    rows.forEach(row => {
      if (hasErrors) return;

      const cityInput = row.querySelector(".pd-city-input");
      const startDateInput = row.querySelector(".pd-start-date");
      const endDateInput = row.querySelector(".pd-end-date");

      const cityNameVal = cityInput.value.trim();
      
      if (!cityNameVal) {
        alert("Please enter or select a Destination City for all itinerary rows.");
        hasErrors = true;
        return;
      }

      // Check if city is in our database, otherwise fall back to standard rates
      const rates = cityDatabase[cityNameVal] || { lodging: 110, meals: 54, incidentals: 5 };

      const startDateVal = startDateInput.value;
      const endDateVal = endDateInput.value;

      if (!startDateVal || !endDateVal) {
        alert("Please fill in start and end dates for all itinerary rows.");
        hasErrors = true;
        return;
      }

      const start = new Date(startDateVal);
      const end = new Date(endDateVal);

      if (end < start) {
        alert(`Invalid date range: End Date cannot be before Start Date.`);
        hasErrors = true;
        return;
      }

      // Calculate travel days (inclusive)
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Lodging nights = days - 1 (nights spent at hotel)
      const nights = diffDays > 1 ? diffDays - 1 : 0;

      // Lodging Total
      const lodgingTotal = nights * rates.lodging;

      // M&IE (Meals and Incidentals) calculation with GSA 75% rule on first/last day
      const mieRateTotal = rates.meals + rates.incidentals;
      let mieTotal = 0;

      if (diffDays === 1) {
        mieTotal = 1 * mieRateTotal * 0.75;
      } else if (diffDays === 2) {
        mieTotal = 2 * mieRateTotal * 0.75;
      } else {
        // First/last day at 75%, middle days at 100%
        mieTotal = (2 * mieRateTotal * 0.75) + ((diffDays - 2) * mieRateTotal);
      }

      // Proportional division of M&IE total
      const mealProportion = rates.meals / mieRateTotal;
      const incidentalProportion = rates.incidentals / mieRateTotal;

      const mealsTotal = mieTotal * mealProportion;
      const incidentalsTotal = mieTotal * incidentalProportion;

      totalLodging += lodgingTotal;
      totalMeals += mealsTotal;
      totalIncidentals += incidentalsTotal;
      totalDaysAll += diffDays;
      totalNightsAll += nights;
    });

    if (hasErrors) return;

    // Update Result Labels and Display Box
    const resPdLodging = document.getElementById("resPdLodging");
    const resPdMeals = document.getElementById("resPdMeals");
    const resPdIncidentals = document.getElementById("resPdIncidentals");
    const resPdGrandTotal = document.getElementById("resPdGrandTotal");

    const resPdLodgingRate = document.getElementById("resPdLodgingRate");
    const resPdMealsRate = document.getElementById("resPdMealsRate");
    const resPdIncidentalsRate = document.getElementById("resPdIncidentalsRate");

    const resultsBox = document.getElementById("perDiemResults");

    if (resultsBox) {
      // Format USD
      const formatUSD = (val) => "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      resPdLodging.textContent = formatUSD(totalLodging);
      resPdMeals.textContent = formatUSD(totalMeals);
      resPdIncidentals.textContent = formatUSD(totalIncidentals);
      
      const grandTotal = totalLodging + totalMeals + totalIncidentals;
      resPdGrandTotal.textContent = formatUSD(grandTotal);

      // Detail rates strings
      resPdLodgingRate.textContent = `${totalNightsAll} night(s) of lodging calculated.`;
      resPdMealsRate.textContent = `${totalDaysAll} travel day(s) calculated.`;
      resPdIncidentalsRate.textContent = `Incidental cap: $5.00/day.`;

      resultsBox.classList.remove("hide");
      resultsBox.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Auto initialize if per diem section is already visible on startup
  const perDiemSection = document.getElementById("per-diem-section");
  if (perDiemSection && !perDiemSection.classList.contains("hide")) {
    initPerDiemPage();
  }
});