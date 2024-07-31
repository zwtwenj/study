import { unique } from "element-plus/es/utils";

const storeConfig: any = {
  device: "deviceId",
  symbol: "symbolId",
};
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
const win: any = window;
let db: any = null;
export function openDeviceDB(dbName: string, version: number) {
  return new Promise((resolve: any, reject) => {
    //  兼容浏览器
    var indexedDB =
      win.indexedDB ||
      win.mozIndexedDB ||
      win.webkitIndexedDB ||
      win.msIndexedDB;
    // 打开数据库，若没有则会创建
    let request = indexedDB.open(dbName, version);
    // 数据库打开成功回调
    request.onsuccess = function (event: any) {
      db = event.target.result; // 数据库对象
      console.log("数据库打开成功");
      resolve();
    };
    // 数据库打开失败的回调
    request.onerror = function (event: any) {
      console.log("数据库打开报错");
      reject();
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event: any) {
      // 数据库创建或升级的时候会触发
      db = event.target.result; // 数据库对象
      var objectStore: any;
      const tablesObj = db.objectStoreNames;
      // 设备
      if (!tablesObj.contains("device")) {
        // 创建存储库
        objectStore = db.createObjectStore("device", {
          keyPath: "deviceId", // 这是主键
          // autoIncrement: true // 实现自增
        });
        // 创建索引，在后面查询数据的时候可以根据索引查
        objectStore.createIndex("deviceId", "deviceId", { unique: false });
      }
      // 图元
      if (!tablesObj.contains("symbol")) {
        objectStore = db.createObjectStore("symbol", {
          keyPath: "symbolId", // 这是主键
          // autoIncrement: true // 实现自增
        });
        objectStore.createIndex("symbolId", "symbolId", { unique: false });
      }
      // 配置
      if (!tablesObj.contains("config")) {
        objectStore = db.createObjectStore("config", {
          keyPath: "id", // 这是主键
          // autoIncrement: true // 实现自增
        });
        objectStore.createIndex("id", "id", { unique: false });
      }
      // 插件
      if (!tablesObj.contains("plugin")) {
        objectStore = db.createObjectStore("plugin", {
          keyPath: "pluginId",
        });
        objectStore.createIndex("pluginId", "pluginId", { unique: false });
      }
      // 全局变量
      if (!tablesObj.contains("globalVariable")) {
        objectStore = db.createObjectStore("globalVariable", {
          keyPath: "key",
        });
        objectStore.createIndex("key", "key", { unique: false });
      }
      resolve();
    };
  });
}

/**
 * 新增数据
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
export function addData(storeName: string, data: any) {
  return new Promise((resolve: any, reject: any) => {
    function add() {
      var request = db
        .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(JSON.parse(JSON.stringify(data)));
      request.onsuccess = function (event: any) {
        console.log("数据写入成功2");
        resolve();
      };
      request.onerror = function (event: any) {
        console.log("数据写入失败", event);
        //   reject();
        resolve();
      };
    }
    getDataByKey(storeName, data[storeConfig[storeName]]).then((res: any) => {
      if (res) {
        updateDB(storeName, JSON.parse(JSON.stringify(data)));
      } else {
        add();
      }
    });
  });
  // return getDataByKey(storeName, data[storeConfig[storeName]])
  //   .then((data) => {
  //     console.log(data);

  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
export function getDataByKey(storeName: string, key?: string) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]); // 事务
    var objectStore = transaction.objectStore(storeName); // 仓库对象
    if (key) {
      var request = objectStore.get(key); // 通过主键获取数据
      request.onerror = function (event: any) {
        console.log("事务失败");
        reject();
      };

      request.onsuccess = function (event: any) {
        console.log("主键查询结果: ", request.result);
        resolve(request.result);
      };
    } else {
      const result: any = [];
      objectStore.openCursor().onsuccess = function (res: any) {
        let cursor = res.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    }
  });
}

/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
function cursorGetData(storeName: string) {
  let list: any = [];
  var store = db
    .transaction(storeName, "readwrite") // 事务
    .objectStore(storeName); // 仓库对象
  var request = store.openCursor(); // 指针对象
  return new Promise((resolve: any, reject: any) => {
    // 游标开启成功，逐行读数据
    request.onsuccess = function (e: any) {
      var cursor = e.target.result;
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        cursor.continue(); // 遍历了存储对象中的所有内容
      } else {
        console.log("游标读取的数据：", list);
        resolve();
      }
    };
  });
}

/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function getDataByIndex(storeName: string, indexName: string, indexValue: any) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store.index(indexName).get(indexValue);
  return new Promise((resolve, reject) => {
    request.onerror = function () {
      console.log("事务失败");
      reject();
    };
    request.onsuccess = function (e: any) {
      var result = e.target.result;
      console.log("索引查询结果：", result);
      resolve(result);
    };
  });
}

/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function cursorGetDataByIndex(
  storeName: string,
  indexName: string,
  indexValue: any
) {
  let list: any = [];
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  return new Promise((resolve, reject) => {
    request.onsuccess = function (e: any) {
      var cursor = e.target.result;
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        cursor.continue(); // 遍历了存储对象中的所有内容
      } else {
        console.log("游标索引查询结果：", list);
        resolve(list);
      }
    };
    request.onerror = function (e: any) {
      reject();
    };
  });
}

/**
 * 通过索引和游标分页查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 * @param {number} page 页码
 * @param {number} pageSize 查询条数
 */
