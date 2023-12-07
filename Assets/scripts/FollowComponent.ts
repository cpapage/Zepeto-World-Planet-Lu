import { Animator, GameObject, Vector3 } from 'UnityEngine'
import { NavMeshAgent } from 'UnityEngine.AI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Entity from './Entity.js'
import Main from './Main'
import { EntityType } from './Config.js';

/**
 * This method implements the follow component for any entity that follows the player or other things.
 * @author Chris Papageorge
 */
export default class FollowComponent extends ZepetoScriptBehaviour {
    public FollowTarget : GameObject = null;
    public range : number;
    public entityComponent : Entity;
    private NavMeshAgent : NavMeshAgent = null;
    private my_animator: Animator;
    private is_following: boolean;

    /**This method determines if the object is still following something. */
    public get isMoving(): boolean
    {
        return this.NavMeshAgent.remainingDistance <= this.NavMeshAgent.stoppingDistance;
    }

    Start() {    
        this.NavMeshAgent = this.GetComponent<NavMeshAgent>();
        this.my_animator = this.GetComponent<Animator>();
        this.entityComponent = this.GetComponent<Entity>();
        this.is_following = false;
    }

    Update() {
        let closestEnemy : Entity = null;                   //The closest entity to this entity
        let shortestDistance : number = Number.MAX_VALUE;   //The shortest distance
        
        //check if this entity is an ally.
        if(this.entityComponent.EntityType == EntityType.ALLY)
        {
            //Iterate through all the entities in the entity map.
            Main.instance.LevelManager.EntityComponents.forEach(element => {
                //check if the current element is not null and is an ENEMY.
                if(element != null && element.EntityType == EntityType.ENEMY)
                {
                    //Calculate the distance between this and the other entity, and then check if the distance is shorter than the shortest distance.
                    const Distance : number = Vector3.Distance(this.gameObject.transform.position, element.gameObject.transform.position);
                    if(Distance < shortestDistance)
                    {
                        //If it is, update the new shortest distance and the new closest enemy.
                        shortestDistance = Distance;
                        closestEnemy = element;
                    }
                }
            })
        }

        //if the closest entity is in range, then follow that entity; otherwise, follow the player.
        if(shortestDistance <= this.range)
            this.NavMeshAgent.SetDestination(closestEnemy.transform.position);
        else if (ZepetoPlayers.instance.LocalPlayer !== null)
             this.NavMeshAgent.SetDestination(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position);

        //If this entity is following, then set the "is following" boolean to true in the animator controller.
        this.is_following = !this.isMoving;
        this.my_animator.SetBool("is following", this.is_following);
    }

}