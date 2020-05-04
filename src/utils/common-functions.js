import moment, { invalid } from 'moment';

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

const ordered = [
	'JK',
	'JB',
	'JI',
	'JT',
	'SN',
	'BT',
	'NB',
	'BA',
	'PA',
	'KS',
	'SB',
	'SS',
	'KT',
	'KI',
	'SU',
	'YO',
	'KU',
	'KR',
	'KB',
	'SG',
	'LA',
	'SA',
	'ST',
	'RI',
	'PB',
	'SR',
	'JA',
	'MU',
	'MA',
	'GO',
	'BB',
	'AC',
	'BE',
	'NT'
];
const IndonesiaStateCodes = {
	AC: 'Aceh', //aceh
	BA: 'Bali', //bali
	BB: 'Kepulauan Bangka Belitung', //bangka_belitung_islands
	BT: 'Banten', //banten
	BE: 'Bengkulu', //bengkulu
	JT: 'Jawa Tengah', //central java
	KT: 'Kalimantan Tengah', //central kalimantan
	ST: 'Sulawesi Tengah', //central sulawesi
	JI: 'Jawa Timur', //east java
	KI: 'Kalimantan Timur', //east kalimantan
	NT: 'Nusa Tenggara Timur', //east nusa tenggara
	GO: 'Gorontalo', //gorontalo
	JK: 'Jakarta', //special region of jakarta
	JA: 'Jambi', //jambi
	LA: 'Lampung', //lampung
	MA: 'Maluku', //maluku
	KU: 'Kalimantan Utara', //noth kalimantan
	MU: 'Maluku Utara', //north maluku
	SA: 'Sulawesi Utara',  //north sulawesi
	SU: 'Sumatera Utara', //north sumatra
	PA: 'Papua', //papua
	RI: 'Riau', //riau
	KR: 'Kepulauan Riau', //riau islands
	SG: 'Sulawesi Tenggara', //southeast sulawesi
	KS: 'Kalimantan Selatan', //south kalimantan
	SN: 'Sulawesi Selatan', //south sulawesi
	SS: 'Sumatera Selatan',  //south sumatra
	JB: 'Jawa Barat', //west java
	KB: 'Kalimantan Barat', //west kalimantan 
	NB: 'Nusa Tenggara Barat', //west nusa tenggara
	PB: 'Papua Barat', //west papua
	SR: 'Sulawesi Barat', //west sulawesi
	SB: 'Sumatera Barat', //west sumatra
	YO: 'Yogyakarta', //speacial region of yogyakarta
	TT: 'Indonesia' //whole country
};

const stateCodes = {
	WB: 'West Bengal',
	UP: 'Uttar Pradesh',
	KA: 'Karnataka',
	DL: 'Delhi',
	MH: 'Maharashtra',
	KL: 'Kerala',
	PB: 'Punjab',
	TG: 'Telangana',
	OR: 'Odisha',
	TN: 'Tamil Nadu',
	AP: 'Andhra Pradesh',
	RJ: 'Rajasthan',
	GJ: 'Gujarat',
	MP: 'Madhya Pradesh',
	AR: 'Arunachal Pradesh',
	AS: 'Assam',
	BR: 'Bihar',
	CT: 'Chhattisgarh',
	GA: 'Goa',
	HR: 'Haryana',
	HP: 'Himachal Pradesh',
	JH: 'Jharkhand', 
	MN: 'Manipur',
	ML: 'Meghalaya',
	MZ: 'Mizoram',
	NL: 'Nagaland',
	SK: 'Sikkim',
	TT: 'Delhi',
	TR: 'Tripura',
	UT: 'Uttarakhand',  
	AN: 'Andaman and Nicobar Islands',
	CH: 'Chandigarh',
	DN: 'Dadra and Nagar Haveli',
	DD: 'Daman and Diu',
	JK: 'Jammu and Kashmir',
	LA: 'Ladakh',
	LD: 'Lakshadweep',
	PY: 'Puducherry',
};


export const getStateName = (code) => {
  return stateCodes[code.toUpperCase()];
};

