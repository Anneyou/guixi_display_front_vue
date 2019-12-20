<template>
  <Common :companyName="baseCompany"
          :fields="buildings">
    <template slot="communityBreadcrumns">
      <div class="community-name">{{ home }}</div>
    </template>
    <template slot="fieldsList">
      <div class="home-building">
        <template v-for="building in buildings">
          <router-link :to="{name: 'Building', query: { home: home, building: building}}" :key="building.id" class="community-home-body-item">
            <i class="icon-icon_dong"></i>
            <span class="building-name">{{ building }}栋</span>
          </router-link>
        </template>
      </div>
    </template>
  </Common>
</template>

<script>
import Common from './Common'
import axios from 'axios'
import Mixin from './Mixin'

export default {
  mixins: [ Mixin ],

  name: 'Home',

  data () {
    return {
      home: '',
      buildings: []
    }
  },

  components: { Common },

  created () {
    this.doRequst()
  },

  methods: {
    doRequst () {
      axios.get(this.baseUrl + 'home?' + this.getQueryString())
        .then(res => {
          this.home = res.data.home
          this.buildings = res.data.result
        })
        .catch(err => { console.log(err) })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.community-name {
  margin-top: .4rem;
  font-size: .7rem;
  color: #bdbdbd;
  line-height: 1.5;
  text-align: right;
}

.home-building {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-right: -3%;
}

.icon-icon_dong {
  background-image: linear-gradient(to right,#f08200, #f45e06);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.building-name {
  font-size: .7rem;
  color: #8d8d8d;
  line-height: 1.5;
  font-weight: 500;
}
</style>
