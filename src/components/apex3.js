import React, {Component} from "react";
import moment from 'moment';
import Chart from "react-apexcharts";

export default class ApexChart2 extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
          
            series: [{
              name: 'Current',
              data: this.props.data[1]
            }, {
              name: 'Projected Best',
              data: this.props.data[2]
            },
			],
            options: {
              chart: {
                type: 'area',
                stacked: true,
				dropShadow: {
				  enabled: true,
				  enabledSeries: [0],
				  top: -2,
				  left: 2,
				  blur: 5,
				  opacity: 0.06
				},
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
				strokeColor: "#fff",
				strokeWidth: 3,
				strokeOpacity: 1,
				fillOpacity: 1,
				hover: {
				  size: 6
				}
              },
			  colors: ['#00E396', '#0090FF'],
			  stroke: {
				curve: "smooth",
				width: 3
			  },
              fill: {
                type: 'solid',
                fillOpacity: 0.7
              },
              yaxis: {
                labels: {
                    style: {
                        colors: '#8e8da4',
                    },
                    offsetX: 0,
                    
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
                text: 'Area Chart',
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
              }
            },
          
          
          };
        }

      

        render() {
          return (
            

      <div id="chart">
  <Chart options={this.state.options} series={this.state.series} type="area" height={350} />
</div>
    

          );
        }
      }