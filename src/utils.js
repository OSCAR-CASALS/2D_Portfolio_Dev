
import { TreasureFound, dialogData, scaleConstant, setTreasureFound } from "./constants.js";

export function displayDialog(text, onDisplayEnd){
    const dialogUI = document.getElementById("textbox");
    
    const dialogue = document.getElementById("dialogue");

    dialogUI.style.display = "block";

    // Text with interval

    /*
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() =>{
        if(index < text.length){
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }

        clearInterval(intervalRef);
    }, 5);

    */

    // Text without interval
    
    dialogue.innerHTML = text;

    const closeButton = document.getElementById("Close");

    closeButton.style.display = "block";

    function onCloseButtonClick(){
        onDisplayEnd();
        dialogUI.style.display = "none";
        dialogue.innerHTML = "";

        //Uncomment clearInterval if you want text with interval
        
        //clearInterval(intervalRef);

        closeButton.style.display = "none";

        closeButton.removeEventListener("click", onCloseButtonClick);
    }

    closeButton.addEventListener("click", onCloseButtonClick);
}

export function setCamScale(k){
    const resizeFactor = k.width() / k.height();

    if(resizeFactor < 1){
        k.camScale(k.vec2(1));
        return;
    }

    k.camScale(k.vec2(1.5));
}

export function loadLevelJson(k, player, map, mapJson, spawnPoint){

    function stopAnimations(){
        if(player.dir == "down"){
            player.play("idle-down");
            return ;
        }
        if(player.dir == "up"){
            player.play("idle-up");
            return ;
        }

        player.play("idle-side");
        return ;
    }

    const layers = mapJson.layers;
    for(const l of layers){
        if(l.name == "Boundaries"){
            for(const b of l.objects){
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), b.width, b.height)
                    }),
                    k.body({ isStatic: true }),
                    k.pos(b.x, b.y),
                    b.name
                ]);

                if(b.name){
                    player.onCollide(b.name, () => {
                        player.isInDialog = true;
                        stopAnimations();
                        displayDialog(dialogData[b.name], () => {player.isInDialog = false;});
                    });
                }
            }
            continue;
        }
        if(l.name == "spawnpoint"){
            for(const entity of l.objects){
                if(entity.name == "treasureBox"){
                    if(TreasureFound == false){
                        k.add([
                            k.sprite("Tileset", {anim: "Treasure"}),
                            k.anchor("center"),
                            k.pos(k.vec2(
                                (map.pos.x + entity.x) * scaleConstant,
                                (map.pos.y + entity.y) * scaleConstant
                            )),
                            k.area(),
                            k.body({isStatic: true}),
                            k.z(1),
                            {
                                opened: false
                            },
                            k.scale(scaleConstant),
                            "TreasureBox"
                        ]);

                        player.onCollide("TreasureBox", (colledObj)=> {
                            if(colledObj.opened == false){
                                player.isInDialog = true;
                                player.TreasureFound = true;
                                stopAnimations();
                                player.play("treasureFound");
                                colledObj.use(k.sprite("Tileset", {anim: "OpenTreasure"}));
                                displayDialog(dialogData["Secret"], () =>{
                                    player.isInDialog = false
                                    player.TreasureFound = false;
                                    setTreasureFound(true);
                                    stopAnimations();
                                });
                                colledObj.opened = true;
                            }
                        })
                    }
                    else{
                        k.add([
                            k.sprite("Tileset", {anim: "OpenTreasure"}),
                            k.anchor("center"),
                            k.pos(k.vec2(
                                (map.pos.x + entity.x) * scaleConstant,
                                (map.pos.y + entity.y) * scaleConstant
                            )),
                            k.area(),
                            k.body({isStatic: true}),
                            k.z(1),
                            k.scale(scaleConstant),
                            "TreasureBox"
                        ])
                    }
                }
                if(entity.name == spawnPoint){
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleConstant,
                        (map.pos.y + entity.y) * scaleConstant
                    );
                    k.add(player);
                    continue;
                }
            }
        }
        if(l.name == "Warps"){
            for(const warp of l.objects){
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), warp.width, warp.height)
                    }),
                    k.pos(warp.x, warp.y),
                    warp.name
                ]);
                player.onCollide(warp.name, () =>{
                    const DestScene = warp.name.split(",");
                    if(DestScene[0] == "SecretHouse" && TreasureFound == false){
                        player.isInDialog = true;
                        stopAnimations();
                        displayDialog(dialogData.TreasureNotFound, () =>{
                            player.isInDialog = false;
                        })
                        return;
                    }
                    k.go(DestScene[0], DestScene[1]);
                })
            }
        }
    }
}