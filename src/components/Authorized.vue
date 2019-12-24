<template>
  <button class="authorized-btn" @click="goToUrlFunc">确认授权</button>
</template>

<script>
import Mixin from './Mixin'
import axios from 'axios'

export default {
  mixins: [ Mixin ],

  name: 'Athorized',

  data () {
    return {
      url: localStorage.getItem('company'),
      code: ''
    }
  },

  methods: {
    goToUrlFunc () {
      this.code = this.parseStringToObject(this.getQueryString()).code
      axios.get(this.baseUrl + 'authorized?code=' + this.code)
        .then(res => {
          let authorize = this.getAuthorizeFunc(res.data)
          location.href = localStorage.getItem('company_url') + '&authorize=' + authorize
        })
    },
    parseStringToObject (string) {
      var params = {}
      var arr = string.split('&')
      for (var i = 0, l = arr.length; i < l; i++) {
        var a = arr[i].split('=')
        params[a[0]] = a[1]
      }
      return params
    },
    getAuthorizeFunc (data) {
      let organizations = []
      data.map(function (organization) {
        organizations.push(organization.name)
      })
      let company = localStorage.getItem('company')
      let authorize = Boolean(organizations.indexOf(company) > -1)
      return authorize
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.authorized-btn {
  height: 2rem;;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7rem;
  color: white;
  line-height: 1.5;
  background: linear-gradient(#f08200, #f45e06);
  margin: 1.2rem 0 1.6rem;
  border-radius: .3rem;
}
</style>
