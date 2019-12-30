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
  <div class="layer-page" v-if="filePreviewShow">
    <div class="layer-header">
      <div class="layer-back" @click="closeFilePreviewFunc">
        <svg viewbox="0 0 24 24" width="100%" height="100%">
          <path d="M9.35 12l6.36 6.36a1 1 0 0 1-1.41 1.42l-7.02-7.02a1 1 0 0 1-.05-1.46l7.06-7.08a1 1 0 1 1 1.42 1.42L9.35 12z" fill="#fd7d58"></path>
        </svg>
      </div>
      <div class="layer-content">
        {{index + 1}} / {{showFiles.length}}
      </div>
      <div class="layer-download" @click="downloadFile">
        <svg t="1577696122018" class="icon" viewBox="0 0 1024 1024"  width="100%" height="100%">
          <path d="M605.333333 772.672L533.333333 830.272V533.333333a21.333333 21.333333 0 0 0-42.666666 0v296.938667l-72-57.6a21.333333 21.333333 0 0 0-26.666667 33.322667l106.666667 85.333333a21.376 21.376 0 0 0 26.666666 0l106.666667-85.333333a21.333333 21.333333 0 1 0-26.666667-33.322667z" fill="#fd7d58" p-id="1900"></path>
          <path d="M810.666667 384c-1.130667 0-2.24 0-3.328 0.042667a298.496 298.496 0 0 0-565.418667-84.906667A213.333333 213.333333 0 0 0 256 725.333333h21.333333a21.333333 21.333333 0 0 0 0-42.666666h-21.333333a170.666667 170.666667 0 0 1 0-341.333334 21.333333 21.333333 0 0 0 19.712-13.12 255.786667 255.786667 0 0 1 491.370667 80.832 21.333333 21.333333 0 0 0 24.533333 19.626667A124.224 124.224 0 0 1 810.666667 426.666667a128 128 0 0 1 0 256h-64a21.333333 21.333333 0 0 0 0 42.666666h64a170.666667 170.666667 0 0 0 0-341.333333z" fill="#fd7d58" p-id="1901"></path>
        </svg>
      </div>
    </div>
    <div class="layer-body">
      <file-preview ref="filePreviewRef" :files="showFiles" @indexChanged="indexChangedFunc">
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
      filePreviewShow: false,
      showFiles: [],
      index: 0
    }
  },

  components: { Common, File, FilePreview },

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
      axios.get(`https://gxzh.cdht.gov.cn/api/v4/forms/${this.information.form_id}/responses`, {
        headers: {
          Authorization: '7372dee4ff2e6b3876e3b386a336a9171444fba5d3a1e5ae3e23c91d92bb68c6:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjF9.WXenxuBIxXEgy_YSmk-PRoElIK7f_gP995N5vdCqSAo'
        }
      }).then(res => {
        const response = _.find(res.data, item => item.id === this.information.response_id)
        const mappedValues = response.mapped_values
        switch (fileName) {
          case this.information.public_security_responsibility_letter:
            this.showFiles = mappedValues.public_security_responsibility_letter.value
            break
          case this.information.roster:
            this.showFiles = mappedValues.roster.value
            break
          case this.information.registration_form:
            this.showFiles = mappedValues.registration_form.value
            break
          case this.information.work_unit_questionnaire:
            this.showFiles = mappedValues.work_unit_questionnaire.value
            break
          case this.information.grid_work_traces:
            this.showFiles = mappedValues.grid_work_traces.value
            break
          default:
            this.showFiles = null
        }
        this.filePreviewShow = true
      })
    },

    closeFilePreviewFunc () {
      this.filePreviewShow = false
    },

    downloadFile () {
      this.$refs.filePreviewRef.downloadFile()
    },
    indexChangedFunc (index) {
      this.index = index
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
  height: 2.5rem;
  padding: 0 2.65rem;
}

.layer-back {
  width: 1.05rem;
  height: 1.05rem;
}

.layer-content {
  flex: auto;
  color: #2e2e2e;
  font-size: 1rem;
  text-align: center;
}

.layer-download {
  width: 1.05rem;
  height: 1.05rem;
}
</style>
