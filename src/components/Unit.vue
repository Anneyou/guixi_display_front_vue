<template>
  <div>
    <Common :companyName="baseCompany">
      <template slot="communityBreadcrumns">
        <div class="community-breadcrumns">
          <router-link :to="{name: 'Home', query: { home: routes.home}}">{{ routes.home }}</router-link> &gt;
          <router-link :to="{name: 'Building', query: { home: routes.home, building: routes.building }}">{{ routes.building}}栋</router-link> &gt;
          <span>{{ routes.unit }}单元</span>
        </div>
      </template>
      <template slot="fieldsList">
        <div class="room-table">
          <div class="datable-table-container">
            <div class="fixed-table">
              <div class="scroll-container" @scroll="scrollFixed" ref="fixedScrollContainer">
                <table>
                  <colgroup>
                    <col width="10">
                  </colgroup>
                  <tbody>
                    <template v-for="(item, index) in floors">
                        <tr :key="index">
                          <td class="column-first">{{ item.floor}}楼</td>
                        </tr>
                      </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="body-table">
              <div class="body-table-wrapper">
                <div class="scroll-container" @scroll="scrollBody" ref="bodyScrollContainer">
                  <table>
                    <colgroup>
                      <template v-for="(room, index) in houses">
                        <col :key="index" width="30">
                      </template>
                    </colgroup>
                    <tbody>
                      <template v-for="(floor, index) in floors">
                        <tr :key="index">
                          <template v-for="(room, index) in floor.data">
                            <td :key="index">
                              <span>
                                <span class="room-number">{{room.room}}</span>
                                <i :class="getStatusClass(room.status)"></i>
                              </span>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="table-legend">
            <div class="legend-item">
              <i class="room-rent-out"></i>
              <span>出租</span>
            </div>
            <div class="legend-item">
              <i class="room-self-use"></i>
              <span>自用</span>
            </div>
            <div class="legend-item">
              <i class="room-leave-unused"></i>
              <span>闲置</span>
            </div>
          </div>
        </div>
        <button class="error-correction-button" @click="openModal">纠错</button>
      </template>
    </Common>
    <Modal company="智慧桂溪"
           extendClass="tip-modal"
           ref="modalRef" ></Modal>
  </div>
</template>

<script>
import Common from './Common'
import axios from 'axios'
import Modal from './Modal'
import Mixin from './Mixin'
import { _ } from 'vue-underscore'

export default {
  mixins: [ Mixin ],

  components: { Common, Modal },

  data () {
    return {
      home: '',
      building: '',
      unit: '',
      floors: [],
      houses: [],
      redirectUrl: '',
      ignoreScrollEvent: false,
      startY: 0
    }
  },

  created () {
    this.doRequest()
    document.title = '出租房屋公示'
  },

  methods: {
    doRequest () {
      axios.get(this.baseUrl + 'unit?' + this.getQueryString())
        .then(res => {
          this.home = res.data.home
          this.building = res.data.building
          this.unit = res.data.unit
          this.floors = res.data.floors
          this.houses = res.data.floors[res.data.floors.length - 1].data
          this.redirectUrl = res.data.redirectUrl
        })
    },

    getStatusClass (status) {
      return {
        'room-rent-out': status === '出租',
        'room-leave-unused': status === '闲置',
        'room-self-use': status === '自用'
      }
    },

    getQuery (key, value) {
      let obj = {}
      obj[key] = value
      return obj
    },

    getRoom (index) {
      return index < 10 ? '0' + index : index
    },

    scrollFixed (e) {
      if (this.ignoreScrollEvent) {
        this.ignoreScrollEvent = false
        return
      }
      this.updateScrollTop(this.$refs.fixedScrollContainer, this.$refs.bodyScrollContainer)
      this.syncScrollTop(this.$refs.fixedScrollContainer, this.$refs.bodyScrollContainer)
    },

    scrollBody (e) {
      if (this.ignoreScrollEvent) {
        this.ignoreScrollEvent = false
        return
      }
      this.updateScrollTop(this.$refs.bodyScrollContainer, this.$refs.fixedScrollContainer)
      this.syncScrollTop(this.$refs.fixedScrollContainer, this.$refs.bodyScrollContainer)
    },

    syncScrollTop: _.debounce(function syncScrollTop (target, relate) {
      this.updateScrollTop(target, relate)
    }, 100),

    updateScrollTop (target, relate) {
      this.ignoreScrollEvent = true
      relate.scrollTop = target.scrollTop
    },

    openModal () {
      this.$refs.modalRef.open()
      setTimeout(() => {
        location.href = this.redirectUrl
      }, 3000)
    },

    touchEvents () {
      document.body.addEventListener('touchstart', (e) => {
        this.startY = e.touches[0].pageY
      })
      document.body.addEventListener('touchmove', this._stopIosRubber, {passive: false})
    },

    _stopIosRubber (event) {
      const endY = event.touches[0].pageY
      if (endY > this.startY && window.scrollTop <= 0) {
        event.preventDefault()
      }
      if (endY < this.startY && (window.scrollTop + window.innerHeight) >= document.body.scrollHeight) {
        event.preventDefault()
      }
    }
  },

  destroyed () {
    document.body.removeEventListener('touchmove', this._stopIosRubber, {passive: false})
    document.body.removeEventListener('touchstart', (e) => {
      this.startY = e.touches[0].pageY
    })
  }
}
</script>

