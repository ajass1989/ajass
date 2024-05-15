export type RacerResponseDto = {
  id: string;
  name: string;
  kana: string;
  category: string;
  bib?: number;
  gender: string;
  seed: number;
  teamId?: string;
  isFirstTime: boolean;
  age?: number;
  special: string;
  createdAt: number;
  updatedAt: number;
};
