import type { Database } from "/database/interfaces/Database.js";
import "dotenv/config";
import { type ServiceAccount } from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { z, ZodType } from "zod";

const FirebaseEnvConfigSchema = z.object({
  type: z.string().trim().min(1),
  project_id: z.string().trim().min(1),
  private_key_id: z.string().trim().min(1),
  private_key: z.string().trim().min(1),
  client_email: z.string().trim().min(1),
  client_id: z.string().trim().min(1),
  auth_uri: z.string().trim().min(1),
  token_uri: z.string().trim().min(1),
  auth_provider_x509_cert_url: z.string().trim().min(1),
  client_x509_cert_url: z.string().trim().min(1),
  universe_domain: z.string().trim().min(1)
});

export class Firebase implements Database {
  private firestore: ReturnType<typeof getFirestore>;

  constructor() {
    const config = parseFirebaseEnvConfig();
    initializeApp({ credential: cert(config as ServiceAccount) });
    this.firestore = getFirestore();
  }

  async set<T extends ZodType>(path: string, value: z.infer<T>, schema: T) {
    schema.parse(value);
    await this.firestore.doc(path).set(value);
  }

  async get<T extends ZodType>(path: string, schema: T) {
    const snapshot = await this.firestore.doc(path).get();
    return schema.parse(snapshot.data());
  }

  async delete(path: string) {
    await this.firestore.doc(path).delete();
  }

  async update<T extends ZodType>(path: string, value: z.infer<T>, schema: T) {
    schema.parse(value);
    await this.firestore.doc(path).update(value);
  }
}

function parseFirebaseEnvConfig() {
  const config: Record<string, string> = {};

  for (const key in FirebaseEnvConfigSchema.shape) {
    if (!Object.hasOwn(FirebaseEnvConfigSchema.shape, key)) {
      continue;
    }
    config[key] = process.env[`FIREBASE_${key.toUpperCase()}`] ?? "";
  }

  return FirebaseEnvConfigSchema.parse(config);
}
