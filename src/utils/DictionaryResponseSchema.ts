import { z } from "zod";

const licenseEntity = z.object({
  name: z.string(),
  url: z.string(),
});

const definitionEntity = z.object({
  antonyms: z.array(z.optional(z.string())),
  definition: z.optional(z.string()),
  example: z.optional(z.string()),
  synonyms: z.array(z.optional(z.string())),
});

const meaningEntity = z.object({
  antonyms: z.array(z.optional(z.string())),
  definitions: z.array(definitionEntity),
  partOfSpeech: z.string(),
  synonyms: z.array(z.optional(z.string())),
});

const phoneticEntity = z.object({
  audio: z.string(),
  license: z.optional(licenseEntity),
  sourceUrl: z.optional(z.string()),
  text: z.optional(z.string()),
});

export const DictionaryResponseSchema = z.array(
  z.object({
    word: z.string(),
    phonetics: z.array(phoneticEntity),
    phonetic: z.optional(z.string()),
    meanings: z.array(meaningEntity),
    license: licenseEntity,
    sourceUrls: z.array(z.optional(z.string())),
  })
);
