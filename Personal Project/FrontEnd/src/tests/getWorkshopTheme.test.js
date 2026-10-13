import { expect, test} from "vitest";
import { getWorkshopTheme } from "../utils/getWorkshopTheme";

test("changing the hilt changes the background but keeps the crystal glow", () =>{
    //arrange
    const greenHilt = {backgroundColor: "#273c2b"};
    const brassHilt = {backgroundColor: "#C49E5B"};
    const violetCrystal = {glowColor: "#ba00ff"};
    //act
    const firstTheme = getWorkshopTheme({
        hilt: greenHilt,
        crystal: violetCrystal,
    });

    const secondTheme = getWorkshopTheme({
        hilt: brassHilt,
        crystal: violetCrystal,
    });
    //assert
    expect(firstTheme.backgroundColor).toBe("#273c2b");
    expect(secondTheme.backgroundColor).toBe("#C49E5B");

    expect(firstTheme.glowColor).toBe("#ba00ff");
    expect(secondTheme.glowColor).toBe("#ba00ff");
})

test("changing the crystal glow changes the crystal glow but it changes the hilt", () =>{
    //arrange
    const greenHilt = {backgroundColor: "#273c2b"};
    const brassHilt = {backgroundColor: "#C49E5B"};
    const violetCrystal = {glowColor: "#ba00ff"};
    //act
    const firstTheme = getWorkshopTheme({
        hilt: greenHilt,
        crystal: violetCrystal,
    });

    const secondTheme = getWorkshopTheme({
        hilt: brassHilt,
        crystal: violetCrystal,
    });
    //assert
    expect(firstTheme.backgroundColor).toBe("#273c2b");
    expect(secondTheme.backgroundColor).toBe("#C49E5B");

    expect(firstTheme.glowColor).toBe("#ba00ff");
    expect(secondTheme.glowColor).toBe("#ba00ff");
})