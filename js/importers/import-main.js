/**
 * Nextcloud - passman
 *
 * @copyright Copyright (c) 2016, Sander Brand (brantje@gmail.com)
 * @copyright Copyright (c) 2016, Marcos Zuriaga Miguel (wolfi@wolfi.es)
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var PassmanImporter = {};
(function(window, $, PassmanImporter) {
	'use strict';


	PassmanImporter.parseRow_ = function(row) {
		// Strip leading quote.
		row = row.trim();
		var isQuoted = false;
		if (row.charAt(0) === '"') {
			row = row.substring(1);
			isQuoted = true;
		}
		if (row.charAt(row.length - 2) === '"') {
			row = row.substring(0, row.length - 2);
			isQuoted = true;
		}
		// Strip trailing quote. There seems to be a character between the last quote
		// and the line ending, hence 2 instead of 1.
		if(isQuoted === true) {
			row = row.split('","');
		} else {
			row = row.split(',');
		}
		return row;
	};
	PassmanImporter.htmlDecode = function(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	};
	PassmanImporter.toObject_ = function(headings, row) {
		var result = {};
		for (var i = 0, ii = row.length; i < ii; i++) {
			headings[i] = headings[i].replace(',','_')
				.toLowerCase().replace(' ','_')
				.replace('(','').replace(')','')
				.replace('"','');
			result[headings[i]] = row[i];
		}
		return result;
	};

	PassmanImporter.join_ = function(arr, sep) {
		var parts = [];
		for (var i = 0, ii = arr.length; i < ii; i++) {
			if(arr[i]){
				parts.push(arr[i]);
			}
		}
		return parts.join(sep);
	};

	PassmanImporter.newCredential = function () {
		var credential = {
			'credential_id': null,
			'guid': null,
			'vault_id': null,
			'label': null,
			'description': null,
			'created': null,
			'changed': null,
			'tags': [],
			'email': null,
			'username': null,
			'password': null,
			'url': null,
			'favicon': null,
			'renew_interval': null,
			'expire_time': 0,
			'delete_time': 0,
			'files': [],
			'custom_fields': [],
			'otp': {},
			'hidden': false
		};
		return credential;
	};

	PassmanImporter.readCsv = function( csv, hasHeadings ){
		hasHeadings = (hasHeadings === undefined) ? true : hasHeadings;
		var i, _row;
		var lines = [];
		var rows = csv.split('\n');
		if(hasHeadings) {
			var headings = this.parseRow_(rows[0]);
			for (i = 1; i < rows.length; i++) {
				_row = this.toObject_(headings, this.parseRow_(rows[i]));
				lines.push(_row);
			}
		} else {
			for (i = 1; i < rows.length; i++) {
				_row = this.toObject_(null, this.parseRow_(rows[i]));
				lines.push(_row);
			}
		}
		return lines;
	};

	PassmanImporter.readJson = function (string){
		return JSON.parse(string);
	};
})(window, $, PassmanImporter);
