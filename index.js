const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function() {
  console.log("Ready!");
  var isLocked = true;
  var doorCheckTimer = null;

  const m = new five.Servo({
    pin: 8,
    startAt: 0
  });

  const button = new five.Button(2);
  const doorSwitch = new five.Switch({
    pin: 13,
    type: "NC"
  });

  const unlock = () => {
    m.to(180);
    isLocked = false;
    if (doorCheckTimer) clearInterval(doorCheckTimer);
  };

  const lock = () => {
    m.home();
    isLocked = true;
    if (doorCheckTimer) clearInterval(doorCheckTimer);
  };

  button.on("release", function() {
    console.log("Button released");
    if (isLocked) unlock();
    else lock();
  });

  doorSwitch.on("open", function() {
    console.log("switch open");
  });

  doorSwitch.on("close", () => {
    console.log("switch closed");
    if (doorCheckTimer) clearInterval(doorCheckTimer);
    doorCheckTimer = setTimeout(() => {
      console.log("checking", isLocked);
      if (!isLocked) lock();
    }, 10000);
  });
});
