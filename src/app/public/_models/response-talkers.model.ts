import { TalkerActivity } from "./talker-activity.model";

export class ResponseTalkers {
  private talkers!: Map<string, TalkerActivity>
  private totalUsers!: number;
  private totalTalkers!: number;
  private ts!: number;
}