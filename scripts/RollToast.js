import anime from './anime.es.js';

const notifyTemplate = "modules/roll-toast/templates/toast.hbs"
loadTemplates([notifyTemplate])

export class RollToast {
    constructor(id, img, title, result, name, adv, dis, crit, fail, timeout) {
        this.id = id,
        this.img = img,
        this.title = title,
        this.result = result
        this.name = name
        this.advantage = adv
        this.disadvantage = dis
        this.crit = crit,
        this.fail = fail
        this.timeout = timeout
    }

    show = async () => {
        const notifyPanel = document.querySelector('#toast-container');
        const renderedTemplate = await renderTemplate(notifyTemplate, this);
        notifyPanel.insertAdjacentHTML('beforeend', renderedTemplate);
        document.getElementById(this.id).addEventListener('click', (ev) => {
            this.remove();
        });
        setTimeout(this.remove, this.timeout);
    }


    remove = () => {
        const ele = document.getElementById(this.id);
        const anim = anime({
            targets: ele,
            translateX: -400,
            duration: 1500,
            complete: () => {
                if (ele) {
                    ele.remove();
                }
            }
        })
        anim.play()

    }
}