function cursorGetDataByIndexAndPage(
  storeName: string,
  indexName: string,
  indexValue: any,
  page: number,
  pageSize: number
) {
  let list: any = [];
  let counter = 0; // 计数器
  let advanced = true; // 是否跳过多少条查询
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  // 关于IDEKeyRange可以查阅https://blog.csdn.net/m0_68635815/article/details/138144234
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  return new Promise((resolve, reject) => {
    request.onsuccess = function (e: any) {
      var cursor = e.target.result;
      if (page > 1 && advanced) {
        advanced = false;
        cursor.advance((page - 1) * pageSize); // 跳过多少条
        return;
      }
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        counter++;
        if (counter < pageSize) {
          cursor.continue(); // 遍历了存储对象中的所有内容
        } else {
          cursor = null;
          console.log("分页查询结果", list);
          resolve(list);
        }
      } else {
        console.log("分页查询结果", list);
        resolve(list);
      }
    };
    request.onerror = function (e: any) {
      reject();
    };
  });
}

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
function updateDB(storeName: string, data: any) {
  // console.log(data);
  var request = db
    .transaction([storeName], "readwrite") // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(JSON.parse(JSON.stringify(data)));

  return new Promise((resolve: any, reject) => {
    request.onsuccess = function () {
      console.log("数据更新成功");
      resolve();
    };

    request.onerror = function () {
      console.log("数据更新失败");
      reject();
    };
  });
}

/**
 * 通过主键删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
export function deleteDB(storeName: string, id: string) {
  var request = db
    .transaction([storeName], "readwrite")
    .objectStore(storeName)
    .delete(id);

  return new Promise((resolve: any, reject) => {
    request.onsuccess = function () {
      console.log("数据删除成功");
      resolve();
    };

    request.onerror = function () {
      console.log("数据删除失败");
      reject();
    };
  });
}

/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
function cursorDelete(storeName: string, indexName: string, indexValue: any) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象

  return new Promise((resolve: any, reject) => {
    request.onsuccess = function (e: any) {
      var cursor = e.target.result;
      var deleteRequest;
      if (cursor) {
        deleteRequest = cursor.delete(); // 请求删除当前项
        deleteRequest.onerror = function () {
          console.log("游标删除该记录失败");
          reject();
        };
        deleteRequest.onsuccess = function () {
          console.log("游标删除该记录成功");
          resolve();
        };
        cursor.continue();
      }
    };
    request.onerror = function (e: any) {
      reject();
    };
  });
}

/**
 * 删除表中所有数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
export function deleteStoreData(storeName: string) {
  var request = db
    .transaction(storeName, "readwrite")
    .objectStore(storeName)
    .clear();

  request.oncomplete = function () {
    console.log("所有数据已经删除");
  };

  request.onerror = function (e: any) {
    console.log("删除数据时发生错误:", e.target.error);
  };
}

/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
function closeDB(db: any) {
  db.close();
  console.log("数据库已关闭");
}
