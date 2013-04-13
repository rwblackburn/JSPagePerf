'use strict';

/**
 * JSPagePerf is a small JS component you can use to add a button to any HTML 
 * page which will output the page's rendering performance.
 * 
 * For more information see:
 *      https://github.com/rwblackburn/JSPagePerf
 * 
 * @author Robert Blackburn (@rwbDev)
 * @constructor
 */
var JSPagePerf = function(c, o) {
	
	/** @type {boolean} */
	var isDrawn = false;
	/** @type {Object} */
	var options = o;
	/** @type {jQuery} */
	var container = c;
	
	/**
	 * JSPagePerf constructor
	 * 
	 * @return {JSPagePerf}
	 */
	var init = function() {
		var chartDialog = undefined, chartButton = undefined, dialogHtml = '';
		
		if(container === undefined) {
			container = $('body');
		}

		if(options === undefined) {
			options = {};
		}
		
		dialogHtml += '<div title="JSPagePerf - Page Performance">';
		dialogHtml += '   <h2>Total Page Time <span id="totalTime"></span></h2>';
		dialogHtml += '   <div id="chartAll" style="width: 100%;"></div>';
		dialogHtml += '   <h2>DOM Processing <span id="processingTime"></span></h2>';
		dialogHtml += '   <div id="chartProcessing" style="width: 100%;"></div>';
		dialogHtml += '   <a href="https://github.com/rwblackburn/JSPagePerf" style="float: right;">help</a>';
		dialogHtml += '</div>'; 
		
		chartDialog = $(dialogHtml).hide();
		chartButton = $('<div style="position:absolute; bottom: 6px; right: 6px;">JSPagePerf</div>').button().click(
			function(event){
				event.preventDefault();
				event.stopPropagation();

				chartDialog.dialog({minWidth:680});
				drawCharts(chartDialog);
			}
		)
		
		container.append(chartButton);
		container.append(chartDialog);
		
		return this;
	};

	/**
	 * Gets all the time differences from the window.performance.timing
	 * browser variable.
	 * 
	 * @return {Object} Object containing all the timing data
	 */
	var getTimeDeltas = function() {
		var timing = window.performance.timing,
			data = {
					total: timing.loadEventEnd-timing.navigationStart,
					
					redirect: timing.redirectEnd-timing.redirectStart,
					appCache: timing.domainLookupStart-timing.fetchStart,
					dns: timing.domainLookupEnd-timing.domainLookupStart,
					tcp: timing.connectEnd-timing.connectStart,
					request: timing.responseStart-timing.requestStart,
					response: timing.responseEnd-timing.responseStart,
					processing: timing.loadEventStart-timing.domLoading,
					loadEvent: timing.loadEventEnd-timing.loadEventStart,
					
					processingToInteractive: timing.domInteractive-timing.domLoading,
					processingToContentLoaded: timing.domContentLoadedEventEnd-timing.domInteractive,
					processingToComplete: timing.loadEventStart-timing.domContentLoadedEventEnd
				};

		return data;
	};

	/**
	 * Draw the performance charts
	 * 
	 * @param {jQuery} container The container HTML element to draw to
	 * 
	 */
	var drawCharts = function(container) {
		if(!isDrawn) {
			var timeDeltas = getTimeDeltas();
			
			$('#totalTime').text('('+timeDeltas.total+'ms)');
			$('#processingTime').text('('+timeDeltas.processing+'ms)');
			
			if(google != undefined && google.visualization != undefined && google.visualization.BarChart != undefined) {
				drawCharts_GoogleViz(container, timeDeltas);
			} else {
				drawCharts_Basic(container, timeDeltas);
			};
			
			isDrawn = true;
		};
		
		return this;
	};
	
	/**
	 * Used by drawCharts() to draw the charts using google visualization
	 * 
	 * @param {$} container The container HTML element to draw to
	 * @param {Object} timeDeltas The timing details
	 * 
	 */
	var drawCharts_GoogleViz = function(container, timeDeltas) {
		var tableOptions = {width:'100%', 
			  	height:100, 
			  	isStacked:true,
			  	legend: {position:'top'},
			  	chartArea: {left: 0, right: 0, width: '100%'}
			  };
		
		var gData = google.visualization.arrayToDataTable([
	       ['Step', 'Redirect', 'App Cache', 'DNS', 'TCP', 'Request', 'Response', 'DOM Processing', 'Load Events'],
	       ['Time',  timeDeltas.redirect, timeDeltas.appCache, timeDeltas.dns, timeDeltas.tcp, timeDeltas.request, timeDeltas.response, timeDeltas.processing, timeDeltas.loadEvent]
	     ]);

		var gDOMData = google.visualization.arrayToDataTable([
	       ['Step', 'MS to Interactive', 'MS to Content Loaded', 'MS to Complete'],
	       ['Time',  timeDeltas.processingToInteractive, timeDeltas.processingToContentLoaded, timeDeltas.processingToComplete]
	     ]);
		
		// Create and draw the visualization.
		tableOptions['colors'] = ['#CCCCCC','#FDC57B', 'F98E1C', '#D2640F', '#C45200', '#B13B00', '#870E03', '#481830'];
		new google.visualization.BarChart(container.find('#chartAll')[0]).draw(gData, tableOptions);
		
		// Create and draw the visualization.
		tableOptions['colors'] = ['#870E03', '#B13B00', '#C45200'];
		new google.visualization.BarChart(container.find('#chartProcessing')[0]).draw(gDOMData, tableOptions);
		
		return this;
	};

	/**
	 * Used by drawCharts() to draw the basic charts using no API
	 * 
	 * @param {jQuery} container The container HTML element to draw to
	 * @param {Object} timeDeltas The timing details
	 * 
	 */
	var drawCharts_Basic = function(container, timeDeltas) {
		var html = '';
		
		html += '<table>';
		html += '   <tr>';
		html += '     <th>Step</th>';
		html += '     <th>Time (MS)</th>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>Redirect</td>';
		html += '     <td>'+timeDeltas.redirect+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>App Cache</td>';
		html += '     <td>'+timeDeltas.appCache+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>DNS</td>';
		html += '     <td>'+timeDeltas.dns+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>TCP</td>';
		html += '     <td>'+timeDeltas.tcp+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>Request</td>';
		html += '     <td>'+timeDeltas.request+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>Response</td>';
		html += '     <td>'+timeDeltas.response+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>DOM Processing</td>';
		html += '     <td>'+timeDeltas.processing+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>Load Events</td>';
		html += '     <td>'+timeDeltas.loadEvent+'</td>';
		html += '   </tr>';
		html += '</table>'; 

		container.find('#chartAll').html(html);
		
		html = '';
		html += '<table>';
		html += '   <tr>';
		html += '     <th>Step</th>';
		html += '     <th>Time (MS)</th>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>MS to Interactive</td>';
		html += '     <td>'+timeDeltas.processingToInteractive+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>MS to Content Loaded</td>';
		html += '     <td>'+timeDeltas.processingToContentLoaded+'</td>';
		html += '   </tr>';
		html += '   <tr>';
		html += '     <td>MS to Complete</td>';
		html += '     <td>'+timeDeltas.processingToComplete+'</td>';
		html += '   </tr>';
		html += '</table>'; 

		container.find('#chartProcessing').html(html);
		
		container.find('table').addClass('ui-widget').css('border-collapse', 'collapse');
		container.find('th').addClass('ui-widget-header').css('padding', '0.2em');
		container.find('td').addClass('ui-widget-content').css('padding', '0.2em');
		
		return this;
	};

	
	// Automatically invoke the constructor
	init();
};