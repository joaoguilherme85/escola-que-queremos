// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require d3
//= require search

var width = 100,
    height = 100,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#3498DB", "#E74C3C"]);

var pie = d3.layout.pie()
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 10)
    .outerRadius(radius - 20);

function generatePie(element, dataset) {
  var svg = d3.select(element).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
      .data(pie(dataset))
    .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial values

  return path;
}

function updatePie(graph, data) {
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    return graph.data(pie(data))
                .transition()
                .duration(750)
                .attrTween("d", arcTween);
}

$(document).ready(function () {
    $('.indicator').each(function () {
        var data = $(this).data();
        var key = data.indicatorKey;
        var hasIndicator = data.hasIndicator;
        var hasntIndicator = data.hasntIndicator;
        var cssClass = "." + key + " .pie";

        generatePie(cssClass, [hasIndicator, hasntIndicator]);
        $(cssClass + " svg").attr("style", "background-image: url('assets/"+key+".png');");
    });

    $('#search-link').click(function (evt) {
      $('.search').focus();
      return false;
    });

    $('a[data-modal]').click(function() {
      $($(this).attr('data-modal')).dialog({modal: true, width: 700, height: 500});
      return false;
    });
});
