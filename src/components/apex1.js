import React, {Component} from "react";
import moment from 'moment';
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
			
            series: [],
            options: {
			  annotations: {
				xaxis: [
				  {
					x: new Date("03/24/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#eb4034",
					label: {
					  borderColor: "#eb4034",
					  style: {
						color: "#fff",
						background: "#eb4034",
						fontSize: "8px"
					  },
					  text: "Lockdown Announced"
					},
				  },
				  {
					x: new Date("03/10/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#4aed18",
					label: {
					  borderColor: "#4aed18",
					  style: {
						color: "#fff",
						background: "#4aed18",
						fontSize: "8px"
					  },
					  text: "First COVID-related Death"
					},
				  },
				  {
					x: new Date("03/19/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#f2ee0a",
					label: {
					  borderColor: "#f2ee0a",
					  style: {
						color: "#fff",
						background: "#f2ee0a",
						fontSize: "8px",
					  },
					  text: "Announcement of Janta Curfew"
					},
				  },
				  {
					x: new Date("03/22/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#7a6bed",
					label: {
					  borderColor: "#7a6bed",
					  style: {
						color: "#fff",
						background: "#7a6bed",
						fontSize: "8px",
					  },
					  text: "Junta Curfew Observed"
					},
				  },
				  {
					x: new Date("04/03/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#ff9100",
					label: {
					  borderColor: "#ff9100",
					  style: {
						color: "#fff",
						background: "#ff9100",
						fontSize: "8px",
					  },
					  text: "Announcement of Diya Jalao"
					},
				  },
				  {
					x: new Date("04/05/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#ff00d0",
					label: {
					  borderColor: "#ff00d0",
					  style: {
						color: "#fff",
						background: "#ff00d0",
						fontSize: "8px",
					  },
					  text: "Diya Jalao Observed at 9PM"
					},
				  },
				  {
					x: new Date("04/14/2020").getTime(),
					strokeDashArray: 0,
					borderColor: "#775DD0",
					label: {
					  borderColor: "#775DD0",
					  style: {
						color: "#fff",
						background: "#775DD0",
						fontSize: "8px",
					  },
					  text: "Announcement of Lockdown Extension"
					},
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
              },
              dataLabels: {
                enabled: false
              },
              markers: {
                size: 0,
              },
			  colors:['#E91E63', '#ffea00'],
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
              title: {
                text: 'Twitter Volume/Day and Positive Cases',
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