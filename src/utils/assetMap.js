// Maps the string keys stored in content.json (e.g. "web", "mysimplerx",
// "cloudtek") to the actual bundled asset URLs. Content edited in the dashboard
// references assets by key; the public site resolves them here. Unknown keys
// resolve to undefined so callers can fall back gracefully.
import {
    mobile, backend, creator, web, typescript, reactjs, redux, tailwind,
    nodejs, mongodb, docker, java, angular, laravel, nextjs, postgresql, git,
    cloudtek, aksaSds, deltaShoppe, mysimplerx, vars, flexigolf, chotok, ugap, edfry,
} from "../assets";

const ASSET_MAP = {
    mobile, backend, creator, web, typescript, reactjs, redux, tailwind,
    nodejs, mongodb, docker, java, angular, laravel, nextjs, postgresql, git,
    cloudtek, aksaSds, deltaShoppe, mysimplerx, vars, flexigolf, chotok, ugap, edfry,
};

// Keys offered in the dashboard asset pickers.
export const ASSET_KEYS = Object.keys(ASSET_MAP).sort();

export function resolveAsset(key) {
    if (!key) return undefined;
    return ASSET_MAP[key];
}
