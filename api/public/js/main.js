let loadingInstance
const baseURL = 'https://cdn.jsdelivr.net/gh/BrotherHai/nba98'
const basexslURL = 'https://brotherhai.github.io/nba98/xls'
const handleData = ({ data }) => {
  if (loadingInstance) loadingInstance.close()
  // 极个别情况，若将错误code设置为0时，防止识别成false影响判断
  return data
}
const copy = { // 名字爱取啥取啥
  /*
    bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
    el: 作用的 dom 对象
    value: 传给指令的值，也就是我们要 copy 的值
  */
  bind(el, { value }) {
    el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        console.log('无复制内容');
        return;
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea');
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly';
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('Copy');
      if (result && textarea.value != '没留') {
        console.log('复制成功', textarea.value);
        alert(textarea.value)
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', el.handler);
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler);
  },
}


/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 10 * 3,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response, config } = error
    if (response) {
      return handleData(response)
    } else {
      console.log('error', error)
      console.log('config', config)
      console.log('response', response)
      this.$message(
        `请求出错：请求链接：${config.url}，错误信息：${error}`,
        'error'
      )
      return {}
    }
  }
)

async function getLocation(Location) {
  return instance({
    url: encodeURI(`json/location/${Location}.json`),
    method: 'get',
  })
}

async function queryInfo(type, name) {
  return instance({
    url: encodeURI(`json/${type}/${name}.json`),
    method: 'get',
  })
}
// 将csv转换成表格
function csv2table(csv) {
  var html = '<table>';
  var rows = csv.split('\n');
  rows.pop(); // 最后一行没用的
  rows.forEach(function (row, idx) {
    var columns = row.split(',');
    columns.unshift(idx + 1); // 添加行索引
    if (idx == 0) { // 添加列索引
      html += '<tr>';
      for (var i = 0; i < columns.length; i++) {
        html += '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>';
      }
      html += '</tr>';
    }
    html += '<tr>';
    columns.forEach(function (column) {
      html += '<td>' + column + '</td>';
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}


console.log(provinceAndCityData)
new Vue({
  el: '#mainBox',
  directives: {
    copy
  },
  data() {
    return {
      fileServer:'http://nba98.top',
      options: [],
      areaSelectData: regionDataPlus, // options绑定的数据就是引入的 provinceAndCityData
      selectedOptions: [],
      showLeft: false,
      tableData: [],
      cityname: '',
      area: [],
      city: [],
      province: [],
      activeName: 'table',
      citytype: '',
      xlsurl: '',
      xlshtml: '',
      dialogVisible: false,
      dialogData: {},
      copyText: '',
      loading: false
    }
  },
  mounted() {
    this._getLocation()
  },
  methods: {
    handleChange(e) {
      let len = e.length
      let name = CodeToText[`${e.pop()}`]
      if (!len) {
        return
      }
      switch (len) {
        case 1:
          this._queryInfo('province', name)
          break
        case 2:
          this._queryInfo('city', name)
          break
        case 3:
          this._queryInfo('area', name)
          break
        default:
          console.log(len)
      }
    },
    showDetail(row) {
      this.dialogVisible = true
      this.dialogData = row
    },
    async _getLocation() {
      console.log("\n".concat(" %c python 是世界上最好的爬虫框架", " | ", "https://www.python.org/"), "color: #fadfa3; background: #030307; padding:5px 0;")
      console.log("\n %c vue 是世界上最好的语言" + "%c https://vuejs.org/", "color:#fff;background:linear-gradient(90deg,#448bff,#44e9ff);padding:5px 0;", "color:#000;background:linear-gradient(90deg,#44e9ff,#ffffff);padding:5px 10px 5px 0px;");

      const area = await getLocation('area')
      this.area = area
      const city = await getLocation('city')
      this.city = city
      const province = await getLocation('province')
      this.province = province
      this._queryInfo('province', '北京市')
    },
    async _queryInfo(type, name) {
      this.loading = true
      this.cityname = name
      this.citytype = type
      await queryInfo(type, name).then(res => {
        console.log(res)
        this.$message({ message: `${name}数据获取成功`, type: 'success' });
        this.loading = false
        this.tableData = res.data
        this.handlexls({ name: this.activeName })
      }).catch(e => {
        console.log(e)
        this.loading = false
        this.tableData = []
        this.$message({ message: `${name}数据获取失败${e}`, type: 'error' });
      })
    },
    handlexls(e) {
      let len = this.tableData.length
      if (e.name === 'xls' && len) {
        this.xlsurl = `${basexslURL}/${this.citytype}/${this.cityname}.xls`
        this.readWorkbookFromRemoteFile(this.xlsurl, function (workbook) {
          console.log(workbook)
          var sheetNames = workbook.SheetNames; // 工作表名称集合
          var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
          var csv = XLSX.utils.sheet_to_csv(worksheet);
          document.getElementById('xlshtml').innerHTML = csv2table(csv);
        });
      }
      console.log(e.name, this.cityname)
    },
    // 从网络上读取某个excel文件，url必须同域，否则报错
    readWorkbookFromRemoteFile(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (xhr.status == 200) {
          var data = new Uint8Array(xhr.response)
          var workbook = XLSX.read(data, { type: 'array' });
          if (callback) callback(workbook);
        }
      };
      xhr.send();
    }
  }
})
