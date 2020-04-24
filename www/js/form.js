$(document).ready(function(){
	$(document).on("click","button.add-car", function(e){
		e.preventDefault();
		$(this).parents(".car-fields").first().clone().appendTo($(this).parents(".group").first());
		$(this).parents(".group").find(".car-fields").last().find("input:text").val("");
	}).on("click","button.remove-car", function(e){
		e.preventDefault();
		$(this).parents(".car-fields").first().remove();
	}).on("keypress", "input", function(){
		$(this).removeClass("error").parents(".field").first().find(".hint-error").remove();
	}).on("change", "input[name='reason']", function(){
		if ($(this).val() == "155"){
			$("#other-reason").show().find("input:text, textarea").prop("required", true);
			$("#who_needs_help, #who_needs_help_phone").hide().find("input:text, textarea").prop("required", false);
		} else {
			$("#other-reason").hide().find("input:text, textarea").prop("required", false);
			$("#who_needs_help, #who_needs_help_phone").show().find("input:text, textarea").prop("required", true);
		}
	});
	if ($("input[name='ceo_name']:hidden").length){
		$("input[name='firstname'], input[name='middlename'], input[name='lastname']").on("change, blur", function(){
			$("input[name='ceo_name']:hidden").val($("input[name='firstname']").val() + " " + $("input[name='middlename']").val() + " " + $("input[name='lastname']").val());
		});
	}
	$("input[data-mask]").each(function(){
		$(this).mask($(this).data("mask"));
	});
	$("input.licence-number").each(function(){
		$(this).mask("Z000ZZ000", {
			translation: {
				"Z": { pattern: /[АВЕКМНОРСТУХавекмнорстух]/ }
			}
		});
	});
	$("form").on("submit", function(e){
		e.preventDefault();
		$form = $(this);
		$form.find("button[type='submit']").prop("disabled",true);
		var formObj = {};
		$form.find(".group:not('.people') input:text, .group textarea, input:hidden, input:radio:checked, input:checkbox:checked").each(function(){
			formObj[$(this).attr("name")] = $(this).val();
		});
		formObj.people = [];
		$form.find(".group.people .car-fields").each(function(){
			var peopleObj = {};
			$(this).find("input:text").each(function(){
				peopleObj[$(this).attr("name")] = $(this).val();
			});
			formObj.people.push(peopleObj);
		});
		window.formData = formObj;
		$("#status").removeAttr("class").empty();
		$.ajax({
			url: $form.attr("action"),
			type: "POST",
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(formObj)
		}).always(function(){

	    }).done(function(){
		    $("#success").text("Ваша заявка отправлена");
	    }).fail(function(jqXHR){
			$form.find("button[type='submit']").prop("disabled",false);
		    window.ajaxErrors = jqXHR;
		    if (jqXHR.responseJSON.message){
			    $("#status").addClass("error").html('<div class="error-message nb">' + jqXHR.responseJSON.message + '</div>');
		    }
		    if (jqXHR.responseJSON.errors){
			    $.each(jqXHR.responseJSON.errors, function(key, val){
				    $("input[name='"+key+"']").addClass("error").parents(".field").first().append('<span class="hint-error">'+val[0]+'</span>');
				    $.each(val, function(i, v){
					   $("#status").append('<div class="error-message nb">' + v + '</div>');
				    });
			    });
		    }
	    });
	});
});