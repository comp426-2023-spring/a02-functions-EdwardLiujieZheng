#!/usr/bin/env node

// import modules
import fetch from 'node-fetch';
import minimist from 'minimist';
import moment from 'moment-timezone';

// parse args
const args = minimist(process.argv.slice(2));

// help
function showHelp() {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
  -h            Show this help message and exit.
  -n, -s        Latitude: N positive; S negative.
  -e, -w        Longitude: E positive; W negative.
  -z            Time zone: uses tz.guess() from moment-timezone by default.
  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
  -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit(0);
}

if (args.h) {
  showHelp();
}

const latitude = args.n || -args.s;
const longitude = args.e || -args.w;
const timezone = args.z || moment.tz.guess();
const day = args.d == null ? 1 : args.d;

const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=precipitation_hours`;

const getWeatherData = async () => {
  const response = await fetch(url);
  const data = await response.json();

  if (args.j) {
    console.log(data);
    process.exit(0);
  }

  const precipitation_hours = data.daily.precipitation_hours[day];
  const phrase = precipitation_hours === 0 ? "will not" : "might";
  const dayStr = day === 0 ? "today" : day === 1 ? "tomorrow" : `in ${day} days`;

  console.log(`You ${phrase} need your galoshes ${dayStr}.`);
};

getWeatherData();
