import { GameObject, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import Entity from './Entity';
import Main from './Main';
import { EntityType } from './Config';

export default class LookAt extends ZepetoScriptBehaviour {
    public radius: number;  //targeting range
    public joint: GameObject;
    public entityComponent : Entity;
    public Is_Caged : boolean;
    @HideInInspector() public is_facing : boolean;
    private idir: Vector3;  //initial direction

    Start()
    {
        if(this.joint == null)
            this.idir = this.transform.localEulerAngles;
        else
            this.idir = this.joint.transform.localEulerAngles;
        this.entityComponent = this.GetComponent<Entity>();
        this.is_facing = false;
    }

    Update()
    {
        let closestEnemy : Entity = null;
        let shortestDistance : number = Number.MAX_VALUE;
        
        if(!this.Is_Caged && this.entityComponent.EntityType == EntityType.ALLY)
        {
            Main.instance.LevelManager.EntityComponents.forEach(element => {
                if(element != null && element.EntityType == EntityType.ENEMY)
                {
                    const Distance : number = Vector3.Distance(this.gameObject.transform.position, element.gameObject.transform.position);
                    if(Distance < shortestDistance)
                    {
                        shortestDistance = Distance;
                        closestEnemy = element;
                    }
                }
            })
        }

        if(shortestDistance <= this.radius)
        {
            let enemyPos : Vector3 = closestEnemy.gameObject.transform.position;
            enemyPos.y += 1;
            this.lookAt(enemyPos);
        }
        else if(ZepetoPlayers.instance.LocalPlayer !== null)
        {
            let playerPos : Vector3 = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.transform.position;
            playerPos.y += 1;
            this.lookAt(playerPos);
        }
    }

    lookAt(target : Vector3)
    {
        let magnitude: number = Vector3.Distance(this.gameObject.transform.position, target);
        if(magnitude <= this.radius)
        {
            if(this.joint == null)
                this.transform.LookAt(target);
            else
            {
                this.joint.transform.LookAt(target);
                let currentAngle : number = this.joint.transform.localEulerAngles.y;
                if(this.idir.y <= 360 && this.idir.y >= 180 && currentAngle >= 0 && currentAngle < 90)
                    currentAngle = 360;
                else
                { 
                    currentAngle = Math.min(currentAngle, this.idir.y + 90);
                    currentAngle = Math.max(currentAngle, this.idir.y - 90);
                }
                let vec : Vector3 = new Vector3(this.joint.transform.localEulerAngles.x, currentAngle, this.joint.transform.localEulerAngles.z);
                this.joint.transform.localEulerAngles = vec;
            }
            this.is_facing = true;
        }
        else
        {
            this.is_facing = false;
            if(this.gameObject.tag != "LORD KREN")
            {
                if(this.joint == null)
                    this.transform.localEulerAngles = this.idir;
                else
                    this.joint.transform.localEulerAngles = this.idir;
            }
        }        
    }
}