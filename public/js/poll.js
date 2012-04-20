	$(function(){
		var socket = io.connect(poll_domain);
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
        title: false,
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Votes'
            }
        },
				legend : false,
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

		$('#pollOptions ul li').each(function(i, el){
			$(this).children('span').eq(0).css('background',colors[i]);
		});

		$('a#vote-submit').click(function(e){
			e.preventDefault();
			var checked_option = $('#pollOptions input:checked').eq(0);
			if(!checked_option) return false;
			var self = this;
			$.getJSON('/polls/' + poll._id + '/vote/' + poll.opts[checked_option.parent().index()]._id, function(data){
				if(data && "string" != typeof data){
					socket.emit('vote', { poll_id: data.poll_id, option_id: data.option_id, option_index: data.option_index });
					$('#pollOptions').fadeOut(function(){
						$('#pollGraph').animate({width: '100%'}, function(){
							chart.setSize($('#pollGraph').width(),$('#pollGraph').height());
						});
					});
				} else if(data) {
					alert(data);
				}		
			});
		});
		
		$('#lastpolls li').hide();
		$('#lastpolls li:first').addClass('currentTick').show();		
		setInterval(function() {
			var nextItem = $('#lastpolls .currentTick').next();
			if (nextItem.length == 0){
				$('#lastpolls li:last').removeClass().fadeOut();
				nextItem = $('#lastpolls li:first');
				nextItem.addClass('currentTick');
			}
			else {
				nextItem;
			}
			$(nextItem).prev().removeClass().fadeOut();
			$(nextItem).addClass('currentTick').fadeIn();
		}, 3000);

		socket.on('vote proc', function(data){
			$('#'+data.option_id+' a span').text(parseInt($('#'+data.option_id+' span').text()) + 1);
			chart.series[0].data[data.option_index].update(++chart.series[0].data[data.option_index].y);
		});
	});

