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
                size: 0,
              },
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
              yaxis: {
                labels: {
                    style: {
                        colors: '#8e8da4',
                    },
                    offsetX: 0,
                    formatter: function (value) {
						return (value*100).toFixed(2);
					}
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                }
              },
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
              title: {
                text: 'Twitter Word Count/Day',
                align: 'left',
                offsetX: 14
              },
              tooltip: {
                shared: true
              },
              legend: {
                position: 'top',
                horizontalAlign: 'right',
                offsetX: -10
              },
			  noData: {
				text: 'No Data Available...'
			  }
            },
          
          
          };
        }
		
        render() {
          return (
            

      <div id="chart">
  <ReactApexChart options={this.state.options} series={this.props.series} type="area" height={350} />
</div>
    

          );
        }
      }