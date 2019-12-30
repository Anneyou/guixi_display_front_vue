
<template>
<div class="main-content"
  ref='swipeContainer'
  v-swipe='{ length: files.length, currentIndex: index, itemWidth: itemWidth, indexChanged: indexChanged }'>
  <div class="swipe-wrapper" :style="{ width: files.length * 100 + '%' }">
    <div class="swipe-item content-centered"
          :style='{ width: (1/files.length * 100).toFixed(6) + "%" }'
          v-for='file in files'
          :key='file._uid'
          :class='{ "real-file-preview": file.id && canPreview(file) }'>
      <div class="real-file-container" v-if='file.id && canPreview(file)'>
        <img :src="_previewUrl(file)" alt="图片载入中" />
      </div>
      <div class="preview-container" v-else>
        <div class="attachment-type">
          <file class="file-icon" :fileName="file.value" />
        </div>
        <h3 class="attachment-name force-break">{{ file.name }}</h3>
        <div class="attachment-size date-text">{{ file.humanSize }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import File from './File'

export default {
  props: {
    enableDelete: {
      type: Boolean,
      default: true
    },
    files: {
      type: Array,
      default: () => ([])
    }
  },

  components: { File },

  data () {
    return {
      currentFile: null,
      itemWidth: 0,
      index: 0
    }
  },

  created () {
    this.currentFile = this.files[this.index]
  },

  mounted () {
    this.itemWidth = this.$refs.swipeContainer.getBoundingClientRect().width
  },

  watch: {
    index (value) {
      this.currentFile = this.files[value]
    }
  },

  methods: {
    indexChanged (index) {
      this.index = index
      this.$emit('indexChanged', index)
    },

    canPreview (file) {
      const fileNameArray = this.fileName.split('.')
      return _.includes(['png', 'jpg', 'jpeg'], fileNameArray[fileNameArray.length - 1])
    },

    downloadFile () {
      window.open(this._downloadUrl(this.currentFile))
    },

    _downloadUrl (file) {
      return `https://gxzh.cdht.gov.cn/attachments/${file.id}/download_url`
    },

    _previewUrl (file) {
      return `https://gxzh.cdht.gov.cn/attachments/${file.id}/download_url?fops=imageView2/0/q/100|imageslim`
    }
  }
}
</script>
<style scoped>
.main-content {
  -webkit-box-flex: 0;
}

.swipe-wrapper {
  height: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.swipe-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.real-file-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.real-file-containe img {
  max-height: 100%;
}

.preview-container {
  margin-top: -0.5 * 2.5rem;
  width: 16.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-container .attachment-type {
  width: 4.75rem;
  height: 5.6rem;
  align-self: center;
  margin: 0;
  margin-bottom: .8rem;
}

.preview-container .attachment-type i {
    font-size: 2.3rem;
  }

.preview-container .attachment-name {
  font-weight: normal;
}

.preview-container .attachment-size {
  line-height: 1.5rem;
  font-size: .65rem;
}

.file-icon {
  font-size: 6rem;
}
</style>
