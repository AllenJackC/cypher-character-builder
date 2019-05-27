var spellListDatabase = [];
var availSpellCount = 4;
var selectedSpellCount = 0;
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
	var typesOptions = $('#type option');
	//Get the allowed species for the currently set type
	var availPriSpecies = $('#type option:selected').attr('data-available-species');
	var availSecSpecies = $('#type option:selected').attr('data-available-sec-species');
	//Get restricted species for the currently set foci
	var resSpecies = "";
	var resPriSpecies = $('#focus option:selected').attr('data-restricted-species');
	var resSecSpecies = $('#secondary-focus option:selected').attr('data-restricted-species');
	//Get restricted types for the currently set foci
	var resTypes = "";
	var resPriTypes = $('#focus option:selected').attr('data-restricted-types');
	var resSecTypes = $('#secondary-focus option:selected').attr('data-restricted-types');
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
	if ( resSecSpecies !== "" ) {
		resSpecies = resSecSpecies;
	} else {
		resSpecies = resPriSpecies;
	}
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes !== "" ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//Check if either a focus or a type (or both) are selected,then
	//restrict available species based on the selections (since all
	//species have both primary and secondary available species, only
	//only need to check for existence of primary species)
	//If the type is selected, and there's no restrictions based on the selected focus
	if ( availPriSpecies !== "" && resSpecies == "" ) {
		var priArray = availPriSpecies.split('');
		var secArray = availSecSpecies.split('');
		priSpeciesOptions.each( function() {
			resOpts($(this),priArray,false);				
		});
		secSpeciesOptions.each( function() {
			resOpts($(this),secArray,false);				
		});
	//If the type is selected, and the selected focus has species restrictions
	} else if ( availPriSpecies !== "" && resSpecies !== "" ) {
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
	} else if ( availPriSpecies == "" && resSpecies !== "" && resTypes !== "" ) {
		var typeArray = resTypes.match(/.{1,2}/g);
		var speciesArray = resSpecies.split('');	
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = $('#type option[value="' + thisType + '"]').attr('data-available-species');
			var secSpeciesForType = $('#type option[value="' + thisType + '"]').attr('data-available-sec-species');
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
	} else if ( availPriSpecies == "" && resSpecies == "" && resTypes !== "" ) {
		var typeArray = resTypes.match(/.{1,2}/g);
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = $('#type option[value="' + thisType + '"]').attr('data-available-species');
			var secSpeciesForType = $('#type option[value="' + thisType + '"]').attr('data-available-sec-species');
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
	} else if ( availPriSpecies == "" && resSpecies !== "" && resTypes == "" ) {
		var array = resSpecies.split('');
		speciesOptions.each( function() {
			resOpts($(this),array,true);				
		});
	}
	//Disable the currently selected primary or secondary species based on the
	//respective selection in the other field, stopping users from double dipping
	if ( priSpeciesVal !== "" ) {
		$('#secondary-species option[value=' + priSpeciesVal + ']').prop('disabled', true);
	}
	if ( secSpeciesVal !== "" ) {
		$('#species option[value=' + secSpeciesVal + ']').prop('disabled', true);
	}
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	//Also fix issue with species field disabling itself if its value is 3 for some reason
	hideOpts(speciesOptions);
	$('#species').removeAttr('disabled');
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
	var resPriTypes = $('#focus option:selected').attr('data-restricted-types');
	var resSecTypes = $('#secondary-focus option:selected').attr('data-restricted-types');
	//Get value of the current genetic variation
	var genVariationVal = $('#variant').val();
	//Generic variable to check if the values of each species select field is unset
	var priSpeciesBlank = priSpeciesVal === "" || priSpeciesVal === null;
	var secSpeciesBlank = secSpeciesVal === "" || secSpeciesVal === null;
	//Select the type select field
	var types = $('#type');
	//Select the options under the type select field
	var typesOptions = $('#type option');
	//Reset disabled status of types before making changes
	typesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes !== "" ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//If there is a focus selected and no species selected
	if ( resTypes !== "" && priSpeciesBlank && secSpeciesBlank ) {
		var array = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			resOpts($(this),array,true);
		});
	//If there is a focus selected and a primary species selected, but no secondary species
	} else if ( resTypes !== "" && !priSpeciesBlank && secSpeciesBlank ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = $(this).attr('data-available-species').split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and a secondary species selected, but no primary species
	} else if ( resTypes !== "" && priSpeciesBlank && !secSpeciesBlank ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availSecSpecies = $(this).attr('data-available-sec-species').split('');
			if( $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and both species are selected
	} else if ( resTypes !== "" && !priSpeciesBlank && !secSpeciesBlank ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = $(this).attr('data-available-species').split('');
			var availSecSpecies = $(this).attr('data-available-sec-species').split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is NO focus selected, but only the primary species is selected
	} else if ( resTypes == "" && !priSpeciesBlank && secSpeciesBlank ) {
		typesOptions.each( function() {
			var array = $(this).attr('data-available-species').split('');
			resOpts($(this),array,false,priSpeciesVal);
		});
	//If there is NO focus selected, but only the secondary species is selected
	} else if ( resTypes == "" && priSpeciesBlank && !secSpeciesBlank ) {
		typesOptions.each( function() {
			var array = $(this).attr('data-available-sec-species').split('');
			resOpts($(this),array,false,secSpeciesVal);
		});
	//If there is NO focus selected, but both species are selected
	} else if ( resTypes == "" && !priSpeciesBlank && !secSpeciesBlank ) {
		typesOptions.each( function() {
			var availPriSpecies = $(this).attr('data-available-species').split('');
			var availSecSpecies = $(this).attr('data-available-sec-species').split('');
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
		if ( genVariationVal == 2 || genVariationVal === null || genVariationVal === "" ) {
			$('#type option[value="A3"]').prop('disabled', false);
		} else {
			$('#type option[value="A3"]').prop('disabled', true);
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
	var priFoci = $('#focus');
	var secFoci = $('#secondary-focus');
	//Get the value of the current type
	var typeVal = $('#type').val();
	//Get the value of the current species select fields
	var priSpeciesVal = $('#species').val();
	var secSpeciesVal = $('#secondary-species').val();
	//Get value of the current genetic variation
	var genVariationVal = $('#variant').val();
	//Generic variable to check if the values of each species and type select fields are unset
	var priSpeciesBlank = priSpeciesVal === "" || priSpeciesVal === null;
	var secSpeciesBlank = secSpeciesVal === "" || secSpeciesVal === null;	
	var typeBlank = typeVal === "" || typeVal === null;
	//Select the options under the two focus select fields
	var fociOptions = $('#focus option, #secondary-focus option');
	//Reset disabled status of foci before making changes
	fociOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If the type is NOT selected, and only the primary species is selected
	if ( typeBlank && !priSpeciesBlank && secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			if ( resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is NOT selected, and only the secondary species is selected	
	} else if ( typeBlank && priSpeciesBlank && !secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			if ( resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is NOT selected, and both species are selected
	} else if ( typeBlank && !priSpeciesBlank && !secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			if ( resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is selected, and only the primary species is selected
	} else if ( !typeBlank && !priSpeciesBlank && secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			var resTypes = $(this).attr('data-restricted-types');
			if ( resTypes !== "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes !== "" && resSpecies == "" ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( resTypes == "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is selected, and only the secondary species is selected
	} else if ( !typeBlank && priSpeciesBlank && !secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			var resTypes = $(this).attr('data-restricted-types');
			if ( resTypes !== "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes !== "" && resSpecies == "" ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( resTypes == "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				resOpts($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is selected, and both species are selected
	} else if ( !typeBlank && !priSpeciesBlank && !secSpeciesBlank ) {
		fociOptions.each( function() {
			var resSpecies = $(this).attr('data-restricted-species');
			var resTypes = $(this).attr('data-restricted-types');
			if ( resTypes !== "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes !== "" && resSpecies == "" ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			} else if ( resTypes == "" && resSpecies !== "" ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is select, and no species is selected
	} else if ( !typeBlank && priSpeciesBlank && secSpeciesBlank ) {
		fociOptions.each( function() {
			var resTypes = $(this).attr('data-restricted-types');
			if ( resTypes !== "" ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				resOpts($(this),typesArray,true,typeVal);
			}
		});
	}
	//If a Terrans are selected, only show Elementalist
	//foci if the correct genetic variation is selected
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		var validVariants = genVariationVal == 2 || genVariationVal === null || genVariationVal === "";
		if ( !validVariants ) {
			fociOptions.each( function() {
				//If A3 is not in the restricted list, hide it
				//If there is 
				var resTypes = $(this).attr('data-restricted-types');
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
	var typeVal = $('#type').val();
	//Select genetic variation select field and options
	var variants = $('#variant');
	var variantsOptions = $('#variant option');
	//Select genetic variation section
	var genVariation = $('#genetic-variation');
	//Get restricted types for the currently set foci
	var resTypes = "";
	var resPriTypes = $('#focus option:selected').attr('data-restricted-types');
	var resSecTypes = $('#secondary-focus option:selected').attr('data-restricted-types');
	//Boolean variable to check if a restrictied focus was selected
	var resFocus = false;
	//Reset disabled status of variants before making changes
	variantsOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes !== "" ) {
		resTypes = resSecTypes;
	} else {
		resTypes = resPriTypes;
	}
	//If user picks Terran, show genetic variations
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		genVariation.removeClass('hidden-section');
	} else {
		variants.val('');
		genVariation.addClass('hidden-section');
	}
	//If the currently selected type or focus has to do with Elementalist
	//disabled all genetic variations exception for the one
	if ( resTypes !== "" ) {
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
	var typeVal = $('#type').val();
	var priFocusVal = $('#focus').val();
	var secFocusVal = $('#secondary-focus').val();
	var variantVal = $('#variant').val();
	//Check to see if any of the character attributes are blank
	var descriptorBlank = descriptorVal === "" || descriptorVal === null;
	var priSpeciesBlank = priSpeciesVal === "" || priSpeciesVal === null;
	var secSpeciesBlank = secSpeciesVal === "" || secSpeciesVal === null;
	var typeBlank = typeVal === "" || typeVal === null;
	var priFocusBlank = priFocusVal === "" || priFocusVal === null;
	var secFocusBlank = secFocusVal === "" || secFocusVal === null;
	var variantBlank = variantVal === "" || variantVal === null;
	//Blank arrays for active character attributes and
	//for the currently active spells
	var selOptions = [];
	var spellsList = [];
	//If the value of the field is not blank,
	//add it to the array to look for spells
	if (!descriptorBlank) selOptions.push("D" + descriptorVal);
	if (!priSpeciesBlank) selOptions.push("S" + priSpeciesVal);
	if (!secSpeciesBlank) selOptions.push("S" + secSpeciesVal);
	if (!typeBlank) selOptions.push("T" + typeVal);
	if (!priFocusBlank) selOptions.push("F" + priFocusVal);
	if (!secFocusBlank) selOptions.push("F" + secFocusVal);
	if (!variantBlank) selOptions.push("V" + variantVal);
	//Run through each field in the character attributes section
	//to retrieve any spells associated with that attribute
	$.each(selOptions, function(index,curOption) {
		for (var i = 0; i < spellListDatabase.length; i++) {
			var spellTier = spellListDatabase[i].tier;
			var spellID = spellListDatabase[i].id;
			var optionID = curOption.substring(1);
			//If the current spell in the array is associated with this attribute
			//and the current tier is equal or lower to the tier of the spell,
			//define parameters and create a new div on the page for the spell
			if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier ) {
				//Define variables for the current spell
				var spellType = spellListDatabase[i].type;
				var spellCost = spellListDatabase[i].cost;
				var spellDuration = spellListDatabase[i].duration;
				var spellEffect = spellListDatabase[i].aftereffect;
				var spellRange = spellListDatabase[i].range;
				var spellCooldown = spellListDatabase[i].cooldown;
				var spellDamage = spellListDatabase[i].damage;
				var spellOrigin;
				switch ( spellType ) {
					case "Action":
					spellType = "action-spell";
					break;
					case "Lore":
					spellType = "lore-spell";
					break;
					default:
					spellType = "";
				}
				switch ( curOption.charAt(0) ) {
					case "D":
					spellOrigin = $('#descriptor option[value="' + optionID + '"]').text();
					break;
					case "S":
					spellOrigin = $('#species option[value="' + optionID + '"]').text();
					break;
					case "T":
					spellOrigin = $('#type option[value="' + optionID + '"]').text();
					break;
					case "F":
					spellOrigin = $('#focus option[value="' + optionID + '"]').text();
					break;
					case "V":
					spellOrigin = $('#focus option[value="' + optionID + '"]').text();
					break;
					default:
					spellOrigin = "";
				}
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellType == "lore-spell" ) {
					spellTier = '<div class="spell-tier">LORE</div>';
				} else if ( spellTier == 0 ) {
					spellTier = '<div class="spell-tier">BASELINE</div>';
				} else {
					spellTier = '<div class="spell-tier">TIER ' + spellTier + '</div>';
				}
				if ( spellCost !== "" ) {
					spellCost = '<span><strong>Cost: </strong>' + spellCost + '</span>';
				}
				if ( spellDuration !== "" ) {
					spellDuration = '<span><strong>Duration: </strong>' + spellDuration + '</span>';
				}
				if ( spellEffect !== "" ) {
					spellEffect = '<span><strong>After Effect: </strong>' + spellEffect + '</span>';
				}
				if ( spellRange !== "" ) {
					spellRange = '<span><strong>Range: </strong>' + spellRange + '</span>';
				}
				if ( spellCooldown !== "" ) {
					spellCooldown = '<span><strong>Cooldown: </strong>' + spellCooldown + '</span>';
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
						'<div id="' + spellID + '" class="spell" style="order: ' + parseInt(spellID) + '">' +
						'<div class="spell-name">' +
						'<div class="spell-icon ' + spellType + '"></div>' +
						spellListDatabase[i].name +
						spellTier +
						'</div>' +
						'<div class="spell-border">' +
						'<div class="stats-left">' +
						spellCost +
						spellDuration +
						spellEffect +
						'</div>' +
						'<div class="stats-right">' +
						spellRange +
						spellCooldown +
						'</div>' +
						'<div class="description">' +
						spellListDatabase[i].description +
						'</div>' +
						'<div class="stats-left">' +
						spellDamage +
						'</div>' +
						'<div class="stats-right">' +
						'<span class="spell-origin">' +
						spellOrigin +
						'</span>' +
						'</div>' +
						'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(spellID);
			}
			//If this spell is marked as required, add the
			//required class, which disables interaction but
			//highlights the spell as automatically selected
			if ( spellListDatabase[i].required == "TRUE" ) {
				var spellID = spellListDatabase[i].id;
				$('#' + spellID).addClass('required');
			}			
		}
	});
	//Remove any spells that are not
	//in the active spell list array
	$('.spell').each( function() {
		var spellID = $(this).attr('id');
		if( $.inArray(spellID,spellsList) < 0 ) {
			$(this).remove();
		}
	});
	//Reset the selected spell count based
	//on the new selections made
	selectedSpellCount = $('.selected').length;
}
//Disable or enable options based on current story arc
function setStoryArc(arc) {
	$('#species option, #secondary-species option').each( function() {
		resetVisibility($(this));
	});
	$('option[data-story-arc]').each( function() {
		if( $(this).attr('data-story-arc') >= arc) {
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
	var types = $('#type');
	var typesOptions = $('#type option');
	//Select foci select fields and options
	var priFoci = $('#focus');
	var secFoci = $('#secondary-focus');
	var priFociOptions = $('#focus option');
	var secFociOptions = $('#secondary-focus option');
	var fociOptions = $('#focus option, #secondary-focus option');
	//Select genetic variation select field and options
	var variants = $('#variant');
	var variantsOptions = $('#variant option');
	//Toggle sections and buttons
	var genVariation = $('#genetic-variation');
	var secFociSection = $('#second-focus');
	var hybridSection = $('#hybrid-species');
	var hybridToggle = $('#hybrid-button div');
	var resetSection = $('#reset-button');
	var resetBtn = $('#reset-button div');
	var spellList = $('#spell-list');
	//Set the initial character tier
	var curTier = 1;
	//Spell list database URL and array
	var spellListDatabaseURL = 'https://docs.google.com/spreadsheets/d/133J5k_1XfoPxFiWuVXcztwIunjamNA7YGTh11zS0U_M/edit?usp=sharing';
	//Setup spell list database
	Tabletop.init({
		key: spellListDatabaseURL,
		callback: function (data, tabletop) {
			spellListDatabase = data;
		},
		simpleSheet: true
	});
	//Temprorary story arc initial setting
	setStoryArc(2);
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
	//[H] button to show or hide secondary species dropdown and reset its value
	hybridToggle.click(function(){
		var priSpeciesVal = priSpecies.val();
		$(this).toggleClass('clicked');
		hybridSection.toggleClass('hidden-section');
		//Reset value of secondary species field
		secSpecies.val('');	
		//If the Hybrid button is clicked and terran is not the primary species,
		//hide the genetic variation field
		if ( priSpeciesVal != 6 ) {
			genVariation.addClass('hidden-section');
			variants.val('');
		}
		//Repopulate all of the fields after cliking the toggle, since disabling it
		//changes the criteria
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		//If only the secondary species is selected when clicked, hide the reset button
		if ( secSpecies.val() == "" && priSpeciesVal == "" && types.val() == "" ) {
			resetSection.addClass('hidden-section');
		}
	});
	//Reset button to reset all values and hide extra sections
	resetBtn.click(function(){
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		variants.val('');
		$('.spell').remove();
		secFociSection.addClass('hidden-section');
		resetSection.addClass('hidden-section');
		genVariation.addClass('hidden-section');
		setStoryArc(2);
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
	});
	//Populate relevant lists each time the select list is interacted
	//with, populate spells, and show the reset button
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
		$('#spellbook-area .spellbook-button').text(availSpellCount - selectedSpellCount + ' Abilities Available');
	});
	$('#focus, #secondary-focus').on('change', function() {
		var curFocus = priFoci.val();
		if ( curFocus == "E2" ) {
			secFociSection.removeClass('hidden-section');
		} else {
			secFociSection.addClass('hidden-section');
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
		if ( $(this).hasClass('disabled-spell') ) {
			alert('You have selected the maximum number of abilities for Tier ' + curTier + '! Deselect abilities, or wait until you get to the next tier.');
		}
		$('#spellbook-area .spellbook-button').text(availSpellCount - selectedSpellCount + ' Abilities Available'); 
	});
	//Show spellbook modal on click
	$('.spellbook-button, #spellbook-background, #spellbook-wrapper').click( function(e) {
		if(e.target !== e.currentTarget) return;
		if ( $('#spellbook-background').hasClass('invisible-section') ) {
			$('#spellbook-background').removeClass('invisible-section');
		} else {
			$('#spellbook-background').addClass('invisible-section');
		}
	});
});