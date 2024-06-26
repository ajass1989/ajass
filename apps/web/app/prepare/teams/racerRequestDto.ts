export type RacerRequestDto = {
  name: string;
  kana: string;
  category: string;
  bib?: number;
  gender: string;
  seed: number;
  teamId: string | null;
  isFirstTime: boolean;
  age: number | null;
  special: string;
};
