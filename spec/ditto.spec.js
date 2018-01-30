const 
	Ditto = require('../src'),
	path = require('path');

describe('ditto', function() {

	/**
	 * Working Directory
	 */
	it('cwd should equal __dirname', function(){
		let cwdCompare = path.resolve('src');
		let ditto = new Ditto(cwdCompare);

		expect(ditto._cwd).toEqual(cwdCompare);
	});

	/**
	 * Metadata
	 */
	it('metadata should equal {}', function(){
		let cwdCompare = path.resolve('src');
		let metadata = { title: 'test' };
		let ditto = new Ditto(cwdCompare).metadata(metadata);
		
		expect(ditto._cwd).toEqual(cwdCompare);
		expect(ditto._metadata).toEqual(metadata);
	});

	it('metadata should equal {} and metadata path should be set', function(){
		let cwdCompare = path.resolve('src');
		let metadata = cwdCompare;
		let ditto = new Ditto(cwdCompare).metadata(metadata);
		
		expect(ditto._cwd).toEqual(cwdCompare);
		expect(ditto._metadata).toEqual({});
		expect(ditto._metadataPath).toEqual(metadata);
	});

	/**
	 * Clobber
	 */
	it('default clobber should be "false"', function(){
		let cwdCompare = path.resolve('src');
		let ditto = new Ditto(cwdCompare);

		expect(ditto._clobber).toEqual(false);
	});

	it('clobber should be "true"', function(){
		let cwdCompare = path.resolve('src');
		let ditto = new Ditto(cwdCompare).clobber(true);

		expect(ditto._clobber).toEqual(true);
	});

	/**
	 * Source
	 */
	it('default source should be "src"', function(){
		let sourceCompare = path.resolve('src');
		let ditto = new Ditto(sourceCompare).source('src');

		expect(ditto._source).toEqual(sourceCompare);
	});

	it('source should be "srcTest"', function(){
		let sourceCompare = path.resolve('srcTest');
		let ditto = new Ditto(sourceCompare).source('srcTest');

		expect(ditto._source).toEqual(sourceCompare);
	});

	/**
	 * Destination
	 */
	it('default destination should be "public"', function(){
		let destinationCompare = path.resolve('public');
		let ditto = new Ditto(destinationCompare).destination('public');

		expect(ditto._destination).toEqual(destinationCompare);
	});

	it('destination should be "publicTest"', function(){
		let destinationCompare = path.resolve('publicTest');
		let ditto = new Ditto(destinationCompare).destination('publicTest');

		expect(ditto._destination).toEqual(destinationCompare);
	});
});