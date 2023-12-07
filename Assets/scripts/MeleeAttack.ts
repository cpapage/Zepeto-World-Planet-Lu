import { Animator, GameObject, Quaternion, Transform, Vector3, WaitForSeconds } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Entity from './Entity';
import { EntityType } from './Config';
import Main from './Main';

/**
 * This script implements a melee attack for those who have melee attacks.
 * @author Chris Papageorge
 */
export default class MeleeAttack extends ZepetoScriptBehaviour {

    /**The point where the projectile will spawn. */
    public SlashPoint : Transform;

    /**The Wave game object. */
    public WaveObject : GameObject;

    /**The targeting range. */
    public AttackRange : number;

    /**The hitspeed. */
    public AttackDelayInSeconds : number;

    private entityComponent : Entity;
    private my_Animator : Animator;

    Start() {    
        //Get the animator and entity components, and start the melee coroutine.
        this.my_Animator = this.GetComponent<Animator>();
        this.entityComponent = this.GetComponent<Entity>();
        this.StartCoroutine(this.MeleeCoroutine());
    }

    /**
     * This Method does the melee coroutine. If an enemy is in range, it will do a melee attack,
     * and it will do each one according to the attack delay. 
     */
    private *MeleeCoroutine()
    {
        while(true)
        {
            let inRange : boolean = false;

            if(this.entityComponent.EntityType == EntityType.ALLY)
            {
                //Go through the list of entities to find if an enemy is in range.
                Main.instance.LevelManager.EntityComponents.forEach(element => {
                    if(element != null && element.EntityType == EntityType.ENEMY)
                    {
                        //Compute the distance between this and the enemy.
                        const Distance : number = Vector3.Distance(this.gameObject.transform.position, element.gameObject.transform.position);
                        
                        //If an enemy is in range, then set the inRange boolean to true.
                        if(Distance <= this.AttackRange)
                        {
                            inRange = true;
                        }
                    }
                })
            }
    
            //If an enemy is in range, then play the melee animation, and create the wave object,
            //and then wait for the attack delay in seconds.
            if(inRange)
            {
                this.my_Animator.SetTrigger("attack");
                const Slash : GameObject = GameObject.Instantiate(this.WaveObject, this.SlashPoint.position, this.SlashPoint.rotation) as GameObject;
                Slash.transform.forward = this.SlashPoint.forward;
                yield new WaitForSeconds(this.AttackDelayInSeconds);
            }
            yield null;
        }
    }

}