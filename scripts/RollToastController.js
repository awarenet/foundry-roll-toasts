import { RollToast } from "./RollToast.js";
import { flagId, moduleId, ROLLCONFIG_DEFAULT_OPTIONS, System } from "./utils.js";


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
    }

    init = async () => {
        this.gameSystem = Object.values(System).filter(x => x.id == game.system.id)[0];
        this.toastSettings = game.user.flags[moduleId][flagId];
        if (!this.toastSettings) {
            game.user.setFlag(moduleId, flagId, { ...ROLLCONFIG_DEFAULT_OPTIONS, ...this.gameSystem.options }).then(x => {
                Hooks.call(`${moduleId}.settings`)
            })
        } else {
            //only adds hooks if we have roll toasts enabled.
            if (this.toastSettings.enable) {
                // ROLL Hooks
                this.hookIndex[`${moduleId}.postatoast`] =
                    Hooks.on(`${moduleId}.postatoast`, (toast) => {
                        this.sendIt(toast);
                    })
            }
        }


    }

    sendToHook = (toast) => {
        if (toast.public) {
            game.socket.emit(`module.${moduleId}`, toast)
        }
        if (this.toastSettings.showOwn) {
            Hooks.call(`${moduleId}.postatoast`, toast)
        }
    }
    socketReceived = (toast) => {
        if (this.toastSettings.showOthers) {
            Hooks.call(`${moduleId}.postatoast`, toast)
        }
    }

    showToast = async ({ id, img, title, result, name, adv, dis, crit, fail }) => {
        const toast = new RollToast(id, img, title, result, name, adv, dis, crit, fail, (this.toastSettings.toastTimeout * 1000));
        toast.show();
    }

}