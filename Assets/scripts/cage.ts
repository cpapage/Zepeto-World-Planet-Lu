import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Health from './Health'
import Entity from './Entity'
import Main from './Main'
import { EntityType } from './Config';

/**
 * This is the script for a cage.
 * @author Chris Papageorge
 */
export default class cage extends ZepetoScriptBehaviour {
    public prisoner: GameObject;
    public EntityComponent : Entity;
    private hp: Health;

    Start() {    
        this.hp = this.GetComponent<Health>();
        this.EntityComponent = this.GetComponent<Entity>();
    }

    Update()
    {
        //check if the cages hp is less than or equal to 0.
        if(this.hp.health <= 0)
        {
            //instantiate the game object that is a prisoner and get its entity component.
            const freed : GameObject = GameObject.Instantiate(this.prisoner, this.transform.position, this.transform.rotation) as GameObject;
            const freedEntityComponent : Entity = freed.GetComponent<Entity>();

            //assign the id to the next open table entry and set the entity type to ALLY.
            freedEntityComponent.Id = ++Main.instance.LevelManager.lastIndex;
            freedEntityComponent.EntityType = EntityType.ALLY;

            //Add the freed prisoner to the table and remove its cage from the table.
            Main.instance.LevelManager.EntityComponents.set(freedEntityComponent.Id, freedEntityComponent);
            Main.instance.LevelManager.EntityComponents.set(this.EntityComponent.Id, null);

            //Destroy the prison game object.
            GameObject.Destroy(this.gameObject);
        }
    }

}