import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';

import {
  formatDate2,
  getoveralldata,
  pushregionwise,
  formatDateAbsolute,
  prettifyData,
  prettifyData1,
  preprocess,
  gettfValues,
  getnfValues,
  getposdata,
  getpsValues,
  getStateName1,
  processForBangla,
  eventdata,
  preprocessIndonesiaData,
  getwa1ValuesIndonesia
} from '../utils/common-functions';

import Papa from 'papaparse';
import stateData from './sample_data.json';
import Table from './table';
//import Level from './level';
import MapExplorer from './mapexplorer2';
import TimeSeries from './timeseries';
import ApexChart from './apex2';
import ApexChart1 from './apex3';
import Modal from './modal';
import Modal1 from './modal1';
//import Minigraph from './minigraph';

var states = [];

function Home(props) {
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  //const [timeseries, setTimeseries] = useState({});
  const [tfseries, setTfseries] = useState([]);
  const [wa1series, setWa1series] = useState([]);
  const [eventseries, setEventseries] = useState([]);
  const [psseries, setPsseries] = useState([]);
  const [nfseries, setNfseries] = useState([]);
  const [activeStateCode, setActiveStateCode] = useState('TT');
  const [activityLog, setActivityLog] = useState([]);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const varToString = varObj => Object.keys(varObj)[0]
  
  const getStates = async () => {
    try {
      var [
        overall,
		graphData,
		posData,
        stateDistrictWiseResponse,
        stateTestResponse
      ] = await Promise.all([
        axios.get('https://api.covid19api.com/dayone/country/bangladesh'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSQA16EVdkiVG8wVgZtHwT7bsIC47OyCJALR4cVewWxxNP5vkBdzKQSJ8BybcvN1ui1eMHL8uAB38Kt/pub?gid=0&single=true&output=csv'),
        axios.get('https://api.covid19api.com/dayone/country/bangladesh'),
		axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
	]);
	  var overalldata = getoveralldata(overall.data.slice(-1)[0]);
	  states=(overalldata);
	  //console.log(states)
	  const Data = preprocess(prettifyData(Papa.parse(graphData.data, {delimiter: ','})))
	  //console.log(Data)
      const finalData = processForBangla(Data);
	  //console.log(finalData)
	  //console.log(posData.data)
      var tfValues = gettfValues(finalData);
      var nfValues = getnfValues(finalData);
      var psValues = getposdata(posData.data);
      var wa1Values = getwa1ValuesIndonesia(finalData);
	  //console.log(psValues)
      setTfseries(tfValues);
      setPsseries(psValues);
      setNfseries(nfValues);
      setWa1series(wa1Values);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setFetched(true);
	  //console.log(nfseries);
    } catch (err) {
      console.log(err);
    }
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
    //console.log(activeStateCode);
  }, []);
  
  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };
  
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };
  
  const normalise = (nf, maxp) => {
	//console.log(nf)
	var max = 0;
	for(var x=0; x < nf.length; x++){
	  if(nf[x][1] > max){
		  max = nf[x][1];
	  }
	}
	for(var i=0; i < nf.length; i++){
	  nf[i][1] *= (maxp / max);
	}
	return nf;
  }

  const refs = [useRef(), useRef(), useRef()];

  return (
    <React.Fragment>
      <div className="Home">
        <div className="home-left">
          
		  {fetched && (
		  <React.Fragment>
		  <MapExplorer
                forwardRef={refs[1]}
                states={states}
                stateDistrictWiseData={stateDistrictWiseData}
                stateTestData={stateTestData}
			    regionHighlighted={regionHighlighted}
                onMapHighlightChange={onMapHighlightChange}
		  />
		  </React.Fragment>
		  )}
	
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <div className="header fadeInUp" style={{animationDelay: '1s'}}>
				<div className="header-mid">
				  <div className="titles">
					<h1>Social Media Analysis</h1>
					<h6 style={{fontWeight: 600}}>An initiative by ICG for WHO's Office for South East Asia</h6>
				  </div>
				</div>
			  </div>

              {/*<TimeSeries
                //timeseries={timeseries[activeStateCode]}
				timeseries={timeseries}
                type={graphOption}
                mode={timeseriesMode}
                logMode={timeseriesLogMode}
              />*/}
			  <div className="fadeInUp" style={{animationDelay: '0.5s'}}>
			  <div className="pills">
				<Modal1 />
			  </div>
			  <p />
        {tfseries[activeStateCode].length != 0 && <ApexChart series={[{name: 'Bangladesh', type:'area', data: tfseries[activeStateCode]},
                                                                      {name: 'Bangladesh'+" (Moving Average)", type:'area', data: wa1series[activeStateCode]}]}/>}
			  {/*tfseries[activeStateCode].length == 0 && <ApexChart series={[{name: getStateName1(activeStateCode), data: tfseries[activeStateCode]}]}/>*/}
			  <div className="pills">
				<Modal />
			  </div>
			  <p />
			  <ApexChart1 series={[{name: 'Twitter Volume/Day', type:'area', data: normalise(nfseries[activeStateCode], psseries[activeStateCode].slice(-1)[0][1])}, {name: 'Positive Cases', type:'area', data: psseries[activeStateCode]}]}/>
        {/* <ApexChart1 series={[{name: 'Twitter Volume/Day', type:'area', data: normalise(nfseries[activeStateCode], psseries[activeStateCode].slice(-1)[0][1])},  */}
                             {/* {name: 'Positive Cases', type:'area', data: psseries[activeStateCode]}]}/> */}
			  </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
