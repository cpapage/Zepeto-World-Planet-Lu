import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from 'UnityEngine.UI';
import { GameObject, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import Health from './Health'

/**
 * This script implements the shoot button which the player can use to shoot bullets.
 * @author Chris Papageorge
 */
export default class ShootButton extends ZepetoScriptBehaviour {
    public MyButton : Button;

    /**The game object that will be used as the bullet. */
    public projectile: GameObject;
    
    Start() {    
        //Add a listener that makes the player fire a bullet in the direction he/she is facing.
        this.MyButton.onClick.AddListener(() => {
            //The player cannot fire bullets if he has no health.
            let playerHP : Health = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<Health>();
            if(playerHP.health > 0)
            {
                //ensure the bullet cannot spawn atop the player, or it will collide with the player.
                let pPos: Vector3 = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position;
                let ydisplacement : number = 1;
                pPos.y += ydisplacement;
                pPos.x += ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.forward.x;
                pPos.y += ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.forward.y;
                pPos.z += ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.forward.z;
                const bullet : GameObject = GameObject.Instantiate(this.projectile, pPos, Quaternion.identity) as GameObject;
                bullet.transform.forward = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.forward;
            }
        })
    }
}