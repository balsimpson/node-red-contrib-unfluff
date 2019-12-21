const https = require('https');
const unfluff = require('unfluff');

const makeHttpCall = async (options) => {
	return new Promise((resolve) => {
		var req = https.request(options, res => {
			res.setEncoding('utf8');
			var returnData = "";
			res.on('data', chunk => {
				returnData = returnData + chunk;
			});
			res.on('end', () => {
				// let results = JSON.parse(returnData);
				// resolve(results);
				resolve(returnData);
			});
		});
		if (options.method == 'POST' || options.method == 'PATCH') {
			req.write(JSON.stringify(options.body));
		}
		req.end();
	})
}

async function getText(url) {

	try {
		let parsed_url = parseURL(url);
		let options = {
			host: parsed_url.domain,
			path: '/' + parsed_url.path,
			method: 'GET'
		}
		let html = await makeHttpCall(options);
		let res = unfluff(html);

		return res;
	} catch (error) {
		return 'error: ' + error;
	}
}

function parseURL(url){
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length ){
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}

module.exports = function (RED) {
	function UnfluffNode(config) {
		RED.nodes.createNode(this, config);
		let node = this;

		let data = {
			url: config.url
		}

		node.on('input', function (msg) {

			data.url = config.url ? config.url : msg.url;
			let results = getText(data.url);
			node.status({ fill: 'yellow', shape: 'ring', text: 'Requesting'  });
			results.then((value) => {
				if (value.error) {
					node.status({ fill: 'red', shape: 'ring', text: 'error - ' + data.url });
					node.error(value.error);
				} else {
					try {
						msg.payload = value;
						node.status({ fill: 'green', shape: 'dot', text: `Parsed `  });
						node.send(msg);
					} catch (error) {
						node.status({ fill: 'red', shape: 'dot', text: 'Error' });
						node.error(error);
					}
				}
			});
		});
	}
	RED.nodes.registerType('unfluff', UnfluffNode);
}