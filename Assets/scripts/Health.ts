import { Collider, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Entity from './Entity';
import { EntityType, GameState } from './Config';
import Main from './Main';
import UIManager from './UIManager';

/**
 * This class implements the health component.
 * @author Chris Papageorge
 */
export default class Health extends ZepetoScriptBehaviour {
    public maxHealth: number;
    @HideInInspector() public health: number;
    public EntityComponent : Entity;

    Start()
    {
        this.health = this.maxHealth;
        this.EntityComponent = this.GetComponent<Entity>();
    }

    /**
     * This method reduces health.
     * @param damage The number of health to lose.
     */
    takeDamage(damage: number)
    {
        this.health -= damage;
        //If this is a player, then update the GUI.
        if(this.EntityComponent.EntityType == EntityType.PLAYER)
        {
            UIManager.GetInstance().UpdateUI();

            //If the player health reaches 0, then end the game.
            if(this.health <= 0)
                Main.instance.SetGameState(GameState.COMPLETE_GAME);
        }
    }
    
    /**
     * This method adds health.
     * @param heal The number of health to add.
     */
    gainHealth(heal: number)
    {
        this.health += heal;
        if(this.health > this.maxHealth)
            this.health = this.maxHealth;
    }

    OnCollisionEnter(other: Collider)
    {
        if(other.gameObject.tag == "PROJECTILE")
        {
            this.takeDamage(10);
        }
        else if(other.gameObject.tag == "TRICERATOPS RAM" && this.EntityComponent.EntityType == EntityType.ENEMY)
        {
            this.takeDamage(25);
        }
        else if(other.gameObject.tag == "SCRATCH" && this.EntityComponent.EntityType == EntityType.ENEMY)
        {
            this.takeDamage(25);
        }
        else if(other.gameObject.tag == "ELEPHANT WHIP" && this.EntityComponent.EntityType == EntityType.ENEMY)
        {
            this.takeDamage(50);
        }
    }
}