import { ChoiceModel } from "../shared/choices";
import { StandardItemModel } from "./standard";
let fields = foundry.data.fields;

export class RoleModel extends StandardItemModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.skills = new fields.SchemaField({
            value : new fields.NumberField({min: 0}),
            list : new fields.ArrayField(new fields.StringField())
        }),
        schema.specialisations = new fields.EmbeddedDataField(RoleSpecialisationsModel);
        schema.equipment = new fields.EmbeddedDataField(ChoiceModel);
        schema.talents = new fields.EmbeddedDataField(TalentListModel);
        return schema;
    }

    computeDerived()
    {
    }
}

class TalentListModel extends DocumentReferenceListModel 
{
    
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.number = new fields.NumberField({min : 0});
        return schema;
    }
}


class RoleSpecialisationsModel extends DocumentReferenceListModel
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.value = new fields.NumberField();
        schema.keys = new fields.ArrayField(new fields.StringField());
        return schema;
    }
}