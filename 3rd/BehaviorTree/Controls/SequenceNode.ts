import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode";
import { TreeNode } from "../TreeNode";

/**
 * @brief The SequenceNode is used to tick children in an ordered sequence.
 * If any child returns RUNNING, previous children will NOT be ticked again.
 *
 * - If all the children return SUCCESS, this node returns SUCCESS.
 *
 * - If a child returns RUNNING, this node returns RUNNING.
 *   Loop is NOT restarted, the same running child will be ticked again.
 *
 * - If a child returns FAILURE, stop the loop and return FAILURE.
 *   Restart the loop only if (reset_on_failure == true)
 *
 */
export class SequenceNode extends ControlNode{
    private mCurrentChildIdx:number = 0;
    public constructor(name:string){
        super(name);
        this.SetRegistrationID("Sequence");
    }
    
    public Halt(): void {
        this.mCurrentChildIdx = 0;
        super.Halt();
    }
    public Tick(): NodeStatus {
        let children_count:number = this.mChildrenNodes.length;
        this.SetStatus(NodeStatus.RUNNING);
        while (this.mCurrentChildIdx < children_count){
            let node:TreeNode = this.mChildrenNodes[this.mCurrentChildIdx];
            let childStatus:NodeStatus = node.ExecuteTick();
            switch (childStatus){
                case NodeStatus.RUNNING:
                    return childStatus;
                case NodeStatus.FAILURE:
                    // Reset on failure
                    this.HaltChildrens();
                    this.mCurrentChildIdx = 0;
                    return childStatus;
                case NodeStatus.SUCCESS:
                    this.mCurrentChildIdx++;
                    break;
                case NodeStatus.IDLE:
                    throw "A child node must never return IDLE";
            }
        }
        // The entire while loop completed. This means that all the children returned SUCCESS.
        if (this.mCurrentChildIdx == children_count){
            this.HaltChildrens();
            this.mCurrentChildIdx = 0;
        }
        return NodeStatus.SUCCESS;
    }   
}