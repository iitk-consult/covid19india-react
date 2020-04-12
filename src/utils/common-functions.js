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
  DB: 'Dadra and Nagar Haveli',
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
  const day = unformattedDate.split(/[/-]+/)[0];
  const month = unformattedDate.split(/[/-]+/)[1];
  const year = unformattedDate.split(/[/-]+/)[2];
  return `${year}-${day}-${month}`;
};

export const formatDateAbsolute = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

export const validateCTS = (data = []) => {
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
  console.log(newJSON)
  return newJSON
};

export const preprocessTimeseries = (timeseries) => {
  return timeseries.map((stat) => ({
    date: new Date(stat.date + ' 2020'),
    totalconfirmed: +stat.totalconfirmed,
    totalrecovered: +stat.totalrecovered,
    totaldeceased: +stat.totaldeceased,
    dailyconfirmed: +stat.dailyconfirmed,
    dailyrecovered: +stat.dailyrecovered,
    dailydeceased: +stat.dailydeceased,
  }));
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
    ventilatorLower: +stat.ventilatorLower,
	admitHospital: +stat.admitHospital,
	admitHospitalLower: +stat.admitHospitalLower,
	admitHospitalUpper: +stat.admitHospitalUpper,
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
  return timeseries.slice(timeseries.length - days);
}
