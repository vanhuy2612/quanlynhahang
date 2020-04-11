'use strict'

const Schedule = require('node-schedule')

require('./BookingScheduler')(Schedule);

module.exports = Schedule;