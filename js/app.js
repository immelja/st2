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
      this.$parent.transactionTotal = CurrencyFormatted(this.$parent.transactionTotal)
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

function reportingPeriodSummary(transactions) {
  var summary = []
  transactions.reduce(function(smry,trn) {
    if (!smry[trn.reportingPeriod]) {
        res[trn.reportingPeriod] = {
            total: 0,
            prd: trn.reportingPeriod
        };
        result.push(res[value.Id])
    }
    res[value.Id].qty += value.qty
    return res;
  })
}

function periodSummary(trn) {
  var result = [];
  accountData.transactions.reduce(function (res, value) {
    if (!res[value.reportingPeriod]) {
        res[value.reportingPeriod] = {
            reportingPeriod: value.reportingPeriod,
            amount: 0
        };
        result.push(res[value.reportingPeriod])
    }
    res[value.reportingPeriod].amount += value.amount;
    return res;
  }, {});
  var formattedResult = result.map(function(val) {
    return {
      reportingPeriod: val.reportingPeriod,
      amount: CurrencyFormatted(val.amount)
    }
  });
  return formattedResult;
}

var demo2 = new Vue({
  el: '#demo2',
  data: {
    searchQuery: '',
    gridColumns: ['reportingPeriod','amount'],
    gridData: periodSummary(),
    // gridData: accountData.transactions.reduce(function(a,b){
    //     a[b.reportingPeriod] = (a[b.reportingPeriod]||0) + b.amount;
    //     return a;
    // },{}),
    transactionTotal: accountData.transactions.reduce(function(preVal,elem){
      return CurrencyFormatted(preVal + elem.amount)
    },0)
  }
}); 

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
      return CurrencyFormatted(preVal + elem.amount)
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

function CurrencyFormatted(amount) {
  var i = parseFloat(amount);
  if(isNaN(i)) { i = 0.00; }
  var minus = '';
  if(i < 0) { minus = '-'; }
  i = Math.abs(i);
  i = parseInt((i + .005) * 100);
  i = i / 100;
  s = new String(i);
  if(s.indexOf('.') < 0) { s += '.00'; }
  if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
  s = minus + s;
  return s;
}