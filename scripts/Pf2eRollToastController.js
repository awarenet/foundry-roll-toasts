import { RollToastController } from "./RollToastController.js";
import { System } from "./utils.js";

export class Pf2eRollToastController extends RollToastController {

    constructor() {
        super();
        if (this.toastSettings.enable) {
            this.addListeners();
            this.types = System.PF2E.types;
        }

    }

    isGM = (data) => {
        return data.whisper.length == 1 && game.users.activeGM._id == data.whisper[0]
    }

    addListeners = () => {
        this.hookIndex['dnd5e.rollAbilitySave'] =
            Hooks.on('preCreateChatMessage', (data,) => {
                const innerData = data.flags.pf2e.context;
                let id = `${data.actor._id}-${data.content}-${Date.now()}`
                let toast = {
                    id: id ,
                    img: data.actor.img,
                    title: innerData.title,
                    result: data.content,
                    name: data.actor.name,
                    adv: false,
                    dis: false,
                    crit: false,
                    fail: false,
                    type: innerData.type,
                    shouldSend: ((data.whisper.length == 0 || this.isGM(data)) && data.actor.type == "character"),
                    gmOnly: this.isGM(data)
                }

                this.sendToHook(toast)
            });
    }

    //Has to be a better way to do this.
    sendIt = (toast) => {
        if (!this.toastSettings.chatShow && isChatActive()) {
            return;
        }
        switch (toast.type) {
            case this.types.ATT:
                if (this.toastSettings.attacks)
                    this.showToast(toast)
                break;
            case this.types.DMG:
                if (this.toastSettings.damage)
                    this.showToast(toast);
                break;
            case this.types.INI:
                if (this.toastSettings.initiative)
                    this.showToast(toast);
                break;
            case this.types.SKI:
                if (this.toastSettings.skills)
                    this.showToast(toast);
                break;
            case this.types.DSV:
                if (this.toastSettings.deathsaves)
                    this.showToast(toast);
                break
            case this.types.SAV:
                if (this.toastSettings.saves)
                    this.showToast(toast);
                break
            case this.types.PER:
                if (this.toastSettings.perception)
                    this.showToast(toast)
                break
            default:
                break;
        }
    }
}