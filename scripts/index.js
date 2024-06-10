
import { moduleId } from './utils.js';
import { RollToastConfigurationForm } from './RollToastConfigurationForm.js'
import { RollToastController } from './RollToastController.js';
//CONFIG.debug.hooks = true
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
Hooks.once('ready', () => {
    new RollToastController();
});


