
export const moduleId = "roll-toast"
export const flagId = "roll-toast-config"
export const isChatActive = () => {
    const chat = document.querySelector('.active[data-tab="chat"]');
    return chat != null;
}

export const ROLLCONFIG_DEFAULT = 
    {
        "enable": true,
        "chatShow": true,
        "toastTimeout": 3,
        "showOwn": true,
        "showOthers": true,
        "initiative": false,
        "attacks": true,
        "damage": false,
        "abilities": true,
        "skill": true,
        "tool": true
    }

    export const Types = {
        ABI: "ability",
        INI: "initiative",
        ATT: "attack",
        DMG: "damage",
        SKI: "skill",
        TOOL: "tool"
    }