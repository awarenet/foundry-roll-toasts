import { RollToast } from "./RollToast.js";
import { flagId, isChatActive, moduleId, ROLLCONFIG_DEFAULT, Types } from "./utils.js";

export class RollToastController {
    constructor() {
        this.hookIndex = {}
        game.socket.on(`module.${moduleId}`, (toast) => {
            this.socketReceived(toast);
        })
        this.init();
        Hooks.on(`${moduleId}.settings`, this.init.bind(this))
    }

    init = () => {
        this.toastSettings = game.user.flags[moduleId][flagId];
        if (!this.toastSettings) {
            this.toastSettings = ROLLCONFIG_DEFAULT;
        }
        //clear all hooks and readd
        if (this.hookIndex) {
            for (const [key, value] of Object.entries(this.hookIndex)) {
                Hooks.off(key, value)
            }
            this.hookIndex = {}
        }
        
        //only adds hooks if we have roll toasts enabled.
        if (this.toastSettings.enable) {
            // ROLL Hooks
            this.hookIndex[`${moduleId}.postatoast`] = 
                Hooks.on(`${moduleId}.postatoast`,(toast) => {
                    this.sendIt(toast);
                })
            this.hookIndex['dnd5e.rollAbilitySave'] =
                Hooks.on('dnd5e.rollAbilitySave', (actor, roll) => {
                    let toast = this.abilityskillCheck(actor, roll, Types.ABI);
                    this.sendToHook(toast)
                });
            this.hookIndex['dnd5e.rollAttack'] =
                Hooks.on('dnd5e.rollAttack', (item, roll) => {
                    let toast = this.itemCheck(item, roll, Types.ATT);
                    this.sendToHook(toast)
                })
            this.hookIndex['dnd5e.rollDamage'] =
                Hooks.on('dnd5e.rollDamage', (item, roll) => {
                    let toast = this.itemCheck(item, roll, Types.DMG);
                    this.sendToHook(toast)
                })
            this.hookIndex['dnd5e.rollToolCheck'] =
                Hooks.on('dnd5e.rollToolCheck', (actor, roll) => {
                    let toast = this.abilityskillCheck(actor, roll, Types.TOOL);
                    this.sendToHook(toast)
                })
            this.hookIndex['dnd5e.rollAbilityTest'] =
                Hooks.on('dnd5e.rollAbilityTest', (actor, roll) => {
                    let toast = this.abilityskillCheck(actor, roll, Types.ABI);
                    this.sendToHook(toast)
                })
            this.hookIndex['dnd5e.rollSkill'] =
                Hooks.on('dnd5e.rollSkill', (actor, roll) => {
                    let toast = this.abilityskillCheck(actor, roll, Types.SKI);
                    this.sendToHook(toast)
                })
            this.hookIndex['dnd5e.rollInitiative'] =
                Hooks.on('dnd5e.rollInitiative', (actor, combatants) => {
                    let toasts = this.initiativeCheck(actor, combatants);
                    toasts && toasts.forEach(x => this.sendToHook(x))
                    
                });
        }

    }

    sendToHook = (toast) => {
        game.socket.emit(`module.${moduleId}`, toast)
        if(this.toastSettings.showOwn){
            Hooks.call(`${moduleId}.postatoast`,toast)
        }
    }
    socketReceived = (toast) => {
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
            type: type
        }
        return toast;
    }

    itemCheck = (item, roll, type) => {
        //if(!isChatActive()){
        let id = `${item._id}-${roll._total}-${Date.now()}`
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
            type: type
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
                type: Types.INI
            }
        })
    }
}