import { ActionNodeBase } from "./ActionNode";
import { NodeType } from "./BasicTypes";
import { ConditionNode } from "./ConditionNode";
import { ControlNode } from "./ControlNode";
import { DecoratorNode } from "./DecoratorNode";
import { TreeNode } from "./TreeNode"
type Visitor = (node:TreeNode)=>void;

export function GetType<T extends TreeNode >(node:T):NodeType{
    if(node instanceof(ActionNodeBase)) return NodeType.ACTION
    if(node instanceof(ConditionNode)) return NodeType.CONDITION
    if(node instanceof(SubtreeNode)) return NodeType.SUBTREE
    if(node instanceof(SubtreePlusNode)) return NodeType.SUBTREE
    if(node instanceof(DecoratorNode)) return NodeType.DECORATOR
    if(node instanceof(ControlNode)) return NodeType.CONTROL
    return NodeType.UNDEFINED;
} 