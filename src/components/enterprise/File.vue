<template>
  <a @click="fileClickedFunc">
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
    }
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
