Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      
      this.$parent.transactionTotal = data.reduce(function(preVal,elem){
        return preVal + elem.amount
       },0)
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: ['date','description','term','amount'],
    gridData: accountData.transactions.filter(function(el) {
      return el.finYear >= 2010
    }),
    transactionTotal: accountData.transactions.reduce(function(preVal,elem){
        return preVal + elem.amount
    },0)
  }
  // },
  // mounted() {
  //   // axios.get("http://localhost:8080/transactions")
  //   // .then(response => {this.gridData = response.data.filter(function(el) {
  //   //   return el.finYear >= 2017
  //   // })})
  //   //.then(response => {console.log(response.data)})
  // }
}); 