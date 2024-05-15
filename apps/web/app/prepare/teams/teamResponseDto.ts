import { RacerResponseDto } from './racerResponseDto';

export type TeamResponseDto = {
  id: string;
  fullname: string;
  shortname: string;
  eventId: string;
  orderMale: number;
  orderFemale: number;
  createdAt: number;
  updatedAt: number;
};

export type TeamResponseWithRacersDto = TeamResponseDto & {
  racers: RacerResponseDto[];
};
