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
      doRequestQueryString: `company=${this.getQueryValue()}`,
      code: '',
      authorize: false
    }
  },

  created () {
    this.doRequst()
  },

  methods: {
    doRequst () {
      axios.get(this.baseUrl + 'company?' + this.doRequestQueryString)
        .then(res => {
          this.information = res.data.result[0] || {}
          localStorage.setItem('company', this.getQueryValue())
          localStorage.setItem('company_url', location.href.replace(/company/, 'authorized'))
          this.authorize = this.parseStringToObject(this.getQueryString()).authorize
          if (!this.authorize) {
            location.href = `${res.data.authorizedRedirectUrl}/oauth/authorize?client_id=${res.data.clientId}&response_type=code&key=value&redirect_uri=${location.origin}/guixi_app/authorized`
          }
        })
        .catch(err => { console.log(err) })
    },
    goToUrlFunc () {
      this.code = this.parseStringToObject(this.getQueryString()).code
      axios.get(this.baseUrl + 'authorized?code=' + this.code)
        .then(res => {
          let authorize = this.getAuthorizeFunc(res.data)
          location.href = localStorage.getItem('company_url') + '&authorize=' + authorize
        })
    },
    getQueryValue () {
      return this.parseStringToObject(this.getRequestQueryString()).company
    },
    getRequestQueryString () {
      var object = this.parseStringToObject(this.getQueryString())
      if (object.code) {
        delete object.code
      }
      return Object.keys(object).map(function (key) { return `${key}=${object[key]}` }).join('=')
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
