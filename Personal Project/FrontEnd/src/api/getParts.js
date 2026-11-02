import axios from "axios";

export async function getParts() {
    try {
        const response = await axios.get("/api/parts.sbr");
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Could not load parts (${error.response.status})`
            );
        }

        throw error;
    }
}