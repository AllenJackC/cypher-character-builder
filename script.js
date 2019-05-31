var spellListDatabase = [];
var availSpellCount = 4;
var selectedSpellCount = 0;
//Function for adding leading zeros, if needed
function leadZeros(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
//Remove hidden and disabled attributes on target
function resetVisibility(target) {
	target.removeAttr('hidden');
	target.removeAttr('disabled');
}
//Function to enable and disable options based on variables
function resOpts(target,array,conditional,otherTar) {
	var targetVal;
	if ( otherTar === undefined ) {
		targetVal = target.val();
	} else {
		targetVal = otherTar;
	}
	if ( !conditional ) {
		if( $.inArray(targetVal,array) < 0 ) {
			target.prop('disabled', true);
		} else {
			target.prop('disabled', false);
		}
	} else {
		if( $.inArray(targetVal,array) > -1 ) {
			target.prop('disabled', true);
		} else {
			target.prop('disabled', false);
		}
	}
}
//Disable or enable options based on current story arc
function setStoryArc(arc) {
	$('#species option, #secondary-species option, #types option').each( function() {
		resetVisibility($(this));
	});
	$('option[data-arc]').each( function() {
		if( $(this).data('arc') >= arc) {
			$(this).prop('hidden', true);
			$(this).hide();
		} else {
			$(this).removeAttr('hidden');
			$(this).show();
		}
	});
}
//Sort select field options function
function sortOpts(field,options) {
	options.sort(function(a,b) {
		if ( a.text.toLowerCase() > b.text.toLowerCase() ) return 1;
		else if ( a.text.toLowerCase() < b.text.toLowerCase() ) return -1;
		else return 0
	});
	field.empty().append(options).val('');
}
//Function to hide any options that are marked as 'hidden' by the startup story arc function
function hideOpts(optGroup) {
	optGroup.each( function() {
		var isHidden = $(this)[0].hasAttribute('hidden');
		if( isHidden === true ) {
			$(this).hide();
		} else {
			$(this).show();
		}		
	});
}
//Populate the contents of the species dropdown lists
function populateSpecies() {
	//Select the species select fields and get their current value
	var priSpecies = $('#species');
	var secSpecies = $('#secondary-species');
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	//Select all of the options for types
	var typesOptions = $('#types option');
	//Get the allowed species for the currently set type
	var availPriSpecies = $('#types option:selected').data('primary-species');
	var availSecSpecies = $('#types option:selected').data('secondary-species');
	//Get restricted species for the currently set foci
	var resSpecies = "";
	var resPriSpecies = $('#foci option:selected').data('restricted-species');
	var resSecSpecies = $('#secondary-foci option:selected').data('restricted-species');
	//Get restricted types for the currently set foci
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Select the options for each species select field
	var priSpeciesOptions = $('#species option');
	var secSpeciesOptions = $('#secondary-species option');
	//Selector for both options
	var speciesOptions = $('#species option, #secondary-species option');
	//Reset disabled status of species before making changes
	speciesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted species,
	//restrict species based on that secondary focus
	if ( resSecSpecies ) {
		resSpecies = resSecSpecies;
	} else {
		resSpecies = resPriSpecies;
	}
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//Check if either a focus or a type (or both) are selected,then
	//restrict available species based on the selections (since all
	//species have both primary and secondary available species, only
	//only need to check for existence of primary species)
	//If the type is selected, and there's no restrictions based on the selected focus
	if ( availPriSpecies && !resSpecies ) {
		var priArray = availPriSpecies.split('');
		var secArray = availSecSpecies.split('');
		priSpeciesOptions.each( function() {
			resOpts($(this),priArray,false);				
		});
		secSpeciesOptions.each( function() {
			resOpts($(this),secArray,false);				
		});
	//If the type is selected, and the selected focus has species restrictions
	} else if ( availPriSpecies && resSpecies ) {
		var priArray = availPriSpecies.split('');
		var secArray = availSecSpecies.split('');
		var speciesArray = resSpecies.split('');	
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,priArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,secArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
	//If the type is NOT selected, and the selected focus has species and type restrictions
	} else if ( !availPriSpecies && resSpecies && resTypes ) {
		var typeArray = resTypes.match(/.{1,2}/g);
		var speciesArray = resSpecies.split('');	
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = String($('#types option[value="' + thisType + '"]').data('primary-species'));
			var secSpeciesForType = String($('#types option[value="' + thisType + '"]').data('secondary-species'));
			if ( $.inArray(thisType,typeArray) < 0 ) {
				priSpeciesArray.push(priSpeciesForType);
				secSpeciesArray.push(secSpeciesForType);					
			}
		});
		priSpeciesArray = priSpeciesArray.join('').split('');
		secSpeciesArray = secSpeciesArray.join('').split('');
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,priSpeciesArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,secSpeciesArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
	//If the type is NOT selected, and the selected focus has type restrictions but no species restrictions
	} else if ( !availPriSpecies && !resSpecies && resTypes ) {
		var typeArray = resTypes.match(/.{1,2}/g);
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = String($('#types option[value="' + thisType + '"]').data('primary-species'));
			var secSpeciesForType = String($('#types option[value="' + thisType + '"]').data('secondary-species'));
			if ( $.inArray(thisType,typeArray) < 0 ) {
				priSpeciesArray.push(priSpeciesForType);
				secSpeciesArray.push(secSpeciesForType);					
			}
		});
		priSpeciesArray = priSpeciesArray.join('').split('');
		secSpeciesArray = secSpeciesArray.join('').split('');
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,priSpeciesArray) < 0 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,secSpeciesArray) < 0 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
	//If the type is NOT selected, and the selected focus has species restrictions but no type restrictions
	} else if ( !availPriSpecies && resSpecies && !resTypes ) {
		var array = resSpecies;
		if ( array ) array = array.split('');
		speciesOptions.each( function() {
			resOpts($(this),array,true);				
		});
	}
	//Disable the currently selected primary or secondary species based on the
	//respective selection in the other field, stopping users from double dipping
	if ( priSpeciesVal ) $('#secondary-species option[value=' + priSpeciesVal + ']').prop('disabled', true);
	if ( secSpeciesVal ) $('#species option[value=' + secSpeciesVal + ']').prop('disabled', true);
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOpts(speciesOptions);
	//Trigger an update of the contents of both species select fields
	priSpecies.trigger('chosen:updated');
	secSpecies.trigger('chosen:updated');
}
//Populate the contents of the type dropdown list
function populateTypes() {
	//Get the value of the current species select fields
	var priSpeciesVal = $('#species').val();
	var secSpeciesVal = $('#secondary-species').val();
	//Get restricted types for the currently set foci
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Get value of the current genetic variation
	var genVariationVal = $('#variant').val();
	//Select the type select field
	var types = $('#types');
	//Select the options under the type select field
	var typesOptions = $('#types option');
	//Reset disabled status of types before making changes
	typesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//If there is a focus selected and no species selected
	if ( resTypes && !priSpeciesVal && !secSpeciesVal ) {
		var array = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			resOpts($(this),array,true);
		});
	//If there is a focus selected and a primary species selected, but no secondary species
	} else if ( resTypes && priSpeciesVal && !secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = String($(this).data('primary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and a secondary species selected, but no primary species
	} else if ( resTypes && !priSpeciesVal && secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and both species are selected
	} else if ( resTypes && priSpeciesVal && secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = String($(this).data('primary-species'));
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is NO focus selected, but only the primary species is selected
	} else if ( !resTypes && priSpeciesVal && !secSpeciesVal ) {
		typesOptions.each( function() {
			var array = String($(this).data('primary-species'));
			if ( array ) { array = array.split(''); }
			resOpts($(this),array,false,priSpeciesVal);
		});
	//If there is NO focus selected, but only the secondary species is selected
	} else if ( !resTypes && !priSpeciesVal && secSpeciesVal ) {
		typesOptions.each( function() {
			var array = String($(this).data('secondary-species'));
			if ( array ) { array = array.split(''); }
			resOpts($(this),array,false,secSpeciesVal);
		});
	//If there is NO focus selected, but both species are selected
	} else if ( !resTypes && priSpeciesVal && secSpeciesVal ) {
		typesOptions.each( function() {
			var availPriSpecies = String($(this).data('primary-species'));
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(secSpeciesVal,availSecSpecies) < 0 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	}
	//If a Terrans are selected, only show the Elementalist
	//type if the correct genetic variation is selected
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		if ( genVariationVal == 2 || !genVariationVal ) {
			$('#types option[value="A3"]').prop('disabled', false);
		} else {
			$('#types option[value="A3"]').prop('disabled', true);
		}
	}
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOpts(typesOptions);
	//Trigger an update of the contents	
	types.trigger('chosen:updated');
}
//Populate the contents of the focus dropdown lists
function populateFoci() {
	//Select the primary and secondary foci select fields
	var priFoci = $('#foci');
	var secFoci = $('#secondary-foci');
	//Get the value of the current type
	var typeVal = $('#types').val();
	//Get the value of the current species select fields
	var priSpeciesVal = $('#species').val();
	var secSpeciesVal = $('#secondary-species').val();
	//Get value of the current genetic variation
	var genVariationVal = $('#variant').val();
	//Select the options under the two focus select fields
	var fociOptions = $('#foci option, #secondary-foci option');
	//Reset disabled status of foci before making changes
	fociOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If the type is NOT selected, and only the primary species is selected
	if ( !typeVal && priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is NOT selected, and only the secondary species is selected	
	} else if ( !typeVal && !priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is NOT selected, and both species are selected
	} else if ( !typeVal && priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is selected, and only the primary species is selected
	} else if ( typeVal && priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is selected, and only the secondary species is selected
	} else if ( typeVal && !priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is selected, and both species are selected
	} else if ( typeVal && priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is select, and no species is selected
	} else if ( typeVal && !priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resTypes = $(this).data('restricted-types');
			if ( resTypes ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			}
		});
	}
	//If a Terrans are selected, only show Elementalist
	//foci if the correct genetic variation is selected
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		if ( genVariationVal == 2 || !genVariationVal ) {
			fociOptions.each( function() {
				//If A3 is not in the restricted list, hide it
				//If there is 
				var resTypes = $(this).data('restricted-types');
				if ( resTypes == "A0A1A2A4A5A6A7A8A9B0B1B2B3B4B5" ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			});
		}
	}
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOpts(fociOptions);
	//Trigger an update of the contents
	priFoci.trigger('chosen:updated');
	secFoci.trigger('chosen:updated');
}
//Populate the contents of the genetic variations dropdown list for Terrans
function populateVariants() {
	//Select species select fields and options
	var priSpeciesVal = $('#species').val();
	var secSpeciesVal = $('#secondary-species').val();
	//Get current type value
	var typeVal = $('#types').val();
	//Select genetic variation select field and options
	var variants = $('#variant');
	var variantsOptions = $('#variant option');
	//Select genetic variation section
	var extraAttributes = $('#extra-attributes');
	var genVariation = $('#genetic-variation');
	//Get restricted types for the currently set foci
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Boolean variable to check if a restrictied focus was selected
	var resFocus = false;
	//Reset disabled status of variants before making changes
	variantsOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//If user picks Terran, show genetic variations
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		extraAttributes.removeClass('hidden-section');
		genVariation.removeClass('hidden-section');
	} else {
		variants.val('');
		genVariation.addClass('hidden-section');
		if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
	}
	//If the currently selected type or focus has to do with Elementalist
	//disabled all genetic variations exception for the one
	if ( resTypes ) {
		var typesArray = resTypes.match(/.{1,2}/g);
		if( $.inArray("A3",typesArray) < 0 ) {
			resFocus = true;
		} else {
			resFocus = false;
		}
	}
	if ( typeVal == "A3" || resFocus ) {
		variantsOptions.each( function() {
			var thisVariant = $(this).val();
			if ( thisVariant != 2 ) {
				$(this).prop('disabled', true);
			}
		});
	}
	variants.trigger('chosen:updated');
}
//Populate the spell list based on the currently selected options
function populateSpells() {
	//Get the current tier (currently placeholder)
	var curTier = 6;
	//Get the values of all of the selection fields
	//in the character attributes section
	var descriptorVal = $('#descriptor').val();
	var priSpeciesVal = $('#species').val();
	var secSpeciesVal = $('#secondary-species').val();
	var typeVal = $('#types').val();
	var priFocusVal = $('#foci').val();
	var secFocusVal = $('#secondary-foci').val();
	var variantVal = $('#variant').val();
	//Blank arrays for active character attributes and
	//for the currently active spells
	var selOptions = [];
	var spellsList = [];
	//If the value of the field is not blank,
	//add it to the array to look for spells
	if ( descriptorVal ) selOptions.push("D" + descriptorVal);
	if ( priSpeciesVal && !secSpeciesVal ) {
		selOptions.push("S" + priSpeciesVal);
	} else if ( !priSpeciesVal && secSpeciesVal ) {
		selOptions.push("S" + secSpeciesVal);
	} else if ( priSpeciesVal && secSpeciesVal ) {
		selOptions.push("S" + String(priSpeciesVal) + String(secSpeciesVal));
	}
	if ( typeVal ) selOptions.push("T" + typeVal);
	if ( priFocusVal ) selOptions.push("F" + priFocusVal);
	if ( secFocusVal ) selOptions.push("F" + secFocusVal);
	if ( variantVal ) selOptions.push("V" + variantVal);
	//Run through each field in the character attributes section
	//to retrieve any spells associated with that attribute
	$.each(selOptions, function(index,curOption) {
		for (var i = 0; i < spellListDatabase.length; i++) {
			//Define variables for the current spell
			var spellName = spellListDatabase[i].name;
			var spellTier = spellListDatabase[i].tier;
			var tooltipTier = spellListDatabase[i].tier;
			var spellID = spellListDatabase[i].id;
			var optionID = curOption.substring(1);
			var spellRequired = spellListDatabase[i].required.includes("TRUE");
			var spellType = spellListDatabase[i].type.toLowerCase() + "-spell";
			var tooltipType = '<span class="spell-type-tooltip">' + spellListDatabase[i].type + '</span>';
			var spellDescription = spellListDatabase[i].description;
			var spellTooltip = spellListDatabase[i].tooltip;
			var spellCost = spellListDatabase[i].cost;
			var tooltipCost = spellListDatabase[i].cost;
			var spellCasttime = spellListDatabase[i].casttime;
			var tooltipCasttime = spellListDatabase[i].casttime;
			var spellDuration = spellListDatabase[i].duration;
			var tooltipDuration = spellListDatabase[i].duration;
			var spellRange = spellListDatabase[i].range;
			var tooltipRange = spellListDatabase[i].range;
			var spellCooldown = spellListDatabase[i].cooldown;
			var tooltipCooldown = spellListDatabase[i].cooldown;
			var spellDamage = spellListDatabase[i].damage;
			var spellOrigin;
			switch ( curOption.charAt(0) ) {
				case "D":
				spellOrigin = $('#descriptor option[value="' + optionID + '"]').text();
				break;
				case "S":
				if ( optionID.length === 2 ) {
					var priSpeciesID;
					var secSpeciesID;
					if ( optionID.charAt(0) < optionID.charAt(1) ) {
						priSpeciesID = optionID.charAt(0);
						secSpeciesID = optionID.charAt(1);
					} else {
						priSpeciesID = optionID.charAt(1);
						secSpeciesID = optionID.charAt(0);
					}
					optionID = priSpeciesID + secSpeciesID;
					curOption = "S" + optionID;
					if ( spellListDatabase[i]["S" + priSpeciesID] == "TRUE" ) {
						spellOrigin = $('#species option[value="' + priSpeciesID + '"]').text();
					} else if ( spellListDatabase[i]["S" + secSpeciesID] == "TRUE" ) {
						spellOrigin = $('#secondary-species option[value="' + secSpeciesID + '"]').text();
					}
				} else {
					spellOrigin = $('#species option[value="' + optionID + '"]').text();
				}
				break;
				case "T":
				spellOrigin = $('#types option[value="' + optionID + '"]').text();
				break;
				case "F":
				if ( $('#foci').val() != "E2" ) {
					spellOrigin = $('#foci option[value="' + optionID + '"]').text();
				} else {
					if ( spellListDatabase[i]["FE2"] == "TRUE" ) {
						spellOrigin = $('#foci option[value="' + optionID + '"]').text();
					} else {
						spellOrigin = $('#secondary-foci option[value="' + optionID + '"]').text();
					}
				}
				break;
				case "V":
				spellOrigin = $('#foci option[value="' + optionID + '"]').text();
				break;
				default:
				spellOrigin = "";
			}
			//If the current spell in the array is associated with this attribute
			//and the current tier is equal or lower to the tier of the spell,
			//define parameters and create a new div on the page for the spell
			if (( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && ['action-spell','enabler-spell','talent-spell','select-spell'].includes(spellType)) || ( !spellRequired && spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && spellType == "passive-spell" )) {
				//Set the order of the spell in the flex-box by its Tier and name
				var spellOrder = parseInt(String(2) + String(parseInt(spellTier) + 1) + leadZeros(parseInt(spellName.charCodeAt(0)) - 64,2) + leadZeros(parseInt(spellName.charCodeAt(1)) - 97,2));
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier == 0 ) {
					spellTier = '<div class="spell-tier">BASELINE</div>';
					tooltipTier = '<span class="spell-tier-tooltip">Baseline</span>';
				} else {
					spellTier = '<div class="spell-tier">TIER ' + spellTier + '</div>';
					tooltipTier = '<span class="spell-tier-tooltip">Tier ' + tooltipTier + '</span>';
				}
				if ( spellCost !== "" ) {
					spellCost = '<span><strong>Cost: </strong>' + spellCost + '</span>';
					tooltipCost = '<span class="spell-cost-tooltip">' + tooltipCost + '</span>';
				}
				if ( spellDuration !== "" ) {
					spellDuration = '<span><strong>Duration: </strong>' + spellDuration + '</span>';
					tooltipDuration = '<span>Lasts ' + tooltipDuration + '</span>';
				}
				if ( spellCasttime !== "" ) {
					spellCasttime = '<span><strong>Time Required: </strong>' + spellCasttime + '</span>';
					tooltipCasttime = '<span>' + tooltipCasttime + '</span>';
				}
				if ( spellRange !== "" ) {
					spellRange = '<span><strong>Range: </strong>' + spellRange + '</span>';
					tooltipRange = '<span>' + tooltipRange + ' range</span>';
				}
				if ( spellCooldown !== "" ) {
					spellCooldown = '<span><strong>Cooldown: </strong>' + spellCooldown + '</span>';
					tooltipCooldown = '<span>' + tooltipCooldown + ' cooldown</span>';
				}
				if ( spellDamage !== "" ) {
					spellDamage = '<span><strong>Damage: </strong>' + spellDamage + '</span>';
				}
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .spell-origin').text(spellOrigin);
				} else {
					$('#spell-list').append(
						'<div id="' + spellID + '" class="spell" style="order: ' + spellOrder + '">' +
						'<h3 class="spell-name">' +
						'<div class="spell-icon ' + spellType + '"></div>' +
						spellName +
						spellTier +
						'</h3>' +
						'<div class="spell-border">' +
						'<div class="stats">' +
						spellCost +
						spellDuration +
						spellCasttime +
						spellRange +
						spellCooldown +
						'</div>' +
						'<div class="spell-description">' +
						spellDescription +
						'</div>' +
						'<div class="stats">' +
						spellDamage +
						'<span class="spell-origin">' +
						spellOrigin +
						'</span>' +
						'</div>' +
						'</div>' +
						'</div>'
					);
					$('#spellbook-area').append(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
						'<h4 class="spell-name-tooltip">' +
						spellName +
						'</h4>' + 
						tooltipTier +
						tooltipCost +
						tooltipRange +
						tooltipCasttime +
						tooltipDuration +
						tooltipCooldown +
						'<span class="spell-description-tooltip">' +
						spellTooltip +
						'</span>' +
						tooltipType +
						'<span>' +
						spellOrigin +
						'</span>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
				//If this spell is marked as required, add the
				//required class, which disables interaction but
				//highlights the spell as automatically selected
				if ( spellRequired ) {
					$('#' + spellID).addClass('required');
				}
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && spellType == "items-spell" ) {
				//Set the order of the spell in the flex-box by its Tier and name
				var spellOrder = parseInt(String(2) + String(parseInt(spellTier) + 1) + leadZeros(parseInt(spellName.charCodeAt(0)) - 64,2) + leadZeros(parseInt(spellName.charCodeAt(1)) - 97,2));
				//Variables specific to items
				var itemName = spellListDatabase[i].itemname;
				var itemType = spellListDatabase[i].itemtype;
				var itemValue = spellListDatabase[i].itemvalue;
				var itemWeight = spellListDatabase[i].itemweight;
				var itemDamage = spellListDatabase[i].itemdamage;
				var itemArmour = spellListDatabase[i].itemarmour;
				var itemLevel = spellListDatabase[i].itemlevel;
				var itemDepletion = spellListDatabase[i].itemdepletion;
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier == 0 ) {
					spellTier = '<div class="spell-tier">BASELINE</div>';
				} else {
					spellTier = '<div class="spell-tier">TIER ' + spellTier + '</div>';
				}
				if ( itemValue !== "" ) {
					itemValue = '<span class="item-value"><strong>Value: </strong>' + itemValue + '₡</span>';
				}
				if ( itemWeight !== "" ) {
					itemWeight = '<span class="item-weight"><strong>Carry Weight: </strong>' + itemWeight + '</span>';
				}
				if ( itemDamage !== "" ) {
					itemDamage = '<span class="item-damage"><strong>Damage: </strong>' + itemDamage + '</span>';
				}
				if ( itemArmour !== "" ) {
					itemArmour = '<span class="item-armour"><strong>Armour: </strong>' + itemArmour + '</span>';
				}
				if ( itemLevel !== "" ) {
					itemLevel = '<span class="item-level"><strong>Level: </strong>' + itemLevel + '</span>';
				}
				if ( itemDepletion !== "" ) {
					itemDepletion = '<span class="item-depletion"><strong>Depletion: </strong>' + itemDepletion + '</span>';
				}
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .spell-origin').text(spellOrigin);
				} else {
					$('#spell-list').append(
						'<div id="' + spellID + '" class="spell" style="order: ' + spellOrder + '">' +
						'<h3 class="spell-name" data-item-name="' + itemName + '" data-item-type="' + itemType + '">' +
						'<div class="spell-icon ' + spellType + '"></div>' +
						spellName +
						spellTier +
						'</h3>' +
						'<div class="spell-border">' +
						'<div class="stats">' +
						itemLevel +
						itemValue +
						itemWeight +
						'</div>' +
						'<div class="spell-description">' +
						spellDescription +
						'</div>' +
						'<div class="stats">' +
						itemDamage +
						itemArmour +
						itemDepletion +
						'<span class="spell-origin">' +
						spellOrigin +
						'</span>' +
						'</div>' +
						'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
				//If this spell is marked as required, add the
				//required class, which disables interaction but
				//highlights the spell as automatically selected
				if ( spellRequired ) {
					$('#' + spellID).addClass('required');
				}
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellType == "lore-spell" ) {
				//Set the order of the spell in the flex-box by its name
				var spellOrder = parseInt(String(parseInt(spellName.charCodeAt(0)) - 64) + leadZeros(parseInt(spellName.charCodeAt(1)) - 97,2));
				if ( $('#' + spellID).length <= 0 ) {
					$('#lore-area').append(
						'<div id="' + spellID + '" class="lore" style="order: ' + spellOrder + '">' +
						'<h3 class="lore-name">' +
						spellName +
						'</h3>' +
						'<div class="lore-description">' +
						spellDescription +
						'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} 
		}
	});
	//Remove any spells that are not
	//in the active spell list array
	$('.spell, .lore').each( function() {
		var spellID = parseInt($(this).attr('id'));
		if( $.inArray(spellID,spellsList) < 0 ) {
			$(this).remove();
		}
	});
	$('.tooltip').each( function() {
		var spellID = parseInt($(this).data('spellid'));
		if( $.inArray(spellID,spellsList) < 0 ) {
			$(this).remove();
		}
	});
	//Reset the selected spell count based
	//on the new selections made
	selectedSpellCount = $('.selected').length;
	populateSpellLists(spellsList);
}
//Populate each individual spell list on the main character sheet
function populateSpellLists(spellsList) {
	var spells = $('.spell');
	$('.list-spell').remove();
	//Move each spell to their respective lists
	spells.each( function() {
		var thisSpell = $(this);
		var spellID = thisSpell.attr('id');
		var spellOrder = thisSpell.css('order');
		var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
		var thisType = tooltip.children('.spell-type-tooltip').text();
		var isItem = $('.spell-icon', thisSpell).hasClass('items-spell');
		if ( thisSpell.hasClass('required') || thisSpell.hasClass('selected') ) {
			if ( thisType == "Enabler" ) {
				$('#enablers-list').append(
					'<div data-spellid="' + spellID + '" class="list-spell" style="order: ' + spellOrder + '">' +
					'<span>' +
					tooltip.children('.spell-name-tooltip').text() +
					'</span>' +
					'<span>' +
					tooltip.children('.spell-cost-tooltip').text() +
					'</span>' +
					'</div>'
				);
			} else if ( thisType == "Action" ) {
				$('#actions-list').append(
					'<div data-spellid="' + spellID + '" class="list-spell" style="order: ' + spellOrder + '">' +
					'<span>' +
					tooltip.children('.spell-name-tooltip').text() +
					'</span>' +
					'<span>' +
					tooltip.children('.spell-cost-tooltip').text() +
					'</span>' +
					'</div>'
				);
			} else if ( thisType == "Talent" ) {
				$('#talents-list').append(
					'<div data-spellid="' + spellID + '" class="list-spell" style="order: ' + spellOrder + '">' +
					'<span>' +
					tooltip.children('.spell-name-tooltip').text() +
					'</span>' +
					'</div>'
				);
			} else if ( isItem && $('.list-item[data-spellid="' + spellID + '"]').length <= 0 && $('#' + spellID + ' .spell-name').data('item-name') != "" ) {
				var selectThisType;
				switch ( thisSpell.children('.spell-name').data('item-type') ) {
					case "Item":
					selectThisType = "IT";
					break;
				}
				var addedItem = 
					'<tr class="list-item" data-spellid="' + spellID + '">' +
					'<td>' +
					'<select class="item-equip">' +
					'<option selected>Stored</option>' +
					'<option>Readied</option>' +
					'<option>Equipped</option>' +
					'</select>' +
					'</td>' +
					'<td contenteditable="true" class="item-name">' +
					thisSpell.children('.spell-name').data('item-name') +
					'</td>' +
					'<td class="item-type-cell">' +
					'<select class="item-type" data-placeholder=" ">' +
					'<option></option>' +
					'<option value="IT">Item</option>' +
					'<option value="LW">Light Weapon</option>' +
					'<option value="MW">Heavy Weapon</option>' +
					'<option value="HW">Medium Weapon</option>' +
					'<option value="LA">Light Armour</option>' +
					'<option value="MA">Medium Armour</option>' +
					'<option value="HA">Heavy Armour</option>' +
					'</select>' +
					'</td>' +
					'<td contenteditable="true" class="item-cost">' +
					$('.item-value', thisSpell).text().replace('Value: ','').replace('₡','') +
					'</td>' +
					'<td contenteditable="true" class="item-weight">' +
					$('.item-weight', thisSpell).text().replace('Carry Weight: ','') +
					'</td>' +
					'<td class="remove-row-cell">' +
					'<div class="remove-row">X</div>' +
					'</td>' +
					'</tr>';
				$(addedItem).insertAfter('#equipment-header-row');
				$('.item-equip').chosen({
					disable_search: true,
					width: "78px"
				});
				$('.item-type').chosen({
					disable_search: true,
					placeholder_text_single: " ",
					width: "123px"
				});
				var thisItem = $('.list-item[data-spellid="' + spellID + '"]');
				$('.item-type', thisItem).val(selectThisType);
				$('.item-type', thisItem).trigger('chosen:updated');
			}
		}
	});
	//Remove items if the associated spell was removed
	$('.list-item').each(function() {
		var spellID = parseInt($(this).data('spellid'));
		if( $.inArray(spellID,spellsList) < 0 && spellsList && spellID ) {
			$(this).remove();
		}
	});
	//Show the spell list section if there are spells in the list, otherwise hide it
	$('.spell-list').each(function() {
		if ( $(this).is(':empty') ) {
			$(this).parent('.spell-section-wrap').parent('.spell-section').hide();
		} else {
			$(this).parent('.spell-section-wrap').parent('.spell-section').show();
		}
	});
}
//Primary on load function
$(function() {
	//Select descriptor select field and options
	var descriptors = $('#descriptor');
	var descriptorsOptions = $('#descriptor option');
	//Select species select fields and options
	var priSpecies = $('#species');
	var secSpecies = $('#secondary-species');
	var priSpeciesOptions = $('#species option');
	var secSpeciesOptions = $('#secondary-species option');
	var speciesOptions = $('#species option, #secondary-species option');
	//Select types select field and options
	var types = $('#types');
	var typesOptions = $('#types option');
	//Select foci select fields and options
	var priFoci = $('#foci');
	var secFoci = $('#secondary-foci');
	var priFociOptions = $('#foci option');
	var secFociOptions = $('#secondary-foci option');
	var fociOptions = $('#foci option, #secondary-foci option');
	//Select genetic variation select field and options
	var variants = $('#variant');
	var variantsOptions = $('#variant option');
	//Toggle sections and buttons
	var extraAttributes = $('#extra-attributes');
	var genVariation = $('#genetic-variation');
	var secFociSection = $('#second-focus');
	var hybridSection = $('#hybrid-species');
	var hybridButton = $('#hybrid-button div');
	var hybridTooltip = $('#hybrid-tooltip');
	var resetSection = $('#reset-button');
	var resetButton = $('#reset-button div');
	var resetTooltip = $('#reset-tooltip');
	var spellList = $('#spell-list');
	var spellButton = $('#main .spellbook-button');
	var spellModal = $('#spellbook-background');
	var loreArea = $('#lore-area');
	var spellLists = $('.spell-list');
	//Select elements inside the equipment section
	var equipmentList = $('#equipment-list');
	var itemEquip = $('.item-equip');
	var itemType = $('.item-type');
	//Set the initial character tier
	var curTier = 1;
	//Setup spell list database
	Tabletop.init({
		key: 'https://docs.google.com/spreadsheets/d/133J5k_1XfoPxFiWuVXcztwIunjamNA7YGTh11zS0U_M/edit?usp=sharing',
		callback: function (data, tabletop) {
			spellListDatabase = data;
			$('#warning').text('👍 DATABASE PULLED 👍');
			$('#warning').css('background-color','green');
		},
		simpleSheet: true
	});
	//Temprorary story arc initial setting
	setStoryArc(2);
	//Toggle spell headers on load
	populateSpellLists();
	//Sort and then setup chosen.js dropdowns
	sortOpts(descriptors,descriptorsOptions);
	descriptors.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a descriptor",
		width: "100%"
	});
	sortOpts(priSpecies,priSpeciesOptions);
	priSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOpts(secSpecies,secSpeciesOptions);
	secSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOpts(types,typesOptions);
	types.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a type",
		width: "100%"
	});
	sortOpts(priFoci,priFociOptions);
	priFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	sortOpts(secFoci,secFociOptions);
	secFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	sortOpts(variants,variantsOptions);
	variants.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a variation",
		width: "100%"
	});
	itemEquip.chosen({
		disable_search: true,
		width: "78px"
	});
	itemType.chosen({
		disable_search: true,
		placeholder_text_single: " ",
		width: "123px"
	});
	//[H] button to show or hide secondary species dropdown and reset its value
	hybridButton.click(function(){
		var priSpeciesVal = priSpecies.val();
		$(this).toggleClass('clicked');
		extraAttributes.removeClass('hidden-section');
		hybridSection.toggleClass('hidden-section');
		if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
		//Reset value of secondary species field
		secSpecies.val('');	
		//If the Hybrid button is clicked and terran is not the primary species,
		//hide the genetic variation field
		if ( priSpeciesVal != 6 ) {
			genVariation.addClass('hidden-section');
			variants.val('');
			if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
		}
		//Repopulate all of the fields after cliking the toggle, since disabling it
		//changes the criteria
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		//If only the secondary species is selected when clicked, hide the reset button
		if ( !secSpecies.val() && !priSpeciesVal && !types.val() ) {
			resetSection.addClass('hidden-section');
		}
	});
	//Reset button to reset all values and hide extra sections
	resetButton.click(function(){
		descriptors.val('');
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		variants.val('');
		secFociSection.addClass('hidden-section');
		resetSection.addClass('hidden-section');
		genVariation.addClass('hidden-section');
		descriptors.trigger('chosen:updated');
		setStoryArc(2);
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
		if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
	});
	//Populate relevant lists each time the select list is interacted
	//with, populate spells, and show the reset button
	descriptors.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpells();
	});
	$('#species, #secondary-species').on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
	});
	types.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateFoci();
		populateVariants();
		populateSpells();
		spellButton.text(availSpellCount - selectedSpellCount + ' Abilities Available');
	});
	$('#foci, #secondary-foci').on('change', function() {
		var curFocus = priFoci.val();
		if ( curFocus == "E2" ) {
			extraAttributes.removeClass('hidden-section');
			secFociSection.removeClass('hidden-section');
		} else {
			secFociSection.addClass('hidden-section');
			secFoci.val('');
			if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
		}
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
	});
	variants.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateTypes();
		populateFoci();
		populateSpells();
	});
	//Highlight spells and keep track of spell count
	spellList.on('click', '.spell', function() {
		if ( $(this).hasClass('required') == false && $(this).hasClass('selected') == false && selectedSpellCount < availSpellCount ) {
			$(this).addClass('selected');
			++selectedSpellCount;
		} else if ( $(this).hasClass('required') == false && $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
			--selectedSpellCount;
		}
		if ( selectedSpellCount === availSpellCount ) {
			$('.spell:not(.selected, .required)').addClass('disabled-spell');
		} else {
			$('.spell').removeClass('disabled-spell');
		}
		if ( availSpellCount - selectedSpellCount === 0 ) {
			spellButton.text('Abilities');
		} else if ( availSpellCount - selectedSpellCount === 1 ) {
			spellButton.text(availSpellCount - selectedSpellCount + ' Ability Available'); 
		} else {
			spellButton.text(availSpellCount - selectedSpellCount + ' Abilities Available'); 
		}
		populateSpellLists();
	});
	//Show spellbook modal on click
	$('.spellbook-button, #spellbook-background, #spellbook-wrapper').click( function(e) {
		if(e.target !== e.currentTarget) return;
		if ( spellModal.hasClass('invisible-section') ) {
			spellModal.removeClass('invisible-section');
			$('body').css('overflow','hidden');
		} else {
			spellModal.addClass('invisible-section');
			$('body').css('overflow','auto');
		}
	});
	//Toggle lore accordions on lore name click
	loreArea.on('click', '.lore-name', function() {
		var thisLore = $(this).parent('.lore').children('.lore-description');
		$('.lore-name').not(this).removeClass('expanded');
		$('.lore-description:visible').not(thisLore).slideToggle(500);
		$(this).toggleClass('expanded');
		thisLore.slideToggle(500);
	});
	//Show tooltips on hover and keep it with mouse
	var isHovering;
	spellLists.on('mouseenter', '.list-spell', function(e) {
		var spellID = $(this).data('spellid');
		var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
		var fromLeft = e.pageX - 30;
		var windowWidth = $(window).width();
		if ( fromLeft < 10 ) {
			fromLeft = 10;
		} else if ( fromLeft > windowWidth - (tooltip.width() + 10) ) {
			fromLeft = windowWidth - (tooltip.width() + 10);
		}
		tooltip.addClass('visible');
		tooltip.css('top', e.pageY - (tooltip.height() + 25));
		tooltip.css('left', fromLeft);
		isHovering = true;
	});
	spellLists.on('mouseleave', '.list-spell', function(e) {
		var spellID = $(this).data('spellid');
		var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
		tooltip.removeClass('visible');
		isHovering = false;
	});
	spellLists.on('mousemove', '.list-spell', function(e){
		var spellID = $(this).data('spellid');
		var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
		if ( isHovering ) {
			tooltip.css('top', e.pageY - (tooltip.height() + 25));
			tooltip.css('left', e.pageX - 30);
		}
	});
	hybridButton.hover( function(e){
		if ( hybridButton.hasClass('clicked') === false ) {
			var fromLeft = e.pageX - 35;
			var windowWidth = $(window).width();
			if ( fromLeft < 10 ) {
				fromLeft = 10;
			} else if ( fromLeft > windowWidth - (hybridTooltip.width() + 10) ) {
				fromLeft = windowWidth - (hybridTooltip.width() + 10);
			}
			hybridTooltip.addClass('visible');
			hybridTooltip.css('top', e.pageY - (hybridTooltip.height() + 45));
			hybridTooltip.css('left', fromLeft);
		}
	}, function() {
		hybridTooltip.removeClass('visible');
	});
	resetButton.hover( function(e){
		if ( resetButton.hasClass('clicked') === false ) {
			var fromLeft = e.pageX - 35;
			var windowWidth = $(window).width();
			if ( fromLeft < 10 ) {
				fromLeft = 10;
			} else if ( fromLeft > windowWidth - (resetTooltip.width() + 10) ) {
				fromLeft = windowWidth - (resetTooltip.width() + 10);
			}
			resetTooltip.addClass('visible');
			resetTooltip.css('top', e.pageY - (resetTooltip.height() + 45));
			resetTooltip.css('left', fromLeft);
		}
	}, function() {
		resetTooltip.removeClass('visible');
	});
	//Add item rows when clicking Add Item
	//Remove item rows when clicking X, but
	//add a new blank item if it's the last
	//item in the row
	function addItem() {
		equipmentList.append(
			'<tr class="list-item">' +
			'<td>' +
			'<select class="item-equip">' +
			'<option selected>Stored</option>' +
			'<option>Readied</option>' +
			'<option>Equipped</option>' +
			'</select>' +
			'</td>' +
			'<td contenteditable="true" class="item-name">' +
			'</td>' +
			'<td class="item-type-cell">' +
			'<select class="item-type" data-placeholder=" ">' +
			'<option></option>' +
			'<option value="IT">Item</option>' +
			'<option value="LW">Light Weapon</option>' +
			'<option value="MW">Heavy Weapon</option>' +
			'<option value="HW">Medium Weapon</option>' +
			'<option value="LA">Light Armour</option>' +
			'<option value="MA">Medium Armour</option>' +
			'<option value="HA">Heavy Armour</option>' +
			'</select>' +
			'</td>' +
			'<td contenteditable="true" class="item-cost">' +
			'</td>' +
			'<td contenteditable="true" class="item-weight">' +
			'</td>' +
			'<td class="remove-row-cell">' +
			'<div class="remove-row">X</div>' +
			'</td>' +
			'</tr>'
		);
		$('.item-equip').chosen({
			disable_search: true,
			width: "78px"
		});
		$('.item-type').chosen({
			disable_search: true,
			placeholder_text_single: " ",
			width: "123px"
		});
	}
	equipmentList.on('click', '.remove-row', function () {
		$(this).closest('.list-item').remove();
		if ( $('.list-item').length == 1 ) {
			addItem();
		}
	});
	$('#add-item').click( function () {
		addItem();
	});
});