import moment from 'moment';

const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

const stateCodes = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CT: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UT: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
  AN: 'Andaman and Nicobar Islands',
  CH: 'Chandigarh',
  DN: 'Dadra and Nagar Haveli',
  DD: 'Daman and Diu',
  DL: 'Delhi',
  JK: 'Jammu and Kashmir',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  PY: 'Puducherry',
};

export const getStateName = (code) => {
  return stateCodes[code.toUpperCase()];
};

export const formatDate = (unformattedDate) => {
  const day = unformattedDate.split(/[/-]+/)[2];
  const month = unformattedDate.split(/[/-]+/)[1];
  const year = unformattedDate.split(/[/-]+/)[0];
  return `${year}-${month}-${day}`;
};

export const formatDate1 = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const year = unformattedDate.slice(6, 10);
  const time = unformattedDate.slice(11);
  return `${year}-${month}-${day}T${time}+05:30`;
};

export const formatDateAbsolute = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

const validateCTS = (data = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dataTypes = [
    'dailyconfirmed',
    'dailydeceased',
    'dailyrecovered',
    'totalconfirmed',
    'totaldeceased',
    'totalrecovered',
  ];
  return data
    .filter((d) => dataTypes.every((dt) => d[dt]) && d.date)
    .filter((d) => dataTypes.every((dt) => Number(d[dt]) >= 0))
    .filter((d) => {
      const year = today.getFullYear();
      return new Date(d.date + year) < today;
    });
};

export const preprocessTimeseries = (timeseries) => {
  return validateCTS(timeseries).map((stat) => ({
    date: new Date(stat.date + ' 2020'),
    totalconfirmed: +stat.totalconfirmed,
    totalrecovered: +stat.totalrecovered,
    totaldeceased: +stat.totaldeceased,
    dailyconfirmed: +stat.dailyconfirmed,
    dailyrecovered: +stat.dailyrecovered,
    dailydeceased: +stat.dailydeceased,
  }));
};

/**
 * Returns the last `days` entries
 * @param {Array<Object>} timeseries
 * @param {number} days
 *
 * @return {Array<Object>}
 */
export function sliceTimeseriesFromEnd(timeseries, days) {
  return timeseries.slice(-days);
}

export const formatNumber = (value) => {
  const numberFormatter = new Intl.NumberFormat('en-IN');
  return isNaN(value) ? '-' : numberFormatter.format(value);
};

export const parseStateTimeseries = ({states_daily: data}) => {
  const statewiseSeries = Object.keys(stateCodes).reduce((a, c) => {
    a[c] = [];
    return a;
  }, {});

  const today = moment();
  for (let i = 0; i < data.length; i += 3) {
    const date = moment(data[i].date, 'DD-MMM-YY');
    // Skip data from the current day
    if (date.isBefore(today, 'Date')) {
      Object.entries(statewiseSeries).forEach(([k, v]) => {
        const stateCode = k.toLowerCase();
        const prev = v[v.length - 1] || {};
        v.push({
          date: date.toDate(),
          dailyconfirmed: +data[i][stateCode] || 0,
          dailyrecovered: +data[i + 1][stateCode] || 0,
          dailydeceased: +data[i + 2][stateCode] || 0,
          totalconfirmed: +data[i][stateCode] + prev.totalconfirmed || 0,
          totalrecovered: +data[i + 1][stateCode] + prev.totalrecovered || 0,
          totaldeceased: +data[i + 2][stateCode] + prev.totaldeceased || 0,
        });
      });
    }
  }

  return statewiseSeries;
};


export const validateHTS = (data = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dataTypes = [
    'positive',
    'hospitalised',
    'hospitalisedGovt',
    'hospitalisedPvt',
  ];
  return data
    .filter((d) => dataTypes.every((dt) => d[dt]) && d.date)
    .filter((d) => dataTypes.every((dt) => Number(d[dt]) >= 0))
    .filter((d) => {
      const year = today.getFullYear();
      return new Date(d.date + year) < today;
    });
};


export const prettifyHospitalisationData = (data) => {
  const parsedData = data.data
  const header = parsedData.shift();
  var newJSON = [];
  for(var i=0; i<parsedData.length; i++) {
    var rowData = parsedData[i];
    newJSON[parsedData.length-i-1] = {
      "date": formatDate(rowData[0]),
      "positive": rowData[1],
	  "positiveBest": rowData[3],
	  "positiveRealistic": rowData[4],
	  "positiveWorst": rowData[5],
      "hospitalisedUpper" : rowData[9],
	  "icuUpper" : rowData[10],
	  "ventilatorLower" : rowData[11],
	  "hospitalisedLower" : rowData[12],
      "icuLower" : rowData[13],
      "ventilatorLower" : rowData[14],
	  "admitHospital": rowData[15],
	  "admitHospitalLower": rowData[16],
	  "admitHospitalUpper": rowData[17],
    }
  }
  newJSON = newJSON.reverse();
  //console.log(newJSON)
  return newJSON
};

export const prettifyData = (data) => {
  const parsedData = data.data
  const header = parsedData.shift();
  var newJSON = [];
  for(var i=0; i<parsedData.length; i++) {
    var rowData = parsedData[i];
    newJSON[parsedData.length-i-1] = {
      "date": formatDate(rowData[0]),
      "hospitalCount": rowData[3],
	  "tfScores": rowData[1],
	  "normalisedFreq": rowData[2],
    }
  }
  newJSON = newJSON.reverse();
  //console.log(newJSON)
  return newJSON
};

export const preprocessHospitalTimeseries = (timeseries) => {
  //console.log("Preprocessing Timeseries")
  //console.log(timeseries)
  return timeseries.map((stat) => ({
    date: new Date(stat.date),
    positive: +stat.positive,
	positiveBest: +stat.positiveBest,
	positiveRealistic: +stat.positiveRealistic,
	positiveWorst: +stat.positiveWorst,
    hospitalisedUpper: +stat.hospitalisedUpper,
	icuUpper: +stat.icuUpper,
	ventilatorLower: +stat.ventilatorLower,
	hospitalisedLower: +stat.hospitalisedLower,
    icuLower: +stat.icuLower,
    ventilatorUpper: +stat.ventilatorUpper,
	admitHospital: +stat.admitHospital,
	admitHospitalLower: +stat.admitHospitalLower,
	admitHospitalUpper: +stat.admitHospitalUpper,
  }));
};

export const preprocess = (timeseries) => {
  //console.log("Preprocessing Timeseries")
  return timeseries.map((stat) => ({
    date: new Date(stat.date),
    hospitalCount: +stat.hospitalCount,
	tfScores: +stat.tfScores,
	normalisedFreq: +stat.normalisedFreq,
  }));
};

export const processForChart = (hospitalisationData) => {
  var final = {};
  var i = 0;
  for(var key in stateCodes){
    final[key]=hospitalisationData[i];
	i++;
	if(i == 5){
		break;
	}
  };
  final['TT'] = hospitalisationData[3];
  return final;
};

export const getHosValues = (x) => {
  var final = {};
  for(var key in x){
	var arr = [];
	for(var i = 0; i < x[key].length; i++){
		arr.push([x[key][i]['date'], x[key][i]['hospitalCount']]);
	}
    final[key]=arr;
  };
  return final;
};

