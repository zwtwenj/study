const config = {
  stationRole: [
    {
      name: 'LS',
      desc: '本地区域',
    },
    {
      name: 'OCC',
      desc: '控制中心',
    },
    {
      name: 'DCC',
      desc: '灾备中心',
    },
    {
      name: 'DMS',
      desc: '设备管理区域',
    },
    {
      name: 'ZB',
      desc: '主变区域',
    },
  ],

  hostRolet: [
    {
      name: '服务器',
    },
    {
      name: '前置机',
    },
    {
      name: '客户端',
    },
    {
      name: '组态服务器',
    },
    {
      name: '历史服务器',
    },
    {
      name: '自定义',
    },
  ],

  hostRole: [
    {
      name: 'rtdb',
      desc: '实时服务器',
    },
    {
      name: 'fep',
      desc: 'FEP服务器',
    },
    {
      name: 'hmi',
      desc: '人机客户端',
    },
    {
      name: 'mysql',
      desc: 'MySQL配置服务',
    },
    {
      name: 'asset',
      desc: '组态服务器',
    },
    {
      name: 'htdb',
      desc: '历史服务器',
    },
    {
      name: 'gbase',
      desc: 'Gbase服务器',
    },
    {
      name: 'atlasdb',
      desc: '海量数据库',
    },
    {
      name: 'k8s',
      desc: 'k8s',
    },
  ],

  permissionLocation: [
    {
      name: 'LS',
    },
    {
      name: 'RCS',
    },
    {
      name: 'OCC',
    },
    {
      name: 'ZB',
    },
    {
      name: 'DMS',
    },
    {
      name: 'DCC',
    },
  ],

  driveType: [
    {
      name: 'tcp',
    },
    {
      name: 'udp',
    },
    {
      name: 'empty',
    },
    {
      name: 'com',
    },
  ],

  modeType: [
    {
      name: '正常模式',
    },
    {
      name: '阻塞模式',
    },
    {
      name: '排废气模式',
    },
    {
      name: '人防模式',
    },
    {
      name: '水灾模式',
    },
    {
      name: '火灾模式',
    },
  ],

  templateType: [
    {
      name: '标准',
    },
    {
      name: '电力',
    },
    {
      name: '视频',
    },
  ],

  pointType: [
    {
      name: 'DI',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '报警',
          key: 2,
        },
        {
          name: '历史',
          key: 3,
        },
        {
          name: '其他',
          key: 4,
        },
        {
          name: '设备计算',
          key: 5,
        },
      ],
    },
    {
      name: 'DO',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '控制超时',
          key: 2,
        },
        {
          name: '数据流',
          key: 3,
        },
        {
          name: '关联状态',
          key: 4,
        },
        {
          name: '可控判断',
          key: 5,
        },
        {
          name: '控制反馈',
          key: 6,
        },
      ],
    },
    {
      name: 'AI',
      config: [
        {
          name: '上下限',
          key: 1,
        },
        {
          name: '历史',
          key: 2,
        },
        {
          name: '报警',
          key: 3,
        },
        {
          name: '其他',
          key: 4,
        },
        {
          name: '设备内计算',
          key: 5,
        },
        {
          name: '跨设备计算',
          key: 6,
        },
      ],
    },
    {
      name: 'AO',
      config: [
        {
          name: '上下限',
          key: 1,
        },
        {
          name: '超时',
          key: 2,
        },
        {
          name: '数据流',
          key: 3,
        },
        {
          name: '关联状态',
          key: 4,
        },
        {
          name: '可控判断',
          key: 5,
        },
        {
          name: '控制反馈',
          key: 6,
        },
      ],
    },
    {
      name: 'LI',
      config: [
        {
          name: '上下限',
          key: 1,
        },
        {
          name: '报表',
          key: 2,
        },
        {
          name: '其他',
          key: 3,
        },
        {
          name: '设备内计算',
          key: 4,
        },
        {
          name: '跨设备计算',
          key: 5,
        },
      ],
    },
    {
      name: 'LO',
      config: [
        {
          name: '上下限',
          key: 1,
        },
        {
          name: '超时',
          key: 2,
        },
        {
          name: '数据流',
          key: 3,
        },
        {
          name: '关联状态',
          key: 4,
        },
        {
          name: '可控判断',
          key: 5,
        },
        {
          name: '控制反馈',
          key: 6,
        },
      ],
    },
    {
      name: 'EI',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '报警定义',
          key: 2,
        },
        {
          name: '历史',
          key: 3,
        },
        {
          name: '其他',
          key: 4,
        },
        {
          name: '设备内计算',
          key: 5,
        },
        {
          name: '跨设备计算',
          key: 6,
        },
      ],
    },
    {
      name: 'EO',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '超时',
          key: 2,
        },
        {
          name: '数据流',
          key: 3,
        },
        {
          name: '关联状态',
          key: 4,
        },
        {
          name: '可控判断',
          key: 5,
        },
        {
          name: '控制反馈',
          key: 6,
        },
      ],
    },
    {
      name: 'DI2',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '报警定义',
          key: 2,
        },
        {
          name: '历史',
          key: 3,
        },
        {
          name: '其他',
          key: 4,
        },
        {
          name: '设备内计算',
          key: 5,
        },
        {
          name: '跨设备计算',
          key: 6,
        },
      ],
    },
    {
      name: 'DO2',
      config: [
        {
          name: '数值定义',
          key: 1,
        },
        {
          name: '控制超时',
          key: 2,
        },
        {
          name: '数据流',
          key: 3,
        },
        {
          name: '关联状态',
          key: 4,
        },
        {
          name: '可控判断',
          key: 5,
        },
        {
          name: '控制反馈',
          key: 6,
        },
      ],
    },
    {
      name: 'SI',
      config: [
        {
          name: '人工置数',
          key: 1,
        },
        {
          name: '数据流',
          key: 2,
        },
        {
          name: '设备内计算',
          key: 3,
        },
      ],
    },
    {
      name: 'SO',
      config: [
        {
          name: '控制超时',
          key: 1,
        },
        {
          name: '数据流',
          key: 2,
        },
        {
          name: '关联状态',
          key: 3,
        },
        {
          name: '可控判断',
          key: 4,
        },
        {
          name: '控制反馈',
          key: 5,
        },
      ],
    },
    {
      name: 'BLOB',
      config: [
        {
          name: '控制超时',
          key: 1,
        },
        {
          name: '数据流',
          key: 2,
        },
      ],
    },
    {
      name: 'POST',
      config: [
        {
          name: '控制超时',
          key: 1,
        },
        {
          name: '数据流',
          key: 2,
        },
      ],
    },
  ],

  defaultPoint: [
    {
      name: 'HQZT',
      desc: '获取状态',
    },
    {
      name: 'TLSMZT',
      desc: '脱离扫描状态',
    },
    {
      name: 'TLSM',
      desc: '脱离扫描',
    },
    {
      name: 'KZYZZT',
      desc: '控制抑制状态',
    },
    {
      name: 'KZYZ',
      desc: '控制抑制',
    },
    {
      name: 'JDGPZT',
      desc: '就地挂牌状态',
    },
    {
      name: 'JDGP',
      desc: '就地挂牌',
    },
    {
      name: 'WXGPZT',
      desc: '维修挂牌状态',
    },
    {
      name: 'WXGP',
      desc: '维修挂牌',
    },
  ],

  judgmentOperator: [
    {
      name: '==',
    },
    {
      name: '!=',
    },
    {
      name: '>',
    },
    {
      name: '>=',
    },
    {
      name: '<',
    },
    {
      name: '<=',
    },
  ],
};

export default config;
