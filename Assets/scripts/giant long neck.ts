import { Animator, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'

/**
 * This scripts implements behavior for the adult long necked dinosaur.
 * @author Chris Papageorge
 */
export default class GiantLongNeck extends ZepetoScriptBehaviour {
    public range: number;
    private my_animator: Animator;
    private headPos: int;

    Start() {    
        this.my_animator = this.GetComponent<Animator>();
        this.headPos = 0;
    }

    Update()
    {
        if (ZepetoPlayers.instance.LocalPlayer !== null)
        {
            //determine the quadrant the player is on.
            let pPos: Vector3 = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.transform.position;
            let slopeX: number = pPos.x - this.transform.position.x;
            let slopeY: number = pPos.y - this.transform.position.y;
            let slopeZ: number = pPos.z - this.transform.position.z;
            let magnitude: number = Math.sqrt(slopeX*slopeX + slopeY*slopeY + slopeZ*slopeZ);
            if(magnitude <= this.range)
            {
                //let angleInRadians: number = (slopeZ == 0) ? ((slopeX >= 0) ? Math.PI/2 : -Math.PI/2) : Math.atan(slopeX/slopeZ);
                if(slopeZ <= 0)
                    this.headPos = 1;
                /*else if(slopeZ > 0 && slopeX <= 0)
                    this.headPos = 2;
                else if(slopeZ > 0 && slopeX > 0)
                    this.headPos = 3;*/
                else
                    this.headPos = 0;
            }
            else
                this.headPos = 0;
        }

        this.my_animator.SetInteger("head pos", this.headPos);
    }

}