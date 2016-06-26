var app = angular.module('ProphetWeb');


app.controller('ViewsController',
    ['listViews', 'view', 'PredictionsService', 'ModelsService', 'charts',
        function (listViews, view, PredictionsService, ModelsService, charts) {

            this.labelclass = "";//"active";

            var vars = ModelsService.inputVars.concat(ModelsService.outputVars).reduce((prev, cur) => {
                prev[cur.value] = cur.desc;
                return prev;
            }, {});

            this.views = listViews;
            this.view = view;
            this.charts = charts;



        }
    ]
);

app.directive('chartcanvas', ['PredictionsService', function (PredictionsService) {
    return {
        scope: {
            chartcanvas: '='
        },
        link: function ($scope, element, attrs) {

            var myChart = new Chart($(element), {
                type: 'line',
                data: {
                    labels: $scope.chartcanvas.labels,
                    datasets: [{
                        label: $scope.chartcanvas.yaxis,
                        data: $scope.chartcanvas.data,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: $scope.chartcanvas.xaxis
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: $scope.chartcanvas.yaxis
                            }
                        }],
                    }
                }
            });
        }
    };
}]);

app.directive('editButton', ['ViewsService', function (ViewsService) {
    return {
        link: function ($scope, element, attrs) {

            $(element).click(function () {
                if (!$(element).data("editing")) {
                    $(element).data("editing", true);

                    $("#headerlabel").hide();
                    $("#editname").show();

                    $("#editicon").text("done");

                } else {
                    $(element).data("editing", false);

                    ViewsService.changeName($("#viewid").val(), $("#viewname").val()).then(x => {

                        $("#headerlabel").text($("#viewname").val());

                        $("#headerlabel").show();

                        $("#editname").hide();
                        $("#editicon").text("edit");

                    });
                }
            });
        }
    }
}]);

app.directive('download', [function () {
    return {
        link: function ($scope, element) {

            $(element)[0].addEventListener('click', function () {
                var canvasData = $(this).parent().parent().next()[0].toDataURL();
                this.href = canvasData;
                this.download = "chart.png"
            }, false);
        }
    }
}]);