Module.register("crypto", {
  defaults: {
    coins: [config.coin, config.coin2, config.coin3],
    coin_name: config.coin,
    coin_name2: config.coin2,
    coin_name3: config.coin3,
    initialLoadDelay: 10000,
    updateInterval: 1000 * 5 // every 30 seconds
  },
  price: 0,
  price2: 0,
  price3: 0,
  prices: [this.price, this.price2, this.price3],
  counter: 0,
  num_coins: 3,

  // Define required scripts.
	getStyles: function () {
		return ["crypto.css"];
	},

  start: function() {
    var self = this
    // log info
    Log.info("Starting module: " + "crypto");
    // set locale
    moment.locale(config.language);

    // Schedule update timer.
    setInterval(
      // invoke and inline arrow function
      ()=>{
        // pass 'this' to the handler
        this.fetchPrice(this)
      }, this.config.updateInterval);
  },

  getDom: function () {
    // create div variable
    // fetch the price for the first time
    var wrapper = document.createElement("div");
    // create table and label className
    var table = document.createElement("table");
    table.className = this.config.tableClass;

    // create row for btc label and insert it into table
    var crypto_label_row = document.createElement("tr");
    // create label element and add it to the row
    var crypto_label = document.createElement("td");
    crypto_label.className = 'crypto_label';
    crypto_label.innerText = "Crypto Prices";
    crypto_label_row.appendChild(crypto_label);
    table.appendChild(crypto_label_row);

    // create row for btc label and insert it into table
    var btc_label_row = document.createElement("tr");
    // create label element and add it to the row
    var btc_label = document.createElement("td");
    btc_label.className = 'btc_label';
    btc_label.innerText = this.config.coin + ": $" + this.price.toLocaleString();
    btc_label_row.appendChild(btc_label);
    table.appendChild(btc_label_row);

    // create row for eth label and insert it into table
    var eth_label_row = document.createElement("tr");
    // create label element and add it to the row
    var eth_label = document.createElement("td");
    eth_label.className = 'eth_label';
    eth_label.innerText = this.config.coin2 + ": $" + this.price2.toLocaleString();
    eth_label_row.appendChild(eth_label);
    table.appendChild(eth_label_row);

    // create row for eth label and insert it into table
    var link_label_row = document.createElement("tr");
    // create label element and add it to the row
    var link_label = document.createElement("td");
    link_label.className = 'link_label';
    link_label.innerText = this.config.coin3 + ": $" + this.price3.toLocaleString();
    link_label_row.appendChild(link_label);
    table.appendChild(link_label_row);

    // add the table to wrapper
    wrapper.appendChild(table);
    this.counter = this.counter + 1;
    Log.info("counter: " + this.counter);

    return wrapper;
  },

  // context lost in timer function invocation, pass it in
  fetchPrice: (self) => {
    // for bitcoin and then for ethereum
    self.fetcher(self, 1);
    self.fetcher(self, 2);
    self.fetcher(self, 3);
  },

  fetcher: (self, num) => {
    var link = ""
    if (num == 1) {
      link = 'https://api.coingecko.com/api/v3/coins/'+ self.config.coin.toLowerCase();
    }
    else if (num == 2) {
      link = 'https://api.coingecko.com/api/v3/coins/'+ self.config.coin2.toLowerCase()
    }
    else {
      link = 'https://api.coingecko.com/api/v3/coins/'+ self.config.coin3.toLowerCase()
    }
    fetch(link)
      .then(
        function(response) {
          if (response.status !== 200) {
            Log.info('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then(function(data) {
            if (num == 1) {
              self.price = data.market_data.current_price.usd;
            }
            else if (num == 2) {
              self.price2 = data.market_data.current_price.usd;
            }
            else {
              self.price3 = data.market_data.current_price.usd;
            }
            self.updateDom(0);
          });
        }
      )
      .catch(function(err) {
        Log.info('Fetch Error :-S', err);
      });
  }

});
