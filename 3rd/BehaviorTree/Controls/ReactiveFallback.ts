import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode";
import { TreeNode } from "../TreeNode";

/**
 * @brief The ReactiveFallback is similar to a ParallelNode.
 * All the children are ticked from first to last:
 *
 * - If a child returns RUNNING, continue to the next sibling.
 * - If a child returns FAILURE, continue to the next sibling.
 * - If a child returns SUCCESS, stop and return SUCCESS.
 *
 * If all the children fail, than this node returns FAILURE.
 *
 * IMPORTANT: to work properly, this node should not have more than
 *            a single asynchronous child.
 *
 */
export class ReactiveFallback extends ControlNode{
    public Tick(): NodeStatus {
        let failureCount:number = 0;
        for(let index = 0;index < this.mChildrenNodes.length ; index++){
            let node:TreeNode = this.mChildrenNodes[index];
            let childStatus:NodeStatus = node.ExecuteTick();
            switch(childStatus){
                case NodeStatus.RUNNING:{
                    for(let i = index + 1 ; i < this.ChildrenCount();i++)
                        this.HaltChild(i);
                    return NodeStatus.RUNNING;
                }
                case NodeStatus.FAILURE:
                    failureCount++;
                    break;
                case NodeStatus.SUCCESS:
                    this.HaltChildrens();
                    return NodeStatus.SUCCESS;
                case NodeStatus.IDLE:
                    throw "A child node must never return IDLE";
            }
        } 
        if(failureCount == this.ChildrenCount()){
            this.HaltChildrens();
            return NodeStatus.FAILURE;
        }
        return NodeStatus.RUNNING;
    }
}