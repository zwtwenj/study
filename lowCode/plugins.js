var hmi_pluginData = {
  button: {
    name: 'button',
    data: {
      width: '80',
      height: '30',
      btncolor: '#008ec4',
      text: '按钮',
      textColor: '#ffffff',
      fontSize: '12',
      textLeft: '40',
      textTop: '15',
    },
    render: `
      <svg width="{{width}}" height="{{height}}">
        <rect width="{{width}}" height="{{height}}" fill="{{btncolor}}" rx="5" ry="5" />
        <text text-anchor="middle" x="{{textLeft}}" y="{{textTop}}" font-size="{{fontSize}}" dy=".3em"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Microsoft YaHei';-inkscape-font-specification:'Microsoft YaHei, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:center;letter-spacing:0px;word-spacing:0px;writing-mode:lr;text-anchor:middle;fill:{{textColor}};fill-opacity:1;stroke:none;">{{text}}</text>
      </svg>
    `,
    event: [
      {
        trigger: 'onclick',
        use: 'message',
        cb: '',
        message: '',
      },
    ],
  },
};
