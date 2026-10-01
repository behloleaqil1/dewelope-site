// SHA-256 hashing in the browser via Web Crypto. Must match the Node-generated
// hash stored in content.json: sha256(`${salt}:${password}`).
export async function sha256Hex(input) {
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function hashPassword(salt, password) {
    return sha256Hex(`${salt}:${password}`);
}
