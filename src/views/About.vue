<template>
<div class="about" style="padding-top: 5px;">
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="primary" header="【POE 查价工具 支持国服和国际服简中汉化】 v1.316.2" header-bg-variant="primary" header-text-variant="white" align="center">
        <b-card-text>【特别感谢 MIGFLY 对于3.162版本做出贡献】</b-card-text>
        <b-card-text>【原作者：rChinnnn】    【汉化支持：流浪的灵魂@khl】</b-card-text>
        <b-card-text>          
          <b-button @click="openLink(`https://github.com/rChinnnn/rchin-poe-trade/releases`)" size="sm" variant="outline-primary" class="mb-2">
            更多原作者历史版本
          </b-button>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <!-- 开黑啦部分 -->
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="success" header="【欢迎更多的POE玩家能够加入我们】" header-bg-variant="success" header-text-variant="white" align="center">
        <b-card-text>我们在一个叫 【开黑啦】 的语音频道里，这里汇集了POE国际服和国服的众多玩家</b-card-text>
        <b-card-text>这是一个类似国外Discord的软件，支持游戏语音和机器人</b-card-text>
        <b-card-text>欢迎自行官网下载，并搜索服务器号：98094725 </b-card-text>   
        <b-card-text>本软件在开黑啦-POE游戏频道首发，请及时关注</b-card-text>   
        <b-card-text>          
         <b-button-group>
          <b-button  @click="openLink(`https://kaihei.co/JiNCux`)" variant="primary" >【☞ 国际服频道】</b-button>
          <b-button  @click="openLink(`https://kaihei.co/y9lplH`)" variant="danger">【☞ Poe综合频道】</b-button>
          <b-button  @click="openLink(`https://kaihei.co/kcahJn`)" variant="primary">【☞ 腾讯服频道】</b-button>
        </b-button-group>

        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
    <!-- 开黑啦部分 -->
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" header="本程序免费   微信/支付宝扫码赞助  ↓↓↓下拉有软件使用说明" align="center">
        <b-card-text>原作者已在 GitHub 上开源并授权许可更改，欢迎分享给你的小伙伴使用</b-card-text>
        <b-card-text>也欢迎赞助一下，用于开发软件的服务器费用</b-card-text>
        <div style="display:flex;justify-content:center;">
          <div class="num">
            <img src="../assets/wechat.png">
          </div>
          <div class="num">
            <img src="../assets/alipay.png">
          </div>
        </div>        
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="danger" header="免责声明" header-bg-variant="danger" header-text-variant="white" align="center">
        <b-card-text>
          <h5>使用此程序请自行承担所有可能后果和风险</h5>
        </b-card-text>
        <b-card-text>程序不修改游戏任何部分</b-card-text>
        <b-card-text>程序原理为抓取POE游戏内对物品复制后的文字进行分析，方便快速查价</b-card-text>
        <b-card-text>程序对接的API皆为官方公开的资源，请勿在短时间内快速搜索造成服务器负担</b-card-text>
        <b-card-text>
          <b style="font-family: monospace; background-color: lightyellow;">This product isn't affiliated with or endorsed by Grinding Gear Games and Garena in any way.</b>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="dark" header="使用说明" header-bg-variant="dark" header-text-variant="white" align="center">
        <b-card-text>1. 点此页上方的 查价 </b-card-text>
        <b-card-text>2. 切換回游戏中</b-card-text>
        <b-card-text>3. 將鼠标停在物品上，按下 Ctrl+C  </b-card-text>
        <b-card-text>4. 程序將自动判断此次搜寻物品</b-card-text>        
        <b-card-text><b style="background-color: lightyellow;">5. 仅支持A大简中版汉化补丁的（查价插件）相关版本，其他黄装词缀查询可能会出错</b></b-card-text>
        <b-card-text>
          <b-button @click="openLink(`https://github.com/rChinnnn/rchin-poe-trade/blob/master/README.md`)" size="sm" variant="outline-primary" class="mb-2">
            详细使用说明及基础搜索设定请点这里
          </b-button>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="dark" header="快捷键设定" header-bg-variant="dark" header-text-variant="white" align="center">
        <table class="table table-sm">
          <thead class="thead-light">
            <tr>
              <th scope="col">按键</th>
              <th scope="col">功能说明</th>
            </tr>
          </thead>
          <tbody class="hotkey">
            <tr v-for="(item, index) in hotkey" :key="index" style="padding-top: 5px;">
              <td align="left">{{ item.key }}</td>
              <td align="left">{{ item.description }}</td>
            </tr>
          </tbody>
        </table>
        <b-card-text><b style="background-color: lightyellow;">注意：所有热键在POE游戏窗口内无效，必须切换至查价工具界面才能正常使用</b></b-card-text>
      </b-card>
    </b-card-group>
  </div> 
 



</div>
</template>


<script>
const {
  clipboard,
  shell
} = require('electron')

export default {
  data() {
    return {
      hotkey: [{
        "key": "F5",
        "description": "程序显示在最上层，并且透明化(可浮动在POE程序上)"
      }, {
        "key": "F6",
        "description": "程序取消在最上层，且取消透明化"
      }, {
        "key": "PageUp",
        "description": "透明化程度 +5%"
      }, {
        "key": "PageDown",
        "description": "透明化程度 -5%"
      }, ]
    }
  },
  methods: {
    openLink(URL) {
      shell.openExternal(URL)
    },
  },
}
</script>
<style>
.card-body {
  padding: 10px !important;
}

.card-text p {
  margin-block-start: 0.5em;
  margin-block-end: 0em;
}

tbody.hotkey>tr>td {
  padding-top: 8px;
  padding-left: 25px;
}
.num {
 	 margin-right: 20px;
  	 width: 200px !important;
  	 height: 200px !important;
     }
</style>
