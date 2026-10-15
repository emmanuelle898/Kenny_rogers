import axios from "axios";

export async function getCrystals() {
    const response = await axios.get("/api/crystals.sbr");

    return response.data;
}