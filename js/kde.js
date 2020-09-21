function kde(sample) {
  /* Epanechnikov kernel */
  function epanechnikov(u) {
    return Math.abs(u) <= 1 ? 0.75 * (1 - u*u) : 0;
  };

  var kernel = epanechnikov;
  return {
    scale: function(h) {
      kernel = function (u) { return epanechnikov(u / h) / h; };
      return this;
    },

    points: function(points) {
      return points.map(function(x) {
        var y = pv.sum(sample.map(function (v) {
          return kernel(x - v);
        })) / sample.length;
        return {x: x, y: y};
      });
    }
  }
}

function timesget(){
  var times = [];
  for( i = 0; i < Data_Store.split_text.length; i++){
      times[i]=Data_Store.split_text[i][2].get("X")-Data_Store.first_date.get("X");
  }
  return(times);
}
