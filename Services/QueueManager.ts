import { InteractionEvent } from "../Models/InteractionEvent";
import { SessionManager } from "./SessionManager";

const localStorageKey = 'UTQueue';
export class QueueManager {

    getQueue(): InteractionEvent[]{
        return JSON.parse(localStorage.getItem(localStorageKey)) as InteractionEvent[] || [];
    }

    setItem(item: InteractionEvent){
        this.setItems([item]);
    }

    setItems(items: InteractionEvent[]) {
        let q: InteractionEvent[] = this.getQueue();
        localStorage.setItem(localStorageKey, JSON.stringify(q.concat(items)));
    }

    getItems(): InteractionEvent[] {
        let q: InteractionEvent[] = this.getQueue();
        localStorage.setItem(localStorageKey, JSON.stringify([]));
        return q;
    }
}