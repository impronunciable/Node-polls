	$(function(){
		var socket = io.connect('http://local.host');
		socket.emit('join poll', poll._id);

    var colors = Highcharts.getOptions().colors,
        categories = [],
        name = poll.title,
        data = [];

		for(var i in poll.opts){
			categories.push(poll.opts[i].title);
			data.push({
           y: poll.opts[i].votes,
          color: colors[i]
			});
		}

    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories);
        chart.series[0].remove();
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        });
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
            type: 'column'
        },
        title: {
            text: poll.title
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Votes'
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                       }
                    }
                },
                dataLabels: {
                    enabled: true,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return this.y;
                    }
                }
            }
        },
        tooltip: {
            formatter: function() {
                var point = this.point,
                  s = this.x +':<b>'+ this.y +' votes';
                	return s;
                }
        },
        series: [{
            name: name,
            data: data,
            color: 'white'
        }],
        exporting: {
            enabled: false
        }
    });


		$('ul a').click(function(e){
			e.preventDefault();
			var self = this;
			$.getJSON($(self).attr('href'), function(data){
				if(data && "string" != typeof data){
					socket.emit('vote', { poll_id: data.poll_id, option_id: data.option_id, option_index: data.option_index });
				} else if(data) {
					alert(data);
				}		
			});
		});

		socket.on('vote proc', function(data){
			$('#'+data.option_id+' a span').text(parseInt($('#'+data.option_id+' span').text()) + 1);
			chart.series[0].data[data.option_index].y++;	
			chart.redraw();
		});
	});
