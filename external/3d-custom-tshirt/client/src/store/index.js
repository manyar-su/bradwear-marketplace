import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color: "#F5F5F0",
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: "./arun-logo.png",
    fullDecal: "./texture.jpg",
    logoPosition: { x: 0, y: 0.04, z: 0.15 },
    logoScale: 0.15,
});

export default state;