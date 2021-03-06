/**
 *
 */

(function ($) {
    var DEFAULT_KPI_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day"
    };

    $.fn.dateAgg = function (options) {
        var container = this;

        container.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_KPI_OPTIONS, options);

            var queryHref = null;
            var aggName = null;
            var component = container.closest('[data-type^="component-"]');
            if (component.length > 0) {
                queryHref = "/queries/" + component.attr("data-query");
                aggName = component.attr("data-agg");
                flog("date histo params", queryHref, aggName, component);
            }

            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog("dateagg date change", e, startDate, endDate);

                loadGraphData(queryHref, aggName, {
                    startDate: startDate,
                    endDate: endDate
                }, cont, config);
            });

            // Wait for event to be triggered
            //loadGraphData(queryHref, aggName, opts, cont, config);
        });
    };


    function loadGraphData(href, aggName, opts, container, config) {
        href = href + "?run&" + $.param(opts);

        flog("loadGraphData", container, aggName, href);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (resp) {
                showHistogram(resp, container, aggName, config);
            }
        });
    }


    function showHistogram(resp, container, aggName, config) {

        var aggr = resp.aggregations[aggName];
        var svg = container.find("svg");
        svg.empty();

        flog("showHistogram", aggr, svg);
        nv.addGraph(function () {

            var myData = [];
            var series = {
                key: "Sum",
                values: []
            };
            myData.push(series);

            $.each(aggr.buckets, function (b, dateBucket) {
                var v = dateBucket.doc_count;
                if (v == null) {
                    v = 0;
                }
                series.values.push({x: dateBucket.key, y: v});
            });

            var chart = nv.models.multiBarChart()
                .margin({right: 50, left: 0, bottom: 30, top: 0})
                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                .showControls(false)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                .showLegend(false)
                .showYAxis(false)
                .clipEdge(true);

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%e %b')(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(',.2f'));

            chart.x(function (d) {
                return d.x;
            });
            chart.y(function (d) {
                return d.y;
            });


            flog("select data", myData, chart, svg.get(0));
            d3.select(svg.get(0))
                .datum(myData)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
        flog("done show histo");
    }
})(jQuery);
