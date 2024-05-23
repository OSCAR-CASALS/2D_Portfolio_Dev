import { displayDialog, loadLevelJson, setCamScale } from "./utils";

import { scaleConstant } from "./constants";

let direction = "up"

export function CreateLevel(k, mapData, baseImage, spawnPoint){
    const map = k.add([
        k.sprite(baseImage),
        k.pos(0), 
        k.scale(scaleConstant),
        k.z(1)
    ]);

    const player = k.make([
        k.sprite("playerSprites"),
        k.area({
            shape: new k.Rect(k.vec2(0, 6), 10, 10) //Hitbox, its position at 0 3(player position) and has width 10 and height 10
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleConstant), 
        {
            speed: 250,
            //speed: 300,
            dir : direction,
            isInDialog: false,
            TreasureFound: false
        }, k.z(2),
        "player"
    ])

    // Player animations

    function stopAnimations(){
        if(player.TreasureFound == true){
            player.play("treasureFound");
            return;
        }
        if(player.dir == "down"){
            player.play("idle-down")
            return ;
        }
        if(player.dir == "up"){
            player.play("idle-up")
            return ;
        }

        player.play("idle-side");
        return ;
    }

    stopAnimations();

    player.onMouseDown((mouseButton) => {
        if(mouseButton != "left" || player.isInDialog) return;

        const worldToMouse = k.toWorld(k.mousePos());

        // facing player in mouse direction

        player.moveTo(worldToMouse, player.speed);

        const MouseAngle = player.pos.angle(worldToMouse);

        const lowerBound = 50;
        const upperBound = 125;

        if(MouseAngle > lowerBound &&
            MouseAngle < upperBound &&
            player.curAnim() != "walk-up"){
                player.play("walk-up");
                player.dir = "up";
                direction = "up";
                return;
            }
        
        if (MouseAngle < -lowerBound &&
            MouseAngle > -upperBound &&
            player.curAnim() != "walk-down"){
                player.play("walk-down");
                player.dir = "down";
                direction = "down";
                return;
            }

        if (Math.abs(MouseAngle) > upperBound) {
            player.flipX = false;
            if(player.curAnim() != "walk-side") player.play("walk-side");
            player.dir = "right";
            direction = "right";
            return;
        }
        
        if (Math.abs(MouseAngle) < lowerBound) {
            player.flipX = true;
            if(player.curAnim() != "walk-side") player.play("walk-side");
            player.dir = "left";
            direction = "left";
            return;
        }

    })

    player.onMouseRelease(stopAnimations);

    // Loading level

    loadLevelJson(k, player, map, mapData, spawnPoint);

    // Change camera size based on screen size.

    setCamScale(k);

    k.onResize(() => {setCamScale(k)});

    // Camera position and player movement

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y, + 100)
    });
}