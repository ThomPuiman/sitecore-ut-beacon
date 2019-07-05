import {Contact} from "./Contact";
import {InteractionEvent} from "./InteractionEvent";

export interface Interaction {
    ChannelId?: string;
    Initiation?: string;
    UserAgent?: string;
    Contact?: Contact;
    Events: InteractionEvent[];
}