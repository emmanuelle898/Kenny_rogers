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

test("changing the crystal changes the glow but keeps the hilt", () => {
    // Arrange
    const hilt = {
        backgroundColor: "#273c2b",
        backgroundImage: "linear-gradient(#142019, #8b9f86)",
    };

    const violet = { glowColor: "#ba00ff" };
    const green = { glowColor: "#33ff33" };

    // Act
    const firstTheme = getWorkshopTheme({
        hilt,
        crystal: violet,
    });

    const secondTheme = getWorkshopTheme({
        hilt,
        crystal: green,
    });

    // Assert
    expect(firstTheme.glowColor).toBe("#ba00ff");
    expect(secondTheme.glowColor).toBe("#33ff33");

    expect(secondTheme.backgroundColor).toBe(
        firstTheme.backgroundColor
    );

    expect(secondTheme.backgroundImage).toBe(
        firstTheme.backgroundImage
    );
});