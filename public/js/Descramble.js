var descramble = function() {
  return {
    init: function() {
      descramble.searchWords();      
    },
		searchWords: function() {
			/*$('#searchWord').on('keyup', function(){
				$('#displayText').html($(this).val());
				 $.ajax({
              url: "/search",
							type:'get',
              dataType: "jsonp",
              data: {
                 searchText: $(this).val(),
              },
              success: function( data ) {
							
								$.each( data.results, function( key, value ) {
										console.log( value.headword);
								});
             }
          });
			});*/
			var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
			$( "#searchWord" ).autocomplete({
				minLength: 2,				
				source: function( request, response ) {
          
					var dataArray = [];
					
					$.ajax({
              url: "/search",
							type:'get',
              dataType: "jsonp",
              data: {
                 searchText: request.term,
              },
              success: function( data ) {
								response($.map(data.results, function (item){
										return {
											label: item.headword,
											value: item.headword,
										}
									}));
             }
          });
				}
			});
		}
  }
}();

$(document).ready(function() {
  descramble.init();
});