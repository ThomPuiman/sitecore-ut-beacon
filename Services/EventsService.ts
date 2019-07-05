import { InteractionEvent } from "../Models/InteractionEvent";
import { QueueManager } from "./QueueManager";
import { PageView } from "../Models/PageView";
import { SessionManager } from "./SessionManager";

export class EventsService {
    qm: QueueManager;
    sm: SessionManager;
    
    constructor(){
        this.qm = new QueueManager();
        this.sm = new SessionManager();
    }

    goal(goalId: string) {
        let event: InteractionEvent = {
            type: "goal",
            DefinitionId: goalId,
            Timestamp: (new Date()).toISOString()
        };
        this.handleEvent(event);
    }

    pageview(){
        let event: PageView = {
            type: "pageview",
            URL: window.location.href,
            Timestamp: (new Date()).toISOString()
        };
        this.handleEvent(event);
    }

    handleEvent(event: InteractionEvent){
        event.TrackingInteractionId = this.sm.getSessionIdFromCookie();
        this.qm.setItem(event);
    }
    
    submit() {
        this.sm.sendEvent();
    }
}