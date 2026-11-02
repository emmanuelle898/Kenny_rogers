import axios from "axios";

export async function getCrystals() {
    try{
    const response = await axios.get("/api/crystals.sbr");
    return response.data;
} catch (error) {
        if (error.response) {
            throw new Error("Could not load crystals");
        }
        throw error;
    }
}