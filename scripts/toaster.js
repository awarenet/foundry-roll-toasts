import anime from './anime.es.js';

const notifyTemplate = "modules/roll-toast/templates/toast.hbs"
loadTemplates([notifyTemplate])


export const showToast = async({id,img, title, result,name}) => {
    const toast = new RollToast(id,img,title,result,name);
    toast.show();
}

class RollToast{
    constructor(id,img,title,result,name){
        this.id = id,
        this.img = img,
        this.title = title,
        this.result = result
        this.name = name
    }

    show = async() => {
        const notifyPanel = document.querySelector('#toast-container');
        const renderedTemplate = await renderTemplate(notifyTemplate, {id: this.id,img: this.img,title: this.title,result: this.result, name: this.notifyTemplate});
        notifyPanel.insertAdjacentHTML('beforeend', renderedTemplate);
        document.getElementById(this.id).addEventListener('click', (ev) => {
            this.remove();
        });
        //setTimeout(this.remove,3000);
    }


    remove = () => {
        const ele = document.getElementById(this.id);
        ele.remove();
    }
}