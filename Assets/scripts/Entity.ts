import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { EntityType } from './Config'

/**
 * This script represents any entity
 * @author Chris Papageorge
 */
export default class Entity extends ZepetoScriptBehaviour {
    public Id : number = null;
    public EntityType : EntityType = null;

    /**
     * This method sets the entity's id.
     * @param id
     */
    Init(id : number) {
        this.Id = id;
    }
}