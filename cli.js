#!/usr/bin/env node

// import modules
import moment from 'moment-timezone';
import fetch from "node-fetch";

// Show help
function show_help () {
  console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
  console.log("    -h            Show this help message and exit.");
  console.log("    -n, -s        Latitude: N positive; S negative.");
  console.log("    -e, -w        Longitude: E positive; W negative.");
  console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
  console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
  console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
  process.exit(0);
}

// parse input and return {url, day, need_jason}
function parse_input () {
    let url = 'https://api.open-meteo.com/v1/forecast?'
    let need_json = false;
    let need_guess_timezone = true;
    let day = 0;
    const args = process.argv.slice();

    // console.log(args)
    for(let i = 2; i < args.length; i += 2){
        switch(args[i]){
            case '-h':
                show_help();
                break;
            case '-n':
                url = url + "latitude=" + args[i+1].toString() + "&";
                break;
            case '-s':
                url = url + "latitude=" + (-args[i+1]).toString() + "&";
                break;
            case '-e':
                url = url + "longitude=" + args[i+1].toString() + "&";
                break;
            case '-w':
                url = url + "longitude=" + (-args[i+1]).toString() + "&";
                break;
            case '-z':
                url = url + "timezone=" + args[i+1].replace("/", "%2F") + "&";
                need_guess_timezone = false;
                break;
            case '-d':
                day = args[i+1];
                break;
            case '-j':
                need_json = true;
                break;
        }
    }

    if(need_guess_timezone) url = url + "timezone=" + moment.tz.guess().replace("/", "%2F") + "&";
    url = url + "daily=precipitation_hours"

    // console.log(url)
    return {url, day, need_json};
}

// Make a request
let args= parse_input()
const response = await fetch(args.url);
const data = await response.json();

// log output
if(args.need_json){
    console.log(data);
    process.exit(0);
}

const precipitation = data.daily.precipitation_hours[args.day];
let messsage = "";
if(precipitation == 0) messsage += "You won't need your galoshes ";
else messsage += "You might need your galoshes ";

const days = args.day;
if (days == 0) {
  messsage += "today.";
} else if (days > 1) {
  messsage += "in " + days + " days."
} else {
  messsage += "tomorrow."
}

console.log(messsage);