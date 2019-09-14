//7.31留言功能
var APP_ID = 'URfkqxY5iOa3IVFJ8WohECzS-gzGzoHsz';
var APP_KEY = '8G8oDsxnDJ4TTDTA4AapbOLO';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});


var query = new AV.Query('leave_msg');
query.find().then(
    function (todos) {
        let history_msg = todos.map((tgas) => tgas.attributes);
        //console.log(history_msg)
        history_msg.forEach((todo) => {
            let li = document.createElement('li');
            li.innerText = `${todo.name}: ${todo.msgvalue}`;
            msg_list.appendChild(li)
            //todo.set('isComplete', true);//这句没搞懂，不屏蔽只取到第一条
        });
        // 批量更新
        AV.Object.saveAll(todos);
    });


let postmesg = document.querySelector('#postmesg');
postmesg.onsubmit = function (e) {
    e.preventDefault();
    let namevalue = postmesg.querySelector('input[name = name]').value;
    let msgvalue = postmesg.querySelector('input[name = content]').value;
    let leave_Msg = AV.Object.extend('leave_msg');//创建表
    let leave_msg = new leave_Msg();//在表中创建数据
    if (namevalue && msgvalue !== '') {
        leave_msg.save({
            'name': namevalue,
            'msgvalue': msgvalue
        }).then(function (obj) {
            let li = document.createElement('li');
            li.innerText = `${obj.attributes.name}: ${obj.attributes.msgvalue}`;
            msg_list.appendChild(li);
            postmesg.querySelector('input[name = content]').value = '';
            postmesg.querySelector('input[name = name]').value = '';
            //console.log('存入OK')
            //console.log(obj)
        })
    } else {
        alert('请输入内容')
    }
}