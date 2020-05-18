import moment, { invalid } from 'moment';
import axios from 'axios';

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

const ordered = {
	'DKI JAKARTA': 'JK',
	'JAWA BARAT': 'JB',
	'JAWA TIMUR': 'JI',
	'JAWA TENGAH': 'JT',
	'SULAWESI SELATAN': 'SN',
	'BANTEN': 'BT',
	'NUSA TENGGARA BARAT': 'NB',
	'BALI': 'BA',
	'PAPUA': 'PA',
	'KALIMANTAN SELATAN': 'KS',
	'SUMATERA BARAT': 'SB',
	'SUMATERA SELATAN': 'SS',
	'KALIMANTAN TENGAH': 'KT',
	'KALIMANTAN TIMUR': 'KI',
	'SUMATERA UTARA': 'SU',
	'DAERAH ISTIMEWA YOGYAKARTA': 'YO',
	'KALIMANTAN UTARA': 'KU',
	'KEPULAUAN RIAU': 'KR',
	'KALIMANTAN BARAT': 'KB',
	'SULAWESI TENGGARA': 'SG',
	'LAMPUNG': 'LA',
	'SULAWESI UTARA': 'SA',
	'SULAWESI TENGAH': 'ST',
	'RIAU': 'RI',
	'PAPUA BARAT': 'PB',
	'SULAWESI BARAT': 'SR',
	'JAMBI': 'JA',
	'MALUKU UTARA': 'MU',
	'MALUKU': 'MA',
	'GORONTALO': 'GO',
	'KEPULAUAN BANGKA BELITUNG': 'BB',
	'ACEH': 'AC',
	'BENGKULU': 'BE',
	'NUSA TENGGARA TIMUR': 'NT'
};

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

export const formatDate3 = (unformattedDate) => {
  const day = unformattedDate.split(/[/-]+/)[0];
  const month = unformattedDate.split(/[/-]+/)[1];
  const year = 2020;
  return `${day}-${month}-${year}`;
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

export const prettifyData1 = (data) => {
  const parsedData = data.data
  const header = parsedData.shift();
  var newJSON = [];
  for(var i=0, countValidDates=0; i<parsedData.length; i++) {
    var rowData = parsedData[i];
    var date_parsed = formatDate3(rowData[0]);
    // console.log(rowData[0]);
    if(rowData[0])
    {
      newJSON[countValidDates] = {
        "date":new Date(date_parsed),
        "AC": rowData[1],
        "BA": rowData[2],
		"BT": rowData[3],
		"BB": rowData[4],
		"BE": rowData[5],
		"YO": rowData[6],
		"JK": rowData[7],
		"JA": rowData[8],
		"JB": rowData[9],
		"JT": rowData[10],
		"JI": rowData[11],
		"KB": rowData[12],
		"KI": rowData[13],
		"KT": rowData[14],
		"KS": rowData[15],
		"KU": rowData[16],
		"KR": rowData[17],
		"NB": rowData[18],
		"SS": rowData[19],
		"SB": rowData[20],
		"SA": rowData[21],
		"SU": rowData[22],
		"SG": rowData[23],
		"SN": rowData[24],
		"ST": rowData[25],
		"LA": rowData[26],
		"RI": rowData[27],
		"MU": rowData[28],
		"MA": rowData[29],
		"PB": rowData[30],
		"PA": rowData[31],
		"SR": rowData[32],
		"NT": rowData[33],
		"GO": rowData[34],
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

export const processForBangla = (data) => {
  var final = {};
  final['TT'] = data;
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

export const getpsValues1 = (x) => {
  var final = {};
  for(var key in IndonesiaStateCodes){
	if(key == 'TT'){
		continue;
	}
	var arr = [];
	for(var i = 0; i < x.length; i++){
		arr.push([x[i]['date'], x[i][key]]);
	}
    final[key]=arr;
  };
  return final;
};

export const getposdata = (x) => {
  var final = {};
  var arr = [];
  for(var i = 0; i < x.length; i++){
	arr.push([new Date(x[i]['Date']), x[i]['Confirmed']]);
  }
  final['TT'] = arr;
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
      arr.push([x[key][i]['date'], x[key][1]['colB']]);
    else
		  arr.push([x[key][i]['date'], (x[key][i]['colB'] + x[key][i-1]['colB'] + x[key][i-2]['colB'] + x[key][i-3]['colB'] + x[key][i-4]['colB'])/5]);
	}
    final[key]=arr;
  };
  return final;
};

export const getwa1ValuesIndonesia = (x) => {
  var final = {};
  for(var key in x){
  var arr = [];
  for(var i = 0; i < x[key].length; i++){
    if (i<2)
      arr.push([x[key][i]['date'], x[key][1]['colB']]);
    else
      arr.push([x[key][i]['date'], (x[key][i]['colB'] + x[key][i-1]['colB'] + x[key][i-2]['colB'])/3]);
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

export const banglaEventData = () => {
  var arr=[];
  arr.push([new Date("03/08/2020").getTime(), 0]);
  arr.push([new Date("03/19/2020").getTime(), 0]);
  arr.push([new Date("03/23/2020").getTime(), 0]);
  arr.push([new Date("03/27/2020").getTime(), 0]);
  arr.push([new Date("04/18/2020").getTime(), 0]);
  arr.push([new Date("05/04/2020").getTime(), 0]);
  return arr;
};

export const getoveralldata = (data) => {
	var arr = [];
	var obj = {'confirmed' : data.Confirmed, 'lastupdatedtime':data.Date, 'deaths': data.Deaths, 'active': data.Confirmed - data.Deaths - data.Recovered, 'statecode': 'TT', 'state': 'Total', 'recovered': data.Recovered};
	arr.push(obj);
	return arr;
};

export const pushregionwise = (a, data) => {
	//console.log(data)
	var relevant = data.list_data;
	//console.log(relevant)
	for(var y in relevant){
		var ref = relevant[y];
		var name = ref.key;
		var obj = {'confirmed' : ref.jumlah_kasus, 'lastupdatedtime':data.last_date + 'T00:00:00Z', 'deaths': ref.jumlah_meninggal, 'active': ref.jumlah_dirawat, 'statecode': ordered[name], 'state': getStateName1(ordered[name]), 'recovered': ref.jumlah_sembuh};
		a.push(obj);
	}
	//console.log(a)
	return a;
}