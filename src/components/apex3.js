import React, {Component} from "react";
import moment from 'moment';
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
			
            series: [],
            options: {
              chart: {
                type: 'area',
                stacked: false,
                height: 350,
                zoom: {
                  enabled: true
                },
              },
              dataLabels: {
                enabled: false
              },
              markers: {
                size: [1,1],
              },
			  colors:['#E91E63', '#ffea00', '#5b4ef2', '#ff8000', '#ff00d9', '#00ffee', '#bbff00', '#ff8000', '#E91E63'],
              fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [20, 100, 100, 100]
                  },
              },
               yaxis: [{
                title: {
                  text: "Twitter Volume/Day"
                },
                labels: {
                    style: {
                        colors: '#8e8da4',
                    },
                    offsetX: 0,
                    formatter: function (value) {
                      return Math.trunc(value);
                    }
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                }
              },
              {
                title: {
                  text: "Positive Cases"
                },
                opposite: true,
                labels: {
                    style: {
                        colors: '#8e8da4',
                    },
                    offsetX: 0,
                    formatter: function (value) {
                    return Math.trunc(value);
                  }
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                }
              }],
              
              xaxis: {
                type: 'datetime',
                tickAmount: 8,
                labels: {
                    rotate: -15,
                    rotateAlways: true,
                    formatter: function(val, timestamp) {
                      return moment(new Date(timestamp)).format("DD MMM")
                  }
                }
              },
              // title: {
              //   text: 'Twitter Volume/Day and Positive Cases',
              //   align: 'left',
              //   offsetX: 14
              // },
              tooltip: {
                shared: true
              },
              legend: {
				        showForZeroSeries: false,
                position: 'top',
                horizontalAlign: 'left',
                offsetX: -10
              },
			  noData: {
				text: 'No Data Available...'
			  }
            },
          
          
          };
        }
		
		test(){
			console.log('yo')
		}
		
        render() {
          return (
            

      <div id="chart">
  <ReactApexChart options={this.state.options} series={this.props.series} type="area" height={350} />
</div>
    

          );
        }
      }