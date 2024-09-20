import { RollToast } from "./RollToast.js";
import { flagId, isChatActive, moduleId, ROLLCONFIG_DEFAULT_OPTIONS, System } from "./utils.js";


export class RollToastController {
    constructor() {
        this.hookIndex = {}
        game.socket.on(`module.${moduleId}`, (toast) => {
            this.socketReceived(toast);
        })
        this.init();
    }

    destroy = () => {
        if (this.hookIndex) {
            for (const [key, value] of Object.entries(this.hookIndex)) {
                Hooks.off(key, value)
            }
            this.hookIndex = {}
        }
        game.socket.off(`module.${moduleId}`);
    }

    init = async () => {
        this.gameSystem = Object.values(System).filter(x => x.id == game.system.id)[0];
        if (game.user.flags[moduleId]) {
            this.toastSettings = game.user.flags[moduleId][flagId];
        }
        if (!this.toastSettings) {
            game.user.setFlag(moduleId, flagId, { ...ROLLCONFIG_DEFAULT_OPTIONS, ...this.gameSystem.options }).then(x => {
                Hooks.call(`${moduleId}.settings`)
            })
        } else {
            // ROLL Hooks
            this.hookIndex[`${moduleId}.postatoast`] =
                Hooks.on(`${moduleId}.postatoast`, (toast) => {
                    this.sendIt(toast);
                })

        }


    }

    sendToHook = (toast) => {
        if (toast.shouldSend) {
            game.socket.emit(`module.${moduleId}`, toast)
        }
        if (this.toastSettings.showOwn) {
            Hooks.call(`${moduleId}.postatoast`, toast)
        }
    }
    socketReceived = (toast) => {

        if (toast.gmOnly && !game.user.isGM) {
            return;
        }
        if (this.toastSettings.showOthers) {
            Hooks.call(`${moduleId}.postatoast`, toast)
        }
    }

    showToast = async ({ id, img, title, result, name, adv, dis, crit, fail }) => {
        const toast = new RollToast(id, img, title, result, name, adv, dis, crit, fail, (this.toastSettings.toastTimeout * 1000));
        toast.show();
    }
    sendIt = (toast) => {
        if (!this.toastSettings.chatShow && isChatActive()) {
            return;
        }
        switch (toast.type) {
            case Types.ABI:
                if (this.toastSettings.abilities)
                    this.showToast(toast);
                break;
            case Types.ATT:
                if (this.toastSettings.attacks)
                    this.showToast(toast)
                break;
            case Types.DMG:
                if (this.toastSettings.damage)
                    this.showToast(toast);
                break;
            case Types.INI:
                if (this.toastSettings.initiative)
                    this.showToast(toast);
                break;
            case Types.SKI:
                if (this.toastSettings.skill)
                    this.showToast(toast);
                break;
            case Types.TOOL:
                if (this.toastSettings.tool)
                    this.showToast(toast);
                break
            default:
                break;
        }
    }

}
