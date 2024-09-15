
import { moduleId,System } from './utils.js';
import { RollToastConfigurationForm } from './RollToastConfigurationForm.js'
import {DnD5eRollToastController } from './DnD5eRollToastController.js'
import { Pf2eRollToastController } from './Pf2eRollToastController.js';

var rollToastController;
const setup = () => { 
    if(rollToastController!=null){
        rollToastController.destroy()
    }
    rollToastController = null;
    switch(game.system.id){
        case(System.DND5E.id):
            rollToastController = new DnD5eRollToastController();
            break;
        case(System.PF2E.id):
            rollToastController = new Pf2eRollToastController();
            break;
        default:
            console.log("No Valid system for roll toasts.")
    }
}
// CONFIG.debug.hooks = true
Hooks.once('init', () => {
    var elemDiv = document.createElement('ol');
    elemDiv.id = "toast-container"
    document.body.appendChild(elemDiv)
    game.settings.registerMenu(moduleId, "rollToastsMenu", {
        name: "Roll Toasts",
        label: "User Setup",      // The text label used in the button
        icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
        type: RollToastConfigurationForm,   // A FormApplication subclass
        restricted: false                   // Restrict this submenu to gamemaster only?
    });

});
Hooks.once('ready', setup);
Hooks.on(`${moduleId}.settings`, setup)

