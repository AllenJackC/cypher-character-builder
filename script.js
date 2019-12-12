var popupError;
var descriptors;
var descriptorsOptions;
var priSpecies;
var secSpecies;
var species;
var priSpeciesOptions;
var secSpeciesOptions;
var speciesOptions;
var types;
var typesOptions;
var elementalistType;
var genderFocusRow;
var priFoci;
var secFoci;
var priFociOptions;
var secFociOptions;
var foci;
var fociOptions;
var extraAttributes;
var secFociSection;
var hybridSection;
var hybridButton;
var hybridTooltip;
var resetSection;
var resetButton;
var resetTooltip;
var addSkillButton;
var skillError;
var skillList;
var skillsDeleteSpace;
var spellBook;
var spellbookButton;
var filterButtons;
var filterSearchBar;
var clearSearchButton;
var loreButton;
var enableCyberware;
var cyberwareTooltip;
var skillsSection;
var actionsSection;
var talentsSection;
var statusSection;
var spellHotbars;
var addCyberwareButton;
var cyberware;
var cyberError;
var cyberwareSection;
var cyberBodyParts;
var cyberwareImages;
var cyberwareDeleteSpace;
var addItemButton;
var inventoryList;
var inventoryBody;
var itemsDeleteSpace;
var addArtifactButton;
var artifactsList;
var artifactsBody;
var artifactsDeleteSpace;
var addNoteButton;
var notesList;
var notesBody;
var notesDeleteSpace;
var addContactButton;
var contactList;
var contactBody;
var contactDeleteSpace;
var firstDrag;
var periodCount;
var curArc;
var curTier;
var spellListDatabase;
var availSpellCount;
var selectedSpellCount;
var isHovering;
var removeAbility;
//Check if an integer is even
function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
}
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
		var array = String(resSpecies);
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
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOptions(typesOptions);
	//Trigger an update of the contents	
	types.trigger('chosen:updated');
}
//Populate the contents of the focus dropdown lists
function populateFoci() {
	var descriptorVal = descriptors.val();
	var typeVal = types.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
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
	//If the "Wealthy" descriptor is selected
	if ( descriptorVal === "M7" ) $('#foci option[value="E8"], #secondary-foci option[value="E8"]').prop('disabled', true);
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOptions(fociOptions);
	//Trigger an update of the contents
	priFoci.trigger('chosen:updated');
	secFoci.trigger('chosen:updated');
}
//Show extra attributes sections
function showExtraAttribute(section,width,animate) {
	if ( animate ) {
		section.stop().animate({
			'width' : width
		}, {
			duration: 300,
			start: function() {
				section.show();
			}
		});
	} else {
		section.css({
			'display' : 'block',
			'width' : width
		});
	}
}
//Hide extra attributes sections
function hideExtraAttribute(section,animate) {
	if ( animate ) {
		section.stop().animate({
			'width' : '0'
		}, {
			duration: 300,
			complete: function() {
				section.removeAttr('style');
			}
		});
	} else {
		section.removeAttr('style');
	}
}
//Populate the spell list based on the currently selected options
function populateSpells() {
	var descriptorVal = descriptors.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var typeVal = types.val();
	var priFocusVal = priFoci.val();
	var secFocusVal = secFoci.val();
	var selectedAttributes = [];
	spellsList = [];
	//If the value of the field is not blank,
	//add it to the array to look for spells
	if ( descriptorVal ) selectedAttributes.push("D" + descriptorVal);
	//If "Has More Money Than Sense" is selected, add the "Wealthy"
	//descriptor to the list of attributes
	if ( priFocusVal == "E8" || secFocusVal == "E8" ) selectedAttributes.push("DM7");
	if ( priSpeciesVal && !secSpeciesVal ) selectedAttributes.push("S" + priSpeciesVal);
	else if ( !priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + secSpeciesVal);
	else if ( priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + String(priSpeciesVal) + String(secSpeciesVal));
	//If character has specialization foci, don't push Type
	if ( typeVal && ['F8','G1','G2','G5','G6'].includes(priFocusVal) == false && ['F8','G1','G2','G5','G6'].includes(secFocusVal) == false ) selectedAttributes.push("T" + typeVal);
	//If character has "Infected" descriptor and selects "Ascension",
	//push "Recondite" type and "Worships Dark Beings" focus
	if ( $('#1768', spellBook).hasClass('selected') ) {
		selectedAttributes.push("TB0");
		selectedAttributes.push("FO7");
	};
	if ( priFocusVal ) selectedAttributes.push("F" + priFocusVal);
	if ( secFocusVal ) selectedAttributes.push("F" + secFocusVal);
	//Run through each field in the character attributes section
	//to retrieve any spells associated with that attribute
	$.each(selectedAttributes, function(index,curOption) {
		for (var i = 0; i < spellListDatabase.length; i++) {
			//Define variables for the current spell
			var hideThis = "";
			var optionalSpell = "";
			var spellName = spellListDatabase[i].name;
			var spellTier = spellListDatabase[i].tier;
			var spellRank = spellListDatabase[i].rank;
			var spellOptional = spellListDatabase[i].optional;
			var spellID = spellListDatabase[i].id;
			var optionID = curOption.substring(1);
			var typeCheck = spellListDatabase[i].type;
			var spellType = '<img src="images/' + typeCheck.toLowerCase() + '.png">';
			var isSelect;
			if ( typeCheck == "Select" ) isSelect = 0;
			else isSelect = 1;
			//Set the order of the spell in the flex-box by its Tier and name
			var spellOrder = parseInt(String(parseInt(spellTier) + 1) + String(isSelect) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97,2) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
			var spellDescription = spellListDatabase[i].description;
			var spellCost = spellListDatabase[i].cost;
			var spellCasttime = spellListDatabase[i].casttime;
			var spellDuration = spellListDatabase[i].duration;
			var spellRange = spellListDatabase[i].range;
			var spellCooldown = spellListDatabase[i].cooldown;
			var spellDice = spellListDatabase[i].dice;
			var itemName = spellListDatabase[i].itemname;
			var itemEffect = spellListDatabase[i].itemeffect;
			var spellOptional = spellListDatabase[i].optional;
			var spellOrigin;
			//Check to see if these values exist to avoid
			//empty line breaks in the spell card
			if ( spellName == "<hide>" || typeCheck == "Status" ) hideThis = " hidden-spell";
			if ( !spellRank ) spellRank = 7;
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
					if ( priFocusVal != "E2" ) {
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
			if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && ['Action','Talent','Select','Note','Skill','Status'].includes(typeCheck) && spellRank > curTier ) {
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				var skillProficiency = spellListDatabase[i].itemtype;
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellDuration ) spellDuration = '<span><strong>Duration:</strong> Lasts ' + spellDuration + '</span>';
				if ( spellCasttime ) spellCasttime = '<span><strong>Cast Time:</strong> Takes ' + spellCasttime + '</span>';
				if ( spellRange ) spellRange = '<span><strong>Range: </strong>' + spellRange + ' range</span>';
				if ( spellCooldown ) spellCooldown = '<span><strong>Cooldown: </strong>' + spellCooldown + '</span>';
				if ( spellDice ) spellDice = '<span><strong>Roll: </strong>' + spellDice + '</span>';
				if ( itemName && itemEffect == "<default>" ) itemName = ' data-default="' + itemName + '" ';
				if ( skillProficiency ) skillProficiency =  ' data-proficiency="' + skillProficiency + '" ';
				else itemName = "";
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '"' + itemName + skillProficiency + 'style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
								spellTier +
								'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									spellDuration +
									spellCasttime +
									spellRange +
									spellCooldown +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellDice +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Items" ) {
				//Variables specific to items
				var itemType = spellListDatabase[i].itemtype;
				var itemValue = spellListDatabase[i].itemvalue;
				if ( itemType == "Artifact" ) spellType = '<img src="images/artifact.png">';
				else spellType = '<img src="images/items.png">';
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( itemValue ) itemValue = '<span><strong>Value: </strong>' + itemValue + '₡</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									itemValue +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Contact" ) {
				//Variables specific to contacts
				var contactSkill = spellListDatabase[i].itemvalue;
				var contactType = spellListDatabase[i].itemtype;					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellName == "<hide>" ) hideThis = " hidden-spell";
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( contactSkill ) contactSkill = '<span><strong>Skills: </strong>' + contactSkill + '</span>';
				if ( contactType ) contactType = '<span><strong>Type: </strong>' + contactType + '</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									'<img src="images/contact.png">' +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									contactType +
									contactSkill +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Cyberware" ) {
				//Variables specific to cyberware
				var cyberwareLocation = spellListDatabase[i].itemtype;
				var cyberwareValue = spellListDatabase[i].itemvalue;
				var cyberwareType = spellListDatabase[i].itemlevel;
				spellType = '<img src="images/cyberware.png">';					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( cyberwareValue ) cyberwareValue = '<span><strong>Value: </strong>' + cyberwareValue + '₡</span>';
				if ( cyberwareType ) cyberwareType = '<span><strong>Type: </strong>' + cyberwareType + '</span>';
				if ( cyberwareLocation ) cyberwareLocation = '<span><strong>Location: </strong>' + cyberwareLocation + '</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell +'" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									cyberwareLocation +
									cyberwareType +
									cyberwareValue +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
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
	//If filters were enabled, honor the filters
	//for any newly added spells
	filterButtons.each( function() {
		var spellState = $(this).attr('id');
		if ( $(this).hasClass('clicked') === false ) {
			if ( spellState != "available" ) $('#spellbook .spell.' + spellState).hide();
			else $('#spellbook .spell').hide();
		}
	});
	//If there are select spells, update the abilities
	//button to prompt user to make selections
	if ( $('img[src$="images/select.png"]', spellBook).length != $('.selected', spellBook).length ) spellbookButton.text('Make Selections');
	else spellbookButton.text('New Abilities');
	populateSpellLists();
}
//Populate each individual spell list on the main character sheet
function populateSpellLists() {	
	//Move each spell to their respective lists
	$('#spellbook .spell').each( function() {
		var talentsVisible = talentsSection.parent('.spell-list').is(':visible');
		var actionsVisible = actionsSection.parent('.spell-list').is(':visible');
		var statusVisible = statusSection.parent('.spell-list').is(':visible');
		var skillsVisible = skillsSection.parent('.spell-list').is(':visible');
		var spellID = $(this).attr('id');
		var spellOrigin = '<span class="origin">' + $('.origin', this).text() + '</span>';
		for (var i = 0; i < spellListDatabase.length; i++) {
			if ( spellListDatabase[i].id === spellID ) {
				var spellName = spellListDatabase[i].name;
				var itemName = spellListDatabase[i].itemname;
				var spellTier = spellListDatabase[i].tier;
				var typeCheck = spellListDatabase[i].type;
				var spellTooltip = '<span class="description">' + spellListDatabase[i].tooltip + '</span>';
				var spellCasttime = spellListDatabase[i].casttime;
				var spellDuration = spellListDatabase[i].duration;
				var spellRange = spellListDatabase[i].range;
				var spellCooldown = spellListDatabase[i].cooldown;
				var spellDice = spellListDatabase[i].dice;
				var spellOptional = spellListDatabase[i].optional;
				var tooltipDice = '<span class="type">' + spellDice + '</span>';
				var spellOrder = parseInt(String(parseInt(spellTier) + 1) + '1' + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97,2) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
				var tooltipName = '<h4 class="name">' + spellName + '</h4>';
				var statusName = '<li>' + spellName + '</li>';
				spellName = '<span>' + spellName + '</span>';
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellDuration ) spellDuration = '<span>Lasts ' + spellDuration + '</span>';
				if ( spellRange ) spellRange = '<span>' + spellRange + ' range</span>';
				if ( spellCasttime ) spellCasttime = '<span>Takes ' + spellCasttime + '</span>';
				if ( spellCooldown ) spellCooldown = '<span>' + spellCooldown + ' cooldown</span>';
				if ( $('#' + spellID, spellBook).hasClass('selected') ) spellOptional = false;
				//Action spell hotbars & tooltips
				if ( !spellOptional && typeCheck == "Action" && ($('#actions .spell[data-spellid="' + spellID + '"]').length <= 0) ) {
					var spellCost = '<span class="spell-handle">' + spellListDatabase[i].cost + '</span>';
					if ( !spellDice ) tooltipDice = '<span class="type">Action</span>';
					var spellToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="spell">' +
							'<div class="wrapper">' +
								spellName +
								spellDice +
							'</div>' +
						'</div>';
					actionsSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip + 
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !actionsVisible ) {
						$(spellToAdd).appendTo(actionsSection).css('width','100%');
						actionsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(spellToAdd).appendTo(actionsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Talent spell hotbars & tooltips
				} else if ( !spellOptional && typeCheck == "Talent" && $('#talents .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					if ( !spellDice ) tooltipDice = '<span class="type">Trait</span>';
					var spellToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="spell">' +
							'<div class="wrapper">' +
								spellName +
							'</div>' +
						'</div>';
					talentsSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip +
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !talentsVisible ) {
						$(spellToAdd).appendTo(talentsSection).css('width','100%');
						talentsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(spellToAdd).appendTo(talentsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Status hotbars and tooltips
				} else if ( !spellOptional && typeCheck == "Status" && $('#status .status-effect[data-spellid="' + spellID + '"]').length <= 0 ) {
					if ( !spellDice ) tooltipDice = '<span class="type">Status</span>';
					var statusToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="status-effect">' +
							'<ul class="wrapper">' +
								statusName +
							'</ul>' +
						'</div>';
					statusSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip + 
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !statusVisible ) {
						$(statusToAdd).appendTo(statusSection).css('width','100%');
						statusSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(statusToAdd).appendTo(statusSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Update proficiency if skill already exists
				} else if ( !spellOptional && typeCheck == "Skill" && $('.spell[data-default="' + itemName + '"]', spellBook).length > 0 && $('#skills .spell[data-default="' + itemName + '"]').length > 0 ) {
					var skillsArray = [];
					var skillProficiency = 0;
					$('.spell[data-default="' + itemName + '"]', spellBook).each( function() {
						var thisProficiency = $(this).data('proficiency');
						switch (thisProficiency) {
							case "T":
								thisProficiency = 1;
							break;
							case "I":
								thisProficiency = -1;
							break;
							default:
								thisProficiency = 0;
						}
						skillsArray.push(thisProficiency);
					});
					for ( var j = 0; j < skillsArray.length; j++ ) skillProficiency += skillsArray[j];
					if ( skillProficiency > 0 ) skillProficiency = "+1d";
					else if ( skillProficiency < 0 ) skillProficiency = "-1d";
					else skillProficiency = "&#10022;";
					$('#skills .spell[data-default="' + itemName + '"] .proficiency').html(skillProficiency);
				//Add skills to the skill list
				} else if ( !spellOptional && typeCheck == "Skill" && $('#skills .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					var skillProficiency = spellListDatabase[i].itemtype;
					var customSkill = spellListDatabase[i].itemeffect;
					var skillSpellOrder = parseInt((parseInt(itemName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97) + leadZeros(parseInt(itemName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
					if ( customSkill == "<default>" ) {
						customSkill =  '" contenteditable="false"';
						defaultName = ' data-default="' + itemName + '"'
					} else {
						customSkill = ' editable" contenteditable="true"';
					}
					switch (skillProficiency) {
						case "T":
							skillProficiency = "+1d";
						break;
						case "I":
							skillProficiency = "-1d";
						break;
						default:
							skillProficiency = "&#10022;";
					}
					var skillToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + skillSpellOrder +'" class="spell"' + defaultName +'>' +
							'<div class="wrapper">' +
								'<div class="name' + customSkill + '">' + itemName + '</div>' +
								'<div class="proficiency">' + skillProficiency + '</div>' +
							'</div>' +
						'</div>';
					if ( !skillsVisible ) {
						$(skillToAdd).appendTo(skillsSection).css('width','100%');
						skillsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(skillToAdd).appendTo(skillsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Add items to the inventory list
				} else if ( !spellOptional && typeCheck == "Items" && $('#equipment tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var itemType = spellListDatabase[i].itemtype;
					var itemValue = spellListDatabase[i].itemvalue;
					var itemEffect = spellListDatabase[i].itemeffect;
					if ( itemType == "Artifact" ) {
						addArtifact(spellID,itemName,itemEffect);
					} else {
						var selectThisType;
						switch ( itemType ) {
							case "Weapon":
							selectThisType = "WE";
							break;
							case "Clothing":
							selectThisType = "CL";
							break;
							default:
							selectThisType = "IT";
						}
						addItem(spellID,itemName,itemValue,selectThisType);
						var thisItem = $('#equipment tr[data-spellid="' + spellID + '"]');
						$('.type select', thisItem).val(selectThisType);
						$('.type select', thisItem).trigger('chosen:updated');
					}
				//Add to contact list
				} else if ( !spellOptional && typeCheck == "Contact" && $('#contacts tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var contactType = spellListDatabase[i].itemtype;
					var contactSkill = spellListDatabase[i].itemvalue;
					var contactDescription = spellListDatabase[i].itemeffect;
					var selectThisType;
					switch ( contactType ) {
						case "Contact":
						selectThisType = "CT";
						break;
						case "Companion":
						selectThisType = "CP";
						break;
						default:
						selectThisType = "OT";
					}
					addContact(spellID,itemName,contactDescription,contactSkill);
					var thisContact = $('#contacts tr[data-spellid="' + spellID + '"]');
					$('.type select', thisContact).val(selectThisType);
					$('.type select', thisContact).trigger('chosen:updated');
				//Add cyberware to the cyberware
				} else if ( !spellOptional && typeCheck == "Cyberware" && $('#cyberware .cyberware[data-spellid="' + spellID + '"]').length <= 0 ) {
					var bodyPart = spellListDatabase[i].itemtype;
					var cyberwareLocation = bodyPart + "-cyberware";
					var cyberwareFunction = spellListDatabase[i].itemeffect;
					var cyberwareValue = spellListDatabase[i].itemvalue;
					var selectThisType;
					switch ( itemName ) {
						case "Weapon":
						selectThisType = "WE";
						break;
						default:
						selectThisType = "UT";
					}
					addCyberware(cyberwareLocation,spellID,cyberwareFunction,cyberwareValue);
					var thisCyberware = $('.cyberware[data-spellid="' + spellID + '"]');
					$('.type select', thisCyberware).val(selectThisType);
					$('.type select', thisCyberware).trigger('chosen:updated');
					var bodyPartImg = $('#cyber-mannequin img.' + bodyPart);
					bodyPartImg.addClass('modded');
					enableCyberware.addClass('clicked');
					if ( cyberware.is(':visible') == false ) cyberware.stop().slideToggle(200);
					if ( bodyPartImg.hasClass('active') == false ) bodyPartImg.attr('src',  'images/cyber'+ bodyPart + '-modded.png');
				} else if ( !spellOptional && typeCheck == "Note" && $('#notes tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var note = spellListDatabase[i].description;
					addNote(spellID,note);
				}
			}
		}
	});
	//Remove any items or spells not in the current spelllist
	$('.spell-list .spell, .spell-list .status-effect, .item-list tr, .tooltip, .cyberware').each( function() {
		var thisBar = $(this);
		var emptySpell = $('.name',thisBar).html();
		var thisHotbarList = thisBar.parent();
		var thisSpellList = thisBar.closest('.spell-list');
		var spellID = parseInt($(this).data('spellid'));
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) {
			if ( thisBar.hasClass('spell') || thisBar.hasClass('status-effect') ) {
				thisBar.stop().slideToggle({
					duration: 300,
					complete: function() {
						thisBar.remove();
						if ( thisSpellList.is(':visible') && thisHotbarList.is(':empty') ) thisSpellList.stop().slideToggle(200);
					}
				});
			} else if ( thisBar.hasClass('cyberware') ) {
				var bodyPart = thisBar.attr('class').split(' ')[1];
				var emptyMods = 0;
				thisBar.remove();
				for (var i = 0; i < $('.cyberware.' + bodyPart).length; i++) {
					emptyMods++;
				}
				if ( !emptyMods ) {
					$('#cyber-mannequin img.' + bodyPart).removeClass('modded');
					if ( $('#cyber-mannequin img.' + bodyPart).hasClass('active') == false ) $('#cyber-mannequin img.' + bodyPart).attr('src',  'images/cyber'+ bodyPart + '.png')
				}
			} else {
				thisBar.remove();
			}
		}
	});
	//Arrange spell hotbars so they don't take up too much vertical-space
	arrangeSpells();
	//If selectable option in select spells matches
	//an existing ability that is already trained
	//disable it
	$('.selectable', spellBook).each( function() {
		var skill = $(this).text().trim();
		var skillTrained;
		var skillExists = $('.spell[data-default="' + skill + '"]', skillList).length > 0;
		if ( skillExists ) skillTrained = $('.spell[data-default="' + skill + '"] .proficiency select', skillList).val();
		var selectedSkill = $(this).hasClass('selected');
		if ( skillExists && !selectedSkill & skillTrained == "T" ) $(this).addClass('disabled');
	});
}
//Populate all of the active item select fields
function populateInventorySelect() {
	$('#equipment .equip select').chosen({
		disable_search: true,
		width: "fit-content"
	});
	$('#equipment .type select').chosen({
		disable_search: true,
		width: "fit-content"
	});
}
//Add a blank item, unless variables are parsed
function addItem(spellID,itemName,itemValue,selectThisType) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemName ) itemName = "";
	if ( !itemValue ) itemValue = "";
	var itemToAdd =
		'<tr class="item"' + spellID + ' style="width: 0">' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="equip">' +
				'<select>' +
					'<option selected value="S">Stashed</option>' +
					'<option value="R">Readied</option>' +
					'<option value="E">Equipped</option>' +
				'</select>' +
			'</td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + itemName + '</div>' +
			'</td>' +
			'<td class="type">' +
				'<select>' +
					'<option selected value="IT">Item</option>' +
					'<option value="WE">Weapon</option>' +
					'<option value="CL">Clothing</option>' +
				'</select>' +
			'</td>' +
			'<td class="value">' +
				'<div class="editable" contenteditable="true">' + itemValue + '</div>' +
				'<div class="credits">&#8353;</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(itemToAdd).insertAfter('#equipment table tr:first-child');
	else inventoryList.append(itemToAdd);
	populateInventorySelect();
}
//Add a blank artifact, unless variables are parsed
function addArtifact(spellID,itemName,itemEffect) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemName ) itemName = "";
	if ( !itemEffect ) itemEffect = "";
	var artifactToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + itemName + '</div>' +
			'</td>' +
			'<td class="effect">' +
				'<div class="mobile-label">Effect:</div>' +
				'<div class="editable" contenteditable="true">' + itemEffect + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(artifactToAdd).insertAfter('#artifacts table tr:first-child');
	else artifactsList.append(artifactToAdd);
}
//Populate all of the active item select fields
function populateCyberwareSelect() {
	$('#cyberware .type select').chosen({
		disable_search: true,
		placeholder_text_single: "Select one",		
		width: "fit-content"
	});
}
//Add a blank cyberware, unless variables are parsed
function addCyberware(bodyPart,spellID,cyberwareFunction,cyberwareValue) {
	var contentEditable;
	var disabledSelect;
	if ( spellID ) {
		spellID = ' data-spellid="' + spellID + '"';
		contentEditable = false;
	} else {
		spellID = "";
		contentEditable = true;
	}
	if ( !cyberwareFunction ) cyberwareFunction = "";
	if ( !cyberwareValue ) cyberwareValue = "";
	var cyberwareToAdd =
		'<div class="cyberware ' + bodyPart.replace('-cyberware','') + '"' + spellID + '>' +
			'<div class="function">' +
				'<div class="cyber-label"><span class="blue-text">run</span> <span class="yellow-text">$</span>FUNCTION.<span class="red-text">exec</span><span class="mobile-handle">&#9776;</span></div>' +
				'<div class="text-wrapper">' +
					'<div contenteditable="true" class="editable">' + cyberwareFunction + '</div>' +
				'</div>' +
			'</div>' +
			'<div class="type">' +
				'<div class="cyber-label"><span class="blue-text">var</span> TYPE =</div>' +
				'<div class="text-wrapper">' +
					'<select>' +
						'<option></option>' +
						'<option value="WE">"Weapon"</option>' +
						'<option value="UT">"Utility"</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
			'<div class="value">' +
				'<div class="cyber-label"><span class="blue-text">print</span> VALUE</div>' +
				'<div class="text-wrapper">' +
					'<span class="blue-text">return</span> <div contenteditable="' + contentEditable + '" class="editable">' + cyberwareValue + '</div>&#8353;' +
				'</div>' +
			'</div>' +
		'</div>'
	$(cyberwareToAdd).appendTo($('#' + bodyPart)).slideToggle({
		duration: 300,
		complete: function() {
			$(this).css('min-height','130px');
		}
	});
	populateCyberwareSelect();
}
//Add a blank note, unless variables are parsed
function addNote(spellID,note) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !note ) note = "";
	var noteToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle hide-me"></td>' +
			'<td class="note">' +
				'<img class="pin mobile-handle" src="images/note-pin.png" />' +
				'<div class="editable" contenteditable="true">' + note + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(noteToAdd).insertAfter('#notes table tr:first-child');
	else notesList.append(noteToAdd);
}
//Populate dropdown for the contact type
function populateContactSelect() {
	$('#contacts .type select').chosen({
		disable_search: true,
		width: "fit-content"
	});
}
//Add a blank skill, unless variables are parsed
function addContact(spellID,contactName,contactDescription,contactSkill) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !contactName ) contactName = "";
	if ( !contactDescription ) contactDescription = "";
	if ( !contactSkill ) contactSkill = "";
	var contactToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="type">' +
				'<select>' +
					'<option selected value="CT">Contact</option>' +
					'<option value="CP">Companion</option>' +
					'<option value="OT">Other</option>' +
				'</select>' +
			'</td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + contactName + '</div>' +
			'</td>' +
			'<td class="effect">' +
				'<div class="mobile-label">Description:</div>' +
				'<div class="editable" contenteditable="true">' + contactDescription + '</div>' +
			'</td>' +
			'<td class="effect skill">' +
				'<div class="mobile-label">Skill:</div>' +
				'<div class="editable" contenteditable="true">' + contactSkill + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(contactToAdd).insertAfter('#contacts table tr:first-child');
	else contactList.append(contactToAdd);
	populateContactSelect();
}
function arrangeSpells() {
	if ( !isTouchDevice() ) {
		//Split Actions into columns of 10 or less
		if ( $('.spell', actionsSection).length >= 30 && $(window).width() >= 1000 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
			actionsSection.closest('item-list').css('width', '100%');
		} else if ( $('.spell', actionsSection).length >= 20 && $(window).width() >= 800 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr 1fr');
			if ( $(window).width() <= 1000 ) actionsSection.closest('item-list').css('width', '100%');
		} else if ( $('.spell', actionsSection).length >= 10 && $(window).width() >= 637 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr');
			if ( $(window).width() <= 800 ) actionsSection.closest('item-list').css('width', '100%');
		} else {
			actionsSection.css('grid-template-columns', '1fr');
		}
		//Split Talents into columns of 5 or less
		if ( $('.spell', talentsSection).length >= 30 && $(window).width() >= 1000 ) talentsSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
		else if ( $('.spell', talentsSection).length >= 20 && $(window).width() >= 800 ) talentsSection.css('grid-template-columns', '1fr 1fr 1fr');
		else if ( $('.spell', talentsSection).length >= 10 && $(window).width() >= 637 ) talentsSection.css('grid-template-columns', '1fr 1fr');
		else talentsSection.css('grid-template-columns', '1fr');
		//Split Status Effects into columns of 5 or less
		if ( $('.status-effect', statusSection).length >= 30 && $(window).width() >= 1000 ) statusSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
		else if ( $('.status-effect', statusSection).length >= 20 && $(window).width() >= 800 ) statusSection.css('grid-template-columns', '1fr 1fr 1fr');
		else if ( $('.status-effect', statusSection).length >= 10 && $(window).width() >= 637 ) statusSection.css('grid-template-columns', '1fr 1fr');
		else statusSection.css('grid-template-columns', '1fr');
	//If touch device, just one column to avoid tooltips
	//moving stuff around too much
	} else {
		actionsSection.css('grid-template-columns', '1fr');
		talentsSection.css('grid-template-columns', '1fr');
		statusSection.css('grid-template-columns', '1fr');
	}
}
//Primary on load function
$(function() {
	popupError = $('#popup-error');
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
	foci = $('#foci, #secondary-foci');
	fociOptions = $('#foci option, #secondary-foci option');
	extraAttributes = $('#extra-attributes');
	secFociSection = $('#second-focus');
	hybridSection = $('#hybrid-species');
	hybridButton = $('#hybrid-button div');
	hybridTooltip = $('#hybrid-tooltip');
	resetSection = $('#reset-button');
	resetButton = $('#reset-button div');
	resetTooltip = $('#reset-tooltip');
	addSkillButton = $('#add-skill');
	spellBook = $('#spellbook');
	spellbookButton = $('#open-spellbook');
	filterButtons = $('.filters .button');
	loreButton = $('#open-archives');
	enableCyberware = $('#enable-cyberware');
	cyberwareTooltip = $('#cyberware-tooltip');
	skillsSection = $('#skills');
	actionsSection = $('#actions');
	talentsSection = $('#talents');
	statusSection = $('#status');
	spellHotbars = $('.spell-list .hotbars');
	addCyberwareButton = $('.add-cyberware');
	cyberware = $('#cyberware');
	cyberError = $('#cyberware .error');
	cyberwareSection = $('#cyber-mods');
	cyberBodyParts = $('.cyber-section');
	cyberwareImages = $('#cyber-mannequin img');
	cyberwareDeleteSpace = $('#cyberware .delete-space');
	addItemButton = $('#add-item');
	inventoryList = $('#equipment table');
	inventoryBody = $('#equipment tbody');
	itemsDeleteSpace = $('#equipment .delete-space');
	addArtifactButton = $('#add-artifact');
	artifactsList = $('#artifacts table');
	artifactsBody = $('#artifacts tbody');
	artifactsDeleteSpace = $('#artifacts .delete-space');
	addContactButton = $('#add-contact');
	contactList = $('#contacts table');
	contactBody = $('#contacts tbody');
	contactDeleteSpace = $('#contacts .delete-space');
	addNoteButton = $('#add-note');
	notesList = $('#notes table');
	notesBody = $('#notes tbody');
	notesDeleteSpace = $('#notes .delete-space');
	firstDrag = true;
	periodCount = 0;
	//Initial variables
	curArc = 2;
	curTier = 6;
	spellListDatabase = [];
	//Setup spell list database
	Tabletop.init({
		key: 'https://docs.google.com/spreadsheets/d/1NWFhf8_oT5lvrNEN7cTAmRYnDHzGkD3Mw2P5nODXaCQ/edit?usp=sharing',
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
	//Populate inventory & skills select dropdowns
	//and initate drag and drop
	populateCyberwareSelect();
	populateInventorySelect();
	populateContactSelect();
	//Cyberware Dragula
	var cyberwareDrake = dragula([cyberwareDeleteSpace[0]],{
			isContainer: function(el) {
				return el.classList.contains('cyber-section');
			}, moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}, accepts: function (el,target,source,sibling) {
				if ( target.classList.contains('cyber-section') && target != source ) return false;
				else if ( el.hasAttribute('data-spellid') && target.classList.contains('delete-space') ) return false;
				else if ( sibling === null || sibling.classList.contains('cyberware') ) return true;
			}
		}).on('drag', function(el,source) {
			if ( el.hasAttribute('data-spellid') && cyberError.is(':visible') == false ) {
				cyberError.text('Cyberware granted by character attributes cannot be removed');
				cyberError.stop().slideToggle(150);
			} else {
				cyberwareDeleteSpace.stop().slideToggle(150);
			}
			if ( firstDrag ) firstDrag = false;
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				cyberwareDeleteSpace.stop().animate({
					'height' : $('.gu-transit').height
				}, 150);
				cyberwareDeleteSpace.css('margin-top', String(parseInt($('.gu-transit').css('height').replace('px','')) + 40) + 'px');
			} else {
				cyberwareDeleteSpace.stop().animate({
					'height' : '185px'
				}, 150);
				cyberwareDeleteSpace.css('margin-top', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				cyberwareDrake.remove();
				var bodyPart = el.classList[1];
				var emptyMods = 0;
				for (var i = 0; i < $('.cyberware.' + bodyPart).length; i++) {
					emptyMods++;
				}
				if ( !emptyMods ) $('#cyber-mannequin img.' + bodyPart).removeClass('modded');
				if ( isTouchDevice() && $('.cyberware').length === 0 ) $('#cyberware-option em').hide();
			}
			if ( cyberError.is(':visible') ) cyberError.stop().slideToggle(300);			
			else if ( cyberwareDeleteSpace.is(':visible') ){
				cyberwareDeleteSpace.stop().animate({
					'margin-top' : '10px',
					'height' : '185px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			if ( cyberError.is(':visible') ) cyberError.stop().slideToggle(300);
			else if ( cyberwareDeleteSpace.is(':visible') ) {
				cyberwareDeleteSpace.stop().animate({
					'height' : '185px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		});
	cyberwareDrake;
	//Inventory Dragula
	var itemsDrake = dragula([inventoryBody[0], itemsDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			itemsDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( inventoryBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "169px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( inventoryBody.children('tr:first-child').is(':visible') ) {
					itemsDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					inventoryList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(inventoryBody.children().length) || addItemButton.css('width') == "40px" ) inventoryList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else inventoryList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				itemsDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				inventoryList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addItem();
						inventoryList.removeAttr('style');
				} else {
					inventoryList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				itemsDrake.remove();
			} else {
				inventoryList.removeAttr('style');
			}
			itemsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			itemsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	itemsDrake;
	//Artifacts Dragula
	var artifactsDrake = dragula([artifactsBody[0], artifactsDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			artifactsDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( artifactsBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "76px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( artifactsBody.children('tr:first-child').is(':visible') ) {
					artifactsDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					artifactsList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(artifactsBody.children().length) || addArtifactButton.css('width') == "40px" ) artifactsList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else artifactsList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				artifactsDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				artifactsList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addArtifact();
						artifactsList.removeAttr('style');
				} else {
					artifactsList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				artifactsDrake.remove();
			} else {
				artifactsList.removeAttr('style');
			}
			artifactsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			artifactsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	artifactsDrake;
	//Contacts Dragula
	var contactDrake = dragula([contactBody[0], contactDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			contactDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( contactBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "161px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( contactBody.children('tr:first-child').is(':visible') ) {
					contactDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					contactList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(contactBody.children().length) || addContactButton.css('width') == "40px" ) contactList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else contactList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				contactDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				contactList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addContact();
						contactList.removeAttr('style');
				} else {
					contactList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				contactDrake.remove();
			} else {
				contactList.removeAttr('style');
			}
			contactDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			contactDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	contactDrake;
	//Notes Dragula
	var notesDrake = dragula([notesBody[0], notesDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			notesDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( notesBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "38px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				notesDeleteSpace.stop().animate({
					'height' : $('.gu-transit').css('height')
				}, 150);
				if ( notesBody.children('tr:first-child').is(':visible') ) {
					notesList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					notesList.css('padding-bottom', $('.gu-transit').outerHeight(true));
				}
			} else {
				notesDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				notesList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addNote();
						notesList.removeAttr('style');
				} else {
					notesList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				notesDrake.remove();
			} else {
				notesList.removeAttr('style');
			}
			notesDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			notesDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	notesDrake;
	//Close error pop-up if OK button is clicked
	$('.button', popupError).click( function() {
		popupError.stop().slideToggle(300);
	});
	//[H] button to show or hide secondary species dropdown and reset its value
	hybridButton.click(function(){
		var priSpeciesVal = priSpecies.val();
		var extraAttributesVisible = extraAttributes.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		$(this).toggleClass('clicked');
		//Show the section and show the hybrid selector
		if ( !extraAttributesVisible ) {
			showExtraAttribute(hybridSection,"145px",false);
			extraAttributes.stop().slideToggle({
				duration: 300,
				start: function() {
					genderFocusRow.removeClass('last-row');
				}
			});
		//Show the hybrid selector if it's not showing
		} else if ( !hybridVisible ) {
			showExtraAttribute(hybridSection,"145px",true);
		//If no other attributes are showing except the hybrid selector
		} else if ( hybridVisible && !secFociVisible ) {
			extraAttributes.stop().slideToggle({
				duration: 300,
				done: function() {
					secSpecies.val('');
					hideExtraAttribute(hybridSection,false);
					genderFocusRow.addClass('last-row');
				}
			});
		//If only the secondary foci and hybrid selectors are showing
		} else if ( hybridVisible && secFociVisible ) {
			secSpecies.val('');
			hideExtraAttribute(hybridSection,true);
		}
		//Repopulate all of the fields after cliking the toggle
		populateSpecies();
		populateTypes();
		populateFoci();
		//If only the secondary species is selected when clicked, hide the reset button
		if ( secSpecies.val() && !priSpeciesVal && !types.val() ) resetSection.addClass('hidden-section');
	});
	//Reset button to reset all values and hide extra sections
	//Does not affect hybrid toggle
	resetButton.click(function(){
		var extraAttributesVisible = extraAttributes.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		availSpellCount = 4;
		selectedSpellCount = 0;
		descriptors.val('');
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		resetSection.addClass('hidden-section');
		descriptors.trigger('chosen:updated');
		setStoryArc(curArc);
		populateSpecies();
		populateTypes();
		populateFoci();
		$('.selected', spellBook).removeClass('selected');
		populateSpells();
		loreButton.text('Lore');
		spellbookButton.text('Abilities');
		filterButtons.addClass('clicked');
		if ( hybridVisible ) {
			if ( secFociVisible ) hideExtraAttribute(secFociSection,true);
		} else if ( extraAttributesVisible ) {
			extraAttributes.stop().slideToggle({
				duration: 300,
				start: function() {
					if ( secFociVisible ) hideExtraAttribute(secFociSection,false);
					genderFocusRow.removeClass('last-row');
				}
			});
		}
	});
	//Populate relevant lists each time the select list is interacted
	//with, populate spells, and show the reset button
	descriptors.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateFoci();
		populateSpells();
	});
	species.on('change', function() {
		var priSpeciesVal = priSpecies.val();
		var secSpeciesVal = secSpecies.val();
		var extraAttributesVisible = extraAttributes.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateSpells();
		loreButton.text('New Lore');
	});
	types.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateFoci();
		populateSpells();
		loreButton.text('New Lore');
	});
	foci.on('change', function() {
		var extraAttributesVisible = extraAttributes.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		var curFocus = priFoci.val();
		//If user picks Forges a New Bond, show second focus
		if ( curFocus == "E2" && $(this).attr('id') == "foci" ) {
			if ( !extraAttributesVisible ) {
				showExtraAttribute(secFociSection,"241px",false);
				extraAttributes.stop().slideToggle({
					duration: 300,
					start: function() {
						genderFocusRow.removeClass('last-row');
					}
				});
			//Show the second focus selector if it's not showing
			} else if ( !secFociVisible ) {
				showExtraAttribute(secFociSection,"241px",true);
			//If no other attributes are showing except the second focus selector
			} else if ( secFociVisible && !hybridVisible ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						secFoci.val('');
						hideExtraAttribute(secFociSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If either of the other selectors are showing
			} else if ( secFociVisible && hybridVisible ) {
				secFoci.val('');
				hideExtraAttribute(secFociSection,true);
			}
		} else if ( $(this).attr('id') == "foci" ) {
			if ( secFociVisible && !hybridVisible ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						secFoci.val('');
						hideExtraAttribute(secFociSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If either of the other selectors are showing
			} else if ( secFociVisible && hybridVisible ) {
				secFoci.val('');
				hideExtraAttribute(secFociSection,true);
			}
		}
		//If "Has More Money Than Sense" focus is selected
		if ( curFocus === "E8" || secFoci.val() === "E8" ) {
			$('#descriptors option[value="M7"]').prop('disabled', true);
			descriptors.trigger('chosen:updated');
		} else {
			$('#descriptors option[value="M7"]').prop('disabled', false);
			descriptors.trigger('chosen:updated');
		}
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateSpells();
	});
	//Toggle optional character options
	$('#open-options').click( function() {
		$('#character-options').stop().slideToggle({
			duration: 300, 
			start: function() {
				$(this).css('display', 'flex');
			}
		});
	});
	//Show cyberware section tracker
	//but only when no cyberware is installed
	enableCyberware.click( function() {
		if ( $('.cyberware').length === 0 ) {
			$(this).toggleClass('clicked');
			cyberware.stop().slideToggle(500);
		}
	});
	//Focus editable div fields when clicking on outter cells
	$('.item-list, #skills, #cyberware').on('click', 'td, div.spell, div.text-wrapper', function() {
		$('.editable', this).focus();
	});
	//Re-order skills on focus loss
	$('#skills').on('blur', '.editable', function() {
		var skillName = $(this).html();
		var newOrder = parseInt((parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97) + leadZeros(parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
		$(this).closest('.spell').css('order', newOrder);
	});
	//Add skills when respective button is clicked
	addSkillButton.click( function() { addSkill(); });
	//Add notes and items when respective button is clicked
	addItemButton.click( function() { addItem(); });
	addArtifactButton.click( function() { addArtifact(); });
	addContactButton.click( function() { addContact(); });
	addNoteButton.click( function() { addNote(); });
	addCyberwareButton.click( function() { 
		var bodyPart = $(this).closest('.cyber-section').attr('id').replace('-cyberware','');
		addCyberware($(this).closest('.cyber-section').attr('id'));
		$('#cyber-mannequin img.' + bodyPart).addClass('modded');
		if ( isTouchDevice() ) $('#cyberware-option em').show();
	});	
	statusSection.on('click', '.status-effect', function() {
		$(this).toggleClass('active');
	});
	//Filter inputs for value fields
	$('.item-list').on('keydown blur paste', '.value .editable', function(e){
		var thisVal = $(this).html();
		var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([116,9,46,8,37,38,39,40].indexOf(e.keyCode) != -1);
        var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >=96 && e.keyCode <= 105);
        var vKey = 86, cKey = 67, aKey = 65;
		var isPeriodKey = [190].indexOf(e.keyCode) != -1;
		periodCount = 0;
		for (i = 0; i < thisVal.length; i++) {
			if (thisVal[i] == ".") periodCount++;
		}
		var onePeriod = periodCount === 0;
        switch(true){
            case isCursorMoveOrDeleteAction:
            case isModifierkeyPressed == false && isNumKeyPressed:
            case (e.metaKey || e.ctrlKey) && ([vKey,cKey,aKey].indexOf(e.keyCode) != -1):
			case isPeriodKey && onePeriod:
                break;
            default:
                e.preventDefault();
        }
	});
	//Highlight currently selected body part
	//and show the section to the right
	cyberwareImages.click( function() {
		var bodyPart = $(this).attr('class').split(' ')[0];
		var thisSection = $('#' + bodyPart + '-cyberware');
		$('#' + bodyPart + '-cyberware').stop().slideToggle(300);
		$(this).toggleClass('active');
		if ( $(this).hasClass('active') ) $(this).attr('src',  'images/cyber'+ bodyPart + '-hover.png');
		else if ( $(this).hasClass('modded') && $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ bodyPart + '-modded.png');
		else $(this).attr('src',  'images/cyber'+ bodyPart + '.png');
		if ( $('#cyber-mods > div:not(#cyber-intro):visible').length === 1 ) $('#cyber-intro').stop().slideToggle(300);
		else if ( $('#cyber-intro').is(':visible') ) $('#cyber-intro').stop().slideToggle(300);
	});
	//Show modals on click
	$('#buttons .modal-button, .modal-background, .modal, .modal-header .close.button').click( function(e) {
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
			$('.spell.disabled', modal).hide();
		} else {
			modal.addClass('visible');
			$('body').css('overflow-y','hidden');
		}
		if ( $(this).attr('id') == "open-archives" ) loreButton.text('Lore');
		if ( $(this).text().trim() == "New Abilities" ) spellbookButton.text('Abilities');
	});
	//Filter spells in spellbook based on selection
	filterButtons.click( function() {
		var thisButton = $(this);
		var thisModal = $(this).closest('.modal');
		var filter = $(this).attr('id');
		var tier;
		switch (filter) {
			case "filter-tier1":
				tier = "Tier 1";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier3":
				tier = "Tier 3";
			break;
			case "filter-tier4":
				tier = "Tier 4";
			break;
			case "filter-tier5":
				tier = "Tier 5";
			break;
			case "filter-tier6":
				tier = "Tier 6";
			break;
		}
		if ( filter.indexOf('filter') > -1 ) {
			$('.spell', thisModal).each( function() {
				var spellTier = $('.tier', this).text();
				if ( (spellTier === tier) && ($(this).hasClass(filter) || $(this).hasClass('hidden') == false) ) {
					$(this).stop().slideToggle(500, function() {
						$(this).toggleClass('hidden ' + filter);
					});
				}
			});
		} 
		thisButton.toggleClass('clicked');
	});
	//Add optional spells to item lists once selected
	spellBook.on('click', 'li.selectable', function() {
		var spellList = $(this).closest('ul');
		spellList.children('li.selectable').not(this).addClass('disabled');
		$(this).addClass('selected');
		spellList.children('li.selectable').each( function() {
			var spellID = $(this).data('spellid');
			var isSelected = $(this).hasClass('selected');
			if ( spellID.length > 4 ) {
				spellID = spellID.split(',');
				for (i = 0; i < spellID.length; i++) {
					if ( !isSelected ) $('#' + spellID[i], spellBook).addClass('disabled');
					else $('#' + spellID[i], spellBook).addClass('selected');
				}
			} else {
				if ( !isSelected ) $('#' + spellID, spellBook).addClass('disabled');
				else $('#' + spellID, spellBook).addClass('selected');
			}
		});
		populateSpells();
		if ( $('img[src$="images/select.png"]', spellBook).length === $('.selected', spellBook).length ) spellbookButton.text('Abilities');
	});
	//Re-arrange spell hotbars when window is resized
	$( window ).resize(function() {arrangeSpells();});
	//Listeners for mobile vs listeners for desktop
	if ( isTouchDevice() ) {
		//Show a sliding tooltip on click
		spellHotbars.on('click', '.spell, .status-effect', function() {
			var hotbar = $(this);
			var spellID = hotbar.data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			//$('.tooltip:visible').not(tooltip).stop().slideToggle(500);
			if (tooltip.is(':visible')) {
				tooltip.stop().slideToggle(500, function() {
					tooltip.appendTo($('body'));
				});
			} else {
				tooltip.appendTo(hotbar);
				tooltip.stop().slideToggle({
					duration: 500,
					start: function() {
						tooltip.css('display','flex');
					}
				});
			}
		});
		$( window ).resize(function() {
			var tooltip = $('.tooltip:visible');
			var hotbarWidth = tooltip.parent('.spell').width();
			tooltip.css('width', hotbarWidth - 40 );
		});
	} else {
		//Highlight the current bodypart on mouseover
		$('#cyber-mannequin img').hover( function() {
			var thisSection = $(this).attr('class').split(' ')[0];
			if ( $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ thisSection + '-hover.png');
		}, function() {
			var thisSection = $(this).attr('class').split(' ')[0];
			if ( $(this).hasClass('modded') && $(this).hasClass('active') == false) $(this).attr('src',  'images/cyber'+ thisSection + '-modded.png');
			else if ( $(this).hasClass('modded') == false && $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ thisSection + '.png');
		});
		//Show tooltips on hover
		function tooltipPosition(targetElement,tooltip) {
			var fromLeft = targetElement.pageX - 20;
			var windowWidth = $(window).width();
			if ( fromLeft < 10 ) fromLeft = 10;
			else if ( fromLeft > windowWidth - (tooltip.width() + 30) ) fromLeft = windowWidth - (tooltip.width() + 30);
			tooltip.css('top', targetElement.pageY - (tooltip.height() + 35));
			tooltip.css('left', fromLeft);
			if ( !isHovering ) tooltip.addClass('visible');
		}
		spellHotbars.on('mouseenter', '.spell, .status-effect', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltipPosition(targetElement,tooltip);
		});
		spellHotbars.on('mouseleave', '.spell, .status-effect', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltip.removeClass('visible');
			isHovering = false;
		});
		spellHotbars.on('mousemove', '.spell, .status-effect', function(targetElement){
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
		enableCyberware.hover( function(targetElement){
			tooltipPosition(targetElement,cyberwareTooltip);
			if ( $('.cyberware').length ) $('em', cyberwareTooltip).css('display','block');
			else $('em', cyberwareTooltip).css('display','none')
		}, function() {
			isHovering = false;
			cyberwareTooltip.removeClass('visible');
		});
		enableCyberware.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,cyberwareTooltip);
		});
	}
});