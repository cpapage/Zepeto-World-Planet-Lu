import { Collider } from 'UnityEngine';
import {ZepetoCharacter, ZepetoPlayer } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationController from './AnimationController';

/**This enum is the zone types. So far there is just water. */
export enum ZoneType
{
    WATER
}

/**
 * This script causes a zone to trigger the player's animations. For example, it can cause the player to swim while in water.
 * @author Chris Papageorge
 */
export default class ZoneTrigger extends ZepetoScriptBehaviour {
    public zoneType: ZoneType;
    
    public OnTriggerEnter(other: Collider)
    {
        if (other.gameObject.tag == "PLAYER")
        {
            let animController: AnimationController = other.GetComponent<AnimationController>();
            if (animController == undefined) { console.error("Couldn't Find an Animator"); }
            this.ApplyZone(animController);
        }
    }
    
    public OnTriggerExit(other: Collider)
    {
        if (other.gameObject.tag == "PLAYER")
        {
            let animController: AnimationController = other.GetComponent<AnimationController>();
            if (animController == undefined) { console.error("Couldn't Find an Animator"); return; }
            this.ResetZone(animController);
        }
    }
    
    public ApplyZone(animController: AnimationController)
    {
        if (animController == undefined) { console.error("Couldn't Find an Animator"); return; }
        switch(this.zoneType)
        {
            case ZoneType.WATER:
                animController.ApplyOverrideAnimation(this.zoneType);
                break;
            default:
                break;
        }
    }
    
    public ResetZone(animController: AnimationController)
    {
        animController.ResetOverrides();
    }

}