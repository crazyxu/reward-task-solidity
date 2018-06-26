pragma solidity ^0.4.23;

//标准任务
contract StdTasks{
    enum State { UnInit, Created, Accepted, Completed, Cancelled}
    struct Task{
        State state;
        string name;
        string description;
        address owner;
        address worker;
        uint reward;
    }

    uint numTasks;
    mapping(uint => Task) tasks;

    constructor () public {
    }

    //添加任务，coin暂存在合约账户
    function addTask(string name, string description) public payable returns(uint taskId) {
        taskId = numTasks++;
        tasks[taskId] = Task(State.Created, name, description, msg.sender, 0, msg.value);
    }

    //查询任务详细
    function getTask(uint taskId) view public returns (State, string, string, address, address, uint) {
        Task storage task = tasks[taskId];
        return (task.state, task.name, task.description, task.owner, task.worker, task.reward);
    }

    //领取任务
    function accept(uint taskId) public returns (bool){
        Task storage task = tasks[taskId];
        if (task.state != State.Created || msg.sender == task.owner){
            return false;
        }
        task.state = State.Accepted;
        task.worker = msg.sender;
        return true;
    }

    //确认任务完成
    function confirm(uint taskId) public returns (bool) {
        Task storage task = tasks[taskId];
        if(task.state != State.Accepted || task.owner != msg.sender){
            return false;
        }
        task.state = State.Completed;
        //支付报酬
        task.worker.transfer(task.reward);
        return true;
    }

    //取消任务
    function cancel(uint taskId) public returns (bool) {
        Task storage task = tasks[taskId];
        if(task.state != State.Created || task.owner != msg.sender){
            return false;
        }
        task.state = State.Cancelled;
        //退回酬金
        task.owner.transfer(task.reward);
        return true;
    }
}