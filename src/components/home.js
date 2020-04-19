import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';
import * as Icon from 'react-feather';

import {
  formatDate,
  formatDate1,
  formatDateAbsolute,
  prettifyData,
  preprocess,
  getpsValues,
  gettfValues,
  getnfValues,
  getHosValues,
  preprocessHospitalTimeseries,
  getStateName,
  processForChart,
  parseStateTimeseries,
  preprocessTimeseries,
  prettifyHospitalisationData
} from '../utils/common-functions';
import {Link} from 'react-router-dom';

import Papa from 'papaparse';

//import Table from './table';
//import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import ApexChart from './apex';
import ApexChart1 from './apex1';
import ApexChart2 from './apex2';
import ApexChart4 from './apex4';
import Modal from './modal';
import Modal1 from './modal1';
//import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  //const [timeseries, setTimeseries] = useState({});
  const [psseries, setPsseries] = useState([]);
  const [tfseries, setTfseries] = useState([]);
  const [nfseries, setNfseries] = useState([]);
  const [hosseries, setHosseries] = useState([]);
  const [activeStateCode, setActiveStateCode] = useState('TT');
  const [activeStateName, setActiveStateName] = useState('Delhi');
  const [activeStateName1, setActiveStateName1] = useState('Delhi');
  const [activeStateCode1, setActiveStateCode1] = useState('TT');  // TT -> India
  const [activityLog, setActivityLog] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      var [
        response,
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        updateLogResponse,
        stateTestResponse,
		wb,
		up,
		karnataka,
		del,
		mh,
		kr,
		pb,
		tl,
		od,
		tn,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/updatelog/log.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSmp1d4JTafcB1Hjzao3WNJcm1Wdjf3LnYi17mr-_Q7Phb7z6_oJ7I_W4qThRCzoHeJ6JHMhFBU0XTr/pub?output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQd55jh-Nn_tbEszeSeF7drdccNXDyW64QRlWwvM7ZjjYxWlBTxa8P6vLJt2hG4Mgrxy_QRZCXstQpX/pub?gid=1922732720&single=true&output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-a8PI2AZidMoYQPJa_1AyOmYbfppLMkeGjH_jDkzyctgRC844iBPApBN66On2E2pS_DtvhY6pUDVT/pub?output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQlJPByX5bzt28DzOm3am0EIgqxPGOyBd3Xo6_anwTdmS_XwiSJ2KfoM2KbBNKAO94TJj7UQEkA_SwS/pub?output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQZQcxULMah8VLC8DfVu5pNV7FnfhOm-YBlRvs7VIHsdxwKhH3ATkHrypDctIMQbu0BKzCzESJ3zSXH/pub?output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vS5g9NkQABSe8gEvfrh21e9yscusVlxj_UOLPbdp0FU4-1am12qUpIHudOXMFldRx_Q_OagrHRyMD0-/pub?gid=1081961011&single=true&output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSP6A9uiaDANSP57k3-ukvq_69cVDxQJJIJpILlIyznn4171Hv641gCe0Fr1Imgm9MoVKiy7oF0RmJ7/pub?gid=993901126&single=true&output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQzHHJK2uRm-89URV0Y5EdSgyULs-Zfk_AxIo_JF53sO2DSaou05gyFFD6MpdVuV9eRstTV0kv0vp_f/pub?output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQcuNGXPh6lyyEVZuMZDE7nf9hh9fXdo-ScRGu_52gOQVVK7iDy3_dWVDZBKWsfJWi-YfdIQ6BIcK4I/pub?output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQEap7wAjiaQv-m5r800dbaOezhKOhSejoFDH-J00aw2HXlweyYQ7xu9eU7uTpHruNwAojTubpzFFeL/pub?output=csv'),
	  ]);
      setStates(response.data.statewise);
      const ts = parseStateTimeseries(statesDailyResponse);
	  wb = preprocess(prettifyData(Papa.parse(wb.data, {delimiter: ','})));
	  up = preprocess(prettifyData(Papa.parse(up.data, {delimiter: ','})));
	  karnataka = preprocess(prettifyData(Papa.parse(karnataka.data, {delimiter: ','})));
	  del = preprocess(prettifyData(Papa.parse(del.data, {delimiter: ','})));
	  mh = preprocess(prettifyData(Papa.parse(mh.data, {delimiter: ','})));
	  kr = preprocess(prettifyData(Papa.parse(kr.data, {delimiter: ','})));
	  pb = preprocess(prettifyData(Papa.parse(pb.data, {delimiter: ','})));
	  tl = preprocess(prettifyData(Papa.parse(tl.data, {delimiter: ','})));
	  od = preprocess(prettifyData(Papa.parse(od.data, {delimiter: ','})));
	  tn = preprocess(prettifyData(Papa.parse(tn.data, {delimiter: ','})));
	  const finalData = processForChart([wb, up, karnataka, del, mh, kr, pb, tl, od, tn]);
	  var hosValues = getHosValues(finalData);
	  var tfValues = gettfValues(finalData);
	  var nfValues = getnfValues(finalData);
	  var psValues = getpsValues(ts);
	  psValues['TT']=psValues['DL'];
	  setPsseries(psValues);
	  setTfseries(tfValues);
	  setNfseries(nfValues);
	  setHosseries(hosValues);
	  setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setActivityLog(updateLogResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };
	
  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
	setActiveStateName(getStateName(statecode));
  }, []);

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
		  <h3><br />Select a state to compare plots:</h3>
		  <div className="trends-state-name">
                  <select style={{margin:'0px'}}
                    onChange={({target}) => {
                      setActiveStateCode1(target.value);
					  setActiveStateName1(getStateName(target.value));
                    }}
                  >
                    <option value="TT">None</option>
					<option value="WB">West Bengal</option>
					<option value="UP">Uttar Pradesh</option>
					<option value="KA">Karnataka</option>
					<option value="DL">Delhi</option>
					<option value="MH">Maharashtra</option>
					<option value="KL">Kerala</option>
					<option value="PB">Punjab</option>
					<option value="TG">Telangana</option>
					<option value="OR">Odisha</option>
					<option value="TN">Telangana</option>
                  </select>
                </div>
              
		  </React.Fragment>
		  )}
		  <div
            className="updates-header fadeInUp"
            style={{animationDelay: '1.5s'}}
          >
            <h1>Updates</h1>
            <h2>{format(new Date(), 'd MMM')}</h2>
          </div>

          <div className="updates fadeInUp" style={{animationDelay: '1.7s'}}>
            {activityLog
              .slice(-5)
              .reverse()
              .map(function (activity, index) {
                activity.update = activity.update.replace('\n', '<br/>');
                return (
                  <div key={index} className="update">
                    <h5>
                      {formatDistance(
                        new Date(activity.timestamp * 1000),
                        new Date()
                      ) + ' Ago'}
                    </h5>
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: activity.update,
                      }}
                    ></h4>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <div className="header fadeInUp" style={{animationDelay: '1s'}}>
				<div className="header-mid">
				  <div className="titles">
					<h1>Our Findings</h1>
					<h6 style={{fontWeight: 600}}>An initiative by ICG</h6>
				  </div>
				  <div className="last-update">
					<h6>Last Updated</h6>
					<h6 style={{color: '#28a745', fontWeight: 600}}>
					  {isNaN(Date.parse(formatDate1(lastUpdated)))
						? ''
						: formatDistance(
							new Date(formatDate1(lastUpdated)),
							new Date()
						  ) + ' Ago'}
					</h6>
					<h6 style={{color: '#28a745', fontWeight: 600}}>
					  {isNaN(Date.parse(formatDate1(lastUpdated)))
						? ''
						: formatDateAbsolute(lastUpdated)}
					</h6>
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
			  {activeStateCode1 != 'TT' && <ApexChart series={[{name: activeStateName, data: tfseries[activeStateCode]},{name: activeStateName1, data: tfseries[activeStateCode1]}]}/>}
			  {activeStateCode1 == 'TT' && <ApexChart series={[{name: activeStateName, data: tfseries[activeStateCode]}]}/>}
			  <div className="pills">
				<Modal />
			  </div>
			  <p />
			  {activeStateCode1 != 'TT' && <ApexChart1 series={[{name: activeStateName, data: nfseries[activeStateCode]},{name: activeStateName1, data: nfseries[activeStateCode1]}]}/>}
			  {activeStateCode1 == 'TT' && <ApexChart1 series={[{name: activeStateName, data: nfseries[activeStateCode]}]}/>}
			  {activeStateCode1 != 'TT' && <ApexChart2 series={[{name: activeStateName, data: hosseries[activeStateCode]},{name: activeStateName1, data: hosseries[activeStateCode1]}]}/>}
			  {activeStateCode1 == 'TT' && <ApexChart2 series={[{name: activeStateName, data: hosseries[activeStateCode]}]}/>}
			  {activeStateCode1 != 'TT' && <ApexChart4 series={[{name: activeStateName, data: psseries[activeStateCode]},{name: activeStateName1, data: psseries[activeStateCode1]}]}/>}
			  {activeStateCode1 == 'TT' && <ApexChart4 series={[{name: activeStateName, data: psseries[activeStateCode]}]}/>}
			  </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
