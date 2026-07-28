import { randomBytes } from "node:crypto";

process.stdout.write(`inv_${randomBytes(32).toString("base64url")}\n`);
