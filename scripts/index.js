import {showToast} from './toaster.js'
CONFIG.debug.hooks = true
Hooks.once('init', () => {
    console.log('adding div');
    var elemDiv = document.createElement('ol');
    elemDiv.id = "toast-container"
    document.body.appendChild(elemDiv)
});


const abilityskillCheck = (actor, roll) => {
    //if(!isChatActive()){
        let id =`${actor._id}-${roll._total}-${Date.now()}`
        showToast({id: id, img: actor.img, title: roll.options.flavor, result: roll._total, name: actor.name})
    //}
}

const itemCheck = (item, roll) => {
    //if(!isChatActive()){
        let id =`${item._id}-${roll._total}-${Date.now()}`
        showToast({id: id, img: item.parent.img, title: roll.options.flavor, result: roll._total, name: item.parent.name})
    //}
}
const isChatActive = () => {
    const chat = document.querySelector('.active[data-tab="chat"]');
    return chat != null;
}


// ROLL Hooks
Hooks.on('dnd5e.rollAbilitySave',(actor, roll) => {
    abilityskillCheck(actor,roll);
})
Hooks.on('dnd5e.rollAttack',(item, roll) => {
    itemCheck(item,roll);
})
Hooks.on('dnd5e.rollDamage',(item, roll) => {
    itemCheck(item,roll);
})
Hooks.on('dnd5e.rollToolCheck',(actor, roll) => {
    abilityskillCheck(actor,roll);
})
Hooks.on('dnd5e.rollAbilityTest', (actor, roll) => {
    abilityskillCheck(actor,roll);
})
Hooks.on('dnd5e.rollSkill', (actor,roll) => {
    abilityskillCheck(actor,roll);
})

Hooks.on('dnd5e.rollInitiative', (actor,combatants) => {
    if(!isChatActive()){
        combatants.forEach((combatant) => {
            let id = `${combatant.actorId}-${combatant.initiative}-${Date.now()}`
            showToast({id: id, img: combatant.img, title: "Intiative", result: combatant.initiative, name: combatant.name})
        })
        
    }
})

