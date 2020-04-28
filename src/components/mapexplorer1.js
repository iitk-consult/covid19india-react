import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ChoroplethMap from './choropleth_indonesia';
import {MAP_TYPES, INDONESIA_MAPS_DIR} from '../constants';
import {formatDate, formatDate1, formatDateAbsolute} from '../utils/common-functions';
import {formatDistance, format, parse} from 'date-fns';
import {formatNumber} from '../utils/common-functions';
import * as Icon from 'react-feather';

const mapMeta = {
  Indonesia: {
    name: '',
    geoDataFile: `${INDONESIA_MAPS_DIR}/indonesia-simplified-topo.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'provinces',
  },
  'Aceh': {
    name: 'Aceh',
    geoDataFile: `${INDONESIA_MAPS_DIR}/aceh-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'aceh',
  },
  'Bali': {
    name: 'Bali',
    geoDataFile: `${INDONESIA_MAPS_DIR}/bali-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'bali',
  },
  'Banten': {
    name: 'Banten',
    geoDataFile: `${INDONESIA_MAPS_DIR}/banten-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'banten',
  },
  'Bengkulu': {
    name: 'Bengkulu',
    geoDataFile: `${INDONESIA_MAPS_DIR}/bengkulu-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'bengkulu',
  },
  'Gorontalo': {
    name: 'Gorontalo',
    geoDataFile: `${INDONESIA_MAPS_DIR}/gorontalo-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'gorontalo',
  },
  'Jakarta': {
    name: 'Jakarta',
    geoDataFile: `${INDONESIA_MAPS_DIR}/jakarta-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jakarta',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/jambi-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jambi',
  },
  'Barat': {
    name: 'Barat',
    geoDataFile: `${INDONESIA_MAPS_DIR}/jawa-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jawa-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/jawa-tengah-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jawa-tengah',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/jawa-timur-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jawa-timur',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kalimantan-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kalimantan-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kalimantan-selantan-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kalimantan-selantan',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kalimantan-timur-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kalimantan-timur',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kalimantan-utara-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kalimantan-utara',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kepulauan-bangka-belitung-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kepulauan-bangka-belitung',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kepulauan-riau-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kepulauan-riau',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/kepulauan-seribu-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kepulauan-seribu',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/lampung-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'lampung',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/maluku-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'maluku',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/nusa-tenggara-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'nusa-tenggara-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/nusa-tenggara-timur-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'nusa-tenggara-timur',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/papua-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'papua-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/papua-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'papua',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sulawesi-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sulawesi-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sulawesi-selatan-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sulawesi-selatan',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sulawesi-tengah-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sulawesi-tengah',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sulawesi-tenggara-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sulawesi-tenggara',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sulawesi-utara-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sulawesi-utara',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sumatera-barat-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sumatera-barat',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sumatera-selatan-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sumatera-selatan',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/sumatera-utara-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sumatera-utara',
  },
  'Jambi': {
    name: 'Jambi',
    geoDataFile: `${INDONESIA_MAPS_DIR}/yogyakarta-simplified-topo.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'yogyakarta',
  },

};

const getRegionFromState = (state) => {
  if (!state) return;
  const region = {...state};
  if (!region.name) region.name = region.state;
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = {...districtData};
  if (!region.name) region.name = name;
  return region;
};

function MapExplorer({
  forwardRef,
  states,
  stateDistrictWiseData,
  stateTestData,
  regionHighlighted,
  onMapHighlightChange,
}) {
  console.log("STATES");
  console.log(states);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [panelRegion, setPanelRegion] = useState(getRegionFromState(states[0]));
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState(
    getRegionFromState(states[0])
  );
  const [testObj, setTestObj] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta.Indonesia);

  const [statistic, currentMapData] = useMemo(() => {
    const statistic = {total: 0, maxConfirmed: 0};
    let currentMapData = {};

    if (currentMap.mapType === MAP_TYPES.COUNTRY) {
      currentMapData = states.reduce((acc, state) => {
        if (state.state === 'Total') {
          return acc;
        }
        const confirmed = parseInt(state.confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }

        acc[state.state] = state.confirmed;
        return acc;
      }, {});
    } else if (currentMap.mapType === MAP_TYPES.STATE) {
      const districtWiseData = (
        stateDistrictWiseData[currentMap.name] || {districtData: {}}
      ).districtData;
      currentMapData = Object.keys(districtWiseData).reduce((acc, district) => {
        const confirmed = parseInt(districtWiseData[district].confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }
        acc[district] = districtWiseData[district].confirmed;
        return acc;
      }, {});
    }
    return [statistic, currentMapData];
  }, [currentMap, states, stateDistrictWiseData]);

  const setHoveredRegion = useCallback(
    (name, currentMap) => {
      if (currentMap.mapType === MAP_TYPES.COUNTRY) {
        const region = getRegionFromState(
          states.find((state) => name === state.state)
        );
        console.log("HOVER");
        console.log(region);
          setCurrentHoveredRegion(region);
        setPanelRegion(region);
        onMapHighlightChange(region);
      } else if (currentMap.mapType === MAP_TYPES.STATE) {
        const state = stateDistrictWiseData[currentMap.name] || {
          districtData: {},
        };
        let districtData = state.districtData[name];
        if (!districtData) {
          districtData = {
            confirmed: 0,
            active: 0,
            deaths: 0,
            recovered: 0,
          };
        }
        setCurrentHoveredRegion(getRegionFromDistrict(districtData, name));
        const panelRegion = getRegionFromState(
          states.find((state) => currentMap.name === state.state)
        );
        setPanelRegion(panelRegion);
      }
    },
    [states, stateDistrictWiseData, onMapHighlightChange]
  );

  useEffect(() => {
    if (regionHighlighted === undefined) {
      return;
    } else if (regionHighlighted === null) {
      setSelectedRegion(null);
      return;
    }
    const isState = !('district' in regionHighlighted);
    if (isState) {
      const newMap = mapMeta['India'];
      setCurrentMap(newMap);
      const region = getRegionFromState(regionHighlighted.state);
      setHoveredRegion(region.name, newMap);
      setSelectedRegion(region.name);
    } else {
      const newMap = mapMeta[regionHighlighted.state.state];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setHoveredRegion(regionHighlighted.district, newMap);
      setSelectedRegion(regionHighlighted.district);
    }
  }, [regionHighlighted, currentMap.mapType, setHoveredRegion]);

  const switchMapToState = useCallback(
    (name) => {
      const newMap = mapMeta[name];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setSelectedRegion(null);
      if (newMap.mapType === MAP_TYPES.COUNTRY) {
        setHoveredRegion(states[0].state, newMap);
      } else if (newMap.mapType === MAP_TYPES.STATE) {
        const {districtData} = stateDistrictWiseData[name] || {};
        const topDistrict = Object.keys(districtData)
          .filter((name) => name !== 'Unknown')
          .sort((a, b) => {
            return districtData[b].confirmed - districtData[a].confirmed;
          })[0];
        setHoveredRegion(topDistrict, newMap);
      }
    },
    [setHoveredRegion, stateDistrictWiseData, states]
  );
  
  const {name, lastupdatedtime} = currentHoveredRegion;

  useEffect(() => {
    setTestObj(
      stateTestData.find(
        (obj) => obj.state === panelRegion.name && obj.totaltested !== ''
      )
    );
  }, [panelRegion, stateTestData, testObj]);

  return (
    <div
      className="MapExplorer fadeInUp"
      style={{animationDelay: '1.5s'}}
      ref={forwardRef}
    >
      <div className="header">
        <h1>Indonesia</h1>
        <h6>
          {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
          {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state/ut' : 'district'}{' '}
          for more details
        </h6>
      </div>

      <div className="map-stats">
        <div className="stats fadeInUp" style={{animationDelay: '2s'}}>
          <h5>{window.innerWidth <= 769 ? 'Cnfmd' : 'Confirmed'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.confirmed)}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="stats is-blue fadeInUp"
          style={{animationDelay: '2.1s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Actv' : 'Active'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.active)}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="stats is-green fadeInUp"
          style={{animationDelay: '2.2s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Rcvrd' : 'Recovered'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.recovered)}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="stats is-gray fadeInUp"
          style={{animationDelay: '2.3s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Dcsd' : 'Deceased'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.deaths)}</h1>
            <h6>{}</h6>
          </div>
        </div>

        {
          <div
            className="stats is-purple tested fadeInUp"
            style={{animationDelay: '2.4s'}}
          >
            <h5>{window.innerWidth <= 769 ? 'Tested' : 'Tested'}</h5>
            <div className="stats-bottom">
              <h1>NA</h1>
            </div>
            <h6 className="timestamp">
              {!isNaN(new Date(testObj?.updatedon))
                ? `As of ${format(
                    parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()),
                    'dd MMM'
                  )}`
                : ''}
            </h6>
            {testObj?.totaltested?.length > 1 && (
              <a href={testObj.source} target="_noblank">
                <Icon.Link />
              </a>
            )}
          </div>
        }
      </div>

      <div className="meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2>{name}</h2>
        {lastupdatedtime && (
          <div
            className={`last-update ${
              currentMap.mapType === MAP_TYPES.STATE
                ? 'district-last-update'
                : 'state-last-update'
            }`}
          >
            <h6>Last Updated</h6>
            <h3
              title={
                isNaN(Date.parse(formatDate1(lastupdatedtime)))
                  ? ''
                  : formatDateAbsolute(lastupdatedtime)
              }
            >
              {isNaN(Date.parse(formatDate1(lastupdatedtime)))
                ? ''
                : formatDistance(
                    new Date(formatDate1(lastupdatedtime)),
                    new Date()
                  ) + ' Ago'}
            </h3>
          </div>
        )}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <h4 className="district-confirmed">
            Confirmed cases:{' '}
            {currentMapData[currentHoveredRegion.name]
              ? currentMapData[currentHoveredRegion.name]
              : 0}
          </h4>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE &&
        currentMapData.Unknown > 0 ? (
          <h4 className="unknown">
            Districts unknown for {currentMapData.Unknown} people
          </h4>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => switchMapToState('India')}
          >
            Back
          </div>
        ) : null}
      </div>

      <ChoroplethMap
        statistic={statistic}
        mapMeta={currentMap}
        mapData={currentMapData}
        setHoveredRegion={setHoveredRegion}
        changeMap={switchMapToState}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
    </div>
  );
}

export default MapExplorer;
