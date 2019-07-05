import {Interaction} from "../Models/Interaction";
import {Configuration} from "../Models/Configuration";
import {Contact} from "../Models/Contact";
import { InteractionEvent } from "../Models/InteractionEvent";
import { QueueManager } from "./QueueManager";

export class SessionManager {
    sessionId: string;
    q: QueueManager;
    constructor() {
        this.sessionId = this.getSessionIdFromCookie();
        this.q = new QueueManager();
    }

    getSessionIdFromCookie() {
        const nameLenPlus = Configuration.cookieName.length + 1;
        this.sessionId = document.cookie
                .split(';')
                .map(c => c.trim())
                .filter(cookie => {
                    return cookie.substring(0, nameLenPlus) === `${Configuration.cookieName}=`;
                })
                .map(cookie => {
                    return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null;
        return this.sessionId;
    }

    completeSession() {
        let interactionId: string = this.getSessionIdFromCookie();
        let req: XMLHttpRequest = new XMLHttpRequest();
        req.open('POST', `${Configuration.baseUrl}/interaction/complete`);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function() {
            if (req.status === 202) {
                document.cookie = Configuration.cookieName + "=" + `; expires=-1; path=/`;
                console.debug("Session has been successfully completed. The cookie has been removed");
            }
            else {
                console.error("Sitecore Universal Tracker session could not be completed.");
            }
        };
        req.send(JSON.stringify(interactionId));
    }

    createInteraction(events: InteractionEvent[]): Interaction {
        let interaction: Interaction = {
            ChannelId: Configuration.channelId,
            UserAgent: navigator.userAgent,
            Events: events,
            Contact: {
                Source: "ut",
                Identifier: "tnp@sitecore.net"
            } as Contact
        };
        return interaction;
    }

    initializeSession(events: InteractionEvent[]){
        this.execApiCall("PUT", "interaction", this.createInteraction(events), function(xhr: XMLHttpRequest){
            if(xhr.status == 201){
                document.cookie = Configuration.cookieName + "=" + xhr.responseText + `; expires=1; path=/`;
                console.debug(`Successfully sent ${events.length} events to Universal Tracker`);
            } else {
                let qm: QueueManager = new QueueManager();
                qm.setItems(events);
                console.debug(`Something went wrong whilst sending events to Universal Tracker. Repsonse: ${xhr.responseText}`);
            }
        });
    }

    execApiCall(method: string, endpoint: string, data: any, callBack: any) {
        var req = new XMLHttpRequest();
        req.open(method, `${Configuration.baseUrl}/${endpoint}`);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function(){ callBack(req); };
        req.send(JSON.stringify(data));
    }

    sendEvent(){
        var events = this.q.getItems();
        if(events.length > 0){
            if(this.getSessionIdFromCookie() != null){
                this.execApiCall("PUT", "event", events, function(xhr: XMLHttpRequest){
                    if(xhr.status == 201){
                        console.debug(`Successfully sent ${events.length} events to Universal Tracker`);
                    } else {
                        let qm: QueueManager = new QueueManager();
                        qm.setItems(events);
                        console.debug(`Something went wrong whilst sending events to Universal Tracker. Repsonse: ${xhr.responseText}`);
                    }
                });
            } else {
                this.initializeSession(events);
            }
        }
    }
}
