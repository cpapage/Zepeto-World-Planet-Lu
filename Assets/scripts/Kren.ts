import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Health from './Health';
import { GameObject } from 'UnityEngine';
import Main from './Main';
import Entity from './Entity';

/**
 * This script implements Lord Kren, the main antagonist of the game.
 * @author Chris Papageorge
 */
export default class Kren extends ZepetoScriptBehaviour {
    private health : Health;
    private EntityComponent : Entity;

    Start()
    {
        this.health = this.GetComponent<Health>();
        this.EntityComponent = this.GetComponent<Entity>();
    }
    
    Update()
    {
        //If his health is less than or equal to 0, delete him, and set the defeatedLordKren boolean to true.
        if(this.health.health <= 0)
        {
            Main.instance.LevelManager.EntityComponents.set(this.EntityComponent.Id, null);
            Main.instance.LevelManager.defeatedLordKren = true;
            GameObject.Destroy(this.gameObject);
        }
    }

}