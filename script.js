var descriptors;
var descriptorsOptions;
var priSpecies;
var priSpeciesOptions;
var secSpecies;
var secSpeciesOptions;
var speciesOptions;
var types;
var typesOptions;
var elementalistType;
var genderFocusRow;
var priFoci;
var priFociOptions;
var secFoci;
var secFociOptions;
var fociOptions;
var extraAttributes;
var variantsSection;
var variants;
var variantsOptions;
var secFociSection;
var hybridSection;
var hybridButton;
var hybridTooltip;
var resetSection;
var resetButton;
var resetTooltip;
var spellBook;
var spellbookButton;
var loreButton;
var modalBackground;
var spellsList;
var actionsEnablersSection;
var talentsSection;
var spellHotbars;
var inventoryList;
var inventoryBody;
var curArc;
var curTier;
var spellListDatabase;
var availSpellCount;
var selectedSpellCount;
var isHovering;
//Check to see if user is currently using a touch device
function isTouchDevice() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}
//Add leading zeros to number strings
function leadZeros(number,places) {
  var zero = places - number.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + number;
}
//Disable or enable options based on current story arc
function setStoryArc(arc) {
	speciesOptions.add(typesOptions).each( function() {
		$(this).removeAttr('hidden');
		$(this).removeAttr('disabled');
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
//Hide any options that are marked as 'hidden' by the startup story arc function
function hideOptions(options) {
	options.each( function() {
		var isHidden = $(this)[0].hasAttribute('hidden');
		if( isHidden ) {
			$(this).hide();
		} else {
			$(this).show();
		}		
	});
}
//Enable and disable options based on variables
function disableOptions(target,array,conditional,otherTarget) {
	var targetVal;
	if ( otherTarget ) targetVal = otherTarget;
	else targetVal = target.val();
	if ( !conditional ) {
		if( $.inArray(targetVal,array) < 0 ) target.prop('disabled', true);
		else target.prop('disabled', false);
	} else {
		if( $.inArray(targetVal,array) > -1 ) target.prop('disabled', true);
		else target.prop('disabled', false);
	}
}
//Sort select field options function
function sortOptions(field,options) {
	options.sort(function(a,b) {
		if ( a.text.toLowerCase() > b.text.toLowerCase() ) return 1;
		else if ( a.text.toLowerCase() < b.text.toLowerCase() ) return -1;
		else return 0
	});
	field.empty().append(options).val('');
}
//Populate all of the active item select fields
function populateInventorySelect() {
	$('#equipment .equip select').chosen({
		disable_search: true,
		width: "78px"
	});
	$('#equipment .type select').chosen({
		disable_search: true,
		width: "123px"
	});
}
//Populate the contents of the species dropdown lists
function populateSpecies() {
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var availPriSpecies = $('#types option:selected').data('primary-species');
	var availSecSpecies = $('#types option:selected').data('secondary-species');
	var resSpecies = "";
	var resPriSpecies = $('#foci option:selected').data('restricted-species');
	var resSecSpecies = $('#secondary-foci option:selected').data('restricted-species');
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Reset disabled status of all species options before making changes
	speciesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted species,
	//restrict species based on that secondary focus
	if ( resSecSpecies ) resSpecies = resSecSpecies;
	else resSpecies = resPriSpecies;
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) resTypes = resSecTypes;
	else resTypes = resPriTypes;
	//If the type is selected, and there's no restrictions based on the selected focus
	if ( availPriSpecies && !resSpecies ) {
		var priArray = String(availPriSpecies);
		var secArray = String(availSecSpecies);
		if ( priArray ) priArray = priArray.split('');
		if ( secArray ) secArray = secArray.split('');
		priSpeciesOptions.each( function() {
			disableOptions($(this),priArray,false);			
		});
		secSpeciesOptions.each( function() {
			disableOptions($(this),secArray,false);				
		});
	//If the type is selected, and the selected focus has species restrictions
	} else if ( availPriSpecies && resSpecies ) {
		var priArray = String(availPriSpecies);
		var secArray = String(availSecSpecies);
		var speciesArray = String(resSpecies);
		if ( priArray ) priArray = priArray.split('');		
		if ( secArray ) secArray = secArray.split('');	
		if ( speciesArray ) speciesArray = speciesArray.split('');	
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if ( $.inArray(thisSpecies,priArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);								
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if ( $.inArray(thisSpecies,secArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);
		});
	//If the type is NOT selected, and the selected focus has species and type restrictions
	} else if ( !availPriSpecies && resSpecies && resTypes ) {
		var typeArray = resTypes;
		var speciesArray = String(resSpecies);
		if ( typeArray ) typeArray = typeArray.match(/.{1,2}/g);
		if ( speciesArray ) speciesArray = speciesArray.split('');
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
			if( $.inArray(thisSpecies,priSpeciesArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);						
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
		var typeArray = resTypes;
		if ( typeArray ) typeArray = typeArray.match(/.{1,2}/g);
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
			disableOptions($(this),priSpeciesArray,false);							
		});
		secSpeciesOptions.each( function() {
			disableOptions($(this),secSpeciesArray,false);								
		});
	//If the type is NOT selected, and the selected focus has species restrictions but no type restrictions
	} else if ( !availPriSpecies && resSpecies && !resTypes ) {
		var array = resSpecies;
		if ( array ) array = array.split('');
		speciesOptions.each( function() {
			disableOptions($(this),array,true);				
		});
	}
	//Disable the currently selected primary or secondary species based on the
	//respective selection in the other field, stopping users from double dipping
	if ( priSpeciesVal ) $('#secondary-species option[value=' + priSpeciesVal + ']').prop('disabled', true);
	if ( secSpeciesVal ) $('#species option[value=' + secSpeciesVal + ']').prop('disabled', true);
	//Do not display any options that are marked as 'hidden' by the startup story arc function
	hideOptions(speciesOptions);
	//Trigger an update of the contents of both species select fields
	priSpecies.trigger('chosen:updated');
	secSpecies.trigger('chosen:updated');
}
//Populate the contents of the type dropdown list
function populateTypes() {
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	var variantVal = variants.val();
	//Reset disabled status of types before making changes
	typesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) resTypes = resSecTypes;
	else resTypes = resPriTypes;
	//If there is a focus selected and no species selected
	if ( resTypes && !priSpeciesVal && !secSpeciesVal ) {
		var array = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			disableOptions($(this),array,true);
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
			disableOptions($(this),array,false,priSpeciesVal);
		});
	//If there is NO focus selected, but only the secondary species is selected
	} else if ( !resTypes && !priSpeciesVal && secSpeciesVal ) {
		typesOptions.each( function() {
			var array = String($(this).data('secondary-species'));
			if ( array ) { array = array.split(''); }
			disableOptions($(this),array,false,secSpeciesVal);
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
		if ( variantVal == 2 || !variantVal ) {
			elementalistType.prop('disabled', false);
		} else {
			elementalistType.prop('disabled', true);
		}
	}
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOptions(typesOptions);
	//Trigger an update of the contents	
	types.trigger('chosen:updated');
}
//Populate the contents of the focus dropdown lists
function populateFoci() {
	var typeVal = types.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var variantVal = variants.val();
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
				disableOptions($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is NOT selected, and only the secondary species is selected	
	} else if ( !typeVal && !priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,secSpeciesVal);
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
				disableOptions($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,priSpeciesVal);
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
				disableOptions($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,secSpeciesVal);
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
				disableOptions($(this),typesArray,true,typeVal);
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
				disableOptions($(this),typesArray,true,typeVal);
			}
		});
	}
	//If a Terrans are selected, only show Elementalist
	//foci if the correct genetic variation is selected
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		if ( variantVal != 2 && variantVal ) {
			fociOptions.each( function() {
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
	hideOptions(fociOptions);
	//Trigger an update of the contents
	priFoci.trigger('chosen:updated');
	secFoci.trigger('chosen:updated');
}
//Populate the contents of the genetic variations dropdown list for Terrans
function populateVariants() {
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var typeVal = types.val();
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
	if ( resSecTypes ) resTypes = resSecTypes;
	else resTypes = resPriTypes;
	//If user picks Terran, show genetic variations
	if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
		extraAttributes.removeClass('hidden-section');
		variantsSection.removeClass('hidden-section');
		$('#gender-focus').removeClass('last-row');
	} else {
		variants.val('');
		variantsSection.addClass('hidden-section');
		if ( extraAttributes.children(':visible').length == 0 ) {
			extraAttributes.addClass('hidden-section');
			genderFocusRow.addClass('last-row');
		}
	}
	//If the currently selected type or focus has to do with Elementalist
	//disabled all genetic variations exception for the one
	if ( resTypes ) {
		var typesArray = resTypes.match(/.{1,2}/g);
		if( $.inArray("A3",typesArray) < 0 ) resFocus = true;
		else resFocus = false;
	}
	if ( typeVal == "A3" || resFocus ) {
		variantsOptions.each( function() {
			if ( $(this).val() != 2 ) $(this).prop('disabled', true);
		});
	}
	variants.trigger('chosen:updated');
}
//Populate the spell list based on the currently selected options
function populateSpells() {
	var descriptorVal = descriptors.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var typeVal = types.val();
	var priFocusVal = priFoci.val();
	var secFocusVal = secFoci.val();
	var variantVal = variants.val();
	var selectedAttributes = [];
	spellsList = [];
	//If the value of the field is not blank,
	//add it to the array to look for spells
	if ( descriptorVal ) selectedAttributes.push("D" + descriptorVal);
	if ( priSpeciesVal && !secSpeciesVal ) selectedAttributes.push("S" + priSpeciesVal);
	else if ( !priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + secSpeciesVal);
	else if ( priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + String(priSpeciesVal) + String(secSpeciesVal));
	if ( typeVal ) selectedAttributes.push("T" + typeVal);
	if ( priFocusVal ) selectedAttributes.push("F" + priFocusVal);
	if ( secFocusVal ) selectedAttributes.push("F" + secFocusVal);
	if ( variantVal ) selectedAttributes.push("V" + variantVal);
	//Run through each field in the character attributes section
	//to retrieve any spells associated with that attribute
	$.each(selectedAttributes, function(index,curOption) {
		for (var i = 0; i < spellListDatabase.length; i++) {
			//Define variables for the current spell
			var spellName = spellListDatabase[i].name;
			var spellTier = spellListDatabase[i].tier;
			//Set the order of the spell in the flex-box by its Tier and name
			var spellOrder = parseInt(String(parseInt(spellTier) + 1) + leadZeros(parseInt(spellName.replace(/\s/g,'').toLowerCase().charCodeAt(0)) - 97,2) + leadZeros(parseInt(spellName.replace(/\s/g,'').toLowerCase().charCodeAt(1)) - 97,2));
			var spellID = spellListDatabase[i].id;
			var optionID = curOption.substring(1);
			var spellRequired = spellListDatabase[i].required.includes("TRUE");
			var typeCheck = spellListDatabase[i].type;
			var spellType = '<img src="images/' + typeCheck.toLowerCase() + '.png">';
			var spellDescription = spellListDatabase[i].description;
			var spellCost = spellListDatabase[i].cost;
			var spellCasttime = spellListDatabase[i].casttime;
			var spellDuration = spellListDatabase[i].duration;
			var spellRange = spellListDatabase[i].range;
			var spellCooldown = spellListDatabase[i].cooldown;
			var spellDamage = spellListDatabase[i].damage;
			var spellOrigin;
			switch ( curOption.charAt(0) ) {
				case "D":
				spellOrigin = $('#descriptors option[value="' + optionID + '"]').text();
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
					if ( spellListDatabase[i]["S" + priSpeciesID] == "TRUE" ) spellOrigin = $('#species option[value="' + priSpeciesID + '"]').text();
					else if ( spellListDatabase[i]["S" + secSpeciesID] == "TRUE" ) spellOrigin = $('#secondary-species option[value="' + secSpeciesID + '"]').text();
				} else {
					spellOrigin = $('#species option[value="' + optionID + '"]').text();
				}
				break;
				case "T":
				spellOrigin = $('#types option[value="' + optionID + '"]').text();
				break;
				case "F":
				if ( priFoci.val() != "E2" ) {
					spellOrigin = $('#foci option[value="' + optionID + '"]').text();
				} else {
					if ( spellListDatabase[i]["FE2"] == "TRUE" ) spellOrigin = $('#foci option[value="' + optionID + '"]').text();
					else spellOrigin = $('#secondary-foci option[value="' + optionID + '"]').text();
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
			if (( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && ['Action','Enabler','Talent','Select'].includes(typeCheck)) || ( !spellRequired && spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Passive" )) {
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier == 0 ) spellTier = '<div class="tier">Baseline</div>';
				else spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellCost ) spellCost = '<span><strong>Cost: </strong>' + spellCost + '</span>';
				if ( spellDuration ) spellDuration = '<span><strong>Duration: </strong>' + spellDuration + '</span>';
				if ( spellCasttime ) spellCasttime = '<span><strong>Requires: </strong>' + spellCasttime + '</span>';
				if ( spellRange ) spellRange = '<span><strong>Range: </strong>' + spellRange + '</span>';
				if ( spellCooldown ) spellCooldown = '<span><strong>Cooldown: </strong>' + spellCooldown + '</span>';
				if ( spellDamage ) spellDamage = '<span><strong>Damage: </strong>' + spellDamage + '</span>';
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell" style="order: ' + spellOrder + '">' +
						'<div class="header">' +
						'<h3>' +
						spellType +
						spellName +
						'</h3>' +
						spellTier +
						'</div>' +
						'<div class="details">' +
						'<div class="stats">' +
						spellCost +
						spellDuration +
						spellCasttime +
						spellRange +
						spellCooldown +
						'</div>' +
						'<div class="description">' +
						spellDescription +
						'</div>' +
						'<div class="stats">' +
						spellDamage +
						spellOrigin +
						'</div>' +
						'</div>' +
						'</div>'
					);
				}
				if ( spellRequired ) $('#' + spellID).addClass('required');
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Items" ) {
				//Variables specific to items
				var itemName = spellListDatabase[i].itemname;
				var itemValue = spellListDatabase[i].itemvalue;
				var itemWeight = spellListDatabase[i].itemweight;
				var itemDamage = spellListDatabase[i].itemdamage;
				var itemArmour = spellListDatabase[i].itemarmour;
				var itemLevel = spellListDatabase[i].itemlevel;
				var itemDepletion = spellListDatabase[i].itemdepletion;
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier == 0 ) spellTier = '<div class="tier">Baseline</div>';
				else spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( itemValue ) itemValue = '<span><strong>Value: </strong>' + itemValue + '₡</span>';
				if ( itemWeight ) itemWeight = '<span><strong>Carry Weight: </strong>' + itemWeight + '</span>';
				if ( itemDamage ) itemDamage = '<span><strong>Damage: </strong>' + itemDamage + '</span>';
				if ( itemArmour ) itemArmour = '<span><strong>Armour: </strong>' + itemArmour + '</span>';
				if ( itemLevel ) itemLevel = '<span><strong>Level: </strong>' + itemLevel + '</span>';
				if ( itemDepletion ) itemDepletion = '<span><strong>Depletion: </strong>' + itemDepletion + '</span>';
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell" style="order: ' + spellOrder + '">' +
						'<div class="header">' +
						'<h3>' +
						spellType +
						spellName +
						'</h3>' +
						spellTier +
						'</div>' +
						'<div class="details">' +
						'<div class="stats">' +
						itemLevel +
						itemValue +
						itemWeight +
						'</div>' +
						'<div class="description">' +
						spellDescription +
						'</div>' +
						'<div class="stats">' +
						itemDamage +
						itemArmour +
						itemDepletion +
						spellOrigin +
						'</div>' +
						'</div>' +
						'</div>'
					);
				}
				if ( spellRequired ) $('#' + spellID).addClass('required');
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && typeCheck == "Lore" ) {
				if ( $('#' + spellID).length <= 0 ) {
					$('#archives').append(
						'<div id="' + spellID + '" class="lore" style="order: ' + spellOrder + '">' +
						'<div class="header">' +
						'<h3>' +
						spellName +
						'</h3>' +
						'</div>' +
						'<div class="details">' +
						'<div class="description">' +
						spellDescription +
						'</div>' +
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
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) $(this).remove();
	});
	//Hide placeholder if there are spells or lore,
	//and show the filters in the spellbook
	$('.modal').each( function() {
		if ( $(this).find('.spell').length != 0 || $(this).find('.lore').length != 0 ) {
			$(this).find('.placeholder').addClass('hidden-section');
			$(this).find('.filters').removeClass('hidden-section');
		} else {
			$(this).find('.placeholder').removeClass('hidden-section');
			$(this).find('.filters').addClass('hidden-section');
		}
	});
	//Reset the selected spell count based
	//on the new selections made
	selectedSpellCount = $('.selected').length;
	//If filters were enabled, honor the filters
	//for any newly added spells
	filterButtons.each( function() {
		var spellState = $(this).attr('id');
		if ( $(this).hasClass('clicked') === false ) {
			if ( spellState != "available" ) $('#spellbook .spell.' + spellState).hide();
			else $('#spellbook .spell').not('.required, .selected').hide();
		}
	});
	populateSpellLists();
}
//Populate each individual spell list on the main character sheet
function populateSpellLists() {
	//Move each spell to their respective lists
	$('#spellbook .spell').each( function() {
		var spellID = $(this).attr('id');
		var spellOrder = String($(this).css('order'));
		var spellOrigin = $('.origin', this).text();
		var isEnabled = $(this).hasClass('required') || $(this).hasClass('selected');
		for (var i = 0; i < spellListDatabase.length; i++) {
			if ( spellListDatabase[i].id === spellID && isEnabled ) {
				var spellName = spellListDatabase[i].name;
				var tooltipName;
				var itemName = spellListDatabase[i].itemname;
				var spellTier = spellListDatabase[i].tier;
				var spellType = spellListDatabase[i].type;
				var spellTooltip = spellListDatabase[i].tooltip;
				var spellCasttime = spellListDatabase[i].casttime;
				var spellDuration = spellListDatabase[i].duration;
				var spellRange = spellListDatabase[i].range;
				var spellCooldown = spellListDatabase[i].cooldown;
				var spellDamage = spellListDatabase[i].damage;
				if ( spellTier == 0 ) spellTier = '<div class="tier">Baseline</div>';
				else spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellName ) tooltipName = '<h4 class="name">' + spellName + '</h4>';
				if ( spellDuration ) spellDuration = "<span>Lasts " + spellDuration + "</span>";
				if ( spellRange ) spellRange = "<span>" + spellRange + " range</span>";
				if ( spellCasttime ) spellCasttime = "<span>" + spellCasttime + "</span>";
				if ( spellDuration ) spellDuration = "<span>" + spellDuration + "</span>";
				if ( spellCooldown ) spellCooldown = "<span>" + spellCooldown + "</span>";
				//Action & enabler spell hotbars & tooltips
				if ( (spellType == "Action" || spellType == "Enabler") && ($('#actions-enablers .spell[data-spellid="' + spellID + '"]').length <= 0) ) {
					var spellCost = spellListDatabase[i].cost;
					actionsEnablersSection.append(
						'<div data-spellid="' + spellID + '" class="spell" style="order: ' + (String(spellOrder) + String(0)) + '">' +
						'<div class="wrapper">' +
						'<span>' +
						spellName +
						'</span>' +
						'<span>' +
						spellCost +
						'</span>' +
						'</div>' +
						'</div>'
					);
					actionsEnablersSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
						tooltipName + 
						spellTier +
						'<span>' +
						spellCost +
						'</span>' +
						spellCasttime +
						spellRange +
						spellDuration +
						spellCooldown +
						'<span class="description">' +
						spellTooltip +
						'</span>' +
						'<span class="type">' + 
						spellType +
						'</span>' +
						'<span class="origin">' +
						spellOrigin +
						'</span>' +
						'</div>'
					);
				//Talent spell hotbars & tooltips
				} else if ( spellType == "Talent" && $('#talents .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					talentsSection.append(
						'<div data-spellid="' + spellID + '" class="spell" style="order: ' + (String(spellOrder) + String(0)) + '">' +
						'<div class="wrapper">' +
						'<span>' +
						spellName +
						'</span>' +
						'</div>' +
						'</div>'
					);
					talentsSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
						'<h4 class="name">' +
						spellName +
						'</h4>' + 
						'<span class="tier">' +
						spellTier +
						'</span>' +
						'<span>' +
						spellRange +
						'</span>' +
						'<span>' +
						spellCasttime +
						'</span>' +
						'<span>' +
						spellDuration +
						'</span>' +
						'<span>' +
						spellCooldown +
						'</span>' +
						'<span class="description">' +
						spellTooltip +
						'</span>' +
						'<span class="type">' + 
						spellType +
						'</span>' +
						'<span class="origin">' +
						spellOrigin +
						'</span>' +
						'</div>'
					);
				//Add items to the iventory list
				} else if ( spellType == "Items" && $('#equipment tr[data-spellid="' + spellID + '"]').length <= 0 && itemName ) {
					var itemType = spellListDatabase[i].itemtype;
					var itemValue = spellListDatabase[i].itemvalue;
					var itemWeight = spellListDatabase[i].itemweight;
					var slotNumber = "slots";
					var itemDamage = spellListDatabase[i].itemdamage;
					var itemArmour = spellListDatabase[i].itemarmour;
					var itemLevel = spellListDatabase[i].itemlevel;
					var itemDepletion = spellListDatabase[i].itemdepletion;
					var selectThisType;
					if ( itemWeight == 1 ) slotNumber = "slot";
					switch ( itemType ) {
						case "Item":
						selectThisType = "IT";
						break;
						case "Light Weapon":
						selectThisType = "LW";
						break;
						case "Medium Weapon":
						selectThisType = "MW";
						break;
						case "Heavy Weapon":
						selectThisType = "HW";
						break;
						case "Light Armour":
						selectThisType = "LA";
						break;
						case "Medium Armour":
						selectThisType = "MA";
						break;
						case "Heavy Armour":
						selectThisType = "HA";
						break;
					}
					var addItem = 
						'<tr data-spellid="' + spellID + '">' +
						'<td class="arrow"></td>' +
						'<td class="equip">' +
						'<select>' +
						'<option selected value="S">Stashed</option>' +
						'<option value="R">Readied</option>' +
						'<option value="E">Equipped</option>' +
						'</select>' +
						'</td>' +
						'<td class="name">' +
						'<div contenteditable="true">' +
						itemName +
						'</div>' +
						'</td>' +
						'<td class="type">' +
						'<select>' +
						'<option></option>' +
						'<option selected value="IT">Item</option>' +
						'<option value="LW">Light Weapon</option>' +
						'<option value="MW">Heavy Weapon</option>' +
						'<option value="HW">Medium Weapon</option>' +
						'<option value="LA">Light Armour</option>' +
						'<option value="MA">Medium Armour</option>' +
						'<option value="HA">Heavy Armour</option>' +
						'</select>' +
						'</td>' +
						'<td class="value">' +
						'<div contenteditable="true">' +
						itemValue +
						'</div>' +
						'<div>&#8353;</div>' +
						'</td>' +
						'<td class="weight">' +
						'<div contenteditable="true">' +
						itemWeight +
						'</div>' +
						'<div>' +
						slotNumber +
						'</div>' +
						'</td>' +
						'<td class="delete">DELETE</td>' +
						'</td>' +
						'</tr>';
					$(addItem).insertAfter('#equipment table tr:first-child');
					populateInventorySelect();
					var thisItem = $('#equipment table tr[data-spellid="' + spellID + '"]');
					$('.type select', thisItem).val(selectThisType);
					$('.type select', thisItem).trigger('chosen:updated');
				}
			}
		}
	});
	//Remove any items or spells not in the current spelllist
	$('.spell-list .spell, #equipment tr, .tooltip').each( function() {
		var spellID = parseInt($(this).data('spellid'));
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) $(this).remove();
	});
	//Show the spell list section if there are spells in the list, otherwise hide it
	$('.hotbars').each(function() {
		if ( $(this).is(':empty') ) $(this).parent('.spell-list').addClass('hidden-section');
		else $(this).parent('.spell-list').removeClass('hidden-section');
	});
}
//Primary on load function
$(function() {
	descriptors = $('#descriptors');
	descriptorsOptions = $('#descriptors option');
	priSpecies = $('#species');
	secSpecies = $('#secondary-species');
	species = $('#species, #secondary-species');
	priSpeciesOptions = $('#species option');
	secSpeciesOptions = $('#secondary-species option');
	speciesOptions = $('#species option, #secondary-species option');
	types = $('#types');
	typesOptions = $('#types option');
	elementalistType = $('#types option[value="A3"]');
	genderFocusRow = $('#gender-focus');
	priFoci = $('#foci');
	secFoci = $('#secondary-foci');
	priFociOptions = $('#foci option');
	secFociOptions = $('#secondary-foci option');
	fociOptions = $('#foci option, #secondary-foci option');
	extraAttributes = $('#extra-attributes, #extra-attributes-header');
	variantsSection = $('#genetic-variation');
	variants = $('#genetic-variants');
	variantsOptions = $('#genetic-variants option');
	secFociSection = $('#second-focus');
	hybridSection = $('#hybrid-species');
	hybridButton = $('#hybrid-button div');
	hybridTooltip = $('#hybrid-tooltip');
	resetSection = $('#reset-button');
	resetButton = $('#reset-button div');
	resetTooltip = $('#reset-tooltip');
	spellBook = $('#spellbook');
	spellbookButton = $('#open-spellbook');
	filterButtons = $('#spellbook .filters .button');
	loreButton = $('#open-archives');
	spellModal = $('#spellbook-background');
	actionsEnablersSection = $('#actions-enablers');
	talentsSection = $('#talents');
	spellHotbars = $('.hotbars');
	inventoryList = $('#equipment table');
	inventoryBody = $('#equipment tbody')[0];
	//Initial variables
	curArc = 2;
	curTier = 6;
	spellListDatabase = [];
	availSpellCount = 4;
	selectedSpellCount = 0;
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
	//Set story arc to hide elements not in current arc
	setStoryArc(curArc);
	//Sort and then setup chosen.js dropdowns
	sortOptions(descriptors,descriptorsOptions);
	descriptors.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a descriptor",
		width: "100%"
	});
	sortOptions(priSpecies,priSpeciesOptions);
	priSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOptions(secSpecies,secSpeciesOptions);
	secSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOptions(types,typesOptions);
	types.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a type",
		width: "100%"
	});
	sortOptions(priFoci,priFociOptions);
	priFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	sortOptions(secFoci,secFociOptions);
	secFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	sortOptions(variants,variantsOptions);
	variants.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a variation",
		width: "100%"
	});
	//Populate inventory select dropdowns
	//and initate drag and drop
	populateInventorySelect();
	dragula([document.getElementById('actions-enablers')], {
		direction: 'vertical'
	}).on('drag', function(el,source) {
		//source.style.display = "block";
		el.style.order = "";
	}).on('drop', function(el,target,source,sibling) {
		var newOrder;
		var beforeLast = target.children.length - 2;
		if ( sibling ) newOrder = parseInt(sibling.style.order) - 1;
		else newOrder = parseInt(target.children[beforeLast].style.order) + 1;
		el.style.order = newOrder;
		//source.removeAttribute('style');
	});
	dragula([document.getElementById('talents')], {
		direction: 'vertical'
	}).on('drag', function(el,source) {
		//source.style.display = "block";
		el.style.order = "";
	}).on('drop', function(el,target,source,sibling) {
		var newOrder;
		var beforeLast = target.children.length - 2;
		if ( sibling ) newOrder = parseInt(sibling.style.order) - 1;
		else newOrder = parseInt(target.children[beforeLast].style.order) + 1;
		el.style.order = newOrder;
		//source.removeAttribute('style');
	});
	dragula([inventoryBody], {
		direction: 'vertical'
	});
	//[H] button to show or hide secondary species dropdown and reset its value
	hybridButton.click(function(){
		var priSpeciesVal = priSpecies.val();
		$(this).toggleClass('clicked');
		extraAttributes.removeClass('hidden-section');
		genderFocusRow.removeClass('last-row');
		hybridSection.toggleClass('hidden-section');
		if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
		secSpecies.val('');	
		//If the Hybrid button is clicked and terran is not the primary species,
		//hide and reset the genetic variation field
		if ( priSpeciesVal != 6 ) {
			variantsSection.addClass('hidden-section');
			variants.val('');
			if ( extraAttributes.children(':visible').length == 0 ) {
				extraAttributes.addClass('hidden-section');
				genderFocusRow.addClass('last-row');
			}
		}
		//Repopulate all of the fields after cliking the toggle
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
	//Does not affect hybrid toggle
	resetButton.click(function(){
		availSpellCount = 4;
		selectedSpellCount = 0;
		descriptors.val('');
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		variants.val('');
		secFociSection.addClass('hidden-section');
		resetSection.addClass('hidden-section');
		variantsSection.addClass('hidden-section');
		descriptors.trigger('chosen:updated');
		setStoryArc(curArc);
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
		loreButton.text('Lore');
		spellbookButton.text('Abilities');
		filterButtons.addClass('clicked');
		if ( extraAttributes.children(':visible').length == 0 ) extraAttributes.addClass('hidden-section');
	});
	//Populate relevant lists each time the select list is interacted
	//with, populate spells, and show the reset button
	descriptors.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpells();
	});
	species.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
		loreButton.text('New Lore');
	});
	function resetAbilityCounters() {
		if ( selectedSpellCount === availSpellCount ) {
			$('#spellbook .spell:not(.selected, .required)').addClass('disabled');
			$('#spellbook .filters #available').html('<div></div>&#10;Disabled');
		} else {
			$('#spellbook .spell').removeClass('disabled');
			$('#spellbook .filters #available').html('<div></div>&#10;Available');
		}
		if ( availSpellCount - selectedSpellCount === 0 ) spellbookButton.text('Abilities');
		else if ( availSpellCount - selectedSpellCount === 1 ) spellbookButton.text(availSpellCount - selectedSpellCount + ' Ability Available');
		else spellbookButton.text(availSpellCount - selectedSpellCount + ' Abilities Available');
	}
	types.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateFoci();
		populateVariants();
		populateSpells();
		resetAbilityCounters();
		loreButton.text('New Lore');
	});
	$('#foci, #secondary-foci').on('change', function() {
		var curFocus = priFoci.val();
		if ( curFocus == "E2" ) {
			extraAttributes.removeClass('hidden-section');
			secFociSection.removeClass('hidden-section');
			$('#gender-focus').removeClass('last-row');
		} else {
			secFociSection.addClass('hidden-section');
			secFoci.val('');
			if ( extraAttributes.children(':visible').length == 0 ) {
				extraAttributes.addClass('hidden-section');
				genderFocusRow.addClass('last-row');
			}
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
	spellBook.on('click', '.spell', function() {
		if ( $(this).hasClass('required') == false && $(this).hasClass('selected') == false && selectedSpellCount < availSpellCount ) {
			$(this).addClass('selected');
			++selectedSpellCount;
			if ( $('#spellbook .filters #selected').hasClass('clicked') == false ) {
				$(this).slideToggle(500);
			}
		} else if ( $(this).hasClass('required') == false && $(this).hasClass('selected') ) {
			$('.hotbars .spell[data-spellid="' + $(this).attr('id') + '"]').remove();
			$(this).removeClass('selected');
			--selectedSpellCount;
			if ( $('#spellbook .filters #available').hasClass('clicked') == false ) {
				$(this).slideToggle(500);
			}
		}
		resetAbilityCounters();
		populateSpellLists();
	});
	//Show modals on click
	$('#buttons .button, .modal-background, .modal, .modal-header .button').click( function(e) {
		if(e.target !== e.currentTarget) return;
		var modal;
		if ( $(this).attr('id') ) {
			modal = $(this).attr('id').replace('open-','')
			modal = $('#' + modal).closest('.modal-background');
		} else if ( $(this).hasClass('close') || $(this).hasClass('modal') ) {
			modal = $(this).closest('.modal-background');
		} else {
			modal = $(this);
		}
		if ( modal.hasClass('visible') ) {
			modal.removeClass('visible');
			$('body').css('overflow-y','auto');
		} else {
			modal.addClass('visible');
			$('body').css('overflow-y','hidden');
		}
		if ( $(this).attr('id') == "open-archives" ) loreButton.text('Lore');
	});
	filterButtons.click( function() {
		var spellState = $(this).attr('id');
		if ( spellState != "available" ) $('#spellbook .spell.' + spellState).slideToggle(500);
		else $('#spellbook .spell').not('.required, .selected').slideToggle(500);
		$(this).toggleClass('clicked');
	});
	//Show tooltips on hover when using a mouse
	//Show tooltips on click when using touch
	if ( isTouchDevice() ) {
		spellHotbars.on('click', '.spell', function() {
			var hotbar = $(this);
			var hotbarWidth = hotbar.width();
			var spellID = hotbar.data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			$('.tooltip:visible').not(tooltip).slideToggle(500);
			if (tooltip.is(':visible')) {
				hotbar.css('width', hotbarWidth);
				tooltip.slideToggle(500, function() {
					hotbar.css('width','');
					tooltip.appendTo($('body'));
				});
			} else {
				hotbar.css('width',hotbarWidth);
				tooltip.appendTo(hotbar);
				tooltip.css('width', hotbarWidth - 40);
				tooltip.slideToggle(500, function() {
					if ($(this).is(':visible')) $(this).css('display', 'flex');
					hotbar.css('width','');
					tooltip.css('width', hotbar.width() - 40 );
				});
			}
		});
		$( window ).resize(function() {
			var tooltip = $('.tooltip:visible');
			var hotbarWidth = tooltip.parent('.spell').width();
			tooltip.css('width', hotbarWidth - 40 );
		});
	} else {
		function tooltipPosition(targetElement,tooltip) {
			var fromLeft = targetElement.pageX - 20;
			var windowWidth = $(window).width();
			if ( fromLeft < 10 ) fromLeft = 10;
			else if ( fromLeft > windowWidth - (tooltip.width() + 30) ) fromLeft = windowWidth - (tooltip.width() + 30);
			tooltip.css('top', targetElement.pageY - (tooltip.height() + 35));
			tooltip.css('left', fromLeft);
			if ( !isHovering ) tooltip.addClass('visible');
		}
		spellHotbars.on('mouseenter', '.spell', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltipPosition(targetElement,tooltip);
		});
		spellHotbars.on('mouseleave', '.spell', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltip.removeClass('visible');
			isHovering = false;
		});
		spellHotbars.on('mousemove', '.spell', function(targetElement){
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			isHovering = true;
			tooltipPosition(targetElement,tooltip);
		});
		hybridButton.hover( function(targetElement){
			if ( hybridButton.hasClass('clicked') === false ) {
				tooltipPosition(targetElement,hybridTooltip);
			}
		}, function() {
			isHovering = false;
			hybridTooltip.removeClass('visible');
		});
		hybridButton.mousemove( function(targetElement){
			if ( hybridButton.hasClass('clicked') === false ) {
				isHovering = true;
				tooltipPosition(targetElement,hybridTooltip);
			}
		});
		resetButton.hover( function(targetElement){
			tooltipPosition(targetElement,resetTooltip);
		}, function() {
			isHovering = false;
			resetTooltip.removeClass('visible');
		});
		resetButton.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,resetTooltip);
		});
	}
	//Add item rows when clicking Add Item
	//Remove item rows when clicking X, but
	//add a new blank item if it's the last
	//item in the row
	function addItem() {
		inventoryList.append(
			'<tr>' +
			'<td class="arrow"></td>' +
			'<td class="equip">' +
				'<select>' +
					'<option selected value="S">Stashed</option>' +
					'<option value="R">Readied</option>' +
					'<option value="E">Equipped</option>' +
				'</select>' +
			'</td>' +
			'<td class="name">' +
				'<div contenteditable="true"></div>' +
			'</td>' +
			'<td class="type">' +
				'<select>' +
					'<option selected value="IT">Item</option>' +
					'<option value="LW">Light Weapon</option>' +
					'<option value="MW">Heavy Weapon</option>' +
					'<option value="HW">Medium Weapon</option>' +
					'<option value="LA">Light Armour</option>' +
					'<option value="MA">Medium Armour</option>' +
					'<option value="HA">Heavy Armour</option>' +
				'</select>' +
			'</td>' +
			'<td class="value">' +
				'<div contenteditable="true">0</div>' +
				'<div>&#8353;</div>' +
			'</td>' +
			'<td class="weight">' +
				'<div contenteditable="true">0</div>' +
				'<div>slots</div>' +
			'</td>' +
			'<td class="delete">DELETE</td>' +
		'</tr>'
		);
		populateInventorySelect();
	}
	inventoryList.on('click', '.delete', function () {
		$(this).closest('tr').remove();
		if ( $('#equipment tr').length == 1 ) {
			addItem();
		}
	});
	$('#add-item').click( function () {
		addItem();
		enableSortableInventory()
	});
	//Focus input fields when clicking on outter cells
	$('#equipment td').click( function() {
		$('div:first-child', this).focus();
	});
	//Update slots text in carry weight to reflect amount of slots
	$('#equipment .weight div:first-child').keyup(function() {
		if ( $(this).text() == 1 ) $(this).parent('.weight').children('div:last-child').html('slot &nbsp;');
		else $(this).parent('.weight').children('div:last-child').text('slots');
	});
});