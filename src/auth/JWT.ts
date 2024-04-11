import type { AuthPayload } from "/auth/interfaces/AuthPayload.js";
import { AuthPayloadSchema } from "/auth/schemas/AuthPayload.js";
import { camelToUpper } from "/utilities/Naming.js";
import * as crypto from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWTEnvConfigSchema = z.object({
  privateKey: z.string().trim().min(1)
});

export class JWT {
  private readonly publicKey: crypto.KeyObject;
  private readonly privateKey: crypto.KeyObject;
  private readonly signOptions: jwt.SignOptions | undefined;
  private readonly verifyOptions: jwt.VerifyOptions | undefined;

  constructor(
    signOptions?: jwt.SignOptions,
    verifyOptions?: jwt.VerifyOptions
  ) {
    const config = parseJWTEnvConfig();
    this.privateKey = crypto.createPrivateKey(
      config.privateKey.replaceAll("\\n", "\n")
    );
    this.publicKey = crypto.createPublicKey(this.privateKey);
    this.signOptions = signOptions;
    this.verifyOptions = verifyOptions;
  }

  encode(payload: AuthPayload): string {
    const parsedAuthPayload = AuthPayloadSchema.parse(payload);
    return jwt.sign(parsedAuthPayload, this.privateKey, this.signOptions);
  }

  decode(token: string): AuthPayload {
    const authPayload = jwt.verify(
      token,
      this.publicKey,
      this.verifyOptions
    ) as AuthPayload;
    return AuthPayloadSchema.parse(authPayload);
  }
}

function parseJWTEnvConfig() {
  const config: Record<string, string> = {};

  for (const key in JWTEnvConfigSchema.shape) {
    if (!Object.hasOwn(JWTEnvConfigSchema.shape, key)) {
      continue;
    }
    config[key] = process.env[`JWT_${camelToUpper(key)}`] ?? "";
  }

  return JWTEnvConfigSchema.parse(config);
}
