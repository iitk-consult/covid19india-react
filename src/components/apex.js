import React, {Component} from "react";
import moment from 'moment';
import ReactApexChart from "react-apexcharts";
import { tr } from "date-fns/locale";

export default class ApexChart extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
			
            series: this.props.series,
            options: {
			  annotations: {
				xaxis: [
				  {
					x: new Date("03/24/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("03/10/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("03/19/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("03/22/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("04/03/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("04/05/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				  {
					x: new Date("04/14/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
				  },
				],
			  },
              chart: {
                type: 'area',
                stacked: false,
                height: 350,
                zoom: {
                  enabled: true
                },
                toolbar:
                {
                  show: true,
                  position: 'right'
                }
              },
              dataLabels: {
                enabled: false
              },
              markers: {
                size: [1,8,8,8,8,8,8,8],
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
                      var truncatedVal;
                      try{
					          	  truncatedVal = (value).toFixed(2);
                      }
                      catch{
                        truncatedVal = 0.0;
                      }
                      return truncatedVal;
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
              // title: {
              //   text: 'Twitter Word Count/Day',
              //   align: 'left',
              //   offsetX: 14
              // },
              tooltip: {
                shared: true,
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
		
        render() {
          return (
            

      <div id="chart">
  <ReactApexChart options={this.state.options} series={this.props.series} type="area" height={350} />
</div>
    

          );
        }
      }