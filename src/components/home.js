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
  gettfValues,
  getnfValues,
  getHosValues,
  preprocessHospitalTimeseries,
  processForChart,
  parseStateTimeseries,
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
//import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  //const [timeseries, setTimeseries] = useState({});
  const [tfseries, setTfseries] = useState([]);
  const [nfseries, setNfseries] = useState([]);
  const [hosseries, setHosseries] = useState([]);
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
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
      //const ts = parseStateTimeseries(statesDailyResponse);
      //ts['TT'] = preprocessTimeseries(response.data.cases_time_series); // TT -> India
	  //setTimeseries(ts);
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
	  console.log(hosValues)
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
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
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
		  <div
                className="timeseries-header fadeInUp"
                style={{animationDelay: '2.5s'}}
                ref={refs[2]}
              >
                <h1>Spread Trends</h1>
                <div className="tabs">
                  <div
                    className={`tab ${graphOption === 1 ? 'focused' : ''}`}
                    onClick={() => {
                      setGraphOption(1);
                    }}
                  >
                    <h4>Cumulative</h4>
                  </div>
                  <div
                    className={`tab ${graphOption === 2 ? 'focused' : ''}`}
                    onClick={() => {
                      setGraphOption(2);
                    }}
                  >
                    <h4>Daily</h4>
                  </div>
                </div>

                <div className="scale-modes">
                  <label>Scale Modes</label>
                  <div className="timeseries-mode">
                    <label htmlFor="timeseries-mode">Uniform</label>
                    <input
                      type="checkbox"
                      checked={timeseriesMode}
                      className="switch"
                      aria-label="Checked by default to scale uniformly."
                      onChange={(event) => {
                        setTimeseriesMode(!timeseriesMode);
                      }}
                    />
                  </div>
                  <div
                    className={`timeseries-logmode ${
                      graphOption !== 1 ? 'disabled' : ''
                    }`}
                  >
                    <label htmlFor="timeseries-logmode">Logarithmic</label>
                    <input
                      type="checkbox"
                      checked={graphOption === 1 && timeseriesLogMode}
                      className="switch"
                      disabled={graphOption !== 1}
                      onChange={(event) => {
                        setTimeseriesLogMode(!timeseriesLogMode);
                      }}
                    />
                  </div>
                </div>

                {window.innerWidth <= 769 && (
                  <div className="trends-state-name">
                    <select
                      onChange={({target}) => {
                        onHighlightState(JSON.parse(target.value));
                      }}
                    >
                      {states.map((s) => {
                        return (
                          <option
                            key={s.statecode}
                            value={JSON.stringify(s)}
                            selected={s.statecode === activeStateCode}
                          >
                            {s.state === 'Total' ? 'All States' : s.state}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
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
            <button className="button">
              <Link to="/demographics">
                <Icon.Database />
                <span>Demographic Overview</span>
              </Link>
            </button>
          </div>
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <div className="header fadeInUp" style={{animationDelay: '1s'}}>
				<div className="header-mid">
				  <div className="titles">
					<h1>Hospitalisation Projections</h1>
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
			  <ApexChart data={{name: 'Twitter Trend Score', data: tfseries[activeStateCode]}}/>
			  <ApexChart1 data={{name: 'Cumulative Word Freq. ', data: nfseries[activeStateCode]}}/>
			  <ApexChart2 data={{name: 'Hospitalisation', data: hosseries[activeStateCode]}}/>
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="Home">
        <div className="home-left">
          
        </div>

        <div className="home-right"></div>
      </div>
    </React.Fragment>
  );
}

export default Home;
