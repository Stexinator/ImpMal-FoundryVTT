import ItemTraitsForm from "../../apps/item-traits";
import ImpMalSheetMixin from "../mixins/sheet-mixin";


export default class ImpMalItemSheet extends ImpMalSheetMixin(ItemSheet)
{
    static get defaultOptions() 
    {
        const options = super.defaultOptions;
        options.classes = options.classes.concat(["impmal", "item"]);
        options.width = 400;
        options.height = 600;
        options.resizable = true;
        options.tabs = [{ navSelector: ".sheet-tabs", contentSelector: ".tab-content", initial: "main" }];
        options.dragDrop.push({dragSelector : ".list .list-item:not(.no-drag)"});
        options.scrollY.push(".tab-content");
        return options;
    }

    get template() 
    {
        return `systems/impmal/templates/item/item-${this.item.type}.hbs`;
    }

    async _render(...args)
    {
        await super._render(...args);
        if (!this.element[0].classList.contains(this.item.type))
        {
            this.element[0].classList.add(this.item.type);
        }
    }

    async _onDrop(ev)
    {
        let dropData = JSON.parse(ev.dataTransfer.getData("text/plain"));
        if (dropData.type == "Item")
        {
            let item = await Item.implementation.fromDropData(dropData);
            if (item)
            {
                return this._onDropItem(item);
            }
            else 
            {
                super._onDrop(ev);
            }
        }
        else 
        {
            super._onDrop(ev);
        }
    }

    _onDropItem(item)
    {
        return this[`_onDropItem${item.type[0].toUpperCase() + item.type.substring(1)}`]?.(item);
    }

    _getHeaderButtons() 
    {
        let buttons = super._getHeaderButtons();
        buttons.unshift(
            {
                class: "post",
                icon: "fas fa-comment",
                onclick: () => this.item.postItem()
            });
        return buttons;
    }

    async getData() 
    {
        let data = super.getData();
        data.system = data.item.toObject(true).system; // Use source data to avoid ammo/mods from showing up in the sheet
        data.isPhysical = Object.keys(game.template.Item).filter(i => game.template.Item[i].templates?.includes("physical")).includes(data.item.type);
        data.conditions = this.formatConditions(data).filter(i => data.item.system.allowedConditions.includes(i.id));
        data.enriched = foundry.utils.expandObject({
            "notes.player" : await TextEditor.enrichHTML(data.item.system.notes?.player, {async: true}),
            "notes.gm" : await TextEditor.enrichHTML(data.item.system.notes?.gm, {async: true}),
            "patron.notes" : await TextEditor.enrichHTML(data.item.system.patron?.notes, {async: true}),
            "character.notes" : await TextEditor.enrichHTML(data.item.system.character?.notes, {async: true})
        });
        return data;
    }

    activateListeners(html) 
    {
        super.activateListeners(html);
        if (!this.isEditable)
        {
            return false;
        }
        
        this.addGenericListeners(html);
        html.find(".edit-traits").click(this._onEditTraits.bind(this));
        html.find(".choice-config").click(this._onChoiceConfig.bind(this));
    }

    _onEditTraits() 
    {
        new ItemTraitsForm(this.item).render(true);
    }

    _onChoiceConfig(ev) 
    {
        new game.impmal.apps.ChoiceConfig(this.item, {path : ev.currentTarget.dataset.path}).render(true);
    }
}