import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';

import {
  formatDate1,
  formatDateAbsolute,
  prettifyData,
  preprocess,
  gettfValues,
  getnfValues,
  getpsValues,
  getStateName,
  processForChart,
  eventdata,
  parseStateTimeseries,
  getwa1Values
} from '../utils/common-functions';

import Papa from 'papaparse';

//import Table from './table';
//import Level from './level';
import MapExplorer from './mapexplorer2';
import TimeSeries from './timeseries';
import ApexChart from './apex';
import ApexChart1 from './apex1';
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
        response,
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        updateLogResponse,
        stateTestResponse,
        wb, up, ka, dl, mh, kl, pb, tg, or, tn, rj, gj, mp, ar, as, br, ct, ga, hr, hp, jh, mn, ml, mz, nl, tr, ut, an, jk, la, py, ap
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
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTNsGwpfY6IRkSc0S9zs89UPRAIgQQIYfHr9ZA1oqatUXyvDnFDviNuich0Q9umZreOWcGJqWcEgjqt/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTuPdEUzM5q0sPtNFJR3znhr6_C1vLiir4c9x0ZhHY_E0xF1yyPqVIF2MXoCtrIS1rCo1x6otQDeOmR/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSDnB6BYXlUf_Ds7HdrrFwVnqDKnnxFg15_jyDm_Dl-bS0o6gP82aKLGy-vj7yZW3WQiHS0Ef-OWyCk/pub?gid=0&single=true&output=csv'),
        //new added states
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSy1O3_KfPaHsdm21NqB4VliAMopDyd_dyKgMHHrvJYuy9TPMutAjr2DP0A2AWmvhePyhEupKIEaz7P/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4jkqdKULkWuxKJq28y370xv9CmFJQrrSya6C3VJerBxf7ym75ocnftR5y4UVEx5N-IJUmFLwzGa_Z/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQBUqNt912EQMI5tu18AaXzJFdqb_kfbyxorosJE-qT820B6CF3-W7tTmkfedRTLwF4Chx0Yg9Xl565/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTqrz-BPWB6-qDOWYTwTtDhQBbmAFsVpAe_Xr4aZ3a5P0T0hkARRDnaHF25a4SCl8eNtEgxiu6z5UwN/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQgUbqRSuppeO3GX7ySorbvwxsIq5Xz5benN025ZuWB-5cUX_295s0GwUPDhMH5XJkp7Os--AdOoBmy/pubhtml?gid=0&single=true'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSjTwm4qPq4QLiB6x1LyEqNAxnvOohnRyGSRbNq_ThRiKfa7xlqsmUzZh3CbqSsujuTbMYHDgYs7cP5/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQZV2z023VO-Dy5qsMH_CMrB3VsjjOW0vzhFtQppWrW3FDQJBx7r7_o4mIlzGzl-5RLWktqPvNm-ctf/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQkisSNI7PaOgqRjc5nko5SN4tSK7bCAu29ec9bzV_pjCNZtiW9TS0s4ethcnmmgTy-LhMuzfxt4AQ7/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQE67PzCWymINN6KW3lwh6f9TazOlp2raO-ists2q4I2ZQff2fNPJz9x-hX3DzdGGL9Of66WgQVWG15/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTJvG4vS2dtvjXKEzSFVHnWQFvDApj_BT3HicCo8ILOHW8tutxIPP0Ad32FN6L04MMQOzeyUWz7e_BY/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTeaR4_Uxe00DwqrfqMspz7rVrYGp6vyIceZrfhhCj4sC7mMwMyW-v1xBLBGwV0zAd54x8-4DoArYqP/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTYrqu0WJhHKFPfR3V5JqFhYJ0l4YMondHoc7jOSFlSt7KCYCW0-XzCjdAzF8Zuttn1ATrqSVwEY05i/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRojnEepHTJY-Tphoc5SJwuPTzKdqw8CIVFXfkOR_KTC4NoFyqSC_6whKpwbWDqNDdWqwF5IVjNc8Jv/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTsTNhSMJHlaqrjjzaj-Wvr3UdZLx9kEMp3IzsO0YNVG1t9_eYFyryxHeguc6yfEMjy65UBZVivpDKe/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTE-_ds94oUBtNKbJsO1vOHHJinL8hXvpuh5Cj7O09JMGVAZZamxE27IsTBiZzRgO197R5jD9El4G-7/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vR6hdU48OumqI6C60GZFMTol8RTsSTNH3phNoQeqacPwhSamXzaKW4GdxJ72nCljRnbulg444Hu44YW/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT1VDQws4AuKQ4gLw19BKnBwyNfFC1qzjFWbpjobS8av4oOQitZNl66tHHSxxvhV2dBKjnr6ZVm9SYR/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTgpwjlWkiKGGqK_KCsxBCrUTs8AzUvx67fZRXQowHLKIn1mzXAOt3ZKXSLUcdTAp4nTvVVIle8KWC2/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRKjNMXYXaPY1Vb0ZfTZcGqMyNYcBkelf5sfwc0IR0_Rs7VQ-h6qLEWDCYi7Ad2LyEFiENDkbGW3ZH-/pub?gid=0&single=true&output=csv'),

	  ]);
      setStates(response.data.statewise);
      const ts = parseStateTimeseries(statesDailyResponse);
      var forPreprocessing = {"WB": wb, "UP": up, "KA": ka, "DL": dl, "MH": mh, "KL": kl, "PB": pb, "TG": tg, "OR": or, "TN": tn, "RJ": rj, "GJ": gj, "MP": mp,
                              "AR": ar, "AS": as, "BR": br, "CT": ct, "GA": ga, "HR": hr, "HP": hp, "JH": jh, "MN": mn, "ML": ml, "MZ": mz, "NL": nl, "TR": tr, "UT": ut, "AN": an, "JK": jk, "LA":la, "PY":py, "AP": ap};
      for(var stateSheet in forPreprocessing){
        forPreprocessing[stateSheet] = preprocess(prettifyData(Papa.parse(forPreprocessing[stateSheet].data, {delimiter: ','})))
      }
      const finalData = processForChart(forPreprocessing);
      var tfValues = gettfValues(finalData);
      var nfValues = getnfValues(finalData);
      var psValues = getpsValues(ts);
      var wa1Values = getwa1Values(finalData);
      psValues['TT']=psValues['DL']
      setTfseries(tfValues);
      setPsseries(psValues);
      setNfseries(nfValues);
      setWa1series(wa1Values);
	    setEventseries(eventdata());
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setActivityLog(updateLogResponse.data);
      setFetched(true);
	  //console.log(finalData);
    } catch (err) {
      console.log(err);
    }
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
    //console.log(activeStateCode);
  }, []);
  
  const normalise = (nf, maxp) => {
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
		  {/* <h3><br />Select a state to compare plots:</h3>
		  <div className="trends-state-name">
                  <select style={{margin:'0px'}}
                    onChange={({target}) => {
                      setActiveStateCode1(target.value);
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
                    <option value="TN">Tamil Nadu</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="MP">Madhya Pradesh</option>
                    <option value="GJ">Gujarat</option>
          
                  </select>
                </div> */}
              
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
					<h1>Social Media Analysis</h1>
					<h6 style={{fontWeight: 600}}>An initiative by ICG for WHO's Office for South East Asia</h6>
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
        {tfseries[activeStateCode].length != 0 && <ApexChart series={[{name: getStateName(activeStateCode), type:'area', data: tfseries[activeStateCode]}, 
                                                                      {name: 'First COVID-related Death', type:'scatter', data: [eventseries[0]]}, 
                                                                      {name: 'Announcement of Janta Curfew', type:'scatter', data: [eventseries[1]]}, 
                                                                      {name: 'Junta Curfew Observed', type:'scatter', data: [eventseries[2]]}, 
                                                                      {name: 'Announcement of Diya Jalao', type:'scatter', data: [eventseries[4]]}, 
                                                                      {name: 'Diya Jalao Observed at 9PM', type:'scatter', data: [eventseries[5]]},
                                                                      {name: 'Announcement of Lockdown Extension', type:'scatter', data: [eventseries[6]]}, 
                                                                      {name: 'Lockdown Announced', type:'scatter', data: [eventseries[3]]},
                                                                      {name: getStateName(activeStateCode)+" (Moving Average)", type:'area', data: wa1series[activeStateCode]}]}/>}
			  {tfseries[activeStateCode].length == 0 && <ApexChart series={[{name: getStateName(activeStateCode), data: tfseries[activeStateCode]}]}/>}
			  <div className="pills">
				<Modal />
			  </div>
			  <p />
			  <ApexChart1 series={[{name: 'Twitter Volume/Day', type:'area', data: normalise(nfseries[activeStateCode], psseries[activeStateCode].slice(-1)[0][1])}, {name: 'Positive Cases', type:'area', data: psseries[activeStateCode]}, {name: 'First COVID-related Death', type:'scatter', data: [eventseries[0]]}, {name: 'Announcement of Janta Curfew', type:'scatter', data: [eventseries[1]]}, {name: 'Junta Curfew Observed', type:'scatter', data: [eventseries[2]]}, {name: 'Announcement of Diya Jalao', type:'scatter', data: [eventseries[4]]}, {name: 'Diya Jalao Observed at 9PM', type:'scatter', data: [eventseries[5]]}, {name: 'Announcement of Lockdown Extension', type:'scatter', data: [eventseries[6]]}, {name: 'Lockdown Announced', type:'scatter', data: [eventseries[3]]}]}/>
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
