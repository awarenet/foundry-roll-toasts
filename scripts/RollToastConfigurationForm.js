import { moduleId, flagId, ROLLCONFIG_DEFAULT } from "./utils.js";
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
            //contentClasses: ["standard-form"],
            icon: "fa-solid fa-triangle-exclamation",
            title: "ROLLTOAST.configTitle",

        }
    }

    static async submission(event, form, formData) {
        await game.user.setFlag(moduleId,flagId,formData.object)
        Hooks.call(`${moduleId}.settings`)
    }

    static PARTS = {
        form: {
            template: `modules/${moduleId}/templates/toast-config.hbs`
        }
    }
    /** @override */
    async _prepareContext(_options) {
        const config = game.user.getFlag(moduleId,flagId);
        return config?config:ROLLCONFIG_DEFAULT;
    }

}