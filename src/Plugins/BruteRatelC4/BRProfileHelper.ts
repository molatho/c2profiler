import { IBRProfile } from "./BRProfileTypes";

export class BRProfileHelper {
    static createEmpty = (): IBRProfile => {
        return {
            "listeners": {}
        }
    }
}