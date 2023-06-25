// let request = window.indexedDB.open('group', Date.now())
let request = window.indexedDB.open('group', '1')
let db = null
let db_table = null

request.onerror = function(error) {
    console.log('IndexedDB 打开失败', error)
}

request.onupgradeneeded = function(res) {
    console.log('IndexedDB 升级成功', res)
    db = res.target.result
    db_table = db.createObjectStore('group', { keyPath: 'id' })
    db_table.createIndex('indexName', 'name', { unique: false })
}

request.onsuccess = function(res) {
    console.log('IndexedDB 打开成功', res)
    db = res.target.result
    /*
        *新建事务
        *@params 数据仓库的数组
        *@params 写入模式
    */
    // readwrite没有加默认会read-only,无法更新
    let store = db.transaction(['group'], 'readwrite').objectStore('group') 
    // addData(store)
    // updata(store)
    // delData(store)
    // getData(store)
    // getAll(store)
    // getDataByOptions(store)

    // addDataRegular(store)
    // deleteDataRegular(store)

    addDataBatch(store)
};

// 添加数据
function addData (store) {
    /*
        *add方法添加数据
        *@params 需要添加的数据信息
    */
    let request = store.add({
        id: new Date().getTime(),
        name: '王二',
        age: 12,
        email: 'XXXX@xxx.com',
    })

    /*
        *添加成功
    */
    request.onsuccess = function(event) {
        console.log('数据添加成功', event);
    };
    
    /*
        *添加失败
    */
    request.onerror = function(event) {
        console.log('数据添加失败', event);
    };
}

// 更新数据
function updata (store) {
    /*
        *put方法根据主键更新数据
        *@params 数据的主键
    */
    let request = store.put({
        id: 1687663532161,
        name: '张一' + Math.random(),
        age: 24,
        email: 'zhangsan@example.com',
    });
    /*
        *更新成功
    */
    request.onsuccess = function(event) {
        console.log('数据更新成功', event);
    };
    /*
        *更新失败
    */
    request.onerror = function(event) {
        console.log('数据更新失败', event);
    };
}

// 删除数据
function delData (store) {
    /*
        *delete方法删除数据
        *@params 数据的主键
    */
    let request = store.delete(1687663532161); 
    /*
        *删除成功
    */
    request.onsuccess = function (event) {
        console.log('数据删除成功',event);
    };
    /*
        *删除失败
    */
    request.onerror = function (event) {
        console.log('数据删除失败',event);
    };
}

// 使用索引
function getData (store) {
    /*
        *index方法获取索引对象
        *get方法获取数据
        *@params 数据的索引
    */
    // 只会获取表中第一个索引的数据
    let request = store.index('indexName').get('王二');
    /*
        *获取成功
    */
    request.onsuccess = function (event) {
        console.log('通过索引获取数据成功',event.target.result);
    };
    /*
        *获取失败
    */
    request.onerror = function (event) {
        console.log('通过索引获取数据失败',event);
    };
}

// 获取表中所有数据
function getAll (store) {
    let request = store.getAll()

    /*
        *更新成功
    */
    request.onsuccess = function(event) {
        console.log('indexedDB getAll:', event.target.result);
    };
    
    /*
        *更新失败
    */
    request.onerror = function(event) {
        console.log('indexedDB getAll:', event);
    };
}

// 根据指定条件获取data
// https://www.w3cschool.cn/javascript_guide/javascript_guide-rcfy26a4.html#toc8
// IDBKeyRange对象
function getDataByOptions (store) {
    // 获取id名称小于当前时间的所有data
    let request = store.getAll(IDBKeyRange.upperBound(+1687669665285));

    /*
        *更新成功
    */
    request.onsuccess = function(event) {
        console.log('indexedDB getAll:', event.target.result);
    };
  
    /*
        *更新失败
    */
    request.onerror = function(event) {
        console.log('indexedDB getAll:', event);
    };
}

// 定期删除失效数据
// 1.首先我们创建数据的时候就以时间戳+失效时间来约定id规则
// 添加数据定期失效
function addDataRegular (store) {
    /*
        *add方法添加数据
        *@params 需要添加的数据信息
    */
    let request = store.add({
        // 十分钟失效
        id: new Date().getTime() + 10 * 60 * 1000,
        name: '王二',
        age: 12,
        email: 'XXXX@xxx.com',
    })

    /*
        *添加成功
    */
    request.onsuccess = function(event) {
        console.log('数据添加成功', event);
    };
    
    /*
        *添加失败
    */
    request.onerror = function(event) {
        console.log('数据添加失败', event);
    };
}
// 2. 再通过上面基础操作的getAll方法，获取指定条件的data，再遍历data，调用删除数据API
function deleteDataRegular (store) {
    // 因为上面id加了十分钟时间戳所以筛选不出来,而十分钟后能筛选出来,十分钟后掉本方法可以删除对应数据
    let request = store.getAll(IDBKeyRange.upperBound(+new Date()));
    /*
        *更新成功
    */
    request.onsuccess = function(event) {
        console.log('indexedDB getAll:', event);
        console.log('indexedDB getAll:', event.target.result);
        const data = event.target.result;
        data.forEach(item => {
            console.log('删除数据', item);
            const deletRequest = store.delete(item.id);
            /*
            *删除成功
            */
            deletRequest.onsuccess = function(event) {
                console.log('数据删除成功', event);
            };
        
        
            /*
            *删除失败
            */
            deletRequest.onerror = function(event) {
                console.log('数据删除失败', event);
            };
        });
    };
    /*
        *更新失败
    */
    request.onerror = function(event) {};
}

// 批量添加数据
function addDataBatch (store) {
    const TestData = [
        {
          event: 'NE-TEST1',
          level: 'warning',
          errorCode: 200,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:039',
          isUploaded: false
        },
        {
          event: 'NE-TEST2',
          msg: '测试2',
          level: 'error',
          errorCode: 1000,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:042',
          isUploaded: false
        },
        {
          event: 'NE-TEST3',
          msg: '测试3',
          level: 'info',
          errorCode: 3000,
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:043',
          isUploaded: false
        },
        {
          event: 'NE-TEST4',
          mgs: '测试4',
          level: 'info',
          url: 'http://www.example.com',
          time: '2017/11/8 下午4:53:0423',
          isUploaded: false
        }
      ]
    
    /**
    * 添加数据
    * @param {array} docs 要添加数据
    * @param {string} objName 仓库名称
    */
    function addData (docs, objName) {
        if (!(docs && docs.length)) {
          throw new Error('docs must be a array!')
        }
        return openIndexedDB().then(db => {
            const tx = db.transaction([objName], 'readwrite')
            tx.oncomplete = e => {
                console.log('tx:addData onsuccess', e)
                return Promise.resolve(docs)
            }
            tx.onerror = e => {
                e.stopPropagation()
                console.error('tx:addData onerror', e.target.error)
                return Promise.reject(e.target.error)
            }
            tx.onabort = e => {
                console.warn('tx:addData abort', e.target)
                return Promise.reject(e.target.error)
            }
            const obj = tx.objectStore(objName)
            docs.forEach(doc => {
                const req = obj.add(doc)
                /**
                 * NOTE:
                 * request
                 * 两个事件：
                 * 1. success
                 * 2. error
                 */
                // req.onsuccess = e => console.log('obj:addData onsuccess', e.target)
                req.onerror = e => {
                    console.error('obj:addData onerror', e.target.error)
                }
            })
        })
    }
    
    addData(TestData, OB_NAMES.UseKeyGenerator)
    .then(() => addData(TestData, OB_NAMES.UseKeyPath))
}