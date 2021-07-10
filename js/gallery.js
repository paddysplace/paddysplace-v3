// an array of unique identifiers for the cards
var cardIds = ['glacier','wheat','market'];
// an array of onClick event handlers to be assigned to a card
// when it is moved to a new position
var clickHandlers = ['rotate.zoom(this)','rotate.right()','rotate.left()'];
// an array of objects defining the dimensions of each card
// based on its position. given more time, I might refactor
// this using CSS transform: scale(0.77)
var sizes = [
  { w: 780, h: 420 },
  { w: 602, h: 324 },
  { w: 602, h: 324 }
];
// an array of the opacities that should be applied to each card
var opacities = [1,0.3,0.3];
// an array that applies a drop shadow to the front card only
var shadows = ['drop-shadow(0 2px 3px rgba(0,0,0,0.5))','none','none'];
// an empty array that will be populated with references to the cards.
  // the cards are pushed, popped, shifted and unshifted in the array
  // to reflect their visual position, and this allows the UI to keep
  // everything in sync.
var cards = [];
// an array that defines the offset position from the center for each card
var offsets = ['0px','50px','-50px'];
// an array that applies a z-index of 2 to the front card only
var indexes = ['2','1','1'];


// a library of functions for manipulating the carousel
var rotate = {
  // when the UI calls for rotating left
  left : function () {
    // pop the last item out of the array and put it at the front
    cards.unshift(cards.pop());
    // rotate the carousel
    translateX();
  },
  // when the UI calls for rotating right
  right : function () {
    // shift the first item out of the array and put it at the end
    cards.push(cards.shift());
    // rotate the carousel
    translateX();
  },
  // when the user clicks on the front card (el)
  zoom : function (el) {
    // display the hidden lightbox
    lightbox.style.display = 'block';
    // show the image on the card as large as possible
    // in the viewport, with the area around the image
    // represented by a 70% opaque black background
    lightbox.style.background = `rgba(0,0,0,0.7) ${el.style.backgroundImage} center/contain no-repeat fixed`;
  },
  // when the user clicks anywhere in the lightbox, it disappears
  unzoom : function () {
    // hide the lightbox
    lightbox.style.display = 'none';
    // release the resources used by the lightbox
    lightbox.style.background = "none";
  },
  // when the user clicks a carousel indicator circle
  indicatorClick : function (el) {
    // clear all carousel indicator fills, and change the
    // fill of the clicked indicator (el) to white
    rotate.indicatorReset(el);
    // find the current location of the corresponding card
    var location = cards.map(card => card.id).indexOf(el.dataset.card);
    // if desired card's index in the cards array is 2
    if (location == 2) {
      // cycle left through the deck
      rotate.left();
    // if desired card's index in the cards array is 1
    } else if (location == 1) {
      // cycle right through the deck
      rotate.right();
    }
    // do nothing if index is 0, because that means
    // the desired card is already in front
  },
  // functions call this to clear and reset indicators
    // the indicator to be filled in is passed as (el)
  indicatorReset : function (el) {
    // set each indicator's fill to transparent so it appears empty
    // but can still receive click events
    indicators.forEach(indicator => indicator.getElementsByTagName('circle')[0].style.fill = 'transparent');
    // set the fill of the passed element (el) to white
    el.getElementsByTagName('circle')[0].style.fill = '#fff';
  }
}

// rotate the carousel based on the updated cards array
function translateX() {
  // loop through the cards, changing their settings based on their new positions
  for (var card in cards) {
    // set the z-index of the card according to its new position
    cards[card].style.zIndex = `${indexes[card]}`;
    // set the onClick attribute of the card (to zoom, rotate left or rotate right)
    cards[card].setAttribute('onClick',clickHandlers[card]);
    // reposition the card horizontally
    cards[card].style.transform = `translateX(${offsets[card]})`;
    // set the height of the card according to its reposition
    // alternatively, we could scale the card using 'transform: scale(x.x)'
    cards[card].style.height = `${sizes[card].h}px`;
    // make the back cards partially transparent, per comp
    cards[card].style.opacity = `${opacities[card]}`;
    // ensure only the front card gets a shadow, per comp
    cards[card].style.filter = `${shadows[card]}`;
    // if front card, add frontCard class to element, else remove frontCard class
      // this determines what cursor is shown when the user hovers over a card
      // if a card's index in the cards array is 0, it is the
      // front card and had the frontCard class added to it.
      // Else, the frontCard class is removed from the element's
      // classList.
    (card == 0) ? cards[card].classList.add('frontCard') : cards[card].classList.remove('frontCard');
  }
  // clear indicator circles and mark the one that corresponds to the front card
  rotate.indicatorReset(indicators[indicators.map(indicator => indicator.dataset.card).indexOf(cards[0].id)]);
}

// an array of the image URLs
  // by having JS create the elements based on this array, it will be easier to
  // modify this code to utilize a list of URLs provided via JSON later
var images = [
  'https://images.unsplash.com/photo-1521902276589-86dc36705998?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=dda92378228681e307674dba522c69e9',
  'https://images.unsplash.com/photo-1511192319655-f82fa0dfe8fd?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=f9f1d887df07c7f735b60217b010f8d3',
  'https://images.unsplash.com/photo-1535745719881-e842027f7f78?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=1788ff7c617d8ac44b768bdd173b1742'
];

// loop through the array of image URLs to create the cards
  // this could have been accomplished with less code by using a template
  // literal to create each div as a string and then append via
  // carousel.innerHTML += string, but this is the proper way to add
  // elements to the DOM. I'm equally comfortable either way.
images.forEach((image, index) => {
  // initialize tempEl to hold the element until it is appended
  const tempEl = document.createElement('div');
  // set class to card
  tempEl.setAttribute('class','card');
  // give the card a unique ID
  tempEl.setAttribute('id',cardIds[index]);
  // set an onClick attribute based on the card's position
  tempEl.setAttribute('onClick',clickHandlers[index]);
  // set the background image of the card
  tempEl.setAttribute('style',`background-image: url(${image});`);
  // push a reference to the card into the cards array
  cards.push(tempEl);
  // append the element to its parent
  carousel.appendChild(tempEl);
});

// TODO: have JS create the SVG images when it creates the cards,
// as opposed to hard-coding them in the HTML. This will be useful
// if we later need to accommodate more than 3 images.

// an array of the carousel indicator circles 
var indicators = Array.from(carouselIndicators.children);

// initialize the positioning/sizing by cycling the carousel one card
translateX();