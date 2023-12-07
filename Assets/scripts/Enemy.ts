import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Health from './Health'
import Entity from './Entity';
import Main from './Main';
import { GameObject } from 'UnityEngine';

/**
 * This script represents an enemy that is not a cage.
 * @author Chris Papageorge
 */
export default class Enemy extends ZepetoScriptBehaviour {
    private hp : Health;
    private EntityComponent : Entity;

    Start() {    
        this.hp = this.GetComponent<Health>();
        this.EntityComponent = this.GetComponent<Entity>();
    }

    Update()
    {
        //If the health is <= 0, then destroy the game object and remove it from the table.
        if(this.hp.health <= 0)
        {
            Main.instance.LevelManager.EntityComponents.set(this.EntityComponent.Id, null);
            GameObject.Destroy(this.gameObject);
        }
    }

}