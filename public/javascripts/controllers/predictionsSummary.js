var app = angular.module('ProphetWeb');


app.controller('PredictionsSummaryController',
    ['model', 'summary', 'inputvars', 'outputvars','ViewsService', 'views',
        function (model, summary, inputvars, outputvars, ViewsService, views) {

            var vars = inputvars.concat(outputvars).reduce((prev, cur) => {
                prev[cur.value] = cur.desc;
                return prev;
            }, {});

            var avgKeys = Object.keys(summary.averages).sort();

            this.averages = avgKeys.map(x => {
                return {
                    name: vars[x.substr(3)],
                    value: summary.averages[x]
                };
            });
            var lastRecordKeys = Object.keys(summary.lastrecord).sort();

            this.lastrecord = lastRecordKeys.map(x => {
                return {
                    name: vars[x],
                    value: summary.lastrecord[x]
                }
            });

            this.predictions = (summary.predictions || []).map(x => {

                x.inputdesc = vars[x.inputvar];

                return x;
            });

            this.model_id = model.model_id;

            this.notRendered = true;

            this.selectedPrediction = null;

            this.allviews = views;

            this.render = function (prediction) {

                this.selectedPrediction = prediction;

                var canvas = $("#predchart");

                var labels = [];
                var step = (prediction.tovalue - prediction.fromvalue)
                    / prediction.amountpredictions;

                for (var i = 1; i <= prediction.amountpredictions; i++) {
                    labels.push((prediction.fromvalue + (i * step)).toFixed(2));
                }


                var myChart = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: vars[model.outputvar],
                            data: prediction.result.split(",").map(parseFloat),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: vars[prediction.inputvar] 
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: vars[model.outputvar]
                                }
                            }],
                        }
                    }
                });

            


                this.notRendered = false;
            };

            this.chosenview = {}

            this.addToView = function () {

                this.modelToUpload = model;
                $('#addToView').openModal();
            }
            this.addToViewPost = function () {
                ViewsService.addToView({
                    view_id: this.chosenview.view_id,
                    prediction: {
                        model_id: this.selectedPrediction.model_id,
                        prediction_id: this.selectedPrediction.prediction_id
                    }
                }).then(x => {
                    Materialize.toast('Prediction added to view.', 4000)
                    $('#addToView').closeModal();
                });
            }

            this.addToNewView = function () {

                this.modelToUpload = model;
                $('#addToNewView').openModal();
            }
            this.addToNewViewPost = function () {
                ViewsService.addToView({
                    view_id: null,
                    name: this.chosenview.name,
                    prediction: {
                        model_id: this.selectedPrediction.model_id,
                        prediction_id: this.selectedPrediction.prediction_id
                    }
                }).then(x => {
                    Materialize.toast('Prediction added to new view.', 4000)
                    $('#addToNewView').closeModal();
                });
            }



            document.getElementById("chartdownload").addEventListener('click', function () {
                var canvasData = document.getElementById("predchart").toDataURL();
                this.href = canvasData;
                this.download = "chart.png"
            }, false);
        }
    ]
);