import { InteractionEvent } from "./InteractionEvent";

export interface PageView extends InteractionEvent{
    URL: string;
}