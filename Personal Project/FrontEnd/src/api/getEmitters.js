import axios from "axios";

export async function getEmitters() {
    try {
        const response = await axios.get("/api/emitters.sbr");
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                "Could not load Emitters"
            )
        }
        throw error;
    }
}