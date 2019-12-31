<template>
  <a :href="responseUrl" v-if="canEdit">
    <i class="file-icon" :class="file.icon"></i>
  </a>
  <a @click="fileClickedFunc" v-else>
    <i class="file-icon" :class="file.icon"></i>
  </a>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'

export default {
  props: {
    fileName: {
      type: String
    },
    responseUrl: {
      type: String
    }
  },

  data () {
    return {
      file: {
        icon: this.getIcon()
      },
      canEdit: false
    }
  },

  created () {
    axios.post(`https://gxzh.cdht.gov.cn/oauth/token`, {
      code: localStorage.getItem('code')
    }).then(res => {
      axios.get('https://gxzh.cdht.gov.cn/api/v1/user', {
        access_token: res.data.access_token
      }).then(user => {
        axios.get(`https://gxzh.cdht.gov.cn/api/v4/users/${user.data.id}`, {
          headers: {
            Authorization: '7372dee4ff2e6b3876e3b386a336a9171444fba5d3a1e5ae3e23c91d92bb68c6:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjF9.WXenxuBIxXEgy_YSmk-PRoElIK7f_gP995N5vdCqSAo'
          }
        }).then(userMessage => {
          this.canEdit = !!(_.find(userMessage.data.tags, tag => tag.name === '网格员'))
        })
      })
    })
  },

  methods: {
    getIcon () {
      let icon = ''
      const fileNameArray = this.fileName.split('.')
      switch (fileNameArray[fileNameArray.length - 1]) {
        case 'xlsx':
          icon = 'icon-Icon_excel'
          break
        case 'pdf':
          icon = 'icon-Icon_pdf'
          break
        case 'jpg':
          icon = 'icon-icon_image'
          break
        case 'jpeg':
          icon = 'icon-icon_image'
          break
        case 'png':
          icon = 'icon-icon_image'
          break
        case 'word':
          icon = 'icon-Icon_word'
          break
        case 'docx':
          icon = 'icon-Icon_word'
          break
        case 'doc':
          icon = 'icon-Icon_word'
          break
        default:
          icon = 'icon-Icon_file'
      }
      return icon
    },

    fileClickedFunc () {
      this.$emit('fileClicked', this.fileName)
    }
  }

}
</script>

<style>
.file-icon {
  font-size: 1rem;
  color: black;
}
</style>
