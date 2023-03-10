import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";
import { TreeNode } from "../TreeNode";

export class SubtreeNode extends DecoratorNode{
    constructor(name:string){
        super(name);
        this.SetRegistrationID("SubTree");
    }

    public Tick(): NodeStatus {
        let prev_status:NodeStatus = this.Status();
        if(prev_status == NodeStatus.IDLE)
            this.SetStatus(NodeStatus.RUNNING);
        let childNode:TreeNode|undefined = this.Child();
        if( childNode == undefined )
            throw "child is empty";
        return childNode.ExecuteTick();
    }
}