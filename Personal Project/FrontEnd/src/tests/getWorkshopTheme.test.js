import { expect, test} from "vitest";
import { getWorkshopTheme } from "../utils/getWorkshopTheme";

test("changin the hild changes the background but keeps the crystal glow", () =>{
    //arrange
    const greenHilt = {backgroundColor: "#273c2b"};
    const brassHilt = {backgroundColor: "#614326"};
    const violetCrystal = {glowColor: "#b77aff"};
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
    expect(secondTheme.backgroundColor).toBe("#614326");

    expect(firstTheme.glowColor).toBe("#b77aff");
    expect(secondTheme.glowColor).toBe("#b77aff");
})