import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LookAt from './LookAt'
import { GameObject, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';

/**
 * This script implements the shooting mechanics for NPCs.
 * @author Chris Papageorge
 */
export default class Shoot extends ZepetoScriptBehaviour {

    /**The point where the bullet will spawn */
    public BulletOrigin : GameObject = null;

    /**The bullet game object */
    public Bullet : GameObject = null;

    public FireRatePerSecond : number = 0;
    public range : number = 0;

    Start() {    
        this.StartCoroutine(this.FireCoroutine());
    }

    /**
     * This Coroutine will detect if the player is in range, and then the enemy will start firing at the player
     * according to the fire rate.
     */
    private *FireCoroutine()
    {
        while(true)
        {
            //Calculate the distance between this and the player
            let playerPos : Vector3 = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position;
            let distance : number = Vector3.Distance(playerPos, this.transform.position);

            //If the player is in range, then fire at the player.
            if(distance <= this.range)
            {       
                this.InstantiateProjectile();
                yield new WaitForSeconds(this.FireRatePerSecond);
            }
            yield null;
        }
    }

    /**
     * This method instantiates a projectile that goes straight towards the player's position.
     */
    private InstantiateProjectile()
    {
        const projectile : GameObject = GameObject.Instantiate(this.Bullet, this.BulletOrigin.transform.position, this.BulletOrigin.transform.rotation) as GameObject;
        let PlayerPos : Vector3 = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position;

        //This ensures the projectile does not fly towards the player's feet.
        PlayerPos.y += 1;

        //point to the player's position so that the projectile flies towards the player.
        this.point(projectile, PlayerPos);
    }

    /**
     * This method makes the projectile fly towards its target. It does this by creating a vector
     * that points to the target, and then setting the projectile's forward direction as that vector.
     */
    private point(projectile: GameObject, target: Vector3)
    {
        let x : number = target.x - this.BulletOrigin.transform.position.x;
        let y : number = target.y - this.BulletOrigin.transform.position.y;
        let z : number = target.z - this.BulletOrigin.transform.position.z;
        let bulletDir : Vector3 = new Vector3(x, y, z);
        projectile.transform.forward = bulletDir;
    }
}