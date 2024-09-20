import { moduleId, flagId, ROLLCONFIG_DEFAULT_OPTIONS, System } from "./utils.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api


export class RollToastConfigurationForm extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        form: {
            handler: RollToastConfigurationForm.submission,
            submitOnChange: false,
            closeOnSubmit: true
        },
        window: {
            icon: "fa-solid fa-triangle-exclamation",
            title: "ROLLTOAST.configTitle",

        }
    }

    static async submission(event, form, formData) {
        await game.user.setFlag(moduleId,flagId,formData.object)
        Hooks.call(`${moduleId}.settings`)
    }

    static PARTS = {
        pf2e: {
            template: `modules/${moduleId}/templates/toast-config-pf2e.hbs`
        },
        dnd5e: {
            template: `modules/${moduleId}/templates/toast-config-dnd5e.hbs`
        }
    }
    /** @override */
    async _prepareContext(_options) {
        const defaultOptions = {...ROLLCONFIG_DEFAULT_OPTIONS,...Object.values(System).filter(x => x.id == game.system.id)[0].options};
        const config = game.user.getFlag(moduleId,flagId);
        _options.parts = [game.system.id]
        return config?config:defaultOptions;
    }

}