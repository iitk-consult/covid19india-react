import React, {Component} from "react";
import moment from 'moment';
import Chart from "react-apexcharts";

export default class ApexChart1 extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
          
            series: [{
              name: 'Admitted to Hospital',
              data: this.props.data[4]
            }, {
              name: 'Admitted to Hospital (est. lower bound)',
              data: this.props.data[5]
            },
			{
              name: 'Admitted to Hospital (est. upper bound)',
              data: this.props.data[6]
            },
			{
              name: 'No. of Beds',
              data: this.props.data[7]
            }
			],
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
                text: 'Admitted to Hospital',
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