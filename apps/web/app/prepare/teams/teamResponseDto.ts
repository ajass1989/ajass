import { Racer, Team } from '@repo/database';
// import { RacerResponseDto } from './racerResponseDto';

// export type TeamResponseDto = {
//   id: string;
//   fullname: string;
//   shortname: string;
//   eventId: string;
//   orderMale: number;
//   orderFemale: number;
//   createdAt: number;
//   updatedAt: number;
// };

export type TeamWithRacers /*TeamResponseWithRacersDto*/ =
  Team /*ResponseDto*/ & {
    racers: Racer /*ResponseDto*/[];
  };
