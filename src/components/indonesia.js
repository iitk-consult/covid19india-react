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
  getpsValues1,
  getStateName1,
  processForChart,
  indoEventData,
  preprocessIndonesiaData,
  getwa1ValuesIndonesia
} from '../utils/common-functions';

import Papa from 'papaparse';
import stateData from './sample_data.json';
import Table from './table';
//import Level from './level';
import MapExplorer from './mapexplorer1';
import TimeSeries from './timeseries';
import ApexChart from './apex5';
import ApexChart1 from './apex6';
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
		regionwise,
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        updateLogResponse,
        stateTestResponse,
        aceh, bali, bbislands, banten, bengkulu, centralJava, centralKalimantan, centralSulawesi, eastJava, eastKalimantan, eastNusaTenggara, gorontalo, jakarta, jambi, lampung, maluku, northKalimantan, norhtMaluku, northSulawesi, northSumatra, papua, riau, riauIslands, southKalimantan, southSulawesi, southSumatra, southEastSulwesi, westJava, westKalimantan, westNusaTenggara, westPapua, westSulawesi, westSumatra, yogyakarta,
		posData
      ] = await Promise.all([
        axios.get('https://api.covid19api.com/dayone/country/indonesia'),
		    axios.get('https://cors-anywhere.herokuapp.com/https://data.covid19.go.id/public/api/prov.json?_=1589190273771'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/updatelog/log.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
		//sheets
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSAerP3eEPO4yVB0CXkzavAiHaXv2NhBDoMEBJUplu3tbuWZ3S4f729-llr4d9z7k3_duI3mA89F5Y7/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSnPAZbtXSwg9Fs8EROAXgIJAGhiH1VP5_eQ7vVf0BBtPQ10Bb0aENgyOqVMLy1JV4SwPEyNBKWooPy/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQqD4gBDoRynua68buVyOHkWQrcN16ryHEer3YpnOP9UF9smtvBDtl_1aF-y4n692RU4mmgU6y09Im0/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRunYa3bz50G6Q2YNosirKviRBOhyjEf4Qrpu7xkf_r-n81h9vb54PAQqWCvNYFCH3gs-9s_gvF2kLP/pub?gid=0&single=true&output=csv'),
		axios.get('https://docs.google.com/spreadsheets/d/1PcxPqbSfZ1uuwMKxdf0WFdK3b7N7N8A8m2-ou8XhcMY/export?format=csv&id=1PcxPqbSfZ1uuwMKxdf0WFdK3b7N7N8A8m2-ou8XhcMY&gid=0'),
		axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Mwf1WT2W8tMHhXj_etiu-MVNtofjO1hqUql-8HOJEAiaevLxT6wL2S5VXzzj6W8rE5_FKFCG3RhA/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5rBFZux9LO6-EXjxf7UiO3P8t-zPLqd5vu9Hc6_Ri3OYlEJuX8-VH3314gc0VR6w3JavSi967vBM5/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT_UY3ia0qCndK-c5jODBCVPjpSgag40SLJC_m6p6xH5zGtOlD4cbcGLEIHaMYlrPf6zBUaT6-Puno9/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSHol1YnGROXvgMo66GzuciKJawYDH-8HNi_cGI0mLzajqGOYmu2HK08i3xaRFjd51Bqsl6hYIYvJub/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcbb1jZvT4ZqFTXkuJbLavcikMWL2b23wiBzOqLCJPXMb5feOxbAGD9EHZZ_PiwSi4O3Z12iovnHgt/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRWL-W1C0-q7lJcwjK1W4j6CPaFw1kTpvHr1XhOMP-zzIUA5Q1RrGlNbFzeyPp2vIx7aozwlLymBHEN/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSAv69WjOby9lciBr27ysenDZEurEHG6R9ugrqmk3ZKfau4KFAz7qh0xVPIlYTdczJr4LjOh5Q0mCzP/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSfqz_npmh_X_C3yN_8tXgZOXrLRw_L8E6BruRAho4U7MsHuQRdDymSC-eBEHpd2GbSHpW6td9lT-YT/pub?gid=0&single=true&output=csv'),        
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQp0RQwiErsd4f0Z8TkFXwcHmQnk6viC1tke15_TGMpBJxZ9DQLdm6dk2ZvH2vrmFNZ9yNhcrmac7ZO/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTXykCQlFmPpMTmR1PN2bvq2H3TWzoyrL23RQvwnJgHaxWhPJao4Jr2Lnr1xJy8a0GGGFkydcOR2lIN/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSedqnguV9GGlvEw0nkbXdLHfES8dL6bjykUQi2xIW1ZGYmsaYFQpa46y5T5h53A6QJw1W0_WQ09SVd/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQUqICXrpbatn24X23gUmiQj67vHjyUYfl7HW8Co_ZQRg3_aQzeQyYRimuE4Ryy0dIB3bhckHhOEhWc/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSXXzGW2Ph5Wwdx6YsBVP7XgaQkKuD7CJlVeLLkCmn_roU20HCo_1LRukoP06t20FQK2jib3Ax_gBkt/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTiOvsvQAk_oVRDDg08w1nj6eIy-DVdQwoinQrR6aDRyytdGQU7FMkOMUc657WhrcFclWZCqzSuu9bk/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRI2sCiL9nHWpwbpqNqGURJmnB2oovBFIckT12N6Q0fhMZMiXdSm-ZGwvIGQAByNpMxCZJOh48WXu-o/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQQV4hFxCWB_IghgrnsVmcspDadN6k5UJCznO6kSDxCx_qqXtMb2Su2jaWr5a8OJ6n0xqKqyZfyTq1A/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQNO4yJmJ6NT7hEflZPgIn4I1cn1rBuchreIEZQR3KepECjU7IRmdkl5h0LX8fS41pXf5dSmKM30ruv/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSa70f3N4kV0W5rSeP_jxrELcLKdEC7kpnC_E4JFvXCowytlNEMC7oWlhOHtjOZ68mgq09q06FCxPxW/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRFavgFxYLkvnplKxL7HSl71b_WT6XAe9OpsbkMcrpkRu_AWfGtAQZp7mqrLXD-Gm-1aL7_vcB1zXa8/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQSaOJqj7C-QBvkQoHznRhT55fOsL-uJwy8_0ZKGEJz5lxcJRWDBbAzrHnLbqqk44EZiNdBbG2Iwwgq/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQP6QKe_rxQAPXHbWN4DhvVlt2AtGsRo260WEYuZ_LfQL_xNsQMfsijQc1hlr7bkw6aBuigCN5IS41P/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSy99WjM-GaNl7zzm70iGZJBc7jS8MD9Ybn-KEzMimVHobhaoliwHJAvt3Bvh9tO_rr8xXgv6_xR1br/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSXTUEhU_-zFKuD2qGtfumSIC4f9-rSskTQAdueLffKKxkywE6IW3SKedtU5m3t--8GcrwBW-BT8XdK/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQhsmdEIpoiN9zBuBUIfrkjvEyngEHY8HnGgiEJTTteb_xzNRdaVjEQdwoy2p8TawpM5aRrGpiULuyw/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTG6PGzhjsUvW8tsKLrUYDinoiO0yVX2y-EHlWch1a4r8irmEcxrFM6x5TEFBksqEn8TPEidwRTWghd/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQAtp1i6RyrFpvJAjTSIc7441B_mGTsgtZ8pYxyhQYtNSwe8sMODXdpdD34rwI-ipPt9tYbhYcwOJxH/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vS2DC8vGtl7HzNbshOFH-sGsAceKkZhhZ5x19wyYaxQTp6Tzm7gY4FpTKDAG7yZ0AY5niLMAZUTRX3G/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRMAWGXJJJveJgxMT7ztFKJIbhlu_AyZ3sf1W02MPPpqv7VFOFADpacO2CTNQi9M_Ex_ZN9cp_9EihI/pub?gid=0&single=true&output=csv'),
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQXEQnY99nd_wEvfkDiW1s5vSsEp1O6szh4QgP0n8Z6kNfCXz9yaEQUSxWruemvxl0CcljVi50TT8Tm/pub?gid=0&single=true&output=csv'),
		
		axios.get('https://docs.google.com/spreadsheets/d/15R0qe47lk-8hsBJrXa669WcPveIzLLBN8rG8h3ysKIU/export?format=csv&id=15R0qe47lk-8hsBJrXa669WcPveIzLLBN8rG8h3ysKIU&gid=0')
	]);
	    var stateData = getoveralldata(overall.data.slice(-1)[0]);
      stateData = pushregionwise(stateData, regionwise.data);
      states=(stateData);
	  //console.log(states)
      var forPreprocessing = {"AC": aceh, "BA": bali, "BB": bbislands, "BT": banten, "BE": bengkulu, "JT": centralJava, "KT": centralKalimantan, "ST": centralSulawesi, "JI": eastJava, "KI": eastKalimantan, "NT": eastNusaTenggara, "GO": gorontalo, "JK": jakarta, "JA": jambi, "LA": lampung, "MA": maluku, "KU": northKalimantan, "MU": norhtMaluku, "SA": northSulawesi, "PA": papua, "RI": riau, "KR": riauIslands, "SG": southEastSulwesi, "KS": southKalimantan, "SN": southSulawesi, "SS": southSumatra, "JB": westJava, "LB": westKalimantan, "NB": westNusaTenggara, "PB": westPapua, "SR": westSulawesi, "SB": westSumatra, "YO": yogyakarta};
      for(var stateSheet in forPreprocessing){
        //console.log(stateSheet);
        //console.log(forPreprocessing[stateSheet].data);
        forPreprocessing[stateSheet] = preprocess(prettifyData(Papa.parse(forPreprocessing[stateSheet].data, {delimiter: ','})))
      }
	  const posdata = prettifyData1(Papa.parse(posData.data, {delimiter: ','}));
	  //console.log(posdata)
      const finalData = processForChart(forPreprocessing, "Indonesia");
	  //console.log(finalData)
      var tfValues = gettfValues(finalData);
      var nfValues = getnfValues(finalData);
      var psValues = getpsValues1(posdata);
      var wa1Values = getwa1ValuesIndonesia(finalData);
	  psValues['TT']=psValues['JK'];
	  tfValues['TT']=tfValues['JK'];
	  nfValues['TT']=nfValues['JK'];
	  wa1Values['TT']=wa1Values['JK'];
	  //console.log(nfValues)
      setTfseries(tfValues);
      setPsseries(psValues);
      setNfseries(nfValues);
      setWa1series(wa1Values);
	  setEventseries(indoEventData());
      setLastUpdated(states[1].lastupdatedtime);
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
		   <Table
            states={states}
            summary={false}
            stateDistrictWiseData={stateDistrictWiseData}
            onHighlightState={onHighlightState}
            onHighlightDistrict={onHighlightDistrict}
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
				  <div className="last-update">
					<h6>Last Updated</h6>
					<h6 style={{color: '#28a745', fontWeight: 600}}>
					  {isNaN(Date.parse(formatDate2(lastUpdated)))
						? ''
						: formatDistance(
							new Date(formatDate2(lastUpdated)),
							new Date()
						  ) + ' Ago'}
					</h6>
					<h6 style={{color: '#28a745', fontWeight: 600}}>
					  {isNaN(Date.parse(formatDate2(lastUpdated)))
						? ''
						: (lastUpdated)}
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
        {tfseries[activeStateCode].length != 0 && <ApexChart series={[{name: getStateName1(activeStateCode), type:'area', data: tfseries[activeStateCode]},
                                                                      {name: getStateName1(activeStateCode)+" (Moving Average)", type:'area', data: wa1series[activeStateCode]},
																	  {name: 'First two cases on national television', type:'scatter', data: [eventseries[0]]}, 
                                                                      {name: 'First death confirmed', type:'scatter', data: [eventseries[1]]}, 
                                                                      {name: 'Companies mandated to provide protection equipment to employees', type:'scatter', data: [eventseries[2]]}, 
                                                                      {name: 'Announcement of state of emergency', type:'scatter', data: [eventseries[3]]}, 
                                                                      {name: 'Inauguration of first COVID-19 makeshift hospital', type:'scatter', data: [eventseries[4]]},
                                                                      {name: 'Declaration of police enforcement of large-scale social distancing', type:'scatter', data: [eventseries[5]]},
																	  {name: 'First publication of number of COVID-19 suspects', type:'scatter', data: [eventseries[6]]}, 
                                                                      {name: 'Announcement to ban Id Ul Fitr Mudik to prevent virus spread', type:'scatter', data: [eventseries[7]]},
                                                                      {name: 'Large scale social restrictions extended by one month in Jakarta', type:'scatter', data: [eventseries[8]]}]}/>}
			  {tfseries[activeStateCode].length == 0 && <ApexChart series={[{name: getStateName1(activeStateCode), data: tfseries[activeStateCode]}]}/>}
			  <div className="pills">
				<Modal />
			  </div>
			  <p />
			  <ApexChart1 series={[{name: 'Twitter Volume/Day', type:'area', data: normalise(nfseries[activeStateCode], psseries[activeStateCode].slice(-1)[0][1])},
								   {name: 'Positive Cases', type:'area', data: psseries[activeStateCode]},
								   {name: 'First two cases on national television', type:'scatter', data: [eventseries[0]]}, 
                                   {name: 'First death confirmed', type:'scatter', data: [eventseries[1]]}, 
                                   {name: 'Companies mandated to provide protection equipment to employees', type:'scatter', data: [eventseries[2]]}, 
                                   {name: 'Announcement of state of emergency', type:'scatter', data: [eventseries[3]]}, 
                                   {name: 'Inauguration of first COVID-19 makeshift hospital', type:'scatter', data: [eventseries[4]]},
                                   {name: 'Declaration of police enforcement of large-scale social distancing', type:'scatter', data: [eventseries[5]]},
								   {name: 'First publication of number of COVID-19 suspects', type:'scatter', data: [eventseries[6]]}, 
                                   {name: 'Announcement to ban Id Ul Fitr Mudik to prevent virus spread', type:'scatter', data: [eventseries[7]]},
                                   {name: 'Large scale social restrictions extended by one month in Jakarta', type:'scatter', data: [eventseries[8]]}]}/>
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
