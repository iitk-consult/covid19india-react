import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import {sliceTimeseriesFromEnd} from '../utils/common-functions';
import {useResizeObserver} from '../utils/hooks';
import {formatNumber} from '../utils/common-functions';
// import {preprocessHospitalTimeseries} from '../utils/common-functions';

function TimeSeries(props) {
  const [lastDaysCount, setLastDaysCount] = useState(
    window.innerWidth > 512 ? Infinity : 30
  );
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [chartType, setChartType] = useState(props.type);
  const [moving, setMoving] = useState(false);

  const svgRef1 = useRef();
  //const svgRef2 = useRef();
  //const svgRef3 = useRef();

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      const slicedTimeseries = sliceTimeseriesFromEnd(
        props.timeseries,
        lastDaysCount
      );
      setIndex(slicedTimeseries.length - 1);
      setTimeseries(slicedTimeseries);
    }
  }, [props.timeseries, lastDaysCount]);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  useEffect(() => {
    setLogMode(props.logMode);
  }, [props.logMode]);

  useEffect(() => {
    setChartType(props.type);
  }, [props.type]);

  const graphData = useCallback(
    (timeseries) => {
      if (!dimensions) return;
      const width = dimensions.width;
      const height = dimensions.height;

      // Margins
      const margin = {top: 15, right: 35, bottom: 25, left: 25};
      const chartRight = width - margin.right;
      const chartBottom = height - margin.bottom;

      // const ts = preprocessHospitalTimeseries(timeseries);
      const ts = 0;
	  const T = ts.length;
      const yBuffer = 1.1;

      setDatapoint(ts[0]);
      setIndex(0);

      const svg1 = d3.select(svgRef1.current);
      //const svg2 = d3.select(svgRef2.current);
      //const svg3 = d3.select(svgRef3.current);

      const dateMin = new Date(ts[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(ts[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .clamp(true)
        .domain([dateMin, dateMax])
        .range([margin.left, chartRight]);

      // Number of x-axis ticks
      const numTicksX = width < 480 ? 4 : 7;

      const xAxis = (g) =>
        g
          .attr('class', 'x-axis')
          .call(d3.axisBottom(xScale).ticks(numTicksX))
          .style('transform', `translateY(${chartBottom}px)`);

      const yAxis = (g, yScale) =>
        g
          .attr('class', 'y-axis')
          .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(5))
          .style('transform', `translateX(${chartRight}px)`);

      // Arrays of objects
      const svgArray = [svg1, /*svg2, svg3*/];
      const plotTotal = chartType === 1;
      const dataTypesTotal = [
        'positiveWorst',
		'positive',
		'positiveRealistic',
		'positiveBest',
      ];
      const dataTypesDaily = [
		'positiveWorst',
		'positive',
		'positiveRealistic',
		'positiveBest',
      ];

      const colors = ['#ff073a', '#28a745', '#6c757d'];

      let yScales;
      if (plotTotal) {
        let uniformScaleMin = Infinity;
        dataTypesTotal.forEach((type) => {
          uniformScaleMin = Math.min(
            uniformScaleMin,
            d3.min(ts, (d) => d[type])
          );
        });
        const yScaleUniformLinear = d3
          .scaleLinear()
          .clamp(true)
          .domain([uniformScaleMin, yBuffer * d3.max(ts, (d) => d.positiveRealistic)])
          .nice()
          .range([chartBottom, margin.top]);

        const yScaleUniformLog = d3
          .scaleLog()
          .clamp(true)
          .domain([
            Math.max(1, uniformScaleMin),
            Math.max(1, yBuffer * d3.max(ts, (d) => d.positiveWorst)),
          ])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesTotal.map((type) => {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([
              d3.min(ts, (d) => d[type]),
              yBuffer * d3.max(ts, (d) => d[type]),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          const yScaleLog = d3
            .scaleLog()
            .clamp(true)
            .domain([
              Math.max(
                1,
                d3.min(ts, (d) => d[type])
              ),
              Math.max(1, yBuffer * d3.max(ts, (d) => d[type])),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          if (logMode) return mode ? yScaleUniformLog : yScaleLog;
          else return mode ? yScaleUniformLinear : yScaleLinear;
        });
      } else {
        const yScaleDailyUniform = d3
          .scaleLinear()
          .clamp(true)
          .domain([0, yBuffer * d3.max(ts, (d) => d.positiveWorst)])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesDaily.map((type) => {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([0, yBuffer * d3.max(ts, (d) => d[type])])
            .nice()
            .range([chartBottom, margin.top]);
          return mode ? yScaleDailyUniform : yScaleLinear;
        });
      }

      /* Focus dots */
      const focus = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          
      });
	  const focus1 = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus1')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus1')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 4);
      });
	  const focus2 = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus2')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus2')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 4);
      });
	  const focus3 = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus3')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus3')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 4);
      });

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const date = xScale.invert(xm);
        const bisectDate = d3.bisector((d) => d.date).left;
        let i = bisectDate(ts, date, 1);
        if (0 <= i && i < T) {
          if (date - ts[i - 1].date < ts[i].date - date) --i;
          setDatapoint(timeseries[i]);
          setIndex(i);
          setMoving(true);
          const d = ts[i];
          focus.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j] : dataTypesDaily[j];
            f.attr('cx', xScale(d.date)).attr('cy', yScale(d[type])).attr('r', (d[type]=="")?null:4);
          });
		  focus1.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j+1] : dataTypesDaily[j+1];
            f.attr('cx', xScale(d.date)).attr('cy', yScale(d[type])).attr('r', (d[type]=="")?null:4);
          });
		  focus2.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j+2] : dataTypesDaily[j+2];
            f.attr('cx', xScale(d.date)).attr('cy', yScale(d[type])).attr('r', (d[type]=="")?null:4);
          });
		  focus3.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j+3] : dataTypesDaily[j+3];
            f.attr('cx', xScale(d.date)).attr('cy', yScale(d[type])).attr('r', (d[type]=="")?null:4);
          });
        }
      }

      function mouseout() {
        setDatapoint(timeseries[0]);
        setIndex(0);
        setMoving(false);
        focus.forEach((f, j) => {
          const yScale = yScales[j];
          const type = plotTotal ? dataTypesTotal[j] : dataTypesDaily[j];
          f.attr('cx', xScale(ts[0].date)).attr('cy', yScale(ts[0][type])).attr('r', (ts[0][type]=="")?null:4);
        });
		focus1.forEach((f, j) => {
          const yScale = yScales[j];
          const type = plotTotal ? dataTypesTotal[j+1] : dataTypesDaily[j+1];
          f.attr('cx', xScale(ts[0].date)).attr('cy', yScale(ts[0][type])).attr('r', (ts[0][type]=="")?null:4);
        });
		focus2.forEach((f, j) => {
          const yScale = yScales[j];
          const type = plotTotal ? dataTypesTotal[j+2] : dataTypesDaily[j+2];
          f.attr('cx', xScale(ts[0].date)).attr('cy', yScale(ts[0][type])).attr('r', (ts[0][type]=="")?null:4);
        });
		focus3.forEach((f, j) => {
          const yScale = yScales[j];
          const type = plotTotal ? dataTypesTotal[j+3] : dataTypesDaily[j+3];
          f.attr('cx', xScale(ts[0].date)).attr('cy', yScale(ts[0][type])).attr('r', (ts[0][type]=="")?null:4);
        });
      }

      /* Begin drawing charts */
      svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i];
        const typeDaily = dataTypesDaily[i];
		const type = plotTotal ? typeTotal : typeDaily;

        const color = colors[i];
        const yScale = yScales[i];
        // WARNING: Bad code ahead.
        /* X axis */
        if (svg.select('.x-axis').empty()) {
          svg.append('g').attr('class', 'x-axis').call(xAxis);
        } else {
          svg.select('.x-axis').transition(t).call(xAxis);
        }
        /* Y axis */
        if (svg.select('.y-axis').empty()) {
          svg.append('g').call(yAxis, yScale);
        } else {
          svg.select('.y-axis').transition(t).call(yAxis, yScale);
        }
        // ^This block of code should be written in a more d3 way following the
        //  General Update Pattern. Can't find of a way to do that within React.

        /* Path dots */
        svg
          .selectAll('.dot1')
          .data(ts, (d) => d.date)
          .join((enter) => enter.append('circle').attr('cy', chartBottom))
          .attr('class', 'dot1')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', (d) => (d[type]=="")? null:2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem1').remove();
          const path = svg
            .selectAll('.trend1')
            .data([[...ts].reverse()])
            .join('path')
            .attr('class', 'trend1')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 4);
          // HACK
          // Path interpolation is non-trivial. Ideally, a custom path tween
          // function should be defined which takes care that old path dots
          // transition synchronously along with the path transition. This hack
          // simulates that behaviour.
          if (path.attr('d')) {
            const n = path.node().getTotalLength();
            const p = path.node().getPointAtLength(n);
            // Append points at end of path for better interpolation
            path.attr(
              'd',
              () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T)
            );
          }
          path
            .transition(t)
            .attr('opacity', plotTotal ? 1 : 0)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d[typeTotal]))
                .curve(d3.curveCardinal)
            );
		  
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          /* DAILY TRENDS */
          svg.selectAll('.trend1').remove();
          svg
            .selectAll('.stem1')
            .data(ts, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem1')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[typeDaily]));
        }

        svg
          .on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);
      });
	  
	  svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i+1];
        const typeDaily = dataTypesDaily[i+1];
		const type = plotTotal ? typeTotal : typeDaily;

        const color = colors[i];
        const yScale = yScales[i];
        // WARNING: Bad code ahead.
        /* X axis */
        if (svg.select('.x-axis').empty()) {
          svg.append('g').attr('class', 'x-axis').call(xAxis);
        } else {
          svg.select('.x-axis').transition(t).call(xAxis);
        }
        /* Y axis */
        if (svg.select('.y-axis').empty()) {
          svg.append('g').call(yAxis, yScale);
        } else {
          svg.select('.y-axis').transition(t).call(yAxis, yScale);
        }
        // ^This block of code should be written in a more d3 way following the
        //  General Update Pattern. Can't find of a way to do that within React.

        /* Path dots */
        svg
          .selectAll('.dot2')
          .data(ts, (d) => d.date)
          .join((enter) => enter.append('circle').attr('cy', chartBottom))
          .attr('class', 'dot2')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', (d) => (d[type]=="")? null:2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem2').remove();
          const path = svg
            .selectAll('.trend2')
            .data([[...ts].reverse()])
            .join('path')
            .attr('class', 'trend2')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 4);
          // HACK
          // Path interpolation is non-trivial. Ideally, a custom path tween
          // function should be defined which takes care that old path dots
          // transition synchronously along with the path transition. This hack
          // simulates that behaviour.
          if (path.attr('d')) {
            const n = path.node().getTotalLength();
            const p = path.node().getPointAtLength(n);
            // Append points at end of path for better interpolation
            path.attr(
              'd',
              () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T)
            );
          }
          path
            .transition(t)
            .attr('opacity', plotTotal ? 1 : 0)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d[typeTotal]))
                .curve(d3.curveCardinal)
            );
		  
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          /* DAILY TRENDS */
          svg.selectAll('.trend2').remove();
          svg
            .selectAll('.stem2')
            .data(ts, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem2')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[typeDaily]));
        }
      });
	  svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i+3];
        const typeDaily = dataTypesDaily[i+3];
		const type = plotTotal ? typeTotal : typeDaily;

        const color = colors[i];
        const yScale = yScales[i];
        // WARNING: Bad code ahead.
        /* X axis */
        if (svg.select('.x-axis').empty()) {
          svg.append('g').attr('class', 'x-axis').call(xAxis);
        } else {
          svg.select('.x-axis').transition(t).call(xAxis);
        }
        /* Y axis */
        if (svg.select('.y-axis').empty()) {
          svg.append('g').call(yAxis, yScale);
        } else {
          svg.select('.y-axis').transition(t).call(yAxis, yScale);
        }
        // ^This block of code should be written in a more d3 way following the
        //  General Update Pattern. Can't find of a way to do that within React.

        /* Path dots */
        svg
          .selectAll('.dot')
          .data(ts, (d) => d.date)
          .join((enter) => enter.append('circle').attr('cy', chartBottom))
          .attr('class', 'dot')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', (d) => (d[type]=="")? null:2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem').remove();
          const path = svg
            .selectAll('.trend')
            .data([[...ts].reverse()])
            .join('path')
            .attr('class', 'trend')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 4);
          // HACK
          // Path interpolation is non-trivial. Ideally, a custom path tween
          // function should be defined which takes care that old path dots
          // transition synchronously along with the path transition. This hack
          // simulates that behaviour.
          if (path.attr('d')) {
            const n = path.node().getTotalLength();
            const p = path.node().getPointAtLength(n);
            // Append points at end of path for better interpolation
            path.attr(
              'd',
              () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T)
            );
          }
          path
            .transition(t)
            .attr('opacity', plotTotal ? 1 : 0)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d[typeTotal]))
                .curve(d3.curveCardinal)
            );
		  
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          /* DAILY TRENDS */
          svg.selectAll('.trend').remove();
          svg
            .selectAll('.stem')
            .data(ts, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[typeDaily]));
        }
      });
	  svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i+2];
        const typeDaily = dataTypesDaily[i+2];
		const type = plotTotal ? typeTotal : typeDaily;

        const color = colors[i];
        const yScale = yScales[i];
        // WARNING: Bad code ahead.
        /* X axis */
        if (svg.select('.x-axis').empty()) {
          svg.append('g').attr('class', 'x-axis').call(xAxis);
        } else {
          svg.select('.x-axis').transition(t).call(xAxis);
        }
        /* Y axis */
        if (svg.select('.y-axis').empty()) {
          svg.append('g').call(yAxis, yScale);
        } else {
          svg.select('.y-axis').transition(t).call(yAxis, yScale);
        }
        // ^This block of code should be written in a more d3 way following the
        //  General Update Pattern. Can't find of a way to do that within React.

        /* Path dots */
        svg
          .selectAll('.dot3')
          .data(ts, (d) => d.date)
          .join((enter) => enter.append('circle').attr('cy', chartBottom))
          .attr('class', 'dot3')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', (d) => (d[type]=="")? null:2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem3').remove();
          const path = svg
            .selectAll('.trend3')
            .data([[...ts].reverse()])
            .join('path')
            .attr('class', 'trend3')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 4);
          // HACK
          // Path interpolation is non-trivial. Ideally, a custom path tween
          // function should be defined which takes care that old path dots
          // transition synchronously along with the path transition. This hack
          // simulates that behaviour.
          if (path.attr('d')) {
            const n = path.node().getTotalLength();
            const p = path.node().getPointAtLength(n);
            // Append points at end of path for better interpolation
            path.attr(
              'd',
              () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T)
            );
          }
          path
            .transition(t)
            .attr('opacity', plotTotal ? 1 : 0)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d[typeTotal]))
                .curve(d3.curveCardinal)
            );
		  
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          /* DAILY TRENDS */
          svg.selectAll('.trend3').remove();
          svg
            .selectAll('.stem3')
            .data(ts, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem3')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[typeDaily]));
        }
      });
    },
    [dimensions, chartType, logMode, mode]
  );

  useEffect(() => {
    if (timeseries.length > 1) {
      graphData(timeseries);
    }
  }, [timeseries, graphData]);

  const focusDate = moment(datapoint.date);
  let dateStr = focusDate.format('DD MMMM');
  dateStr += focusDate.isSame(moment().subtract(1, 'days'), 'day')
    ? ' Yesterday'
    : '';

  const chartKey1 = chartType === 1 ? 'positive' : 'hospitalised';
  const chartKey11 = chartType === 1 ? 'positiveBest' : 'hospitalised';
  const chartKey12 = chartType === 1 ? 'positiveRealistic' : 'hospitalised';
  const chartKey13 = chartType === 1 ? 'positiveWorst' : 'hospitalised';
  //const chartKey2 = chartType === 1 ? 'admitHospital' : 'hospitalisedGovt';
  //const chartKey3 = chartType === 1 ? 'recovered' : 'hospitalisedPvt';
  //const chartKey21 = chartType === 1 ? 'admitHospitalLower' : 'hospitalisedGovt';
  //const chartKey31 = chartType === 1 ? 'recovered' : 'hospitalisedPvt';
  //const chartKey22 = chartType === 1 ? 'admitHospitalUpper' : 'hospitalisedGovt';
  //const chartKey32 = chartType === 1 ? 'recovered' : 'hospitalisedPvt';

  // Function for calculate increased/decreased count for each type of data
  const currentStatusCount = (chartType) => {
    if (timeseries.length <= 0 || index === 0) return '';
    const currentDiff =
      timeseries[index][chartType] - timeseries[index - 1][chartType];
    const formatedDiff = formatNumber(currentDiff);
    return currentDiff >= 0 ? `+${formatedDiff}` : formatedDiff;
  };

  return (
    <div
      className="TimeSeries-Parent fadeInUp"
      style={{animationDelay: '2.7s'}}
    >
      <div className="timeseries">
        <div className="svg-parent" ref={wrapperRef}>
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Positive</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
				<h5>Current:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey1])}</h2>
              <h6>{currentStatusCount(chartKey1)}</h6>
            </div>
			<div className="stats-bottom">
				<h5>Proj. Best:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey11])}</h2>
              <h6>{currentStatusCount(chartKey11)}</h6>
            </div>
			<div className="stats-bottom">
				<h5>Proj. Realistic:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey12])}</h2>
              <h6>{currentStatusCount(chartKey12)}</h6>
            </div>
			<div className="stats-bottom">
				<h5>Proj. Worst:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey13])}</h2>
              <h6>{currentStatusCount(chartKey13)}</h6>
            </div>
          </div>
          <svg ref={svgRef1} preserveAspectRatio="xMidYMid meet" />
        </div>

        {/*<div className="svg-parent is-green">
          <div className="stats is-green">
            <h5 className={`${!moving ? 'title' : ''}`}>Admitted to Hospital</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
				<h5>Current:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey2])}</h2>
              <h6>{currentStatusCount(chartKey2)}</h6>
            </div>
			<div className="stats-bottom">
				<h5>Proj. Best:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey21])}</h2>
              <h6>{currentStatusCount(chartKey21)}</h6>
            </div>
			<div className="stats-bottom">
				<h5>Proj. Realistic:</h5>
			</div>
			<div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey22])}</h2>
              <h6>{currentStatusCount(chartKey22)}</h6>
            </div>
          </div>
          <svg ref={svgRef2} preserveAspectRatio="xMidYMid meet" />
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5 className={`${!moving ? 'title' : ''}`}>Deceased</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey3])}</h2>
              <h6>{currentStatusCount(chartKey3)}</h6>
            </div>
          </div>
          <svg ref={svgRef3} preserveAspectRatio="xMidYMid meet" />
		</div>*/}
      </div>

      <div className="pills">
        <button
          type="button"
          onClick={() => setLastDaysCount(Infinity)}
          className={lastDaysCount === Infinity ? 'selected' : ''}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(30)}
          className={lastDaysCount === 30 ? 'selected' : ''}
          aria-label="1 month"
        >
          1M
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(14)}
          className={lastDaysCount === 14 ? 'selected' : ''}
          aria-label="14 days"
        >
          14D
        </button>
      </div>
    </div>
  );
}

export default TimeSeries;
