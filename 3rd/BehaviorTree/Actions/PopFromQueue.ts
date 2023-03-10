import { SyncActionNode } from "../ActionNode";
import { NodeStatus } from "../BasicTypes";

export class ProtectedQueue<T>{
    Items:Array<T> = new Array<T>;
};
/*
 * Few words about why we represent the queue as std::shared_ptr<ProtectedQueue>:
 *
 * Since we will pop from the queue, the fact that the blackboard uses
 * a value semantic is not very convenient, since it would oblige us to
 * copy the entire std::list from the BB and than copy again a new one with one less element.
 *
 * We avoid this using reference semantic (wrapping the object in a shared_ptr).
 * Unfortunately, remember that this makes our access to the list not thread-safe!
 * This is the reason why we add a mutex to be used when modyfying the ProtectedQueue::items
 *
 * */
export class PopFromQueue<T> extends SyncActionNode{
    public Tick(): NodeStatus {
        let queue:ProtectedQueue<T> = new ProtectedQueue<T>();
        
    }
}
    NodeStatus tick() override
    {
        if( getInput("queue", queue) && queue )
        {
            std::unique_lock<std::mutex> lk(queue->mtx);
            auto& items = queue->items;

            if( items.empty() )
            {
                return NodeStatus::FAILURE;
            }
            else{
                T val = items.front();
                items.pop_front();
                setOutput("popped_item", val);
                return NodeStatus::SUCCESS;
            }
        }
        else{
            return NodeStatus::FAILURE;
        }
    }

    static PortsList providedPorts()
    {
        return { InputPort<std::shared_ptr<ProtectedQueue<T>>>("queue"),
                 OutputPort<T>("popped_item")};
    }
};

/**
 * Get the size of a queue. Usefull is you want to write something like:
 *
 *  <QueueSize queue="{waypoints}" size="{wp_size}" />
 *  <Repeat num_cycles="{wp_size}" >
 *      <Sequence>
 *          <PopFromQueue  queue="{waypoints}" popped_item="{wp}" >
 *          <UseWaypoint   waypoint="{wp}" />
 *      </Sequence>
 *  </Repeat>
 */
template <typename T>
class QueueSize : public SyncActionNode
{
  public:
    QueueSize(const std::string& name, const NodeConfiguration& config)
      : SyncActionNode(name, config)
    {
    }

    NodeStatus tick() override
    {
        std::shared_ptr<ProtectedQueue<T>> queue;
        if( getInput("queue", queue) && queue )
        {
            std::unique_lock<std::mutex> lk(queue->mtx);
            auto& items = queue->items;

            if( items.empty() )
            {
                return NodeStatus::FAILURE;
            }
            else{
                setOutput("size", int(items.size()) );
                return NodeStatus::SUCCESS;
            }
        }
        return NodeStatus::FAILURE;
    }

    static PortsList providedPorts()
    {
        return { InputPort<std::shared_ptr<ProtectedQueue<T>>>("queue"),
                 OutputPort<int>("size")};
    }
};
