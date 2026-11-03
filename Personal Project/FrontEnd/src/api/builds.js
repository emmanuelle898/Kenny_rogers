import axios from "axios";

function buildUrl(id) {
    return `/api/builds/${encodeURIComponent(id)}.sbr`;
}

export async function createBuild(build) {
    const response = await axios.post("/api/builds.sbr", build);
    return response.data;
}

export async function listBuilds() {
    const response = await axios.get("/api/builds.sbr");
    return response.data;
}

export async function getBuild(id) {
    const response = await axios.get(buildUrl(id));
    return response.data;
}

export async function updateBuild(id, build) {
    const response = await axios.put(buildUrl(id), build);
    return response.data;
}

export async function deleteBuild(id) {
    await axios.delete(buildUrl(id));
}