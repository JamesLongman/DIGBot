#!/usr/bin/env bash
configFile=$1;

node > ${configFile} <<EOF
//Read data
var config = require('./${configFile}');

//Manipulate data

//Output data
console.log("====TEST LOG====")
console.log(config.environment);

EOF
