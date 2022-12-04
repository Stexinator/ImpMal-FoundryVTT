export class ImpMalActor extends Actor 
{
    
    async _preCreate(data, options, user) 
    {
        await super._preCreate(data, options, user);
        this.updateSource(this.system.preCreateData(data));
    }

    async _preUpdate(data, options, user) 
    {
        await super._preUpdate(data, options, user);
        this.system.preUpdateChecks(data);
    }

    prepareBaseData()
    {
        this.system.computeBase();
        this.itemCategories = this.itemTypes;
    }

    prepareDerivedData() 
    {
        this.system.computeDerived(this.itemCategories);
    }


}