export const getStateName1 = (code) => {
  return IndonesiaStateCodes[code.toUpperCase()];
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

export const formatDate2 = (unformattedDate) => {
  const day = unformattedDate.slice(8, 10);
  const month = unformattedDate.slice(5, 7);
  const year = unformattedDate.slice(0, 4);
  const time = unformattedDate.slice(11,19);
  return `${year}-${month}-${day}T${time}`;
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

export const prettifyData = (data) => {
  const parsedData = data.data
  const header = parsedData.shift();
  var newJSON = [];
  for(var i=0, countValidDates=0; i<parsedData.length; i++) {
    var rowData = parsedData[i];
    var date_parsed = formatDate(rowData[0]);
    // console.log(rowData[0]);
    if(rowData[0])
    {
      newJSON[countValidDates] = {
        "date":date_parsed,
        "colB": rowData[1],
        "colC": rowData[2],
      }
      countValidDates++;
    }
  }
  if (countValidDates>5)
    return newJSON
  else
    return []
};


export const preprocessIndonesiaData = (data) => {
  const parsedData = data.data
  console.log(parsedData);
  var newJSON = [];
  for (var i = 0; i<36; i++)
  {
    var state=[];
    for (var j = 0; j<parsedData.length; j++)
    {
        state.push({
          "date": formatDate(parsedData[j][0]),
          "totalconfirmed": parsedData[j][1]
        })
    }
    newJSON[parsedData[0][i]]=state;
  }
  //console.log(newJSON);
  return newJSON
};


export const preprocess = (timeseries) => {
  //console.log("Preprocessing Timeseries")
  return timeseries.map((stat) => ({
    date: new Date(stat.date),
    colB: +stat.colB,
    colC: +stat.colC,
  }));
};

export const processForChart = (data, country) => {
  var final = {};
  var Codes;
  if (country==="Indonesia")
    Codes=IndonesiaStateCodes;
  else
    Codes=stateCodes;
  //console.log(Codes)
  for(var key in Codes){
    //console.log(key);
    //console.log(data[key]);
    if(!data[key])
    {
		  final[key]=[];
    }
    else
    {
		  final[key]=data[key];
	  }
  }
  //console.log(final);
  return final;
};

export const getpsValues = (x) => {
  var final = {};
  for(var key in x){
	var arr = [];
	for(var i = 0; i < x[key].length; i++){
		arr.push([x[key][i]['date'], x[key][i]['totalconfirmed']]);
	}
    final[key]=arr;
  };
  return final;
};

export const gettfValues = (x) => {
  var final = {};
  for(var key in x){
	var arr = [];
	for(var i = 0; i < x[key].length; i++){
		arr.push([x[key][i]['date'], x[key][i]['colB']]);
	}
    final[key]=arr;
  };
  return final;
};

export const getnfValues = (x) => {
  var final = {};
  for(var key in x){
	var arr = [];
	for(var i = 0; i < x[key].length; i++){
		arr.push([x[key][i]['date'], x[key][i]['colC']]);
	}
    final[key]=arr;
  };
  return final;
};

export const getwa1Values = (x) => {
  var final = {};
  for(var key in x){
	var arr = [];
	for(var i = 0; i < x[key].length; i++){
    if (i<4)
      arr.push([x[key][i]['date'], x[key][0]['colB']]);
    else
		  arr.push([x[key][i]['date'], (x[key][i]['colB'] + x[key][i-1]['colB'] + x[key][i-2]['colB'] + x[key][i-3]['colB'] + x[key][i-4]['colB'])/5]);
	}
    final[key]=arr;
  };
  return final;
};


export const eventdata = () => {
  var arr=[];
  arr.push([new Date("03/10/2020").getTime(), 0]);
  arr.push([new Date("03/19/2020").getTime(), 0]);
  arr.push([new Date("03/22/2020").getTime(), 0]);
  arr.push([new Date("03/24/2020").getTime(), 0]);
  arr.push([new Date("04/03/2020").getTime(), 0]);
  arr.push([new Date("04/05/2020").getTime(), 0]);
  arr.push([new Date("04/14/2020").getTime(), 0]);
  return arr;
};

export const getoveralldata = (data) => {
	var arr = [];
	var ref = data.stats[0];
	var obj = {'confirmed' : ref.confirmed, 'lastupdatedtime':ref.date, 'deaths': ref.fatal, 'active': ref.confirmed - ref.fatal - ref.recovered, 'statecode': 'TT', 'state': 'Total', 'recovered': ref.recovered};
	arr.push(obj);
	return arr;
};

export const pushregionwise = (a, data) => {
	var relevant = []
	for(var x in data){
		var dat = data[x];
		if(dat.parentId === "indonesia"){
			relevant.push(dat);
		}
	}
	//console.log(relevant)
	for(var y in relevant){
		var ref = relevant[y].report;
		var name = ref.name;
		var obj = {'confirmed' : ref.infected, 'lastupdatedtime':ref.lastUpdated, 'deaths': ref.dead, 'active': ref.sick, 'statecode': ordered[y], 'state': getStateName1(ordered[y]), 'recovered': ref.recovered};
		a.push(obj);
	}
	//console.log(a)
	return a;
}