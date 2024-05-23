import {k} from "./KaboomCtx"

import { CreateLevel } from "./LoadLevel";

import { scaleConstant } from "./constants";

//Load map sprite(png)

// main scene

k.loadSprite("playerSprites","sprites/WebCharacter.png", {
	sliceX: 5,
	sliceY: 4,
	anims: {
		"idle-down": 0,
		"idle-up": 5,
		"idle-side": 10,
		"walk-down": {from: 1, to: 4, loop: true, sped: 8},
		"walk-up": {from: 6, to: 9, loop: true, speed: 8},
		"walk-side": {from: 11, to: 14, loop: true, speed: 8},
		"treasureFound": 15
	}
});

k.loadSprite("Tileset", "sprites/TreasureBox.png", {
	sliceX: 2,
	anims: {
		"Treasure": 0,
		"OpenTreasure": 1
	}
});

k.scene("Temple", async(sp) => {

	// Loading assets
	k.loadSprite("map", "Levels/Village.png");

	k.loadSprite("superiorLayer", "Levels/SuperiorLayer.png");

	k.setBackground(0, 0, 0, 1);

	const mapData = await( await fetch("Levels/Village.json")).json();

	CreateLevel(k, mapData, "map", sp);

	const supLevel = k.add([
        k.sprite("superiorLayer"),
        k.pos(0), 
        k.scale(scaleConstant),
		k.z(3)
    ]);

})

k.scene("PersonalProjects", async(sp) => {

	k.setBackground(135, 206, 235, 1);

	k.loadSprite("PersProj", "Levels/PersonalProjects.png");

	k.loadSprite("SupLayer", "Levels/PersonalProjects_SupLayer.png");

	
	const mapData = await(await fetch("Levels/PersonalProjects.json")).json();

	CreateLevel(k ,mapData, "PersProj", sp);

	const supLevel = k.add([
        k.sprite("SupLayer"),
        k.pos(0), 
        k.scale(scaleConstant),
		k.z(3)
    ]); 

});

k.scene("BioinformaticsMuseum",async(sp) =>{
	// displayDialog(dialogData["FDegree"], () => {});
	k.setBackground(0, 0, 0, 1);

	k.loadSprite("Museum", "Levels/BioinfoProjectsMuseum.png");

	const mapData = await(await fetch("Levels/BioinfoProjectsMuseum.json")).json();

	CreateLevel(k, mapData, "Museum", sp);
	
})

k.scene("WebsCave", async(sp) =>{
	k.setBackground(0, 0, 0, 1);

	k.loadSprite("Cave", "Levels/Cave.png");

	const mapData = await(await fetch("Levels/Cave.json")).json();

	CreateLevel(k, mapData, "Cave", sp);
	
});

k.scene("PortFoliumTemple", async(sp) =>{
	k.setBackground(0, 0, 0, 1);

	k.loadSprite("PortfoliumTemple", "Levels/ProtFoliumTemple.png");

	const mapData = await(await fetch("Levels/ProtFoliumTemple.json")).json();

	CreateLevel(k, mapData, "PortfoliumTemple", sp);
});

k.scene("SecretHouse", async(sp) =>{
	k.setBackground(0, 0, 0, 1);

	k.loadSprite("FoundersHouse", "Levels/SecreteHouse.png");

	const mapData = await(await fetch("Levels/SecreteHouse.json")).json();

	CreateLevel(k, mapData, "FoundersHouse", sp);
});

k.scene("Skills", async(sp) =>{
	k.setBackground(135, 206, 235, 1);

	k.loadSprite("SkillsMap", "Levels/Skills.png");
	
	const mapData = await(await fetch("Levels/Skills.json")).json();

	CreateLevel(k ,mapData, "SkillsMap", sp);
})

k.go("Temple", "PlayerSpawnPoint");

