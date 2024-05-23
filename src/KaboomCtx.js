import kaboom from "kaboom"

export const k = kaboom({
    global: false,
    touchToMouse: true, // So mouse click is translated to touch in phones
    canvas: document.getElementById("game"),
    debug: false
});