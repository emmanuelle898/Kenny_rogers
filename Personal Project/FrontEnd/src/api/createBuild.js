import axios from "axios";

export async function createBuild(build) {
    const response = await axios.post("/api/builds.sbr", build);

    return response.data;
}