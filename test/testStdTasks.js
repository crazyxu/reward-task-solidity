var StdTasks = artifacts.require("./StdTasks.sol")

contract("StdTasks", async function(accounts){
    var owner = web3.eth.coinbase
    var worker = accounts[1]
    //mock task
    var taskId = 1
    var taskName = "任务名称"
    var taskSecs = "任务描述"
    var taskSerial = "123456"
    var reward = 1
    var rewardWei =  web3.toWei(reward, "ether")
    //测试正常流程
    it("Test Compelet", async function(){
        var instance = await StdTasks.deployed()
        var workerCoin = await getBalance(worker)
        //创建task,赏金1ether
        var tx = await instance.addTask(taskName, taskSecs, taskSerial, {from: owner, value: rewardWei})
        //event
        let event = tx.logs[0].args
        assert.equal(event.serial, taskSerial)
        assert.equal(event.taskId.toNumber(), taskId)
        //接受
        await instance.accept(taskId, {from: worker})
        //确认完成
        await instance.confirm(taskId, {from: owner})
        //验证coin
        var workerCoinAfter = await getBalance(worker)
        assert.isAbove(workerCoinAfter, workerCoin)
        //确认状态
        var task = await instance.getTask(taskId)
        //验证task和输入一致
        assert.equal(task[0].toNumber(), 3)
        assert.equal(task[1], taskName)
        assert.equal(task[2], taskSecs)
        assert.equal(task[5].toNumber(), rewardWei)
    })
    //测试取消流程
    it("Test Cancel", async function(){
        var instance = await StdTasks.deployed()
        var ownerCoin = await getBalance(owner)
        //创建task,赏金1ether
        await instance.addTask(taskName, taskSecs, taskSerial, {from: owner, value: rewardWei})
        var ownerCoin2 = await getBalance(owner)
        //取消任务
        await instance.cancel(taskId, {from: owner})
        //验证coin
        var ownerCoin3 = await getBalance(owner)
        assert.isAbove(ownerCoin, ownerCoin2)
    })

})

async function getBalance(addr){
    return web3.eth.getBalance(addr).toNumber()
}