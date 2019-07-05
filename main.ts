import { EventsService } from "./Services/EventsService";
import {SessionManager} from "./Services/SessionManager";

declare global {
    interface Window { UT: EventsService; SM: SessionManager; }
}

window.SM = new SessionManager();
window.UT = new EventsService();
window.UT.pageview();
window.UT.goal("1779cc42-ef7a-4c58-bf19-fa85d30755c9");
window.UT.submit();