import { z } from "zod";

export const SessionIdSchema = z.string().uuid();
export const MessageIdSchema = z.string().uuid();

/**
 * Schema of normal message records
 */
export const MessageSchema = z.object({
  /**
   * Message ID. Should uniquely identify a single message.
   */
  id: MessageIdSchema,
  // eslint-disable-next-line no-magic-numbers
  content: z.string().trim().min(1),
  /**
   * Specify who is the author of this message.
   */
  author: z.object({
    role: z.union([
      z.literal("user"),
      z.literal("assistant"),
      z.literal("system")
    ])
  })
});

/**
 * Schema of control instructions
 */
export const ControlSchema = z.object({
  /**
   * Predefined control signals.
   */
  signal: z.union([
    z.literal("generation-pending"),
    z.literal("generation-started"),
    z.literal("generation-done"),
    z.literal("generation-error")
  ])
});

/**
 * Describe a history chat session entry that is meant to be displayed in the
 * sidebar.
 */
export const HistorySessionSchema = z.object({
  /**
   * Session ID
   */
  id: SessionIdSchema,
  /**
   * Data & time string in ISO 8601 standard
   */
  dateTime: z.string().datetime(),
  // eslint-disable-next-line no-magic-numbers
  title: z.string().trim().min(1)
});

// eslint-disable-next-line no-magic-numbers
export const UsernameSchema = z.string().trim().min(1).max(32).regex(/^\w*$/u);

// eslint-disable-next-line no-magic-numbers
export const PasswordSchema = z.string().trim().min(6).max(64);