<style>
#app > div {
  height: 100%;
}

.community-name {
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
  height: 100%;
}

.room-table {
  flex: 1;
  background-color: white;
  width: 100%;
  border-radius: .3rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.datable-table-container {
  display: flex;
  overflow: hidden;
  justify-content: center;
  margin-top: 1rem;
  padding: 0 1rem;
}

.fixed-table {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 3.245rem;
}

.fixed-table table {
  width: 100%;
}

.normal-table {
  width: 3.245rem;
}

.scroll-container {
  border-top: 1px solid #E9EAEB;
  border-bottom: 1px solid #E9EAEB;
}

.fixed-table > .scroll-container {
  display: flex;
  width: 3.245rem;
  height: 100%;
  overflow-y: auto;
}

.fixed-table > .scroll-container::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}

.fixed-table > .scroll-container td {
  padding-left: .4rem;
  text-align: left;
}

.body-table-wrapper {
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.body-table-wrapper > .fixed-table-header {
  max-width: 100%;
  overflow-x: auto;
}

.body-table-wrapper > .fixed-table-header::-webkit-scrollbar {
  height: 0 !important;
}

.body-table {
  overflow: hidden;
}

.body-table-wrapper > .scroll-container {
  width: 100%;
  flex: 1;
  overflow: auto;
}

.body-table-wrapper > .scroll-container table {
  width: 100%;
}

.body-table-wrapper > .scroll-container::-webkit-scrollbar {
  display: block;
}

table {
  table-layout: fixed;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #E9EAEB;
}

tr:last-child {
  border-bottom: none;
}

td {
  height: 2.75rem;;
  padding-left: .4rem;
  text-align: left;
  white-space: nowrap;
  text-align: center;
}

td>span {
  display: flex;
  flex-direction: row;
  color: #95a4b3;
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

td .room-number {
  margin-bottom: .4rem;
}

td:first-child {
  font-size: .6rem;
  color: #8d8d8d;
}

.room-self-use {
  display: inline-block;
  width: .8rem;
  height: .8rem;
  border-radius: 50%;
  background-color: #11E909;
}

.room-leave-unused {
  display:inline-block;
  width: .8rem;
  height: .8rem;
  background-color: #f5de0a;
  border-radius: .1rem;
}

.room-rent-out {
  position: relative;
  top: 0;
  display: inline-block;
  font-size: 0;
  border-radius: 30%;
  overflow: hidden;
}

.room-rent-out::before{
  display: inline-block;
  content: "";
  position: relative;
  bottom: .05rem;
  border: .4rem solid transparent;
  border-top-width: 0;
  border-bottom-width: .8rem;
  border-bottom-color: #f52929;
}

.table-legend {
  display: flex;
  justify-content: center;
  background-color: #f2f4f6;
  flex: 0 0 46px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: .6rem 0;
  margin-right: 1.2rem;
  vertical-align: middle;
  height: 2rem;
}

.legend-item:nth-child(3) {
  margin-right: 0;
}

.legend-item i {
  margin-right: .2rem;
}

.legend-item span {
  font-size: .6rem;
  color: #8d8d8d;
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

</style>
