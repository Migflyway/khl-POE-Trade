<template>
<div class="home" ref="home">
  <go-top :size="30" :bottom="50" :max-width="575" bg-color="#04a9f3" :boundary="10"></go-top>
  <hr>
  <b-alert v-if="isApiError" show variant="danger" style="margin-top: 5px;">
    <div>API调用发生错误，请在下方输入框中填入正确的【国服】POESESSID</div>
    <!-- migfly增加部分代码 -->
    <h4 style="padding-top: 6px;">{{ apiErrorStr }}</h4>
      <b-col sm="12" class="my-1">
        <b-form-group label="填入【国服】POESESSID" label-cols-sm="4" label-align-sm="right" label-size="sm" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model=handlePOESESSID :disabled="false" type="search" id="filterInput" placeholder="请输入ID"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    <hr>
    <!-- migfly增加部分代码 -->
    <div>若跳出提示 Code 503，表示国服或国际服官方可能在关机维护中，请稍后再试</div>
    <div>国际服玩家 -> 国服及国际服官方皆正常才可使用</div>
    <div>国服玩家 -> 国服官方正常即可使用</div>
    <hr>
    <countdown ref="countdown" :time="countTime" @end="handleCountdownEnd" :interval="100">
      <template slot-scope="props">
        <b-button v-if="isCounting" @click="getAllAPI" :disabled="isCounting" size="sm" variant="outline-danger">请等待 {{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }} 秒后重试</b-button>
        <div v-else>
          <b-button @click="getAllAPI(true)" :disabled="isCounting" size="sm" variant="outline-danger">国际服玩家点这里重试一次</b-button> /
          <b-button @click="getAllAPI(false)" :disabled="isCounting" size="sm" variant="outline-danger">国服玩家点这里重试一次</b-button>
        </div>
      </template>
    </countdown>
  </b-alert>
  <div v-else>
    <b-container class="bv-example-row">
      <b-row class="lesspadding">
        <b-col align-self="center" style="padding-left: 6px !important;">
          <b-button v-b-toggle.collapse-1 size="sm" variant="outline-primary">搜索设置</b-button>
        </b-col>
        <b-col align-self="center">
          <b-button @click="isItemCollapse = !isItemCollapse" :disabled="!isItem" size="sm" variant="outline-primary">物品设置</b-button>
        </b-col>
        <b-col align-self="center">
          <b-button @click="isStatsCollapse = !isStatsCollapse" :disabled="searchStats.length == 0" size="sm" variant="outline-primary">词缀设置</b-button>
        </b-col>
        <b-col align-self="center">
          <b-button @click="isMapCollapse = !isMapCollapse" :disabled="!isMap" size="sm" variant="outline-primary">地图设置</b-button>
        </b-col>
        <b-col align-self="center">
          <b-button @click="isGemCollapse = !isGemCollapse" :disabled="!isGem" size="sm" variant="outline-primary">技能设置</b-button>
        </b-col>
        <b-col align-self="center">
          <b-button v-b-toggle.collapse-2 size="sm" variant="outline-primary">附加功能</b-button>
        </b-col>
        <b-col v-if="isDevMode" align-self="center">
          <b-button @click="checkAPI" size="sm" variant="outline-primary">API 测试</b-button>
        </b-col>
      </b-row>
      <b-collapse id="collapse-2" class="mt-2">
        <b-card>
          <b-row class="lesspadding" style="padding-left: 2px;">
            <b-col sm="12" v-if="handlePOESESSID">
              <b-form-group label="请保护好你的国服POESESSID" label-cols-sm="5" label-align-sm="right" label-size="sm" class="mb-0">
                <b-input-group size="sm">
                  <b-form-input v-model="handlePOESESSID" disabled></b-form-input>
                  <b-input-group-append>
                    <b-button @click="$store.commit('setPOESESSID', '')" :disabled="wantedAddedText.length > 0">刪除</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-checkbox style="padding-top: 7px;" class="float-right" v-model="isMapAreaCollapse" switch :inline="false">
                <b>异界地图名称复制</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="1"></b-col>
            <b-col sm="7" class="my-1">
              <b-form-group label="" label-cols-sm="0" label-align-sm="right" label-size="sm" class="mb-0">
                <b-input-group size="sm">
                  <b-form-input v-model="wantedAddedText" type="search" id="filterInput" placeholder="请输入欲在复制地图名称后增加的文字"></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!wantedAddedText" @click="addAfterCopyText">增加</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <!-- 因POESESSID国服和国际服不通用问题，此功能暂时注销，有时间看下国服是否支持 -->
            <!-- <b-col sm="12" v-if="handlePOESESSID">
              <ChaosRecipe></ChaosRecipe>
            </b-col> -->
          </b-row>
          <b-collapse :visible="isMapAreaCollapse" class="lesspadding">
            <b-row style="padding-top: 10px;">
              <b-col sm="5">
                <b-button @click="mapAreaCopy('海沃克村')" size="sm" variant="outline-primary">海沃克村 (左上)</b-button>
              </b-col>
              <b-col sm="4">
                <b-button @click="mapAreaCopy('瓦尔多之息')" size="sm" variant="outline-primary">瓦尔多之息 (右上)</b-button>
              </b-col>
            </b-row>
            <b-row style="padding-top: 8px;">
              <b-col sm="5">
                <b-button @click="mapAreaCopy('格伦纳赫石冢')" size="sm" variant="outline-primary" @click.shift.middle="(clickCount > 5 && isGem) || handlePOESESSID ? clickOpen() : ''">格伦纳赫石冢 (左下)</b-button>
              </b-col>
              <b-col sm="4">
                <b-button @click="mapAreaCopy('利拉亚森')" size="sm" @click.right="clickCount++" variant="outline-primary">利拉亚森 (右下)</b-button>
              </b-col>
            </b-row>
          </b-collapse>
        </b-card>
      </b-collapse>
      <b-collapse visible id="collapse-1" class="mt-2">
        <b-card>
          <b-row>
            <!-- <b-col sm="5" class="lesspadding">
              <v-select :options="leagues.option" v-model="leagues.chosenL" :searchable="false" :clearable="false" :filterable="false"></v-select>
            </b-col> -->
            <b-col sm="4" class="lesspadding">
              <multiselect :options="leagues.option" v-model="leagues.chosenL" :showLabels="false" :searchable="false" :allow-empty="false"></multiselect>
            </b-col>
            <!-- khl自己添加部分 -->       
            <b-col sm="8">                           
              <b-form-input style="width:300px;" v-model="khlupdateinfo.chosenL" :disabled="true" size="md"></b-form-input>          
            </b-col>
            <!-- khl自己添加部分 -->
          </b-row>
          <!-- migfly修改部分，调整位置 -->
          <!-- <b-row>
            <b-col sm="12">
              <b-form-group label="POESESSID" label-cols-sm="4" label-size="md" class="mb-0">
                <b-input-group size="md">
                  <b-form-input style="width:300px;" v-model="handlePOESESSID"></b-form-input>
                  <b-input-group-append>
                    <b-button @click="$store.commit('setPOESESSID', '')" :disabled="wantedAddedText.length > 0">刪除</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row> -->
          <!-- migfly修改部分，调整位置 -->
          <b-row class="lesspadding" style="padding-top: 5px; padding-left: 2px;">
            <b-col sm="3">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="isOnline" :disabled="isCounting" switch :inline="false">
                <b>只显示线上</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="2">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="isPriced" :disabled="true" switch>
                <b>{{ pricedText }}</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="4" class="lesspadding">
              <v-select :options="priceSetting.option" v-model="priceSetting.chosenObj" @input="priceSettingChange" :disabled="isCounting" :clearable="false" :filterable="false"></v-select>
            </b-col>
            <b-col sm="1" class="lesspadding" style="padding-top: 2px;">
              <b-form-input v-model.number="storePriceMin" @change="priceSettingChange" :disabled="isCounting" size="sm" type="number" min="0" max="999"></b-form-input>
            </b-col>
            <b-col sm="1" class="lesspadding" style="padding-top: 2px;">
              <b-form-input v-model.number="storePriceMax" @change="priceSettingChange" :disabled="isCounting" size="sm" type="number" min="0" max="999" :style="!isNaN(storePriceMax) && (storePriceMax < storePriceMin) ? 'color: #fc3232; font-weight:bold;' : ''"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px; padding-left: 2px;">
            <b-col sm="3">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="isPriceCollapse" :disabled="isCounting" switch :inline="false">
                <b v-b-tooltip.hover.right.v-secondary :title="`交易过滤条件：按账号收起列表 (Collapse Listings by Account)`">按账号折叠</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="2">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="corruptedSet.isSearch" :disabled="true" switch>已污染</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <v-select :options="corruptedSet.option" v-model="corruptedSet.chosenObj" @input="corruptedInput" :disabled="!isSearchJson || isCounting" label="label" :clearable="false" :filterable="false"></v-select>
            </b-col>
            <b-col sm="3"></b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-container>
    <b-container class="bv-example-row">
      <b-collapse :visible="isItem && isItemCollapse" class="mt-2">
        <b-card>
          <!-- TODO: 全部物品篩選 -->
          <b-row class="lesspadding">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemLevel.isSearch" @input="isItemLevelSearch" switch>物品等級</b-form-checkbox>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLevel.min" @dblclick="itemLevel.min = ''" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLevel.max" @dblclick="itemLevel.max = ''" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" :style="itemLevel.max && (itemLevel.max < itemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox style="padding-right: 19px !important;" class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemLinked.isSearch" @input="isLinkedSearch" switch>物品连线</b-form-checkbox>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLinked.min" @dblclick="itemLinked.min = ''" @input="isLinkedSearch" :disabled="!itemLinked.isSearch" :style="itemLinked.min > 6 ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLinked.max" @dblclick="itemLinked.max = ''" @input="isLinkedSearch" :disabled="!itemLinked.isSearch" :style="(itemLinked.max && (itemLinked.max < itemLinked.min)) || itemLinked.max > 6 ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemCategory.isSearch" @input="isItemCategorySearch" switch>物品分类</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="itemCategory.option" v-model="itemCategory.chosenObj" label="label" @input="categoryChange" :disabled="!itemCategory.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemBasic.isSearch" @input="isItemBasicSearch" switch>物品基底</b-form-checkbox>
            </b-col>
            <b-col sm="3" style="padding-top: 3px;">
              <b-form-input style="width: 100px;" v-model="itemBasic.text" :disabled="true" size="sm"></b-form-input>
            </b-col>
            <b-col sm="2" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemExBasic.isSearch" @input="isExBasicSearch" switch>势力基底</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select class="exBasicIcon" :options="itemExBasic.option" :value="itemExBasic.chosenObj" label="label" @input="exBasicChange" :disabled="!itemExBasic.isSearch" :clearable="false" :filterable="false" placeholder="任何">
                <template v-slot:option="itemExBasic">
                  <b-img :src="itemExBasic.url"></b-img>
                  {{ itemExBasic.label }}
                </template>
              </v-select>
            </b-col>
          </b-row>
          <b-collapse :visible="!isStatsCollapse || searchStats.length == 0">
            <b-row>
              <b-col sm="10"></b-col>
              <b-col sm="2" style="padding-top: 15px;">
                <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查询</b-button>
              </b-col>
            </b-row>
          </b-collapse>
        </b-card>
      </b-collapse>
    </b-container>
    <b-container class="bv-example-row">
      <b-collapse :visible="isMap && isMapCollapse" class="mt-2">
        <b-card>
          <b-row class="lesspadding">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="mapLevel.isSearch" @input="isMapLevelSearch" switch>地图等级</b-form-checkbox>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="mapLevel.min" @dblclick="mapLevel.min= ''" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="mapLevel.max" @dblclick="mapLevel.max= ''" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" :style="mapLevel.max && (mapLevel.max < mapLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="2"></b-col>
            <b-col sm="2" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="mapBasic.isSearch" @input="isMapBasicSearch" switch>地图基底</b-form-checkbox>
            </b-col>
            <b-col :sm="isGarenaSvr ? 4 : 9">
              <!-- <b-form-input v-model="mapBasic.chosenM" :disabled="true"></b-form-input> -->
              <v-select :options="mapBasic.option" v-model="mapBasic.chosenM" @input="isMapBasicSearch" label="label" :disabled="!mapBasic.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-collapse :visible="raritySet.chosenObj.label !== '传奇'">
            <b-row style="padding-top: 10px;">
              <b-col sm="4">
                <b-form-checkbox style="padding-left: 8px !important" v-model="mapCategory.isShaper" switch :inline="false">塑者领域</b-form-checkbox>
              </b-col>
              <b-col sm="4">
                <b-form-checkbox v-model="mapCategory.isElder" switch :inline="false">尊师领域</b-form-checkbox>
              </b-col>
              <b-col sm="4">
                <b-form-checkbox v-model="mapCategory.isBlighted" switch :inline="false">凋落地区</b-form-checkbox>
              </b-col>
            </b-row>
          </b-collapse>
          <b-collapse :visible="mapCategory.isElder">
            <b-row style="padding-top: 8px;">
              <b-col sm="4"></b-col>
              <b-col sm="3" style="padding-left: 28px; padding-top: 5px;">
                <b-form-checkbox v-model="mapElderGuard.isSearch" @input="isMapElderGuardSearch" switch :inline="false">守卫</b-form-checkbox>
              </b-col>
              <b-col sm="5" class="lesspadding">
                <v-select :options="mapElderGuard.option" v-model="mapElderGuard.chosenObj" @input="isMapElderGuardSearch" label="label" :disabled="!mapElderGuard.isSearch" :clearable="false" :filterable="false">
                  <template v-slot:option="mapElderGuard">
                    <b-img style="max-width: 25px;" :src="mapElderGuard.url"></b-img>
                    {{ mapElderGuard.label }}
                  </template>
                </v-select>
              </b-col>
            </b-row>
          </b-collapse>
          <b-row>
            <b-col sm="10"></b-col>
            <b-col sm="2" style="padding-top: 15px;">
              <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查询</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-container>
    <b-container class="bv-example-row">
      <b-collapse :visible="isGem && isGemCollapse" class="mt-2">
        <b-card>
          <b-row class="lesspadding">
            <b-col sm="3" style="padding-top: 3px;">
              <b-form-checkbox class="float-right" v-model="gemLevel.isSearch" @input="isGemLevelSearch" switch>技能等级</b-form-checkbox>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemLevel.min" @dblclick="gemLevel.min= ''" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemLevel.max" @dblclick="gemLevel.max= ''" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" :style="gemLevel.max && (gemLevel.max < gemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 3px;">
              <b-form-checkbox class="float-right" v-model="gemQuality.isSearch" @input="isGemQualitySearch" switch>技能品质</b-form-checkbox>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemQuality.min" @dblclick="gemQuality.min= ''" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemQuality.max" @dblclick="gemQuality.max= ''" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" :style="gemQuality.max && (gemQuality.max < gemQuality.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 10px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="gemQualitySet.isSearch" @input="gemQualityTypeInput" switch>替代品质</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="gemQualitySet.option" v-model="gemQualitySet.chosenObj" @input="gemQualityTypeInput" label="label" :disabled="!gemQualitySet.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 10px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="gemBasic.isSearch" @input="isGemBasicSearch" switch>技能基底</b-form-checkbox>
            </b-col>
            <b-col :sm="isGarenaSvr ? 6 : 9">
              <v-select :options="gemBasic.option" v-model="gemBasic.chosenG" @input="isGemBasicSearch" label="label" :disabled="!gemBasic.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10"></b-col>
            <b-col sm="2" style="padding-top: 5px;">
              <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查询</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-container>
    <hr ref="refAnalysis">
    <h5 :style="isItem && searchStats.length > 0 ? 'cursor: pointer;' : ''" @click="isStatsCollapse = !isStatsCollapse" v-html="searchName"></h5>
    <b-alert v-if="isCounting && !isApiError" show variant="warning" style="margin-top: 5px;">
      <countdown ref="countdown" :time="countTime" @end="handleCountdownEnd" :interval="100">
        <template slot-scope="props">因 API 调用次数限制，请再等待：{{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }} 秒</template>
      </countdown>
    </b-alert>
    <b-container class="bv-example-row">
      <b-collapse :visible="!isStatsCollapse && searchStats.length > 0">
        <b-icon-card-text @click="isStatsCollapse = !isStatsCollapse" style="cursor: pointer; user-select:none;"></b-icon-card-text>
        <b-icon-arrows-expand @click="isStatsCollapse = !isStatsCollapse" style="cursor: pointer; user-select:none;"></b-icon-arrows-expand>
      </b-collapse>
      <b-collapse :visible="isStatsCollapse && searchStats.length > 0">
        <table class="table table-sm">
          <thead class="thead-dark">
            <tr>
              <th scope="col">查询</th>
              <th scope="col">种类</th>
              <th scope="col">词缀内容</th>
              <th scope="col">最小值</th>
              <th scope="col">最大值</th>
            </tr>
          </thead>
          <tbody class="searchStats">
            <tr v-for="(item, index) in searchStats" :key="index" style="padding-top: 5px;" :style="item.isSearch ? 'font-weight:bold;' : 'color: #AAACAD'">
              <td style="width: 45px;">
                <b-form-checkbox v-model="item.isSearch"></b-form-checkbox>
              </td>
              <td style="width: 55px; cursor: pointer; user-select:none;" :style="statsFontColor(item.type)" @click="item.isSearch = !item.isSearch">{{ item.type }} </td>
              <td style="cursor: pointer; user-select:none; white-space:pre-wrap;" @click="item.isSearch = !item.isSearch">{{ item.text }} </td>
              <td style="width: 64px; padding-top: 5px !important;">
                <div style="padding:0px 4px 0px 6px;">
                  <b-form-input v-if="item.isValue" v-model.number="item.min" @dblclick="item.min = ''" :disabled="!item.isSearch" size="sm" type="number" style="text-align: center;"></b-form-input>
                </div>
              </td>
              <td style="width: 64px; padding-top: 5px !important;">
                <div style="padding:0px 4px 0px 6px;">
                  <b-form-input v-if="item.isValue" v-model.number="item.max" @dblclick="item.max = ''" :disabled="!item.isSearch" :style="item.max && (item.max < item.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number" style="text-align: center;"></b-form-input>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <b-row>
          <b-col sm="2"></b-col>
          <b-col sm="8">
            <b-icon-card-text @click="isStatsCollapse = !isStatsCollapse" style="cursor: pointer; user-select:none;"></b-icon-card-text>
            <b-icon-arrows-collapse @click="isStatsCollapse = !isStatsCollapse" style="cursor: pointer; user-select:none;"></b-icon-arrows-collapse>
          </b-col>
          <b-col sm="2">
            <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查询</b-button>
          </b-col>
        </b-row>
      </b-collapse>
    </b-container>
    <h6 v-html="status" style="padding-top: 10px;"></h6>
  </div>
  <div>
    <b-button v-if="fetchQueryID" @click="popOfficialWebsite" :disabled="isCounting" size="sm" variant="outline-primary">{{ whichServer }} 官方交易市集</b-button>
    <PriceAnalysis @countdown="startCountdown" @refresh="searchTrade(searchJson)" @exclude="excludeCorrupted()" @scroll="scrollToPriceAnalysis()" :isCounting="isCounting" :fetchID="fetchID" :fetchQueryID="fetchQueryID" :isPriced="isPriced" :baseUrl="baseUrl" :searchTotal="searchTotal" :isPriceCollapse="isPriceCollapse" :resultLength="resultLength"></PriceAnalysis>
  </div>
  <div v-if="!isSupported" style="padding:5px 30px;">
    <b-card header="问题反馈" border-variant="info" header-bg-variant="info" header-text-variant="white" align="center">
      <div @click="issueTextCopy" style="padding: 0px 100px;">
        <b-form-textarea v-model="issueText" size="sm" disabled style="cursor: pointer;" max-rows="15"></b-form-textarea>
      </div>
      <b-card-text style="padding-top: 20px;">
        <span>复制以上物品信息发送至  </span>
        <b-button @click="openLink(`https://kaihei.co/Hklu4m`)" size="sm" variant="outline-primary" class="mb-2">
          开黑啦-->>问题反馈频道 
        </b-button>         
        <span>  感谢你的支持！</span>
      </b-card-text>
    </b-card>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
// import hotkeys from "hotkeys-js";
import PriceAnalysis from '@/components/PriceAnalysis.vue'
import ChaosRecipe from '@/components/ChaosRecipe.vue'
import GoTop from '@inotom/vue-go-top';

import itemsData from "../assets/poe/items.json";
import statsData from "../assets/poe/stats.json";
import leagueDate from "../assets/poe/leagues.json";

const _ = require('lodash');
const stringSimilarity = require('string-similarity');
const {
  clipboard,
  shell
} = require('electron')
export default {
  name: 'home',
  components: {
    PriceAnalysis,
    ChaosRecipe,
    GoTop
  },
  data() {
    return {
      clickCount: 0,
      searchTotal: 0,
      status: '',
      copyText: '',
      wantedAddedText: '',
      testResponse: '',
      countTime: 0,
      baseUrl: 'https://poe.game.qq.com',
      //cookie :`POESESSID=bb4b09f6499001ec8d476c9e5e5adaa6`, //此处cookie取消，为测试用数据
      isGarenaSvr: true,
      isApiError: false,
      apiErrorStr: '',
      isCounting: false,
      isOnline: true,
      isPriced: true,
      isItem: false,
      isMap: false,
      isGem: false,
      isItemCollapse: true,
      isMapCollapse: true,
      isGemCollapse: true,
      isStatsCollapse: true,
      isSupported: true,
      issueText: '',
      isMapAreaCollapse: false,
      searchStats: [], // 分析拆解後的物品詞綴陣列，提供使用者在界面勾選是否查詢及輸入數值
      allStats: statsData, // 詞綴 API 資料
      allLeague : leagueDate,
      pseudoStats: [], // 偽屬性
      explicitStats: [], // 隨機屬性
      implicitStats: [], // 固定屬性
      fracturedStats: [], // 破裂
      enchantStats: [], // 附魔
      scourgeStats: [], // 災魘詞綴
      craftedStats: [], // 已工藝
      clusterJewelStats: [], // 星團珠寶附魔詞綴
      allocatesStats: [], // 項鍊塗油配置附魔詞綴
      wrapStats: [],
      fetchID: [], // 預計要搜尋物品細項的 ID, 10 個 ID 為一陣列
      isPriceCollapse: true, // 透過帳號摺疊名單 (Collapse Listings by Account) 預設為 true
      resultLength: 0,
      searchName: '',
      fetchQueryID: '',
      allItems: itemsData, // 物品 API 資料
      equipItems: [], // 可裝備的物品資料
      monstersItems: [], // 物品化怪物資料
      priceSetting: { // 價格設定
        option: [{
          label: "与混沌石等值",
          prop: ''
        }, {
          label: "点金石",
          prop: 'alch'
        }, {
          label: "混沌石",
          prop: 'chaos'
        }, {
          label: "崇高石",
          prop: 'exa'
        }, ],
        chosenObj: {
          label: "与混沌石等值",
          prop: ''
        }
      },
      leagues: { // 搜尋聯盟 
        option: [],
        chosenL: ""
      },
      khlupdateinfo: { // khl增加代码 
        option: [],
        chosenL: ""
      },
      gggLeagues: [], // 暫存 ggg 聯盟字串
      raritySet: { // 稀有度設定
        option: [{
          label: "一般",
          prop: 'normal'
        }, {
          label: "魔法",
          prop: 'magic'
        }, {
          label: "稀有",
          prop: 'rare'
        }, {
          label: "传奇",
          prop: 'unique'
        }, {
          label: "古藏传奇",
          prop: 'uniquefoil'
        }, {
          label: "非传奇",
          prop: 'nonunique'
        }, ],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      corruptedSet: { // 汙染設定
        option: [{
          label: "是",
          prop: 'true'
        }, {
          label: "否",
          prop: 'false'
        }, {
          label: "任何",
          prop: 'any'
        }],
        chosenObj: {
          label: "任何",
          prop: 'any'
        },
        isSearch: true,
      },
      gemQualitySet: { // 寶石替代品質設定
        option: [{
          label: "精良的（默认）",
          prop: '0'
        }, {
          label: "任何替代",
          prop: 'alternate'
        }, {
          label: "异常",
          prop: '1'
        }, {
          label: "分歧",
          prop: '2'
        }, {
          label: "魅影",
          prop: '3'
        }, ],
        chosenObj: {
          label: "精良的（默认）",
          prop: '0'
        },
        isSearch: false,
      },
      mapLevel: { // 地圖階級
        min: 0,
        max: 0,
        isSearch: false,
      },
      mapCategory: { // 地圖種類
        isShaper: false,
        isElder: false,
        isBlighted: false
      },
      mapElderGuard: { // 尊師守衛地圖
        option: [{
          label: "裂界守卫：奴役",
          prop: "1",
          url: "https://poe.game.qq.com/image/Art/2DItems/Maps/AtlasMapGuardianFire.png?v=e5e1e33936ce8035aed76e3ca12b9b4f"
        }, {
          label: "裂界守卫：寂灭",
          prop: "2",
          url: "https://poe.game.qq.com/image/Art/2DItems/Maps/AtlasMapGuardianLightning.png?v=90d792a619252cc02b8f974893811531"
        }, {
          label: "裂界守卫：约束",
          prop: "3",
          url: "https://poe.game.qq.com/image/Art/2DItems/Maps/AtlasMapGuardianHoly.png?v=ebb9b06c3456603cc78e88b797049dda"
        }, {
          label: "裂界守卫：净世",
          prop: "4",
          url: "https://poe.game.qq.com/image/Art/2DItems/Maps/AtlasMapGuardianChaos.png?v=e131ac9d26855fcbd7eb44deee8a9ef1"
        }, ],
        chosenObj: {
          label: "无",
          prop: ''
        },
        isSearch: false,
      },
      mapBasic: { // 地圖基底
        option: [],
        chosenM: '无',
        isSearch: false,
      },
      gggMapBasic: [],
      itemLevel: { // 物品等級
        min: 0,
        max: '',
        isSearch: false,
      },
      itemLinked: { // 物品插槽連線
        min: '',
        max: '',
        isSearch: false,
      },
      itemCategory: { // 物品分類
        option: [],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      itemBasic: { // 物品基底
        text: '',
        isSearch: false,
      },
      itemExBasic: { // 勢力基底
        option: [{
          label: "塑界之器",
          prop: "shaper_item",
          url: "https://poe.game.qq.com/image/item/popup/shaper-symbol.png?1582104312019"
        }, {
          label: "裂界之器",
          prop: "elder_item",
          url: "https://poe.game.qq.com/image/item/popup/elder-symbol.png?1582104312011"
        }, {
          label: "圣战者物品",
          prop: "crusader_item",
          url: "https://poe.game.qq.com/image/item/popup/crusader-symbol.png?1582104312011"
        }, {
          label: "救赎者物品",
          prop: "redeemer_item",
          url: "https://poe.game.qq.com/image/item/popup/redeemer-symbol.png?1582104312015"
        }, {
          label: "督军物品",
          prop: "warlord_item",
          url: "https://poe.game.qq.com/image/item/popup/warlord-symbol.png?1582104312019"
        }, {
          label: "狩猎者物品",
          prop: "hunter_item",
          url: "https://poe.game.qq.com/image/item/popup/hunter-symbol.png?1582104312015"
        }, ],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      gemLevel: { // 技能寶石等級
        min: 0,
        max: '',
        isSearch: false,
      },
      gemQuality: { // 技能寶石品質
        min: 0,
        max: '',
        isSearch: false,
      },
      gemBasic: { // 技能寶石基底
        option: [],
        chosenG: '无',
        isSearch: false,
      },
      gggGemBasic: [],
      searchJson: {},
      searchJson_Def: {
        "query": {
          "status": {
            "option": "online"
          },
          "stats": [{
            "type": "and",
            "filters": []
          }],
          "filters": {
            "trade_filters": {
              "filters": {
                "sale_type": {
                  "option": "priced"
                },
                "price": {
                  "min": localStorage.getItem('priceSettingMin') || 0.1,
                  "max": localStorage.getItem('priceSettingMax') || null,
                },
                "collapse": {}
              }
            },
            "misc_filters": {
              "filters": {}
            },
            "type_filters": {
              "filters": {}
            },
            "map_filters": {
              "filters": {}
            }
          }
        },
        "sort": {
          "price": "asc"
        }
      },
      newLine: navigator.userAgent.indexOf('Mac OS X') > -1 ? '\n' : '\r\n', // Mac 與 Windows 換行符號差異
      exJson: {
        "query": {
          "status": {
            "option": "online"
          },
          "type": "宝钻戒指", // 物品基底 isItemBasicSearch
          "stats": [{
            "type": "and",
            "filters": [{
              "id": "enchant.stat_3948993189", // 附魔：星團珠寶(jewel.cluster) 固定詞綴ID
              "value": { // "增加的小天赋获得：#"
                "option": 16 // 1~53
              },
              'disabled': false
            }, {
              "id": "enchant.stat_2954116742", // 附魔：項鍊塗油 固定詞綴ID
              "value": { // "配置 #"
                "option": 32345 // 各技能皆一組 ID
              },
              'disabled': false
            }]
          }],
          "filters": {
            "misc_filters": {
              "filters": {
                "ilvl": { // 物品等級 isItemLevelSearch
                  "min": 86
                },
                "crusader_item": { // 勢力區域 isExBasicSearch
                  "option": "true"
                },
                "corrupted": { // 已汙染設定 corruptedInput
                  "option": "true"
                },
                "gem_level": { // 技能等級 isGemLevelSearch
                  "min": 10
                },
                "quality": { // 技能品質 isGemQualitySearch
                  "min": 10
                },
                "gem_alternate_quality": { // 寶石替代品質設定 gemQualityTypeInput
                  "option": "alternate", // any alternate
                  "option": "0", // superior(default) 精良的
                  "option": "1", // anomalous  異常的
                  "option": "2", // divergent  相異的
                  "option": "3", // phantasmal 幻影的
                },
              }
            },
            "type_filters": {
              "filters": {
                "category": { // 物品種類 isItemCategorySearch
                  "option": "accessory.ring", // 戒指
                  "option": "heistequipment" // 劫盜裝備
                }
              }
            },
            "socket_filters": { // 插槽連線設定
              "filters": {
                "links": {
                  "min": 5
                }
              }
            }
          }
        },
        "sort": {
          "price": "asc"
        }
      }
    }
  },
  created() {
    //if (clipboard.readText().indexOf('稀有度:') > -1) {
    if (clipboard.readText().indexOf('稀有度:') > -1 || clipboard.readText().indexOf('稀 有 度:') > -1) { //这部分为添加代码，不要轻易修改
      this.cleanClipboard()
    }
    this.initLocalStorage()
  },
  mounted() {
    // hotkeys('ctrl+c, command+c', () => this.hotkeyPressed())
    this.scanCopy();
    this.getAllAPI(true);
  },
  methods: {
    initLocalStorage() {
      this.isPriceCollapse = localStorage.getItem('isPriceCollapse') ? JSON.parse(localStorage.getItem('isPriceCollapse')) : true
      if (this.isPriceCollapse) {
        this.searchJson_Def.query.filters.trade_filters.filters.collapse = {
          option: "true"
        }
      } else {
        delete this.searchJson_Def.query.filters.trade_filters.filters.collapse
      }
    },
    checkAPI() {
      this.equipItems.forEach(element => {
        console.log(element.text, element.name, element.option)
      });
    },
    replaceString(string) {
      //const regMatchBrackets = /\((.+?)\)/g // 取出括號內文字    
      const regMatchBrackets = /\(([-a-zA-Z\s':]+?)\)/g // 修改部分，取括号中的英文    
      string = regMatchBrackets.test(string) ? string.match(regMatchBrackets)[0] : string
      const regEnglish = /[\u4e00-\u9fa5]+|\(|\)|．|：/g // 全域搜尋中文字、括號及特定符號，ready for replace
      if (string.indexOf('忆境 ') > -1) { // 追憶物品只取 itemBasic Name
        string = string.slice(3).trim()      
      }
      return this.isGarenaSvr ? string : string.replace(regEnglish, '').trim()
    },
    resetSearchData() {
      this.searchName = ''
      this.fetchID.length = 0
      this.isMap = false
      this.isItem = false
      this.isGem = false
      this.isSupported = true
      this.raritySet.isSearch = false
      this.itemLevel.isSearch = false
      this.itemLevel.max = ''
      this.itemLinked.isSearch = false
      this.itemLinked.min = ''
      this.itemLinked.max = ''
      this.itemBasic.isSearch = false
      this.gemLevel.isSearch = false
      this.gemLevel.max = ''
      this.gemQuality.isSearch = false
      this.gemQuality.max = ''
      this.corruptedSet.chosenObj = {
        label: "任何",
        prop: 'any'
      }
      this.fetchQueryID = ''
      this.status = ''
      this.searchStats = []
    },
    hotkeyPressed() {
      this.searchTotal++
    },
    scanCopy() {
      setInterval(() => {
        this.copyText = clipboard.readText()
      }, 500);
    },
    cleanClipboard() {
      clipboard.writeText('')
    },
    cleanCopyText() {
      this.copyText = ''
    },
    clickOpen() {
      this.$prompt('请输入 e-mail', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[a-z0-9]{32}$|^$/,
        inputErrorMessage: 'e-mail 格式不正确'
      }).then(({
        value
      }) => {
        this.$store.commit('setPOESESSID', value);
        this.$message({
          type: 'success',
          message: `你的 mailID: ${value} 已存储成功`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    apiTest: _.debounce(function () {
      let vm = this
      this.axios.post(`http://localhost:3031/tradeTest`, {
          clipboardText: clipboard.readText()
        })
        .then((response) => {
          this.testResponse = response.data
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 500),
    searchTrade: _.debounce(function (obj) {
      let vm = this
      this.isSupported = true
      if (this.searchJson.query.stats[0].filters.length === 0) {
        this.searchStats.forEach((element, index, array) => {
          let value = {}
          let min = element.min
          let max = element.max
          if (element.isNegative && _.isNumber(min)) {
            value.max = -min
          } else if (_.isNumber(min)) {
            value.min = min
          }
          if (element.isNegative && _.isNumber(max)) {
            value.min = -max
          } else if (_.isNumber(max)) {
            value.max = max
          }
          if (element.option) {
            value.option = element.option
          }
          this.searchJson.query.stats[0].filters.push({
            "id": element.id,
            "disabled": element.isSearch ? false : true,
            "value": value
          })
        })
      }
      this.fetchQueryID = ''
      this.axios.post(`http://localhost:3031/trade`, {
          searchJson: obj,
          baseUrl: this.baseUrl,
          league: this.leagues.chosenL,
          cookie: this.$store.state.POESESSID, //增加逗号
          // cookie:this.cookie
        })
        .then((response) => {
          this.resultLength = response.data.resultLength
          this.searchTotal = response.data.total // 總共搜到幾項物品
          if (response.data.total === 10000) { // 嘗試修復有時搜尋會無法代入條件的 bug
            this.copyText = ''
          }
          this.status = ` 共 ${response.data.total} 笔符合 ${this.isPriceCollapse && response.data.total !== response.data.resultLength ? '- 价格已折叠' : ''}`
          this.fetchID = response.data.fetchID
          this.fetchQueryID = response.data.id
          let limitState = response.data.limitState
          // console.log(limitState, this.$moment().format('HH:mm:ss.SSS'))
          switch (true) { // X-Rate-Limit-Ip: 5:10:60,15:60:300,30:300:1800
            case limitState.third >= 28:
              this.startCountdown(50)
              break;
            case limitState.third >= 24:
              this.startCountdown(10)
              break;
            case limitState.second >= 14:
              this.startCountdown(8)
              break;
            case limitState.second >= 12:
              this.startCountdown(4)
              break;
            case limitState.first >= 4:
              this.startCountdown(2)
              break;
            default:
              break;
          }
        })
        .catch(function (error) {
          let errMsg = JSON.stringify(error.response.data)
          let errJson = JSON.stringify(vm.searchJson) // 针对'Invalid query'问题搜集信息
          vm.issueText = `此次搜索异常！\n${errMsg}\n\`\`\`\n${vm.copyText.replace('稀有度: ', 'Rarity: ')}\`\`\``
          // 判定代码 新增加部分
          if (error.response.data.error.message === 'Invalid query') {
            vm.issueText += `\n${errJson}`
          }
          //判定代码  新增加部分
          vm.itemsAPI()
          vm.isSupported = false
          vm.isStatsCollapse = false
          vm.$message({
            type: 'error',
            message: errMsg
          });
          console.log(errMsg);
        })
    }, 300),
    popOfficialWebsite() {
      shell.openExternal(`${this.baseUrl}/trade/search/${this.leagues.chosenL}/${this.fetchQueryID}`)
    },
    openLink(URL) {
      shell.openExternal(URL)
    },
    startCountdown(Time) {
      this.countTime = Time * 1000
      this.isCounting = true
    },
    handleCountdownEnd() {
      this.isCounting = false
      this.cleanClipboard()
    },
    getAllAPI(boolean) {
      this.isApiError = false
      this.statsAPI();
      this.itemsAPI();
      this.khlupdate(); // khl读取日期更新添加部分
      this.leaguesAPI();
      if (boolean) {
        setTimeout(() => {
          this.gggAPI();
        }, 1000);
      }
    },
    // khl读取更新日期代码部分
    khlupdate() {
      let vm = this
      this.axios.get(`https://gitee.com/wandering_soul/khl-poe-trade/raw/master/update.json`, )
        .then((response) => {
          const getID = _.property('id')
          this.khlupdateinfo.option = _.map(response.data.result, 'id')
          // `_.property` 迭代縮寫 _.map(response.data.result, 'id') = _.map(response.data.result, getID) 
          this.khlupdateinfo.chosenL = this.khlupdateinfo.option[0]
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    // 读取更新日期代码部分
    statsAPI() { // 詞綴 API
      let vm = this
      // this.axios.post(`http://localhost:3031/api/trade/data/stats`, {
      //     baseUrl: this.baseUrl,
      //     cookie: this.cookie,
      // }).then((response) => {
      let result = this.allStats
      //let result = this.allStats.result   //3.162原作者调整的代码，实际有问题，暂时用源代码
      result[0].entries.forEach((element, index) => { // 偽屬性
        let text = element.text
        if (text.indexOf('内有房间：') > -1) { // 刪除 "有房間：" 字串
          text = text.substring(4, 20)
        }
        this.pseudoStats.push(text, element.id)
      })
      result[1].entries.forEach((element, index) => { // 隨機屬性
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        if (text.includes('\n')) { // 處理折行詞綴
          this.wrapStats.push(text)
        }
        this.explicitStats.push(text, element.id)
      })
      result[2].entries.forEach((element, index) => { // 固定屬性
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        if (text.includes('\n')) { // 處理折行詞綴
          this.wrapStats.push(text)
        }
        this.implicitStats.push(text, element.id)
      })
      result[3].entries.forEach((element, index) => { // 破裂
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        this.fracturedStats.push(text, element.id)
      })
      result[4].entries.forEach((element, index) => { // 附魔
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        if (element.id === "enchant.stat_3948993189") { // 星團珠寶固定附魔詞綴
          element.option.options.forEach((element, index) => {
            this.clusterJewelStats.push(element.text, (element.id).toString())
          })
        } else if (element.id === "enchant.stat_2954116742") { // 項鍊塗油配置附魔詞綴
          element.option.options.forEach((element, index) => {
            this.allocatesStats.push(element.text, (element.id).toString())
          })
        }
        if (text.includes('\n')) { // 處理折行詞綴
          this.wrapStats.push(text)
        }
        this.enchantStats.push(text, element.id)
      })
      result[5].entries.forEach((element, index) => { // 災魘詞綴
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        if (text.includes('\n')) { // 處理折行詞綴
          this.wrapStats.push(text)
        }
        this.scourgeStats.push(text, element.id)
      })
      result[6].entries.forEach((element, index) => { // 已工藝
        let text = element.text
        if (text.indexOf(' (区域)') > -1) { // 刪除(部分)字串
          text = text.substring(0, text.indexOf(' (区域)'))
        }
        if (text.includes('\n')) { // 處理折行詞綴
          this.wrapStats.push(text)
        }
        this.craftedStats.push(text, element.id)
      })
      // })
      // .catch(function (error) {
      //   vm.isApiError = true
      //   vm.apiErrorStr = error
      //   vm.startCountdown(10)
      //   vm.resetSearchData()
      //   vm.$message({
      //     type: 'error',
      //     message: `error: ${error}`
      //   });
      //   console.log(error);
      // })
    },
    itemsAPI() { // 物品 API
      let vm = this
      let accessoryIndex = 0
      let armourIndex = 0
      let flasksIndex = 0
      let jewelIndex = 0
      let weaponIndex = 0
      let watchstoneIndex = 0
      let heistIndex = 0
      this.equipItems.length = 0
      this.monstersItems.length = 0
      this.mapBasic.option.length = 0
      this.gemBasic.option.length = 0
      this.axios.post(`http://localhost:3031/api/trade/data/items`, {
          baseUrl: this.baseUrl,
          cookie: this.$store.state.POESESSID,
      }).then((response) => {
          this.allItems = response.data.result
          let result = response.data.result
          result[0].entries.forEach((element, index) => { // "label": "附件"
            const basetype = ["碧珠护身符", "素布腰带", "裂隙戒指", "赏金猎人饰品"]
            // _.isUndefined(element.flags) == true 表示非傳奇物品
            if (_.isUndefined(element.flags)) {
              accessoryIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (accessoryIndex) {
              case 1: // 項鍊起始點 { "type": "碧珠護身符", "text": "碧珠護身符" }
                element.name = "项链"
                element.option = "accessory.amulet"
                this.equipItems.push(element)
                break;
              case 2: // 腰帶起始點 { "type": "素布腰帶", "text": "素布腰帶" }
                element.name = "腰带"
                element.option = "accessory.belt"
                this.equipItems.push(element)
                break;
              case 3: // 戒指起始點 { "type": "裂痕戒指", "text": "裂痕戒指" }  
                element.name = "戒指"
                element.option = "accessory.ring"
                this.equipItems.push(element)
                break;
              case 4: // 飾品起始點 { "type": "盜賊飾品", "text": "盜賊飾品" }  
                element.name = "饰品"
                element.option = "accessory.trinket"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[1].entries.forEach((element, index) => { // "label": "護甲"
            const basetype = ["黄金战甲", "异色鞋(冰闪)", "擒拿手套", "唤骨头盔", "羊皮轻盾", "火焰箭袋"]
            if (_.isUndefined(element.flags)) {
              armourIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (armourIndex) {
              case 1: // 胸甲起始點 { "type": "黃金戰甲", "text": "黃金戰甲" }
                element.name = "胸甲"
                element.option = "armour.chest"
                this.equipItems.push(element)
                break;
              case 2: // 鞋子起始點 { "type": "異色鞋", "text": "異色鞋" }
                element.name = "鞋子"
                element.option = "armour.boots"
                this.equipItems.push(element)
                break;
              case 3: // 手套起始點 { "type": "擒拿手套", "text": "擒拿手套" }
                element.name = "手套"
                element.option = "armour.gloves"
                this.equipItems.push(element)
                break;
              case 4: // 頭部起始點 { "type": "喚骨頭盔", "text": "喚骨頭盔" }
                element.name = "头盔"
                element.option = "armour.helmet"
                this.equipItems.push(element)
                break;
              case 5: // 盾牌起始點 { "type": "黃金聖炎", "text": "黃金聖炎" }
                element.name = "盾"
                element.option = "armour.shield"
                this.equipItems.push(element)
                break;
              case 6: // 箭袋起始點 { "type": "火靈箭袋", "text": "火靈箭袋" }
                element.name = "箭袋"
                element.option = "armour.quiver"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[4].entries.forEach((element, index) => { // "label": "藥劑" 
            const basetype = ["小型复合药剂"]
            if (_.isUndefined(element.flags)) {
              flasksIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (flasksIndex) {
              case 1: // 藥劑起始點 { "type": "小型複合藥劑", "text": "小型複合藥劑" }
                element.name = "药剂"
                element.option = "flask"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[6].entries.forEach((element, index) => { // "label": "珠寶"
            const basetype = ["安睡之凝珠宝"]
            if (_.isUndefined(element.flags)) {
              jewelIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (jewelIndex) {
              case 1: // 珠寶起始點 { "type": "催眠之眼珠寶", "text": "催眠之眼珠寶" }
                element.name = "珠宝"
                element.option = "jewel"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[8].entries.forEach((element, index) => { // "label": "武器"
            const basetype = ["拳钉", "玻璃利片", "锈斧", "朽木之棒", "锈剑", "朽木法杖", "鱼竿", "粗制弓", "朽木之干", "石斧", "朽木巨锤", "锈斑巨剑"]
            if (_.isUndefined(element.flags)) {
              weaponIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (weaponIndex) {
              case 1: // 爪起始點 { "type": "拳釘", "text": "拳釘" }
                element.name = "爪"
                element.option = "weapon.claw"
                element.weapon = "weapon.one" // "weapon.one" 單手武器
                this.equipItems.push(element)
                break;
              case 2: // 匕首起始點 { "type": "玻璃利片", "text": "玻璃利片" }
                element.name = "匕首"
                element.option = "weapon.dagger"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 3: // 單手斧起始點 { "type": "鏽斧", "text": "鏽斧" }
                element.name = "单手斧"
                element.option = "weapon.oneaxe"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 4: // 單手錘起始點 { "type": "朽木之棒", "text": "朽木之棒" }
                element.name = "单手锤"
                element.option = "weapon.onemace"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 5: // 單手劍起始點 { "type": "鏽劍", "text": "鏽劍" }
                element.name = "单手剑"
                element.option = "weapon.onesword"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 6: // 法杖起始點 { "type": "朽木法杖", "text": "朽木法杖" }
                element.name = "法杖"
                element.option = "weapon.wand"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 7: // { "type": "魚竿", "text": "魚竿" }
                element.name = "鱼竿"
                element.option = "weapon.rod"
                this.equipItems.push(element)
                break;
              case 8: // 弓起始點 { "type": "粗製弓", "text": "粗製弓" }
                element.name = "弓"
                element.option = "weapon.bow"
                this.equipItems.push(element)
                break;
              case 9: // 長杖起始點 { "type": "朽木之幹", "text": "朽木之幹" }
                element.name = "长杖"
                element.option = "weapon.staff"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 10: // 雙手斧起始點 { "type": "石斧", "text": "石斧" }
                element.name = "双手斧"
                element.option = "weapon.twoaxe"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 11: // 雙手錘起始點 { "type": "朽木巨錘", "text": "朽木巨錘" }
                element.name = "双手锤"
                element.option = "weapon.twomace"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 12: // 雙手劍起始點 { "type": "鏽斑巨劍", "text": "鏽斑巨劍" }
                element.name = "双手剑"
                element.option = "weapon.twosword"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[11].entries.forEach((element, index) => { // "label": "守望石"
            const basetype = ["纯白守望石"]
            if (_.isUndefined(element.flags)) {
              watchstoneIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (watchstoneIndex) {
              case 1: // 一般守望石起始點 { "type": "象白守望石", "text": "象白守望石" }
                element.name = "守望石"
                element.option = "watchstone"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[12].entries.forEach((element, index) => { // "label": "劫盜裝備"
            const basetype = ["鳗皮鞋底"]
            if (_.isUndefined(element.flags)) {
              heistIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (heistIndex) {
              case 1: // 劫盜裝備起始點 { "type": "鰻皮鞋底", "text": "鰻皮鞋底" }
                element.name = "劫盗装备"
                element.option = "heistequipment"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[7].entries.forEach((element, index) => { // "label": "地圖" 
            const basetype = ["恶灵学院"] // 地圖起始點 { "type": "惡靈學院", "text": "惡靈學院" }
            if (_.isUndefined(element.flags) && element.disc === "warfortheatlas") { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
              this.mapBasic.option.push(element.text)
            } else if (element.text.indexOf('贤主之邀：') > -1) { // 3.13 釋界之邀
              element.name = "贤主之邀"
              element.option = "map.invitation"
              this.equipItems.push(element)
            }
          });
          result[5].entries.forEach((element, index) => { // "label": "技能寶石"
            this.gemBasic.option.push(element.text)
          });
          result[11].entries.forEach((element, index) => { // "label": "物品化怪物"
            this.monstersItems.push(element)
          });
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    leaguesAPI() { // 聯盟 API
      let vm = this
      this.axios.post(`http://localhost:3031/api/trade/data/leagues`, {
          baseUrl: this.baseUrl,
          cookie: this.$store.state.POESESSID,// 增加逗号
      }).then((response) => {
          const getID = _.property('id')
          this.leagues.option = _.map(response.data.result, 'id')
          // `_.property` 迭代縮寫 _.map(response.data.result, 'id') = _.map(response.data.result, getID) 
          this.leagues.chosenL = this.leagues.option[0]
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    gggAPI() {
      let vm = this
      const ignoreTyep = [""] // 國際服的圖沒有這三種基底
      let tempMapBasic = []
      this.mapBasic.option.forEach((element, index) => {
        if (stringSimilarity.findBestMatch(element, ignoreTyep).bestMatch.rating !== 1) { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
          tempMapBasic.push(element)
        }
      });
      this.axios.get(`https://www.pathofexile.com/api/trade/data/leagues`, )
        .then((response) => {
          this.gggLeagues = _.map(response.data.result, 'id')
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
      this.axios.get(`https://www.pathofexile.com/api/trade/data/items`, )
        .then((response) => {
          let result = response.data.result
          let mapMatchIndex = 0
          result[7].entries.forEach((element, index) => { // "label": "Maps"
            const basetype = ["Academy Map"] // 地圖起始點 { "type": "Academy Map", "text": "Academy Map" }
            if (stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1) {
              mapMatchIndex = index
            }
            if (_.isUndefined(element.flags) && element.disc === "warfortheatlas") { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
              this.gggMapBasic.push(`${tempMapBasic[index - mapMatchIndex]} (${element.text})`)
            }
          });
          let bloodthirstGemIndex = 0
          result[5].entries.forEach((element, index) => { // "label": "Gems"
            if (element.text === 'Bloodthirst Support') { // 解決台服將 Bloodthirst Support, Bloodlust Support 都翻譯為嗜血輔助的 bug   此处待确定
              bloodthirstGemIndex += 1
              this.gggGemBasic.push(`嗜血輔助 (${element.text})`)
            } else {
              this.gggGemBasic.push(`${this.gemBasic.option[index - bloodthirstGemIndex]} (${element.text})`)
            }
          });
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          console.log(error);
        })
    },
    mapAreaCopy(name) {
      clipboard.writeText(name)
      this.$message({
        duration: 1200,
        type: 'success',
        message: `${name} 区域已复制!`
      });
      this.isMapAreaCollapse = false
    },
    issueTextCopy() {
      clipboard.writeText(this.issueText)
      this.$message({
        duration: 1200,
        type: 'success',
        message: `有问题的物品信息已复制!`
      });
    },
    addAfterCopyText() {
      clipboard.writeText(`${clipboard.readText()} ${this.wantedAddedText}`)
      this.$message({
        duration: 2000,
        type: 'success',
        message: `已复制信息：${clipboard.readText().substring(0, 10)} ... ${this.wantedAddedText}`
      });
    },
    clickToSearch: _.debounce(function () { // TODO: 重構物品/地圖交替搜尋時邏輯 stats: [{type: "and", filters: [], disabled: true(?)}]
      if (this.isItem) {
        this.searchJson.query.stats[0].filters.length = 0
      }
      if (this.isMap && this.mapBasic.isSearch) {
        this.searchName = `物品名称 <br>『${this.mapBasic.chosenM}』`
      }
      if (this.isGem && this.gemBasic.isSearch) {
        this.searchName = `物品名称 <br>『${this.gemQualitySet.chosenObj.prop !== '0' && this.gemQualitySet.isSearch ? `${this.gemQualitySet.chosenObj.label} ` : ''}${this.gemBasic.chosenG}』`
      }
      this.searchTrade(this.searchJson)
    }, 500),
    itemStatsAnalysis(itemArray, rarityFlag) {
      let priceText = itemArray[itemArray.length - 2]
      if (priceText.indexOf(': ~b/o') > -1 || priceText.indexOf(': ~price') > -1 || priceText.indexOf('Note:') > -1) {
        // 處理在高倉標價後搜尋的物品陣列
        itemArray.splice(itemArray.length - 3, 2)
      }
      if (itemArray.indexOf('塑界之器') > -1) // 勢力判斷由 itemAnalysis function 處理
        itemArray.splice(itemArray.indexOf('塑界之器'), 1)
      if (itemArray.indexOf('裂界之器') > -1)
        itemArray.splice(itemArray.indexOf('裂界之器'), 1)
      if (itemArray.indexOf('圣战者物品') > -1)
        itemArray.splice(itemArray.indexOf('圣战者物品'), 1)
      if (itemArray.indexOf('救赎者物品') > -1)
        itemArray.splice(itemArray.indexOf('救赎者物品'), 1)
      if (itemArray.indexOf('狩猎者物品') > -1)
        itemArray.splice(itemArray.indexOf('狩猎者物品'), 1)
      if (itemArray.indexOf('督军物品') > -1)
        itemArray.splice(itemArray.indexOf('督军物品'), 1)

      let clusterA = itemArray.findIndex((e) => e.indexOf('个增加的天赋为【珠宝槽】') > -1) // 星團珠寶贅詞
      let clusterB = itemArray.findIndex((e) => e.indexOf('增加的天赋跟珠宝范围无关。可以右键点击从插槽中移除。') > -1)
      if (clusterB > -1)
        itemArray.splice(clusterB, 1)
      if (clusterA > -1)
        itemArray.splice(clusterA, 1)

      this.isStatsCollapse = rarityFlag ? false : true
      let tempStat = []
      let itemDisplayStats = [] // 該物品顯示的詞綴陣列
      let itemStatStart = 0 // 物品隨機詞綴初始位置
      let itemStatEnd = itemArray.length - 1 // 物品隨機詞綴結束位置

      function spliceWrapStats(spliceNumber, index) { //配合 splice function 與 \n 數量調整詞綴結束位置
        itemArray.splice(index + 1, spliceNumber)
        itemStatEnd = itemArray.length - spliceNumber
      }

      itemArray.forEach((element, index) => {
        let isEndPoint = index > 0 ? itemArray[index - 1].indexOf("(enchant)") > -1 || itemArray[index - 1].indexOf("(implicit)") > -1 || itemArray[index - 1].indexOf("(scourge)") > -1 : false
        // "--------" 字串前一筆資料若為固定詞或附魔詞或災魘詞，則不將此 index 視為詞綴結束點
        if (stringSimilarity.compareTwoStrings(element, '魔符等级:') > 0.7) {
          itemStatStart = index + 2
        } else if (stringSimilarity.compareTwoStrings(element, '物品等级:') > 0.7) {
          itemStatStart = index + 2
        }
        this.wrapStats.forEach((wrapStatsElement, wrapStatsIndex) => {
          let firstWSE = wrapStatsElement.split("\n")[0]
          let secondWSE = wrapStatsElement.split("\n")[1]
          let newLineCount = wrapStatsElement.split("\n").length - 1
          let tempStatArray = []
          // 比對折行詞綴第一筆與第二筆，比對成功就將 itemArray 刪除指定筆數
          if (element && stringSimilarity.compareTwoStrings(firstWSE, element) > 0.7 && stringSimilarity.compareTwoStrings(secondWSE, itemArray[index + 1]) > 0.7) {
            for (let i = 0; i <= newLineCount; i++) {
              tempStatArray.push(itemArray[index + i])
            }
            itemArray[index] = tempStatArray.join('\n')
            spliceWrapStats(newLineCount, index)
          }
        });
        if (element.indexOf("增加的小天赋获得：") > -1 && element.indexOf("(enchant)") > -1) { // 有折行的星團珠寶附魔詞綴
          switch (true) {
            case element.indexOf("斧类攻击造成的击中和异常状态伤害提高 12%") > -1:
              itemArray[index] = `${itemArray[index]}\n剑类攻击造成的击中和异常状态伤害提高 12% (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("长杖攻击造成的击中和异常状态伤害提高 12%") > -1:
              itemArray[index] = `${itemArray[index]}\n锤类或短杖攻击造成的击中和异常状态伤害提高 12% (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("爪类攻击造成的击中和异常状态伤害提高 12%") > -1:
              itemArray[index] = `${itemArray[index]}\n匕首攻击造成的击中和异常状态伤害提高 12% (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("弓类的伤害提高 12%") > -1:
              itemArray[index] = `${itemArray[index]}\n弓类技能的持续伤害效果提高 12% (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("陷阱伤害提高 12%") > -1:
              itemArray[index] = `${itemArray[index]}\n地雷伤害提高 12% (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("药剂回复的生命提高 10%") > -1:
              itemArray[index] = `${itemArray[index]}\n药剂回复的魔力提高 10% (enchant)`
              spliceWrapStats(1, index)
              break;
            default:
              break;
          }
        } else if (element.indexOf("只影响") > -1 && element.indexOf("范围内配置") > -1) { // 希望之絃 Thread of Hope 特殊判斷
          let areaStat = itemArray[index].substr(3, 1)
          itemArray[index] = `Only affects Passives in # Ring,${areaStat}`
        }
        if (element === "--------" && !isEndPoint && itemStatStart && index > itemStatStart && itemStatEnd == itemArray.length - 1) { // 判斷隨機詞墜結束點
          itemStatEnd = index
        }
        if (element.indexOf('未鉴定') > -1) {
          itemStatEnd = index - 1
          return
        }
      });

      for (let index = itemStatStart; index < itemStatEnd; index++) {
        if (itemArray[index] !== "--------" && itemArray[index]) {
          let text = itemArray[index]
          itemDisplayStats.push(itemArray[index])
          if (itemArray[index].indexOf('(implicit)') > -1) { // 固定屬性
            text = text.substring(0, text.indexOf('(implicit)')) // 刪除(implicit)字串
            tempStat.push(this.findBestStat(text, this.implicitStats))
            tempStat[tempStat.length - 1].type = "基底"
          } else if (itemArray[index].indexOf('(fractured)') > -1) { // 破裂
            text = text.substring(0, text.indexOf('(fractured)'))
            tempStat.push(this.findBestStat(text, this.fracturedStats))
            tempStat[tempStat.length - 1].type = "分裂的"
          } else if (itemArray[index].indexOf('(scourge)') > -1) { // 災魘
            text = text.substring(0, text.indexOf('(scourge)'))
            tempStat.push(this.findBestStat(text, this.scourgeStats))
            tempStat[tempStat.length - 1].type = "天灾" 
          } else if (itemArray[index].indexOf('(crafted)') > -1) { // 已工藝屬性
            text = text.substring(0, text.indexOf('(crafted)'))
            tempStat.push(this.findBestStat(text, this.craftedStats))
            tempStat[tempStat.length - 1].type = "工艺的"
          } else if (itemArray[index].indexOf('(enchant)') > -1) {
            text = text.substring(0, text.indexOf('(enchant)'))
            if (text.indexOf('增加的小天赋获得：') > -1) {
              tempStat.push(this.findBestStat('增加的小天赋获得：#', this.enchantStats))
            } else {
              tempStat.push(this.findBestStat(text, this.enchantStats))
            }
            tempStat[tempStat.length - 1].type = "附魔"
          } else if (rarityFlag) { // 傳奇裝詞綴
            tempStat.push(this.findBestStat(text, this.explicitStats))
            tempStat[tempStat.length - 1].type = "传奇"
          } else { // 隨機屬性
            tempStat.push(this.findBestStat(text, this.explicitStats))
            tempStat[tempStat.length - 1].type = "随机"
          }
        }
      }
      //console.log(itemDisplayStats)  //这里是断点
      //console.log(tempStat)  //这里是断点
      let elementalResistanceTotal = 0
      let spellDamageTotal = 0
      tempStat.forEach((element, idx, array) => { // 比對詞綴，抓出隨機數值與詞綴搜尋 ID
        let isStatSearch = false
        //let statID = element.ratings[element.bestMatchIndex + 1].target // 詞綴ID
        let bestIndex = (element.bestMatchIndex % 2 === 0) ? element.bestMatchIndex + 1 : element.bestMatchIndex // 處理判斷到英文詞綴的例外狀況，通常是季初有新詞綴尚未翻譯時才發生
        let statID = element.ratings[bestIndex].target // 詞綴ID
        let apiStatText = element.bestMatch.target // API 抓回來的詞綴字串
        let itemStatText = itemDisplayStats[idx] // 物品上的詞綴字串
        // A大补丁中 替换[]中词缀信息 由于A大补丁问题，这部分代码不一定能执行，需要后期A大补丁支持
        let AmosePatchRE = /\[(.+?)\]|\((★.+[^\w])\)|▲|▽/g 
        itemStatText = itemStatText.replace(AmosePatchRE, '') // 將 AmosePatch 詞綴中的 ▲▽[ ]( ) 及其內容通通去掉， ( ) 內若為英文則不去除
        //console.log(itemStatText)       
        //A大补丁中 替换[]中词缀信息结束
        switch (true) { // 部分(Local)屬性判斷處理：若物品為武器，攻擊屬性應為（部分）標籤
          case statID.indexOf('stat_960081730') > -1 || statID.indexOf('stat_1940865751') > -1: // 附加 # 至 # 物理傷害 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) { // 武器類別
              statID = `${statID.split('.')[0]}.stat_1940865751`
            } else { // 非武器
              statID = `${statID.split('.')[0]}.stat_960081730`
            }
            break;
          case statID.indexOf('stat_321077055') > -1 || statID.indexOf('stat_709508406') > -1: // 附加 # 至 # 火焰傷害 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_709508406`
            } else {
              statID = `${statID.split('.')[0]}.stat_321077055`
            }
            break;
          case statID.indexOf('stat_3531280422') > -1 || statID.indexOf('stat_2223678961') > -1: // 附加 # 至 # 混沌傷害 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_2223678961`
            } else {
              statID = `${statID.split('.')[0]}.stat_3531280422`
            }
            break;
          case statID.indexOf('stat_1334060246') > -1 || statID.indexOf('stat_3336890334') > -1: // 附加 # 至 # 閃電傷害 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_3336890334`
            } else {
              statID = `${statID.split('.')[0]}.stat_1334060246`
            }
            break;
          case statID.indexOf('stat_2387423236') > -1 || statID.indexOf('stat_1037193709') > -1: // 附加 # 至 # 冰冷傷害 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_1037193709`
            } else {
              statID = `${statID.split('.')[0]}.stat_2387423236`
            }
            break;
          case statID.indexOf('stat_681332047') > -1 || statID.indexOf('stat_210067635') > -1: // 攻擊速度 (部分) 
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_210067635`
            } else {
              statID = `${statID.split('.')[0]}.stat_681332047`
            }
            break;
          case statID.indexOf('stat_681332047') > -1 || statID.indexOf('stat_210067635') > -1: // 攻擊速度 (部分) 
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_210067635`
            } else {
              statID = `${statID.split('.')[0]}.stat_681332047`
            }
            break;
          case statID.indexOf('stat_3593843976') > -1 || statID.indexOf('stat_55876295') > -1: // #% 的物理攻擊傷害偷取生命 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_55876295`
            } else {
              statID = `${statID.split('.')[0]}.stat_3593843976`
            }
            break;
          case statID.indexOf('stat_3237948413') > -1 || statID.indexOf('stat_669069897') > -1: // #% 所造成的物理攻擊傷害偷取魔力 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('weapon') > -1) {
              statID = `${statID.split('.')[0]}.stat_669069897`
            } else {
              statID = `${statID.split('.')[0]}.stat_3237948413`
            }
            break;
            // 若物品為護甲，防禦屬性應為（部分）標籤
          case statID.indexOf('stat_2144192055') > -1 || statID.indexOf('stat_53045048') > -1: // # 點閃避值 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) { // 護甲類別
              statID = `${statID.split('.')[0]}.stat_53045048`
            } else { // 非護甲
              statID = `${statID.split('.')[0]}.stat_2144192055`
            }
            break;
          case statID.indexOf('stat_2106365538') > -1 || statID.indexOf('stat_124859000') > -1: // 增加 #% 閃避值 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_124859000`
            } else {
              statID = `${statID.split('.')[0]}.stat_2106365538`
            }
            break;
          case statID.indexOf('stat_809229260') > -1 || statID.indexOf('stat_3484657501') > -1: // # 點護甲 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_3484657501`
            } else {
              statID = `${statID.split('.')[0]}.stat_809229260`
            }
            break;
          case statID.indexOf('stat_2866361420') > -1 || statID.indexOf('stat_1062208444') > -1: // 增加 #% 護甲 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_1062208444`
            } else {
              statID = `${statID.split('.')[0]}.stat_2866361420`
            }
            break;
          case statID.indexOf('stat_3489782002') > -1 || statID.indexOf('stat_4052037485') > -1: // # 最大能量護盾 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_4052037485`
            } else {
              statID = `${statID.split('.')[0]}.stat_3489782002`
            }
            break;
          default:
            break;
        }
        let itemStatArray = itemStatText.split(' ') // 將物品上的詞綴拆解
        let matchStatArray = apiStatText.split(' ') // 將詞綴資料庫上的詞綴拆解
        //console.log(itemStatText)  //这里是断点
        //console.log(matchStatArray)  //这里是断点
        let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
        let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
        let optionValue = 0 // 星團珠寶附魔 / 項鍊塗油配置 的 ID

        if (statID === "enchant.stat_3948993189") {
          isStatSearch = true
          let obj = stringSimilarity.findBestMatch(itemStatText, this.clusterJewelStats)
          optionValue = parseInt(obj.ratings[obj.bestMatchIndex + 1].target, 10)
          apiStatText = `增加的小天赋获得：\n${obj.ratings[obj.bestMatchIndex].target}`
        } else if (statID === "enchant.stat_2954116742") {
          let obj = stringSimilarity.findBestMatch(itemStatText, this.allocatesStats)
          optionValue = parseInt(obj.ratings[obj.bestMatchIndex + 1].target, 10)
          apiStatText = `配置 涂油天赋：${obj.ratings[obj.bestMatchIndex].target}` //此处需要确认
        } else if (statID === "explicit.stat_3642528642") {
          isStatSearch = true
          this.isStatsCollapse = true
          let areaStat = itemStatText.split(',')[1]
          switch (areaStat) {
            case '小':
              optionValue = '1'
              break;
            case '中':
              optionValue = '2'
              break;
            case '大':
              optionValue = '3'
              break;
            case '非':
              optionValue = '4'
              areaStat = '非常大'
              break;
            default:
              break;
          }
          apiStatText = `只影响『${areaStat}』范围天赋`  // 此处可能有问题
        } else {
          for (let index = 0; index < itemStatArray.length; index++) { // 比較由空格拆掉後的詞綴陣列元素
            if (randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 物品詞綴最大值
              randomMaxValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
              randomMaxValue = isNaN(randomMaxValue) ? '' : randomMaxValue
            }
            if (!randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 物品詞綴最小值
              randomMinValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
              randomMinValue = isNaN(randomMinValue) ? '' : randomMinValue
              if (matchStatArray[index]) {
                if (matchStatArray[index].indexOf('，#') > -1) { // 處理隨機數值在'，'後的詞綴(無法用空格符號 split)
                  let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('，') + 1)
                  randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
                } else if (matchStatArray[index].indexOf('：#') > -1) { // 處理隨機數值在'：'後的詞綴(無法用空格符號 split)
                  let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('：') + 1)
                  randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
                }
              }
            }
          }
        }
        let isNegativeStat = false // API 詞綴只有"增加"，但物品可能有"減少"詞綴相關處理
        if (apiStatText.includes('提高') && itemStatText.includes('降低')) {
          apiStatText = apiStatText.replace('提高', '降低')
          isNegativeStat = true
        }
        if (statID === "enchant.stat_3086156145" || statID === "explicit.stat_1085446536") { // cluster jewel analysis
          isStatSearch = true
          this.isStatsCollapse = true
          let tempValue = randomMinValue
          switch (randomMinValue) { // 附加天賦數判斷
            case 4:
              randomMaxValue = randomMinValue + 1
              break;
            case 5:
              randomMaxValue = tempValue
              randomMinValue = tempValue - 1
              break;
            default:
              randomMaxValue = tempValue
              break;
          }
          switch (true) { // 物品等級區分判斷 
            case this.itemLevel.min >= 84:
              this.itemLevel.min = 84
              break;
            case this.itemLevel.min >= 75:
              this.itemLevel.min = 75
              break;
            case this.itemLevel.min >= 68:
              this.itemLevel.min = 68
              break;
            case this.itemLevel.min >= 50:
              this.itemLevel.min = 50
              break;
            case this.itemLevel.min < 50:
              this.itemLevel.min = ''
              this.itemLevel.max = 49
              break;
            default:
              break;
          }
          this.itemLevel.isSearch = true
        } else if (randomMaxValue) { // 物品中包含 "# 至 #" 的詞綴，在官方市集搜尋中皆以相加除二作搜尋
          randomMinValue = (randomMinValue + randomMaxValue) / 2
          randomMaxValue = ''
        }
        switch (true) { // 計算三元素抗性至偽屬性
          case statID.indexOf('stat_3372524247') > -1 || statID.indexOf('stat_1671376347') > -1 || statID.indexOf('stat_4220027924') > -1:
            // 單抗詞綴 '火焰抗性' || '閃電抗性' || '冰冷抗性'
            elementalResistanceTotal += randomMinValue
            break;
          case statID.indexOf('stat_2915988346') > -1 || statID.indexOf('stat_3441501978') > -1 || statID.indexOf('stat_4277795662') > -1:
            // 雙抗詞綴 '火焰與冰冷抗性' || '火焰與閃電抗性' || '冰冷與閃電抗性'
            elementalResistanceTotal += (randomMinValue * 2)
            break;
          case statID.indexOf('stat_2901986750') > -1:
            // 三抗詞綴 '全部元素抗性'
            elementalResistanceTotal += (randomMinValue * 3)
            break;
          case statID.indexOf('stat_2974417149') > -1:
            // "增加 #% 法術傷害"
            spellDamageTotal += randomMinValue
            break;
          default:
            break;
        }
        if (elementalResistanceTotal && idx === array.length - 1) {
          this.searchStats.unshift({ // 若該裝備有抗性詞，增加偽屬性至詞綴最前端
            "id": "pseudo.pseudo_total_elemental_resistance",
            "text": `+#% 最大元素抗性`,
            "option": optionValue,
            "min": elementalResistanceTotal,
            "max": '',
            "isValue": true,
            "isNegative": false,
            "isSearch": false,
            "type": "综合"
          })
        }
        if (spellDamageTotal && idx === array.length - 1) {
          this.searchStats.unshift({ // 計算法術傷害偽屬性
            "id": "pseudo.pseudo_increased_spell_damage",
            "text": `#% 法术伤害提高`,
            "option": optionValue,
            "min": spellDamageTotal,
            "max": '',
            "isValue": true,
            "isNegative": false,
            "isSearch": false,
            "type": "综合"
          })
        }
        this.searchStats.push({
          "id": statID,
          "text": apiStatText,
          "option": optionValue,
          "min": randomMinValue,
          "max": randomMaxValue,
          "isValue": randomMinValue ? true : false,
          "isNegative": isNegativeStat,
          "isSearch": isStatSearch,
          "type": element.type
        })
      })
    },
    templeStatsAnalysis(itemArray) {
      if (itemArray.indexOf('内有房间：') > -1) // 只判斷是否有該房間，受阻房間可用彈藥房炸通
        itemArray.splice(itemArray.indexOf('内有房间：'), 1)

      let tempStat = []
      let itemStatStart = 6 // 開啟房間： index = 5
      let itemStatEnd = 17 //  房間 index 結束點

      for (let index = itemStatStart; index <= itemStatEnd; index++) {
        tempStat.push(this.findBestStat(itemArray[index], this.pseudoStats))
        tempStat[tempStat.length - 1].type = "综合"
      }

      tempStat.forEach((element, idx) => {
        let statID = element.ratings[element.bestMatchIndex + 1].target // 詞綴ID
        let apiStatText = element.bestMatch.target // API 抓回來的詞綴字串
        let isLevel3Room = (apiStatText.indexOf('3 阶') > -1)

        //console.log(apiStatText, isLevel3Room)
        if (isLevel3Room) { // 只保留階級三房間
          this.searchStats.push({
            "id": statID,
            "text": apiStatText,
            "option": '',
            "min": '',
            "max": '',
            "isValue": false,
            "isNegative": false,
            "isSearch": false,
            "type": element.type
          })
        }
      })
    },
    findBestStat(text, stats) { // 物品上原先詞綴 與 原先詞綴數值用 '#' 取代的兩種字串皆判斷並取最符合那一筆
      let floatValue = []
      let reference = []

      let originalObj = stringSimilarity.findBestMatch(text, stats)
      let modifiedObj = stringSimilarity.findBestMatch(text.replace(/\d+/g, '#'), stats)

      reference.push(originalObj, modifiedObj)
      floatValue.push(originalObj.bestMatch.rating, modifiedObj.bestMatch.rating)

      if (text.includes('降低')) { // 處理物品上原先詞綴包含 '減少' 的情況：因部分詞綴於 api 中只顯示 '增加'，會造成詞綴誤判
        text = text.replace('降低', '提高')
        let specialOriginalObj = stringSimilarity.findBestMatch(text, stats)
        let specialModifiedObj = stringSimilarity.findBestMatch(text.replace(/\d+/g, '#'), stats)
        reference.push(specialOriginalObj, specialModifiedObj)
        floatValue.push(specialOriginalObj.bestMatch.rating, specialModifiedObj.bestMatch.rating)
        // console.log(floatValue)
      }

      let maxFloat = Math.max.apply(null, floatValue);
      let index = floatValue.indexOf(maxFloat);

      return reference[index]
    },
    isRaritySearch() {
      if (!this.raritySet.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.type_filters.filters.rarity // 刪除稀有度 filter
      } else if (this.raritySet.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.type_filters.filters.rarity = { // 增加稀有度 filter
          "option": this.raritySet.chosenObj.prop
        }
        if (this.isMap && this.raritySet.chosenObj.label === '传奇') {
          this.mapCategory = {
            isShaper: false,
            isElder: false,
            isBlighted: false
          }
        }
      }
    },
    itemAnalysis(item, itemArray, matchItem) {
      const NL = this.newLine
      this.itemCategory.option.length = 0
      this.itemExBasic.chosenObj = {
        label: "任何",
        prop: ''
      }
      this.raritySet.chosenObj = {
        label: "非传奇",
        prop: 'nonunique'
      }
      this.raritySet.isSearch = true
      this.isRaritySearch()
      // 判斷物品基底
      this.itemBasic.text = matchItem.text
      // 判斷物品等級
      if (item.indexOf('物品等级: ') > -1) {
        let levelPos = item.substring(item.indexOf('物品等级: ') + 5)
        let levelPosEnd = levelPos.indexOf(NL)
        let levelValue = parseInt(levelPos.substring(0, levelPosEnd).trim(), 10)
        this.itemLevel.min = levelValue >= 86 ? 86 : levelValue // 物等超過86 只留86
      }
      // 判斷插槽連線
      if (item.indexOf('插槽: ') > -1) {
        const regLinkStr = /[A-Z]/g // 全域搜尋大寫英文字母
        const regLink6 = /(-){5}/g // 六連
        const regLink5 = /(-){4}/g // 五連
        const regLink4 = /(-){3}/g // 四連
        let linkedPos = item.substring(item.indexOf('插槽: ') + 3)
        let linkedPosEnd = linkedPos.indexOf(NL)
        let linkedString = linkedPos.substring(0, linkedPosEnd).trim().replace(regLinkStr, '')
        switch (true) {
          case regLink6.test(linkedString) == true:
            this.itemLinked.min = 6
            break;
          case regLink5.test(linkedString) == true:
            this.itemLinked.min = 5
            break;
          case regLink4.test(linkedString) == true:
            this.itemLinked.min = 4
            break;
          default:
            break;
        }
      }
      // 判斷物品分類
      this.itemCategory.option.push({
        label: matchItem.name,
        prop: matchItem.option,
      })
      this.itemCategory.chosenObj = {
        label: matchItem.name,
        prop: matchItem.option,
      }
      if (matchItem.weapon) {
        this.itemCategory.option.push({
          label: matchItem.weapon === "weapon.one" ? "单手武器" : "双手武器",
          prop: matchItem.weapon === "weapon.one" ? "weapon.one" : "weapon.twomelee",
        })
      }
      this.itemCategory.isSearch = true
      this.isItemCategorySearch()
      // 判斷勢力基底
      this.itemExBasic.isSearch = true
      switch (true) {
        case itemArray.indexOf('塑界之器') > -1:
          this.itemExBasic.chosenObj = {
            label: "塑界之器",
            prop: "shaper_item"
          }
          break;
        case itemArray.indexOf('裂界之器') > -1:
          this.itemExBasic.chosenObj = {
            label: "裂界之器",
            prop: "elder_item"
          }
          break;
        case itemArray.indexOf('圣战者物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "圣战者物品",
            prop: "crusader_item"
          }
          break;
        case itemArray.indexOf('救赎者物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "救赎者物品",
            prop: "redeemer_item"
          }
          break;
        case itemArray.indexOf('督军物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "督军物品",
            prop: "warlord_item"
          }
          break;
        case itemArray.indexOf('狩猎者物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "狩猎者物品",
            prop: "hunter_item"
          }
          break;
        default:
          this.itemExBasic.isSearch = false
          break;
      }
      this.isExBasicSearch()

      switch (matchItem.option) { // 藥劑、守望石、釋界之邀、劫盜裝備會自動搜尋該基底
        case 'flask':
          this.itemLevel.isSearch = true // 3.16 藥劑增加物等篩選
        case 'watchstone':
        case 'map.invitation':
        case 'heistequipment':
          this.itemBasic.isSearch = true
          this.isItemBasicSearch()
          this.searchTrade(this.searchJson)
          break;
        default:
          break;
      }
    },
    isItemLevelSearch() {
      if (!this.itemLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.ilvl // 刪除物品等級 filter
      } else if (this.itemLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.ilvl = { // 增加物品等級最小值 filter
          "min": this.itemLevel.min ? this.itemLevel.min : null,
          "max": this.itemLevel.max ? this.itemLevel.max : null
        }
      }
    },
    isLinkedSearch() { // 插槽連線設定
      if (!this.itemLinked.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.socket_filters // 刪除連線設定 filter
      } else if (this.itemLinked.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.socket_filters = { // 增加物品連線 filter
          "filters": {
            "links": {
              "min": this.itemLinked.min ? this.itemLinked.min : null,
              "max": this.itemLinked.max ? this.itemLinked.max : null
            }
          }
        }
      }
    },
    isItemBasicSearch() {
      if (!this.itemBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除物品基底 filter
      } else if (this.itemBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.itemBasic.text) // 增加物品基底 filter
      }
    },
    isItemCategorySearch() {
      if (!this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.type_filters.filters.category // 刪除物品種類 filter
      } else if (this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.type_filters.filters.category = { // 增加物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
    },
    corruptedInput() { // 已汙染設定
      if (this.isSearchJson && this.corruptedSet.chosenObj.prop === 'any') {
        delete this.searchJson.query.filters.misc_filters.filters.corrupted // 刪除已汙染 filter
        this.corruptedSet.chosenObj = {
          label: "任何",
          prop: 'any'
        }
        this.searchTrade(this.searchJson)
      } else if (this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.corrupted = {
          "option": this.corruptedSet.chosenObj.prop
        }
        this.searchTrade(this.searchJson)
      }
    },
    excludeCorrupted() { // 排除已污染
      this.corruptedSet.chosenObj = {
        label: "否",
        prop: 'false'
      }
      this.corruptedInput()
    },
    gemQualityTypeInput() { // 寶石替代品質設定 
      if (!this.gemQualitySet.isSearch && this.gemQualitySet.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.gem_alternate_quality // 刪除寶石替代品質 filter
      } else if (this.gemQualitySet.isSearch && this.gemQualitySet.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.gem_alternate_quality = {
          "option": this.gemQualitySet.chosenObj.prop
        }
      }
    },
    isExBasicSearch() {
      if (!this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] // 刪除勢力選項
      } else if (this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
    },
    categoryChange(value) {
      if (this.isSearchJson) {
        this.searchJson.query.filters.type_filters.filters.category = { // 修改物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
    },
    exBasicChange(value) {
      let exSearchItem = !this.itemExBasic.chosenObj.prop ? '' : this.itemExBasic.chosenObj.prop // 前一個搜尋的勢力選項
      if (this.isSearchJson && this.searchJson.query.filters.misc_filters.filters.hasOwnProperty(exSearchItem)) {
        delete this.searchJson.query.filters.misc_filters.filters[exSearchItem] // 刪除前一個勢力選項
      }
      if (this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters[value.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
      this.itemExBasic.chosenObj = value
    },
    priceSettingChange() {
      this.searchJson_Def.query.filters.trade_filters.filters.price.min = this.storePriceMin ? this.storePriceMin : null
      this.searchJson_Def.query.filters.trade_filters.filters.price.max = this.storePriceMax ? this.storePriceMax : null
      if (this.priceSetting.chosenObj.prop) {
        this.searchJson_Def.query.filters.trade_filters.filters.price.option = this.priceSetting.chosenObj.prop
      } else {
        delete this.searchJson_Def.query.filters.trade_filters.filters.price.option
      }
      if (this.isSearchJson) {
        this.searchJson.query.filters.trade_filters.filters.price = this.searchJson_Def.query.filters.trade_filters.filters.price
        this.searchTrade(this.searchJson)
      }
      this.$message({
        type: 'success',
        message: `价格设置已更新！`
      });
    },
    scrollToPriceAnalysis() {
      // console.log(this.$refs.refAnalysis)
      this.$nextTick(function () {
        this.$refs.refAnalysis.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      });
    },
    mapAnalysis(item, itemArray, Rarity) {
      // this.itemStatsAnalysis(itemArray, 1) 地圖先不加入詞綴判斷
      const NL = this.newLine
      this.isMap = true
      this.isMapCollapse = true
      this.mapCategory = {
        isShaper: false,
        isElder: false,
        isBlighted: false
      }
      this.raritySet.chosenObj = {
        label: "非传奇",
        prop: 'nonunique'
      }
      this.raritySet.isSearch = true
      this.isRaritySearch()
      let mapPos = item.substring(item.indexOf('地图阶级:') + 5) // 地圖階級截斷字串
      let mapPosEnd = mapPos.indexOf(NL) // 地圖階級換行定位點
      let mapTier = parseInt(mapPos.substring(0, mapPosEnd).trim(), 10)
      this.mapLevel.min = mapTier
      this.mapLevel.max = mapTier
      this.mapLevel.isSearch = true
      this.isMapLevelSearch()

      let itemNameString = itemArray[2] === "--------" ? itemArray[1] : `${itemArray[1]} ${itemArray[2]}`
      let mapBasicCount = 0

      this.mapBasic.option.some(element => {
        let itemNameStringIndex = itemNameString.indexOf(element.replace(/[^\u4e00-\u9fa5|．]/gi, "")) // 比對 mapBasic.option 時只比對中文字串
        if (itemNameStringIndex > -1 && !mapBasicCount) {
          mapBasicCount++
          this.mapBasic.chosenM = this.isGarenaSvr ? element.replace(/[^\u4e00-\u9fa5|．]/gi, "") : itemNameString.slice(itemNameStringIndex)
          return true
        }
      });
      this.mapBasic.isSearch = true
      this.isMapBasicSearch()
      this.searchJson.query.filters.map_filters.filters.map_blighted = { // 過濾凋落圖
        "option": "false"
      }
      if (Rarity === "传奇") { //傳奇地圖
        this.raritySet.chosenObj = {
          label: "传奇",
          prop: 'unique'
        }
        this.raritySet.isSearch = true
        this.isRaritySearch()
      } else if (item.indexOf('该区域被塑界者影响 (implicit)') > -1) { // 塑界者地圖
        this.mapCategory.isShaper = true
        this.searchJson.query.stats[0].filters[0] = {
          "id": "implicit.stat_1792283443",
          "value": {
            "option": "1"
          }
        }
      } else if (item.indexOf('该区域被裂界者影响 (implicit)') > -1) { // 尊師地圖
        this.mapCategory.isElder = true
        this.searchJson.query.stats[0].filters[0] = {
          "id": "implicit.stat_1792283443",
          "value": {
            "option": "2"
          }
        }
        if (item.indexOf('地图被裂界守卫：奴役占领 (implicit)') > -1) { // 尊師守衛地圖
          this.mapElderGuard.chosenObj = {
            label: "裂界守卫：奴役",
            prop: "1"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地图被裂界守卫：寂灭占领 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "裂界守卫：寂灭",
            prop: "2"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地图被裂界守卫：约束占领 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "裂界守卫：约束",
            prop: "3"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地图被裂界守卫：净世占领 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "裂界守卫：净世",
            prop: "4"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        }
      } else if (item.indexOf('菌潮') > -1 || item.indexOf('Blighted') > -1) {  // 这里待确定
        this.mapCategory.isBlighted = true
        this.searchJson.query.filters.map_filters.filters.map_blighted = {
          "option": "true"
        }
      }
      // else { // error handle
      //   this.status = `Oops! 尚未支援搜尋此種地圖`
      //   return
      // }
      this.searchTrade(this.searchJson)
    },
    isMapBasicSearch() {
      if (!this.mapBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除地圖基底 filter
      } else if (this.mapBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.mapBasic.chosenM) // 增加地圖基底 filter
      }
    },
    isMapLevelSearch() {
      if (!this.mapLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.map_filters.filters.map_tier // 刪除地圖階級 filter
      } else if (this.mapLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.map_filters.filters.map_tier = { // 指定地圖階級最小 / 最大值 filter
          "min": this.mapLevel.min ? this.mapLevel.min : null,
          "max": this.mapLevel.max ? this.mapLevel.max : null
        }
      }
    },
    isMapElderGuardSearch() {
      if (this.mapCategory.isElder && !this.mapElderGuard.isSearch && this.isSearchJson) {
        this.searchJson.query.stats[0].filters.length = 1
      } else if (this.mapElderGuard.isSearch && this.mapElderGuard.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.stats[0].filters[1] = {
          "id": "implicit.stat_3624393862",
          "value": {
            "option": this.mapElderGuard.chosenObj.prop
          }
        }
      }
    },
    isGemBasicSearch() {
      if (!this.gemBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除技能基底 filter
      } else if (this.gemBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.gemBasic.chosenG) // 增加技能基底 filter
      }
    },
    isGemLevelSearch() {
      if (!this.gemLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.gem_level // 刪除技能等級 filter
      } else if (this.gemLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.gem_level = { // 指定技能等級最小 / 最大值 filter
          "min": this.gemLevel.min ? this.gemLevel.min : null,
          "max": this.gemLevel.max ? this.gemLevel.max : null
        }
      }
    },
    isGemQualitySearch() {
      if (!this.gemQuality.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.quality // 刪除技能品質 filter
      } else if (this.gemQuality.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.quality = { // 指定技能品質最小 / 最大值 filter
          "min": this.gemQuality.min ? this.gemQuality.min : null,
          "max": this.gemQuality.max ? this.gemQuality.max : null
        }
      }
    },
    checkValue(event, item, ref) {
      if (event < 0) {
        if (ref == "min") {
          item.min = 0
        } else {
          item.max = 0
        }
      }
    },
  },
  watch: {
    copyText: function () {
      let item = this.copyText;
      //if (item.indexOf('稀 有 度: ') === -1 || !this.copyText || this.isApiError) { // POE 內的文字必定有稀有度
      if (item.indexOf('稀 有 度: ') === -1 && item.indexOf('稀有度: ') === -1 || !this.copyText || this.isApiError) {  //这部分为A大补丁和编年史补丁判断代码，不用轻易修改
        return
      }
      if (this.isCounting) {
        this.cleanCopyText()
        this.cleanClipboard()
        this.$message({
          duration: 2000,
          type: 'error',
          message: `请等待限制间隔倒数完毕再次按下 Ctrl+C`
        });
        return
      }
      this.resetSearchData();
      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件
      const NL = this.newLine
      let itemArray = item.split(NL); // 以行數拆解複製物品文字
      const regExp = new RegExp("[A-Za-z]+"); // 有英文字就代表是國際服
      this.isGarenaSvr = regExp.test(itemArray[0]) ? false : true // 國際服中文化抓取物品種類作判斷
      itemArray.splice(0, 1); // 暫時移除 3.14 增加 物品種類 的資訊以符合原先邏輯
      let posRarity = itemArray[0].indexOf(': ')
      let Rarity = itemArray[0].substring(posRarity + 2).trim()
      let searchName = itemArray[1]
      // 新增判断A大补丁中物品名称包含[]问题
      if (searchName.indexOf('[') > -1) { // 刪除A大物品名称[]字串
          //searchName = searchName.substring(0, searchName.indexOf('['))
          searchName = searchName.replace(/\[.*\]/g,"")               //A大补丁中含[] 删除替换 
      }
      // 新增判断A大补丁中物品名称包含[]问题 结束
      this.searchName = itemArray[2] === "--------" ? `物品名称 <br>『${itemArray[1]}』` : `物品名称 <br>『${itemArray[1]} ${itemArray[2]}』`
      let itemBasic = itemArray[2]
      //console.log(itemBasic)
      let itemNameString = itemArray[2] === "--------" ? itemArray[1] : `${itemArray[1]} ${itemArray[2]}`
      let itemBasicCount = 0
       // console.log(searchName) // 搜索物品名称log
      this.equipItems.some(element => {
        let itemNameStringIndex = itemNameString.indexOf(element.text)
        // console.log(itemNameString, itemNameStringIndex) //物品字符串log
        if (itemNameStringIndex > -1 && !itemBasicCount && (itemNameString.indexOf('碎片') === -1 || Rarity !== '传奇')) {
          itemBasicCount++
          element.text = this.isGarenaSvr ? element.text : this.replaceString(itemArray[2] === "--------" ? itemArray[1] : itemArray[2])
          this.itemAnalysis(item, itemArray, element)
          this.isItem = true
          this.isItemCollapse = true
          return true
        }
      });
      if (item.indexOf('地图阶级: ') > -1 && item.indexOf('在私人地图装置中使用可以前往该地图。只能被使用一次。') > -1) { // 地圖搜尋
        this.mapAnalysis(item, itemArray, Rarity)
      } else if ((Rarity === "稀有" || Rarity === "传奇") && item.indexOf('點擊右鍵將此加入你的獸獵寓言。') > -1) { // 獸獵（物品化怪物）此处待确定
        let monstersCount = 0
        this.monstersItems.some(element => {
          if (itemNameString.indexOf(element.text) > -1 && !monstersCount) {
            this.searchJson.query.type = element.type
            return true
          }
        });
      } else if (Rarity === "传奇" && item.indexOf('在丹恩的试验室') === -1) { // 傳奇道具
        if (item.indexOf('古藏传奇') > -1) {
          this.raritySet.chosenObj = {
            label: "古藏传奇",
            prop: 'uniquefoil'
          }
        } else {
          this.raritySet.chosenObj = {
            label: "传奇",
            prop: 'unique'
          }
        }
        if (item.indexOf('未鉴定') === -1) { // 已鑑定傳奇
          this.searchJson.query.name = this.replaceString(searchName)
          this.searchJson.query.type = this.replaceString(itemBasic)
          this.raritySet.isSearch = true
          this.isRaritySearch()
          if (this.isItem) {
            this.itemStatsAnalysis(itemArray, 1)
          }
        } else { // 未鑑定傳奇(但會搜到相同基底)
          if (searchName.indexOf('精良的') > -1) { // 未鑑定的品質傳奇物品
            searchName = searchName.substring(4)
          }
          this.raritySet.isSearch = true
          this.isRaritySearch()
          this.searchJson.query.type = this.replaceString(searchName)
          this.$message({
            duration: 2000,
            type: 'warning',
            message: `未鉴定传奇物品会搜到相同基底的其他传奇装`
          });
        }
      } else if (Rarity === "命运卡" || Rarity === "通货" || Rarity === "通货不足") {
        this.searchJson.query.type = this.replaceString(searchName)
        if (item.indexOf('可以在私人地图装置中使用，在当天开启一扇通向阿佐亚特神庙的传送门。') > -1) { // 史記房間判斷
          this.templeStatsAnalysis(itemArray)
          this.isStatsCollapse = true
          return
        }
      } else if (Rarity === "宝石") {
        this.isGem = true
        this.gemQualitySet.isSearch = false
        this.gemBasic.chosenG = searchName
        this.gemQualitySet.chosenObj = {
          label: "精良的（默认）",
          prop: '0'
        }
        let regMatchGem = /\((.+?)\)/g
        //if (item.indexOf('异常 ') > -1) { // 替代品質判斷
        if (item.indexOf('异常') > -1) { // 2021.8.5 修改 去掉空格，编年史汉化中没有空格
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '1'
          this.gemQualitySet.chosenObj.label = '异常的'
          this.gemBasic.chosenG = this.isGarenaSvr ? searchName.split(' ')[1] : searchName.match(regMatchGem)[1]
        } else if (item.indexOf('分歧') > -1) {
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '2'
          this.gemQualitySet.chosenObj.label = '分歧的'
          this.gemBasic.chosenG = this.isGarenaSvr ? searchName.split(' ')[1] : searchName.match(regMatchGem)[1]
        } else if (item.indexOf('魅影') > -1) {
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '3'
          this.gemQualitySet.chosenObj.label = '魅影的'
          this.gemBasic.chosenG = this.isGarenaSvr ? searchName.split(' ')[1] : searchName.match(regMatchGem)[1]
        }
        this.gemQualityTypeInput()

        if (item.indexOf('瓦尔：') > -1) { // 瓦爾技能
          let vaalPos = item.substring(item.indexOf('瓦尔：'))
          let vaalPosEnd = vaalPos.indexOf(NL)
          let vaalGem = vaalPos.substring(0, vaalPosEnd)
          this.searchName = `物品名称『${vaalGem}』`
          this.isGarenaSvr = regExp.test(vaalGem) ? false : true
          this.gemBasic.chosenG = vaalGem
        }
        this.gemBasic.isSearch = true
        this.isGemBasicSearch()

        let levelPos = item.substring(item.indexOf('等级: ') + 4)
        let levelPosEnd = levelPos.indexOf(NL)
        this.gemLevel.min = parseInt(levelPos.substring(0, levelPosEnd).replace(/[+-]^\D+/g, ''), 10)

        let minQuality = 0
        if (item.indexOf('品质: +') > -1) {
          let quaPos = item.substring(item.indexOf('品质: +') + 5) // 品質截斷字串 (包含'品質: +'前的字串全截斷)
          let quaPosEnd = quaPos.indexOf('% (augmented)') // 品質定位點
          minQuality = parseInt(quaPos.substring(0, quaPosEnd).trim(), 10)
        }
        if (!this.gemQualitySet.isSearch) { // 若沒有替代品質，則搜尋技能品質
          this.gemQuality.isSearch = true
        }
        this.gemQuality.min = minQuality
        this.isGemQualitySearch()
      } else if (Rarity === "普通" && (item.indexOf('右键点击后赋予你的角色预言之力。') > -1)) { // 預言
        let name = this.isGarenaSvr ? searchName : this.replaceString(searchName.split('(')[1])
        this.searchJson.query.name = name
      } else if (Rarity === "普通" && !this.isItem) {
        // } else if (Rarity === "普通" && (item.indexOf('透過聖殿實驗室或個人') > -1 || item.indexOf('可以使用於個人的地圖裝置來增加地圖的詞綴') > -1 || item.indexOf('放置兩個以上不同的徽印在地圖裝置中') > -1 || item.indexOf('你必須完成異界地圖中出現的全部六種試煉才能進入此區域') > -1 || item.indexOf('擊殺指定數量的怪物後會掉落培育之物') > -1 || item.indexOf('將你之前祭祀神壇保存的怪物加入至該地圖的祭祀神壇中') > -1 || item.indexOf('使用此物品開啟前往無悲憫與同情之地的時空之門') > -1 || item.indexOf('在個人地圖裝置使用此物品開啟譫妄異域時空之門') > -1 || item.indexOf('地圖裝置來使用此物品以前往進入瓦爾寶庫') > -1)) {
        // 地圖碎片、裂痕石、徽印、聖甲蟲、眾神聖器、女神祭品、培育器、浸血碑器、釋界之令、幻像異界、瓦爾遺鑰
        this.searchJson.query.type = this.replaceString(searchName)
      } else if (this.isItem) {
        this.itemStatsAnalysis(itemArray, 0)
        return
      } else {
        this.itemsAPI()
        this.issueText = `目前版本尚未支援搜尋該道具\n\`\`\`\n${this.copyText.replace('稀有度: ', 'Rarity: ')}\`\`\``
        this.isSupported = false
        this.isStatsCollapse = false
        return
      }
      this.searchTrade(this.searchJson)
    },
    isGarenaSvr: function () { // 國際服相關 function 處理
      let vm = this
      this.baseUrl = this.isGarenaSvr ? 'https://poe.game.qq.com' : 'https://www.pathofexile.com'
      if (!this.isGarenaSvr) {
        // this.leagues.option = this.gggLeagues
        this.leagues.option = Object.assign([], this.gggLeagues);  //这部分为判定为国际服后进行相关操作代码，不要轻易动
        this.leagues.chosenL = this.leagues.option[0]
        this.mapBasic.option = Object.assign([], this.gggMapBasic);
        this.gemBasic.option = Object.assign([], this.gggGemBasic);
      } else {
        this.itemsAPI();
        this.leaguesAPI();
      }
    },
    isPriceCollapse: function () {
      localStorage.setItem('isPriceCollapse', JSON.stringify(this.isPriceCollapse))
      if (this.isPriceCollapse) {
        this.searchJson_Def.query.filters.trade_filters.filters.collapse = {
          option: "true"
        }
      } else {
        delete this.searchJson_Def.query.filters.trade_filters.filters.collapse
      }
      if (this.isSearchJson && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        if (this.isPriceCollapse) {
          this.searchJson.query.filters.trade_filters.filters.collapse = {
            option: "true"
          }
        } else {
          delete this.searchJson.query.filters.trade_filters.filters.collapse
        }
        this.searchTrade(this.searchJson)
      }
    },
    isOnline: _.debounce(function () {
      let option = this.isOnline ? 'online' : 'any'
      this.searchJson_Def.query.status.option = option
      if (this.isSearchJson && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.status.option = option
        this.searchTrade(this.searchJson)
      }
    }, 500),
    isPriced: function () {
      this.fetchID.length = 0
      let option = this.isPriced ? 'priced' : 'unpriced'
      this.searchJson_Def.query.filters.trade_filters.filters.sale_type.option = option
      if (this.isSearchJson && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.filters.trade_filters.filters.sale_type.option = option
        this.searchTrade(this.searchJson)
      }
    },
    'mapCategory.isShaper': { // TODO: 判斷塑者/尊師/凋落圖方式需重構
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
          this.mapCategory.isElder = false
          this.mapCategory.isBlighted = false
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "1", // 塑界者
            }
          }
        } else if (!newVal && !this.mapCategory.isElder && !this.mapCategory.isBlighted) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        }
      },
      deep: true
    },
    'mapCategory.isElder': {
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
          this.mapCategory.isShaper = false
          this.mapCategory.isBlighted = false
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "2", // 尊師
            }
          }
        } else if (!newVal && !this.mapCategory.isShaper && !this.mapCategory.isBlighted) {
          this.mapElderGuard.isSearch = false
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        } else if (!newVal) {
          this.mapElderGuard.isSearch = false
        }
      },
      deep: true
    },
    'mapCategory.isBlighted': {
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.mapCategory.isShaper = false
          this.mapCategory.isElder = false
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "true"
          }
        } else if (!newVal && !this.mapCategory.isShaper && !this.mapCategory.isElder) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        }
      },
      deep: true
    },
  },
  computed: {
    handlePOESESSID: {
      get() { // get stored message
        return this.$store.state.POESESSID;
      },
      set(newID) { // commit a mutation to set message
        this.$store.commit('setPOESESSID', `POESESSID=${newID};`);
        //console.log(newID)  //注释掉log对话2021.11.8
      }
    },
    storePriceMin: {
      get() {
        return this.$store.state.priceSettingMin;
      },
      set(newValue) {
        this.$store.commit('setPriceMin', newValue);
      }
    },
    storePriceMax: {
      get() {
        return this.$store.state.priceSettingMax;
      },
      set(newValue) {
        this.$store.commit('setPriceMax', newValue);
      }
    },
    isDevMode() {
      return process.env.NODE_ENV === 'development'
    },
    isSearchJson() {
      return !_.isEmpty(this.searchJson)
    },
    pricedText() {
      return this.isPriced ? "有标价" : "未标价"
    },
    whichServer() {
      return this.isGarenaSvr ? "国服" : "国际服"
    },
    statsFontColor() {
      return function (item) {
        switch (item) {
          case '基底':
            return {
              'color': '#5555ff'
            }
            break;
          case '附魔':
            return {
              'color': '#8181ff'
            }
            break;
          case '分裂的':
            return {
              'color': '#a29162'
            }
            break;
          case '天灾':
            return {
              'color': '#ff6e25'
            }
            break;
          case '工艺的':
            return {
              'color': '#8181ff'
            }
            break;
          case '传奇':
            return {
              'color': '#af6025'
            }
            break;
          case '综合':
            return {
              'color': '#96bf47'
            }
            break;
          default:
            break;
        }
      }
    },
    isDetailHistoried() {
      return function (item) {
        if (item.isDetailHistoried === 'true') {
          return true
        }
      }
    },
  },
}
</script>

<style>
/* 隱藏滾動捲軸 */
::-webkit-scrollbar {
  display: none;
}

.MapCopy {
  border-top: 1px solid #000;
  padding: 5px;
  color: #b4b4ff
}

/* 取消 input 欄位的 step 功能 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.lesspadding div {
  padding-left: 0px !important;
  padding-right: 5px !important;
}

tbody.searchStats>tr>td {
  padding-top: 8px;
}

.vs__dropdown-menu {
  flex-direction: column;
  align-items: flex-start;
  min-width: 0px !important;
  width: calc(100% - 5px) !important;
}

.vs__dropdown-option--highlight {
  background: rgb(208, 236, 252) !important;
  color: #333 !important;
}

.vs__dropdown-option--selected {
  background: lightskyblue !important;
  color: #333 !important;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-size: 13px !important;
}

.multiselect__tags {
  font-size: 13px !important;
}

.multiselect__tag-icon:after {
  font-size: 13px !important;
}

.multiselect .multiselect__option {
  padding: 8px 12px;
  height: 30px !important;
  min-height: 30px !important;
}

.multiselect .multiselect__input,
.multiselect .multiselect__single {
  cursor: pointer;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0px;
  padding: 1px 4px;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
}

.statsFontColor {
  color: (var(color))
}

.el-message {
  min-width: 220px;
  max-width: 450px;
  height: 40px;
}

.el-message p {
  max-width: 370px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.custom-control-label {
  cursor: pointer;
}
</style>
