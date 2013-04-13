JSPagePerf
==========

A small JS component you can use to add a button to any HTML page which will output the page's rendering performance. 

<h2>How it Works</h2>
<p>
  This component adds a button to the lower right corner of any HTML page. This is a more accurate test of page performance then some traditional methods for testing. Many traditional tools only test the time it takes for the client computer to receive an HTML page, and does not take into account the time it takes the browser to parse and display the HTML page to the user. JSPagePerf gives the full "to glass" performance time, which includes the network time to get the HTML page, the time to parse the DOM and display the page to the user.
</p>
<h2>Setup &amp; Installation</h2>
This is done in only a few easy steps:
<ol>
	<li>
		Include jQuery &amp; jQuery UI API:<code><pre>
		&lt;link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css"&gt;
		&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"&gt;&lt;/script&gt;
		&lt;script type="text/javascript" src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"&gt;&lt;/script&gt;
		</pre></code>
	</li>

	<li>
		<a href="https://github.com/rwblackburn/JSPagePerf/tree/master/JSPagePerf/build">Download</a> &amp; include the JSPagePerf.js file:<code><pre>
		&lt;script type="text/javascript" src="JSPagePerf.js"&gt;&lt;/script&gt;
		</pre></code>
	</li>

	<li>
		Optionally* include Google Visualization API:<code><pre>
		&lt;script type="text/javascript" src="https://www.google.com/jsapi"&gt;&lt;/script&gt;
		</pre></code>
		<em>* - This simply makes the performance report look nicer.</em><br />&nbsp;
	</li>
	
	<li>Invoke <code>new JSPagePerf();</code> any time after the page is fully loaded. For example, if you included the Google Visualization API, you could do this:<code><pre>	
		&lt;script type="text/javascript"&gt;
	
			var main = function(){
				new JSPagePerf();
			};
	
			google.load('visualization', '1.0', {'packages':['corechart']});
			google.setOnLoadCallback(main);
			
		&lt;/script&gt;
		</pre></code>
		Or if you did not include the Google Vizualization API:
		<code><pre>	
		&lt;script type="text/javascript"&gt;
	
			var main = function(){
				new JSPagePerf();
			};
	
			$(document).ready(main);
			
		&lt;/script&gt;
		</pre></code> 
	</li>

</ol>
