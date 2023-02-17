#!/usr/bin/env node

// import modules
import fetch from 'node-fetch';
import minimist from 'minimist';
import moment from 'moment-timezone';

// parse args
const args = minimist(process.argv.slice(2));

// show help and exit
if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

// interpret args
const latitude = args.n || -args.s;
const longitude = args.e || -args.w;
const timezone = args.z || moment.tz.guess();
const day = args.d == null ? 1 : args.d;

// Make a request
let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&timezone=' + timezone + '&daily=precipitation_hours';

const response = await fetch(url);
// Get the data from the request
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

const precipitation_hours = data.daily.precipitation_hours[day];

let phrase = precipitation_hours === 0 ? "will not" : "might";
if (day === 0) {
  console.log(`You ${phrase} need your galoshes today.`)
} else if (day > 1) {
  console.log(`You ${phrase} need your galoshes in ${day} days.`)
} else {
  console.log(`You ${phrase} need your galoshes tomorrow.`)
}