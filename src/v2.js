/*!
 * Hydrogen v1.x (https://github.com/pimbrouwers/hydrogen)
 * Copyright 2018 Pim Brouwers
 * Licensed under MIT (https://github.com/pimbrouwers/hydrogen/blob/master/LICENSE)
 */

`use strict`

import { EventEmitter } from 'events';
import path from 'path';

const
  events = require('events'),
  fs = require('fs-extra'),
  glob = require('glob'),
  path = require('path'),
  rimraf = require('rimraf'),
  util = require('util');

module.exports = Ditto;

class Ditto extends EventEmitter {

  constructor(workingDirectory) {
    super();

    this._cwd = __dirname;
		this._metadata = {};
		this._source = null;
		this._destination = null;

    if (typeof workingDirectory == 'string')
      this.cwd(workingDirectory)
  }

  /**
	 * sets the working directory
	 * @param {String} workingDirectory 
	 */
  cwd(workingDirectory) {
    this._cwd = path.resolve(cwd);
    return this;
	}
	
	/**
	 * sets the output dir
	 * @param {String} destination 
	 */
	destination (destination) {
		this._destination = path.resolve(destination);
    return this;
	}

	/**
	 * sets the instance metadata
	 * @param {Object} metadata 
	 */
  metadate(metadata) {
    this._metadata = metadata;
    return this;
	}
	
	/**
	 * sets the source dir
	 * @param {String} source 
	 */
	source (source) {
		this._source = path.resolve(source);
    return this;
	}
}