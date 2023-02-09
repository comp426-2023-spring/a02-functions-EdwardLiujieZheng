#!/usr/bin/env node

// import modules
import moment from 'moment-timezone';

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

// parse input and return an url
function parse_input () {
    let url = 'https://api.open-meteo.com/v1/forecast?'
    let is_first_arg = true;
    let need_json = false;
    const args = process.argv.slice();
    // console.log(args)
    for(let i = 2; i < args.length; i += 2){
        console.log(args[i]);
        switch(args[i]){
            case '-h':
                show_help();
                break;
            case '-n':
                console.log(args[i+1]);
                break;
            case '-j':
                console.log('echo json');
                break;
        }
    }
}

parse_input ()


const timezone = moment.tz.guess();

//console.log(timezone)

//let sample_url = 'https://api.open-meteo.com/v1/forecast?latitude=35.94&longitude=-79.03&timezone=America%2FNew_York&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit'


// Make a request
//const response = await fetch(url);
//const data = await response.json();

// console.log(data)