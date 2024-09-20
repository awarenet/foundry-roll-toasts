import { RollToastController } from "./RollToastController.js";
import { System, PUBLIC_ROLL, GM_ONLY_ROLL,isChatActive } from "./utils.js";

export class DnD5eRollToastController extends RollToastController {

    constructor() {
        super();
        this.addListeners();
        this.types = System.DND5E.types;
    }

    addListeners = () => {
        this.hookIndex['dnd5e.rollAbilitySave'] =
            Hooks.on('dnd5e.rollAbilitySave', (actor, roll) => {
                let toast = this.abilityskillCheck(actor, roll, this.types.ABI);
                this.sendToHook(toast)
            });
        this.hookIndex['dnd5e.rollAttack'] =
            Hooks.on('dnd5e.rollAttack', (item, roll) => {
                let toast = this.itemCheck(item, roll, this.types.ATT);
                this.sendToHook(toast)
            })
        this.hookIndex['dnd5e.rollDamage'] =
            Hooks.on('dnd5e.rollDamage', (item, roll) => {
                let toast = this.itemCheck(item, roll, this.types.DMG);
                this.sendToHook(toast)
            })
        this.hookIndex['dnd5e.rollToolCheck'] =
            Hooks.on('dnd5e.rollToolCheck', (actor, roll) => {
                let toast = this.abilityskillCheck(actor, roll, this.types.TOOL);
                this.sendToHook(toast)
            })
        this.hookIndex['dnd5e.rollAbilityTest'] =
            Hooks.on('dnd5e.rollAbilityTest', (actor, roll) => {
                let toast = this.abilityskillCheck(actor, roll, this.types.ABI);
                this.sendToHook(toast)
            })
        this.hookIndex['dnd5e.rollSkill'] =
            Hooks.on('dnd5e.rollSkill', (actor, roll) => {
                let toast = this.abilityskillCheck(actor, roll, this.types.SKI);
                this.sendToHook(toast)
            })
        this.hookIndex['dnd5e.rollInitiative'] =
            Hooks.on('dnd5e.rollInitiative', (actor, combatants) => {
                let toasts = this.initiativeCheck(actor, combatants);
                toasts && toasts.forEach(x => this.sendToHook(x))
            });
    }

    sendIt = (toast) => {

        if (!this.toastSettings.chatShow && isChatActive()) {
            return;
        }
        switch (toast.type) {
            case this.types.ABI:
                if (this.toastSettings.abilities)
                    this.showToast(toast);
                break;
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
                if (this.toastSettings.skill)
                    this.showToast(toast);
                break;
            case this.types.TOOL:
                if (this.toastSettings.tool)
                    this.showToast(toast);
                break
            default:
                break;
        }
    }

    shouldItGo = (roll, actor) => {
        return ((roll.options.rollMode == PUBLIC_ROLL || roll.options.rollMode == GM_ONLY_ROLL) && actor.type == "character")
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
            shouldSend: this.shouldItGo(roll, actor),
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
            shouldSend: this.shouldItGo(roll, actor),
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
                type: this.types.INI,
                shouldSend: true,
                gmOnly: false
            }
        })
    }
}