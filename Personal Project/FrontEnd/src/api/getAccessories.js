import axios from "axios";

export async function getAccessories() {
    const response = await axios.get("/api/accessories.sbr");
    return response.data;
}