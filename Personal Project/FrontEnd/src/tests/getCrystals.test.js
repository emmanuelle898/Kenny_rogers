import { beforeEach, expect, test, vi } from "vitest";
import axios from "axios";
import { getCrystals } from "../api/getCrystals.js";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

beforeEach(() => {
    axios.get.mockReset();
});

test("gets crystals glow colors", async () => {
    // Arrange
    const crystals = [
        {
            id: "violet",
            name: "Violet Crystal",
            glowColor: "#ba00ff",
        },
        {
            id: "blue",
            name: "Blue Crystal",
            glowColor: "#0018f9",
        },
        {id:"yellow", name:"Yellow Crystal", glowColor:"#ffe81f"},
        {id:"crimson", name:"Crimson Crystal",glowColor: "#990000"},
        {id:"orange",name: "Orange Crystal", glowColor:"#be5103"},
        {id:"green", name:"Green Crystal",glowColor: "#33ff33"},
        {id:"white", name:"White Crystal",glowColor:"#f4f8ff"},
        {id:"black",name: "Black Crystal", glowColor:"#000000"}
    ];

    axios.get.mockResolvedValue({
        data: crystals,
    });

    // Act
    const result = await getCrystals();

    // Assert
    expect(result).toEqual(crystals);
    expect(axios.get).toHaveBeenCalledWith("/api/crystals.sbr");
});