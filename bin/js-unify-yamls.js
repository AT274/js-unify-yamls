#!/usr/bin/env node
'use strict'
const program = require("commander");

program.option("-t, --test <test>", "test option")
       .parse(process.argv);

const options = program.opts();
console.log(options)
