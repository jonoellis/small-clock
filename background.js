var colours = ["black", "white", "red", "blue", "green", "yellow"];
var colour = "black";

browser.storage.sync.get('colour').then((res) => {
  colour = res.colour || 'black';
  update();
});

function update() {
  var date = new Date();
  var hours = date.getHours();
  var minutes=  date.getMinutes();

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.fillStyle = colour;
  context.font = "80px sans-serif";
  context.fillText(hours, 1, 58);
  context.font = "62px sans-serif";
  context.fillText((minutes<10? "0": "") + minutes, 60, 110);

  var imageData = context.getImageData(0, 0, 128, 128);

  browser.browserAction.setIcon({imageData: imageData});
  browser.browserAction.setTitle({title: date.toString()});

  setTimeout(update, (60-date.getSeconds())*1000);
}

browser.browserAction.onClicked.addListener(() => {
  var currentIndex = colours.indexOf(colour);
  var newIndex = (currentIndex + 1) % colours.length;
  browser.storage.sync.set({
    colour: colours[newIndex]
  });
});

function logStorageChange(changes, area) {
  if(changes['colour']) {
    colour = changes['colour'].newValue
  }
  update();
}

browser.storage.onChanged.addListener(logStorageChange);
