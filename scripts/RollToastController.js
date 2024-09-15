import { RollToast } from "./RollToast.js";
import { flagId, isChatActive, moduleId, ROLLCONFIG_DEFAULT, Types, System } from "./utils.js";
const PUBLIC_ROLL = 'publicroll'
const GM_ONLY_ROLL = 'gmroll'

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
        if(toast.shouldSend){
            game.socket.emit(`module.${moduleId}`, toast)
        }
        if (this.toastSettings.showOwn) {
            Hooks.call(`${moduleId}.postatoast`, toast)
        }
    }
    socketReceived = (toast) => {

        if(toast.gmOnly && !game.user.isGM){
            return;
        }
        if(this.toastSettings.showOthers){
            Hooks.call(`${moduleId}.postatoast`,toast)
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
        switch(toast.type){
            case Types.ABI:
                if(this.toastSettings.abilities)
                    this.showToast(toast);
                break;
            case Types.ATT:
                if(this.toastSettings.attacks)
                    this.showToast(toast)
                break;
            case Types.DMG:
                if(this.toastSettings.damage)
                    this.showToast(toast);
                break;
            case Types.INI:
                if(this.toastSettings.initiative)
                    this.showToast(toast);
                break;
            case Types.SKI:
                if(this.toastSettings.skill)
                    this.showToast(toast);
                break;
            case Types.TOOL:
                if(this.toastSettings.tool)
                    this.showToast(toast);
                break
            default:
                break;
        }
    }

    shouldItGo = (roll,actor) => {
        return ((roll.options.rollMode == PUBLIC_ROLL || roll.options.rollMode == GM_ONLY_ROLL)&& actor.type == "character")
    }

    abilityskillCheck = (actor, roll, type) => {
        let id = `${actor._id}-${roll._total}-${Date.now()}`
        const toast = {
            id: id,
            img: actor.img,
            title: roll.options.flavor,
            result: roll._total,
            name: actor.name,
            adv: roll.hasAdvantage,
            dis: roll.hasDisadvantage,
            crit: roll.isCritical,
            fail: roll.isFumble,
            type: type,
            shouldSend: this.shouldItGo(roll,actor),
            gmOnly: (roll.options.rollMode == GM_ONLY_ROLL && actor.type == "character"),
        }
        return toast;
    }

    itemCheck = (item, roll, type) => {
        //if(!isChatActive()){
        let id = `${item._id}-${roll._total}-${Date.now()}`
        let actor = item.actor;
        const toast = {
            id: id,
            img: item.parent.img,
            title: roll.options.flavor,
            result: roll._total,
            name: item.parent.name,
            adv: roll.hasAdvantage,
            dis: roll.hasDisadvantage,
            crit: roll.isCritical,
            fail: roll.isFumble,
            type: type,
            shouldSend: this.shouldItGo(roll,actor),
            gmOnly: (roll.options.rollMode == GM_ONLY_ROLL && actor.type == "character"),
        }
        return toast;
    }

    initiativeCheck = (actor, combatants) => {
        return combatants.map((combatant) => {
            let id = `${combatant.actorId}-${combatant.initiative}-${Date.now()}`
            return {
                id: id,
                img: combatant.img,
                title: "Intiative",
                result: combatant.initiative,
                name: combatant.name,
                adv: false,
                dis: false,
                crit: false,
                fail: false,
                type: Types.INI,
                shouldSend: true,
                gmOnly: false
            }
        })
    }
}
