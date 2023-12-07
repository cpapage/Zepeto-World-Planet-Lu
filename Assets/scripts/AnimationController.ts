import {KeyValuePair$2, List$1 } from 'System.Collections.Generic';
import { AnimationClip, Animator, AnimatorOverrideController, Resources, RuntimeAnimatorController } from 'UnityEngine';
import {CharacterState, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Main from './Main';
import { ZoneType } from './TerrainZoneTrigger';

export default class AnimationController extends ZepetoScriptBehaviour {
    private animator: Animator;
    
    public Start()
    {
        this.animator = this.GetComponentInChildren<Animator>();
    }
    
    public ApplyOverrideAnimation(type: ZoneType)
    {
        let state: CharacterState = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.CurrentState;
        
        //Override the animations based on the type enum
        switch(type)
        {
            case ZoneType.WATER:
                this.animator.runtimeAnimatorController = Main.instance.swimAnimatorController;
                break;
        }
        
        this.animator.SetInteger("State",state);
    }

    public ApplyDeathAnimation()
    {
        this.animator.runtimeAnimatorController = Main.instance.DeathAnimatorController;
    }
    
    public ResetOverrides()
    {
        //Reset Animations back to original states
        let state: CharacterState = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.CurrentState;
        this.animator.runtimeAnimatorController = Main.GetInstance().defaultAnimatorController;
        this.animator.SetInteger("State",state);
    }

}