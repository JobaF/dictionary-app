export interface dictionaryResponse {
  word: string;
  phonetics?: PhoneticsEntity[] | null;
  meanings?: MeaningsEntity[] | null;
  license: License;
  sourceUrls?: string[] | null;
}
export interface PhoneticsEntity {
  audio: string;
  sourceUrl?: string | null;
  license?: License1 | null;
  text?: string | null;
}
export interface License1 {
  name: string;
  url: string;
}
export interface MeaningsEntity {
  partOfSpeech: string;
  definitions?: DefinitionsEntity[] | null;
  synonyms?: (string | null)[] | null;
  antonyms?: (string | null)[] | null;
}
export interface DefinitionsEntity {
  definition: string;
  synonyms?: null[] | null;
  antonyms?: null[] | null;
  example?: string | null;
}
export interface License {
  name: string;
  url: string;
}
