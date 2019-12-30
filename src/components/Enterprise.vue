<template>
<div>
  <Common :companyName="baseCompany">
    <template slot="communityBreadcrumns">
      <div class="description">{{ baseDescription }}</div>
    </template>
    <template slot="fieldsList">
      <div class="company-body">
        <div class="head">
          <div class="title">{{ company }}</div>
          <button @click="goToUrl(companyQueryUrl)">企业自查上报</button>
        </div>
        <div class="list">
          <div class="list-item">
            <div class="left-head">治安责任书</div>
            <div class="right-body" >
              <File v-if="information.public_security_responsibility_letter"
                    :fileName="information.public_security_responsibility_letter"
                    :responseUrl="responseUrl"
                    @fileClicked="fileClickedFunc" />
            </div>
          </div>
          <div class="list-item">
            <div class="left-head">
              <div class="title">花名册</div>
              <button class="up-button" @click="goToUrl(updateUrl)">更新</button>
            </div>
            <div class="right-body">
              <File v-if="information.roster"
                    :fileName="information.roster"
                    :responseUrl="responseUrl"
                    @fileClicked="fileClickedFunc" />
            </div>
          </div>
          <div class="list-item">
            <div class="left-head">登记表</div>
            <div class="right-body">
              <File v-if="information.registration_form"
                    :fileName="information.registration_form"
                    :responseUrl="responseUrl"
                    @fileClicked="fileClickedFunc" />
            </div>
          </div>
          <div class="list-item">
            <div class="left-head">单位调查表</div>
            <div class="right-body">
              <File v-if="information.work_unit_questionnaire"
                    :fileName="information.work_unit_questionnaire"
                    :responseUrl="responseUrl"
                    @fileClicked="fileClickedFunc" />
             </div>
          </div>
          <div class="list-item">
            <div class="left-head">网格员工作痕迹</div>
            <div class="right-body">
              <File v-if="information.grid_work_traces"
                    :fileName="information.grid_work_traces"
                    :responseUrl="responseUrl"
                    @fileClicked="fileClickedFunc"  />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Common>
  <div class="layer-page">
    <div class="layer-header">
      <div class="layer-back">
        <i class="icon-arrow_left"></i>
      </div>
      <div class="layer-content"></div>
      <div class="layer-download">
        <i class="icon-download_o"></i>
      </div>
    </div>
    <div class="layer-body">

    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import Common from './Common'
import axios from 'axios'
import Mixin from './Mixin'
import File from './enterprise/File'
import FilePreview from './enterprise/file_preview'

export default {
  mixins: [ Mixin ],

  name: 'Company',

  data () {
    return {
      company: this.getQueryString().split('=')[1],
      information: {},
      responseUrl: '',
      companyQueryUrl: '',
      updateUrl: '',
      response: {},
      showFiles: {}
    }
  },

  components: { Common, File },

  created () {
    this.doRequst()
    document.title = '一牌一簿'
  },

  methods: {
    doRequst () {
      axios.get(this.baseUrl + 'enterprise?' + this.getQueryString())
        .then(res => {
          this.responseUrl = res.data.response_url
          this.companyQueryUrl = res.data.query_url
          this.updateUrl = res.data.update_url
          if (res.data.result[0]) {
            this.information = res.data.result[0]
          }
        })
        .catch(err => { console.log(err) })
    },
    goToUrl (url) {
      location.href = url
    },

    fileClickedFunc (fileName) {
      axios.get(`https://gxzh.cdht.gov.cn/api/v4/forms/${this.information.form_id}/responses`).then(res => {
        this.response = _.filter(res.data, item => item.id === this.information.response_id)
        const mapped_values = response.mapped_values
        switch (fileName) {
          case information.public_security_responsibility_letter:
            this.showFiles = mapped_values.public_security_responsibility_letter.value
            break
          case information.roster:
            this.showFiles = mapped_values.roster.value
            break
          case information.registration_form:
            this.showFiles = mapped_values.registration_form.value
            break
          case information.work_unit_questionnaire:
            this.showFiles = mapped_values.work_unit_questionnaire.value
            break
          case information.grid_work_traces:
            this.showFiles = mapped_values.grid_work_traces.value
            break
          default:
            this.showFiles = {}
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.description {
  margin-top: .4rem;
  font-size: .7rem;
  color: #bdbdbd;
  line-height: 1.5;
  text-align: right;
}

.community-home-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.company-body {
  width: 100%;
  background-color: white;
  border-radius: .3rem;
  padding: 0 .9rem;
}

.company-body > .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: .05rem solid #e9eaeb;
}

.company-body > .head > button {
  height: 1.4rem;
  padding: 0 .6rem;
  font-size: .6rem;
  color: white;
  line-height: 1.5;
  background: linear-gradient(#f08200, #f45e06);
  border-radius: .3rem;
}

.company-body > .head >.title {
  height: 2.25rem;
  font-size: .7rem;
  color: #95a4b3;
  line-height: 1.5;
  display: flex;
  align-items: center;
}

.company-body .list-item {
  height: 2.25rem;
  font-size: .6rem;
  color: #8d8d8d;
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: .05rem solid #e9eaeb;
}
.company-body .list-item > .left-head {
  display: flex;
}

.company-body .list-item > .left-head > .up-button {
  padding: 0 .6rem;
  font-size: .6rem;
  color: #f08200;
  border: 1px solid #f08200;
  border-radius: .2rem;
  margin-left: .6rem;
  background: transparent;
}

.error-correction-button {
  height: 2rem;;
  width: 100%;
  font-size: .7rem;
  color: white;
  line-height: 1.5;
  background: linear-gradient(#f08200, #f45e06);
  margin: 1.2rem 0 1.6rem;
  border-radius: .3rem;
}

.layer-page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 4;
  background-color: #ffffff;
}

.layer-header {
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.08);
  position: relative;
  top: 0;
}

.layer-back {
  color: #fd7d58;
  font-size: 1.05rem;
}

.layer-content {
  flex: auto;
  color: #2e2e2e;
}

.layer-download {
  color: #fd7d58;
  font-size: 1.05rem;
}
</style>
