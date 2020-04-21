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
	});
	$("input[data-mask]").each(function(){
		$(this).mask($(this).data("mask"));
	});
	$("form").on("submit", function(e){
		e.preventDefault();
		$form = $(this);
		$form.find("button[type='submit']").prop("disabled",true);
		var formObj = {};
		$form.find(".group:not('.people') input:text, .group textarea, input:hidden").each(function(){
			formObj[$(this).attr("name")] = $(this).val();
		});
		formObj.activity_kind = $("input[name='activity_kind']:radio:checked").val();
		formObj.people = [];
		$form.find(".group.people .car-fields").each(function(){
			var peopleObj = {};
			$(this).find("input:text").each(function(){
				peopleObj[$(this).attr("name")] = $(this).val();
			});
			formObj.people.push(peopleObj);
		});
		$form.find("input:checkbox:checked").each(function(){
			formObj[$(this).attr("name")] = $(this).val();
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
//		    $("#status").addClass("error").text(jqXHR.responseJSON.message ? jqXHR.responseJSON.message : "Произошла ошибка. Попробуйте позже");
		    window.ajaxErrors = jqXHR;
		    if (jqXHR.responseJSON.errors){
			    $.each(jqXHR.responseJSON.errors, function(key, val){
				    $("input[name='"+key+"']").addClass("error").parents(".field").first().append('<span class="hint-error">'+val[0]+'</span>');
				    $.each(val, function(i, v){
					   $("#status").append('<div class="error-message">' + v + '</div>');
				    });
			    });
		    }
			$form.find("button[type='submit']").prop("disabled",false);
	    });
	});
});