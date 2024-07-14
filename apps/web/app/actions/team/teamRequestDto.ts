/**
 * チームの追加、更新リクエストDTO
 */
export type TeamRequestDto = {
  fullname: string;
  shortname: string;
  eventId: string;
  orderMale: number;
  orderFemale: number;
};
