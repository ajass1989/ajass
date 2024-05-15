import { Racer, Team } from '@repo/database';

export type TeamWithRacers = Team & {
  racers: Racer[];
};
