
export const moduleId = "roll-toast"
export const flagId = "roll-toast-config"
export const isChatActive = () => {
    const chat = document.querySelector('.active[data-tab="chat"]');
    return chat != null;
}

export const PUBLIC_ROLL = 'publicroll';
export const GM_ONLY_ROLL = 'gmroll';
export const ROLLCONFIG_DEFAULT_OPTIONS =
{
    "enable": true,
    "chatShow": true,
    "toastTimeout": 3,
    "showOwn": true,
    "showOthers": true,
}

export const System = {
    DND5E: {
        id: 'dnd5e',
        types: {
            ABI: "ability",
            INI: "initiative",
            ATT: "attack",
            DMG: "damage",
            SKI: "skill",
            TOOL: "tool"
        },
        options: {
            "initiative": false,
            "attacks": true,
            "damage": false,
            "abilities": true,
            "skill": true,
            "tool": true
        }
    },
    PF2E: {
        id: 'pf2e',
        types: {
            ATT: "attack-roll",
            SAV: "saving-throw",
            PER: "perception-check",
            SKI: "skill-check",
            DMG : "damage-roll",
            INI: "initiative",
            DSV: "flat-check"
        },
        options: {
            "initiative": false,
            "attacks": true,
            "damage": false,
            "saves": true,
            "skills": true,
            "deathsaves": true,
            "perception":true
        }
    }
}