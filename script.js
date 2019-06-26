var popupError;
var descriptors;
var descriptorsOptions;
var priSpecies;
var priSpeciesOptions;
var secSpecies;
var secSpeciesOptions;
var species;
var speciesOptions;
var types;
var typesOptions;
var elementalistType;
var genderFocusRow;
var priFoci;
var priFociOptions;
var secFoci;
var secFociOptions;
var foci;
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
var curMightVal;
var maxMightVal;
var curSpeedVal;
var maxSpeedVal;
var curIntellectVal;
var maxIntellectVal;
var mightOverflow;
var speedOverflow;
var intellectOverflow;
var poolAddPoint;
var poolRemovePoint;
var mightEdge;
var speedEdge;
var intellectEdge;
var edgeAddPoint;
var edgeRemovePoint;
var commitSection;
var commitButton;
var essenceStat;
var effortStat;
var availPoolStat;
var availEdgeStat;
var addSkillButton;
var skillError;
var skillList;
var skillsDeleteSpace;
var spellBook;
var spellbookButton;
var loreButton;
var enableCyberware;
var cyberwareTooltip;
var modalBackground;
var spellsList;
var actionsEnablersSection;
var talentsSection;
var spellHotbars;
var mannequinState;
var addCyberwareButton;
var cyberError;
var cyberware;
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
var curArc;
var curTier;
var availPoints;
var spentPoints;
var	availEdge;
var spentEdge;
var	curEffort;
var	curEssence;
var spellListDatabase;
var availSpellCount;
var selectedSpellCount;
var firstDrag;
var containerHeight;
var defaultContainerHeight;
var isHovering;
var periodCount;
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
//Reset spell counters to their default value when selecting or deselecting spells
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
//Populate all of the active skill select fields
function populateSkillsSelect() {
	$('#skills .proficiency select').chosen({
		disable_search: true,
		width: "fit-content"
	});
}
//Add a blank skill, unless variables are parsed
function addSkill(skillName,inabilityNumber) {
	if ( !skillName ) skillName = "";
	if ( !inabilityNumber ) inabilityNumber = "1";
	var skillToAdd =
		'<div class="spell">' +
			'<div class="wrapper">' +
				'<div class="handle">&#9776;</div>' +
				'<div class="name" contenteditable="true">' + skillName + '</div>' +
				'<div class="proficiency">' +
					'<div class="plus-symbol">+</div>' +
					'<div class="inability" contenteditable="true">' + inabilityNumber + '</div>' +
						'<select>' +
							'<option value="I">Inability</option>' +
							'<option selected value="P">Practiced</option>' +
							'<option value="T">Trained</option>' +
							'<option value="S">Specialized</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
	$(skillToAdd).appendTo(skillList).stop().animate({'width' : '100%'},300);
	populateSkillsSelect();
}
//Populate all of the active item select fields
function populateCyberwareSelect() {
	$('#cyberware .type select').chosen({
		disable_search: true,
		placeholder_text_single: "Select one",		
		width: "fit-content"
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
//Check to see if the currently selected cyberware are valid
function validCyberware(selectedType,bodyPart,essenceVal,oldType) {
	var hasEssence = (essenceVal > 0 || essenceVal) && (essenceVal != ".");
	var mightVal = Number(maxMight.text());
	var speedVal = Number(maxSpeed.text());
	var intellectVal = Number(maxIntellect.text());
	var stats = [];
	var priStat;
	var priNumber;
	var secStat;
	var secNumber;
	var oldPriStat;
	var oldPriNumber;
	var oldSecStat;
	var oldPSecNumber;
	switch ( bodyPart) {
		case "head":
			switch ( selectedType ) {
				case "ST":
					priStat = "Might";
					priNumber = 2;
				break;
				case "LW":
					priStat = "Intellect";
					priNumber = 2;
				break;
				default:
					priStat = "Might";
					priNumber = 3;
			}
		break;
		case "core":
			switch ( selectedType ) {
				case "ST":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				case "MW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				case "HW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 2;
				break;
				default:
					priStat = "Intellect";
					priNumber = 3;
			}
		break;
		case "leftarm":
			switch ( selectedType ) {
				case "ST":
					priStat = "Intellect";
					priNumber = 1;
				break;
				case "LW":
					priStat = "Intellect";
					priNumber = 2;
				break;
				case "MW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				default:
					priStat = "Intellect";
					priNumber = 3;
			}
		break;
		case "rightarm":
			switch ( selectedType ) {
				case "ST":
					priStat = "Intellect";
					priNumber = 2;
				break;
				case "LW":
					priStat = "Intellect";
					priNumber = 2;
				break;
				case "MW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				default:
					priStat = "Intellect";
					priNumber = 3;
			}
		break;
		case "leftleg":
			switch ( selectedType ) {
				case "ST":
					priStat = "Intellect";
					priNumber = 1;
				break;
				case "LW":
					priStat = "Intellect";
					priNumber = 2;
				break;
				case "MW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				default:
					priStat = "Intellect";
					priNumber = 3;
			}
		break;
		case "rightleg":
			switch ( selectedType ) {
				case "ST":
					priStat = "Intellect";
					priNumber = 1;
				break;
				case "LW":
					priStat = "Intellect";
					priNumber = 2;
				break;
				case "MW":
					priStat = "Intellect";
					priNumber = 2;
					secStat = "Speed";
					secNumber = 1;
				break;
				default:
					priStat = "Intellect";
					priNumber = 3;
			}
		break;
		default:
			priStat = "Intellect";
			priNumber = 3;
	}
	if ( oldType ) {
		switch ( bodyPart) {
			case "skin":
				if ( oldType == "ST" ) {
					oldPriStat = "Armour";
					oldPriNumber = 0;
				} else { 
					oldPriStat = "Intellect";
					oldPriNumber = 3;
				}
			break;
			case "head":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Might";
						oldPriNumber = 2;
					break;
					case "LW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					default:
						oldPriStat = "Might";
						oldPriNumber = 3;
				}
			break;
			case "core":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					case "MW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					case "HW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 2;
					break;
					default:
						oldPriStat = "Intellect";
						oldPriNumber = 3;
				}
			break;
			case "leftarm":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Intellect";
						oldPriNumber = 1;
					break;
					case "LW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					case "MW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					default:
						oldPriStat = "Intellect";
						oldPriNumber = 3;
				}
			break;
			case "rightarm":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					case "LW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					case "MW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					default:
						oldPriStat = "Intellect";
						oldPriNumber = 3;
				}
			break;
			case "leftleg":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Intellect";
						oldPriNumber = 1;
					break;
					case "LW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					case "MW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					default:
						oldPriStat = "Intellect";
						oldPriNumber = 3;
				}
			break;
			case "rightleg":
				switch ( oldType ) {
					case "ST":
						oldPriStat = "Intellect";
						oldPriNumber = 1;
					break;
					case "LW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
					break;
					case "MW":
						oldPriStat = "Intellect";
						oldPriNumber = 2;
						oldSecStat = "Speed";
						oldSecNumber = 1;
					break;
					default:
						oldPriStat = "Intellect";
						oldPriNumber = 3;
				}
			break;
			default:
				oldPriStat = "Intellect";
				oldPriNumber = 3;
		}
		if ( oldPriStat === priStat ) priNumber -= oldPriNumber;
		if ( oldSecStat && secStat && oldSecStat === secStat ) secNumber -= oldSecNumber;
	}
	//Determine if the selection is valid based on the current
	//selections and if previous options were selected
	var validSelection =
		( bodyPart == "skin" && selectedType == "ST" ) ||
		( bodyPart == "skin" && selectedType == "EA" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "skin" && selectedType == "ES" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "skin" && selectedType == "SP" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "head" && selectedType == "ST" && mightVal >= priNumber + 1 ) ||
		( bodyPart == "head" && selectedType == "LW" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "head" && selectedType == "EA" && mightVal >= priNumber + 1 ) ||
		( bodyPart == "head" && selectedType == "ES" && mightVal >= priNumber + 1 ) ||
		( bodyPart == "head" && selectedType == "SP" && mightVal >= priNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "ST" && intellectVal >= priNumber + 1 && speedVal >= secNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "MW" && intellectVal >= priNumber + 1 && speedVal >= secNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "HW" && intellectVal >= priNumber + 1 && speedVal >= secNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "EA" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "ES" && intellectVal >= priNumber + 1 ) ||
		( bodyPart == "core" && selectedType == "SP" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "ST" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "LW" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "MW" && intellectVal >= priNumber + 1 && speedVal >= secNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "EA" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "ES" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("arm") > -1 && selectedType == "SP" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "ST" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "LW" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "MW" && intellectVal >= priNumber + 1 && mightVal >= secNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "EA" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "ES" && intellectVal >= priNumber + 1 ) ||
		( bodyPart.indexOf("leg") > -1 && selectedType == "SP" && intellectVal >= priNumber + 1 );
	//Validate, and then push stats needed if invalid
	stats.push(priStat);
	stats.push(priNumber);
	if ( secStat ) {
		stats.push(secStat);
		stats.push(secNumber);
	}
	if ( hasEssence && !selectedType ) return false;
	else if ( !hasEssence && selectedType ) return false;
	else if ( !hasEssence && !selectedType ) return false;
	else if ( hasEssence && validSelection ) return true;
	else {
		return stats;
	}
}
//Calculate and then show the current essence
function calculateEssence() {
	var essenceCost = 0;
	$('.essence .editable').each( function() {
		var thisParent = $(this).closest('.cyberware');
		var selectedType = $('.type select', thisParent).val();
		if ( $(this).html() != "." && selectedType ) essenceCost += Number($(this).html());
	});
	$('.value', essenceStat).text((6 - essenceCost).toFixed(2));
}
//Add a blank cyberware, unless variables are parsed
function addCyberware(bodyPart,spellID,cyberwareFunction,cyberwareValue,essenceCost) {
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
	if ( !cyberwareValue ) cyberwareValue = "0";
	if ( !essenceCost ) essenceCost = "0";
	var partOptions;
	switch ( bodyPart.replace('-cyberware','') ) {
		case "skin":
		partOptions = '<option value="ST">"+1 Armour"</option>';
		break;	
		case "head":
		partOptions =
			'<option value="ST">"+2 Intellect"</option>' +
			'<option value="LW">"Light Weapon"</option>';
		break;	
		case "core":
		partOptions = 
			'<option value="ST">"+3 Might"</option>' +
			'<option value="MW">"Medium Weapon"</option>' +
			'<option value="HW">"Heavy Weapon"</option>';
		break;	
		case "leftarm":
		partOptions = 
			'<option value="ST">"+1 Might"</option>' +
			'<option value="LW">"Light Weapon"</option>' +
			'<option value="MW">"Medium Weapon"</option>';
		break;	
		case "rightarm":
		partOptions = 
			'<option value="ST">"+1 Might"</option>' +
			'<option value="LW">"Light Weapon"</option>' +
			'<option value="MW">"Medium Weapon"</option>';
		break;
		case "leftleg":
		partOptions = 
			'<option value="ST">"+2 Speed"</option>' +
			'<option value="LW">"Light Weapon"</option>' +
			'<option value="MW">"Medium Weapon"</option>';
		break;	
		case "rightleg":
		partOptions = 
			'<option value="ST">"+2 Speed"</option>' +
			'<option value="LW">"Light Weapon"</option>' +
			'<option value="MW">"Medium Weapon"</option>';
		break;
	}
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
						partOptions +
						'<option value="EA">"Extra Ability"</option>' +
						'<option value="ES">"Extra Skill"</option>' +
						'<option value="SP">"Special"</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
			'<div class="essence">' +
				'<div class="cyber-label"><span class="blue-text">if</span> (ESSENCE_COST)</div>' +
				'<div class="text-wrapper">' +
					'&#123; <div contenteditable="' + contentEditable + '" class="editable">' + essenceCost + '</div> Essence &#125;' +
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
			$(this).css('min-height','170px');
		}
	});
	populateCyberwareSelect();
	if ( $('.' + bodyPart.replace('-cyberware','') + ' option:selected[value="ST"]').length > 0 ) {
		$('.' + bodyPart.replace('-cyberware','') + ' option[value="ST"]:not(:selected)').prop('disabled', true);
		$('.' + bodyPart.replace('-cyberware','') + ' .type select').trigger('chosen:updated');
	}
}
//Add a blank item, unless variables are parsed
function addItem(spellID,itemName,itemValue,itemWeight,slotNumber,selectThisType) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemName ) itemName = "";
	if ( !itemValue ) itemValue = "0";
	if ( !itemWeight ) itemWeight = "0";
	if ( !slotNumber ) slotNumber = "slots";
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
				'<div class="editable mobile-handle" contenteditable="true">' + itemName + '</div>' +
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
				'<div class="editable" contenteditable="true">' + itemValue + '</div>' +
				'<div class="credits">&#8353;</div>' +
			'</td>' +
			'<td class="weight">' +
				'<div class="editable" contenteditable="true">' + itemWeight + '</div>' +
				'<div class="slots">' + slotNumber + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(itemToAdd).insertAfter('#equipment table tr:first-child');
	else inventoryList.append(itemToAdd);
	populateInventorySelect();
}
//Add a blank artifact, unless variables are parsed
function addArtifact(spellID,itemLevel,itemName,itemEffect,itemDepletion,itemWeight,slotNumber) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemLevel ) itemLevel = "1";
	if ( !itemName ) itemName = "";
	if ( !itemEffect ) itemEffect = "";
	if ( !itemDepletion ) itemDepletion = "";
	if ( !itemWeight ) itemWeight = "0";
	if ( !slotNumber ) slotNumber = "slots";
	var artifactToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="level">' +
				'<div class="mobile-label">Level:</div>' +
				'<div class="editable" contenteditable="true">' + itemLevel + '</div>' +
			'</td>' +
			'<td class="name">' +
				'<div class="editable mobile-handle" contenteditable="true">' + itemName + '</div>' +
			'</td>' +
			'<td class="effect">' +
				'<div class="mobile-label">Effect:</div>' +
				'<div class="editable" contenteditable="true">' + itemEffect + '</div>' +
			'</td>' +
			'<td class="depletion">' +
				'<div class="mobile-label">Depletion:</div>' +
				'<div class="editable" contenteditable="true">' + itemDepletion + '</div>' +
			'</td>' +
			'<td class="weight">' +
				'<div class="editable" contenteditable="true">' + itemWeight + '</div>' +
				'<div class="slots">' + slotNumber + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(artifactToAdd).insertAfter('#artifacts table tr:first-child');
	else artifactsList.append(artifactToAdd);
}
//Add a blank artifact, unless variables are parsed
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
			if (( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && ['Action','Enabler','Talent','Select','Note'].includes(typeCheck)) || ( !spellRequired && spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Passive" )) {
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
				var hideThis = "";
				var itemType = spellListDatabase[i].itemtype;
				var itemValue = spellListDatabase[i].itemvalue;
				var itemWeight = spellListDatabase[i].itemweight;
				var itemDamage = spellListDatabase[i].itemdamage;
				var itemArmour = spellListDatabase[i].itemarmour;
				var itemLevel = spellListDatabase[i].itemlevel;
				var itemDepletion = spellListDatabase[i].itemdepletion;
				if ( itemType == "Artifact" ) spellType = '<img src="images/artifact.png">';
				else spellType = '<img src="images/items.png">';					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellName == "<hide>" ) hideThis = " hidden-spell";
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
						'<div id="' + spellID + '" class="spell' + hideThis + '" style="order: ' + spellOrder + '">' +
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
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Cyberware" ) {
				//Variables specific to cyberware
				var essenceCost = spellListDatabase[i].itemweight;
				var cyberwareLocation = spellListDatabase[i].itemtype;
				var cyberwareValue = spellListDatabase[i].itemvalue;
				var cyberwareDamage = spellListDatabase[i].itemdamage;
				var cyberwareArmour = spellListDatabase[i].itemarmour;
				var cyberwareType = spellListDatabase[i].itemlevel;
				spellType = '<img src="images/cyberware.png">';					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier == 0 ) spellTier = '<div class="tier">Baseline</div>';
				else spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( essenceCost ) essenceCost = '<span><strong>Essence Cost: </strong>' + essenceCost + ' Essence</span>';
				if ( cyberwareValue ) cyberwareValue = '<span><strong>Value: </strong>' + cyberwareValue + '₡</span>';
				if ( cyberwareDamage ) cyberwareDamage = '<span><strong>Damage: </strong>' + cyberwareDamage + '</span>';
				if ( cyberwareArmour ) cyberwareArmour = '<span><strong>Armour: </strong>' + cyberwareArmour + '</span>';
				if ( cyberwareType ) cyberwareType = '<span><strong>Type: </strong>' + cyberwareType + '</span>';
				if ( cyberwareLocation ) cyberwareLocation = '<span><strong>Location: </strong>' + cyberwareLocation + '</span>';
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
									cyberwareLocation +
									cyberwareType +
									essenceCost +
									cyberwareValue +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									cyberwareDamage +
									cyberwareArmour +
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
		var talentsVisible = talentsSection.parent('.spell-list').is(':visible');
		var actionsEnablersVisible = actionsEnablersSection.parent('.spell-list').is(':visible');
		var spellID = $(this).attr('id');
		var spellOrigin = '<span class="origin">' + $('.origin', this).text() + '</span>';
		var isEnabled = $(this).hasClass('required') || $(this).hasClass('selected');
		for (var i = 0; i < spellListDatabase.length; i++) {
			if ( spellListDatabase[i].id === spellID && isEnabled ) {
				var spellName = spellListDatabase[i].name;
				var tooltipName = '<h4 class="name">' + spellName + '</h4>';
				spellName = '<span class="spell-handle">' + spellName + '</span>';
				var itemName = spellListDatabase[i].itemname;
				var spellTier = spellListDatabase[i].tier;
				var typeCheck = spellListDatabase[i].type;
				var spellType = '<span class="type">' + typeCheck + '</span>';
				var spellTooltip = '<span class="description">' + spellListDatabase[i].tooltip + '</span>';
				var spellCasttime = spellListDatabase[i].casttime;
				var spellDuration = spellListDatabase[i].duration;
				var spellRange = spellListDatabase[i].range;
				var spellCooldown = spellListDatabase[i].cooldown;
				var spellDamage = spellListDatabase[i].damage;
				if ( spellTier == 0 ) spellTier = '<div class="tier">Baseline</div>';
				else spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellDuration ) spellDuration = "<span>Lasts " + spellDuration + "</span>";
				if ( spellRange ) spellRange = "<span>" + spellRange + " range</span>";
				if ( spellCasttime ) spellCasttime = "<span>" + spellCasttime + "</span>";
				if ( spellDuration ) spellDuration = "<span>" + spellDuration + "</span>";
				if ( spellCooldown ) spellCooldown = "<span>" + spellCooldown + "</span>";
				//Action & enabler spell hotbars & tooltips
				if ( (typeCheck == "Action" || typeCheck == "Enabler") && ($('#actions-enablers .spell[data-spellid="' + spellID + '"]').length <= 0) ) {
					var spellCost = '<span class="spell-handle">' + spellListDatabase[i].cost + '</span>';
					var spellToAdd =
						'<div data-spellid="' + spellID + '" class="spell">' +
							'<div class="wrapper spell-handle">' +
								spellName +
								spellCost +
							'</div>' +
						'</div>';
					actionsEnablersSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCost +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip + 
							spellType +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !actionsEnablersVisible ) {
						$(spellToAdd).appendTo(actionsEnablersSection).css('width','100%');
						actionsEnablersSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(spellToAdd).appendTo(actionsEnablersSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300,
							step: function() {
								$(this).css('height','34px');
							}
						});
					}
				//Talent spell hotbars & tooltips
				} else if ( typeCheck == "Talent" && $('#talents .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					var spellToAdd =
						'<div data-spellid="' + spellID + '" class="spell">' +
							'<div class="wrapper spell-handle">' +
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
							spellType +
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
							duration: 300,
							step: function() {
								$(this).css('height','34px');
							}
						});
					}
				//Add items to the iventory list
				} else if ( typeCheck == "Items" && $('#equipment tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var itemType = spellListDatabase[i].itemtype;
					var itemValue = spellListDatabase[i].itemvalue;
					var itemWeight = spellListDatabase[i].itemweight;
					var slotNumber = "slots";
					var itemDamage = spellListDatabase[i].itemdamage;
					var itemArmour = spellListDatabase[i].itemarmour;
					var itemLevel = spellListDatabase[i].itemlevel;
					var itemDepletion = spellListDatabase[i].itemdepletion;
					var itemEffect = spellListDatabase[i].itemeffect;
					if ( itemWeight == 1 ) slotNumber = "slot &nbsp;";
					if ( itemType == "Artifact" ) {
						addArtifact(spellID,itemLevel,itemName,itemEffect,itemDepletion,itemWeight,slotNumber);
					} else {
						var selectThisType;
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
						addItem(spellID,itemName,itemValue,itemWeight,slotNumber,selectThisType);
						var thisItem = $('#equipment tr[data-spellid="' + spellID + '"]');
						$('.type select', thisItem).val(selectThisType);
						$('.type select', thisItem).trigger('chosen:updated');
					}
				} else if ( typeCheck == "Cyberware" && $('#cyberware .cyberware[data-spellid="' + spellID + '"]').length <= 0 ) {
					var essenceCost = spellListDatabase[i].itemweight;
					var bodyPart = spellListDatabase[i].itemtype;
					var cyberwareLocation = bodyPart + "-cyberware";
					var cyberwareFunction = spellListDatabase[i].itemeffect;
					var cyberwareValue = spellListDatabase[i].itemvalue;
					var cyberwareType = spellListDatabase[i].itemlevel;
					var selectThisType;
					var selectThisLocation;
					switch ( cyberwareType ) {
						case "Light Weapon":
						selectThisType = "LW";
						break;
						case "Medium Weapon":
						selectThisType = "MW";
						break;
						case "Heavy Weapon":
						selectThisType = "HW";
						break;
						case "Extra Ability":
						selectThisType = "EA";
						break;
						case "Extra Skill":
						selectThisType = "ES";
						break;
						case "Special":
						selectThisType = "SP";
						break;
						default:
						selectThisType = "ST";
					}
					addCyberware(cyberwareLocation,spellID,cyberwareFunction,cyberwareValue,essenceCost);
					var thisCyberware = $('.cyberware[data-spellid="' + spellID + '"]');
					$('.type select', thisCyberware).val(selectThisType);
					if ( selectThisType == "ST" ) {
						$('.' + bodyPart + ' option[value="ST"]:not(:selected)').prop('disabled', true);
						$('.' + bodyPart + ' .type select').trigger('chosen:updated');
					} else {
						$('.type select', thisCyberware).trigger('chosen:updated');
					}
					var bodyPartImg = $('#cyber-mannequin img.' + bodyPart);
					bodyPartImg.addClass('modded');
					enableCyberware.addClass('clicked');
					if ( cyberware.is(':visible') == false ) cyberware.stop().slideToggle(200);
					if ( essenceStat.is(':visible') == false ) {
						essenceStat.animate( {
							width : '124px'
							}, { duration: 300,
							start: function() {
								essenceStat.show();
							}
						});	
					}
					if ( bodyPartImg.hasClass('active') == false ) bodyPartImg.attr('src',  'images/cyber'+ bodyPart + '-modded.png');
				} else if ( typeCheck == "Note" && $('#notes tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var note = spellListDatabase[i].description;
					addNote(spellID,note);
				}
			}
		}
	});
	//Remove any items or spells not in the current spelllist
	$('.spell-list .spell, .item-list tr, .tooltip, .cyberware').each( function() {
		var thisBar = $(this);
		var thisHotbarList = thisBar.parent();
		var thisSpellList = thisBar.closest('.spell-list');
		var spellID = parseInt($(this).data('spellid'));
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) {
			if ( thisBar.hasClass('spell') ) {
				thisBar.stop().slideToggle({
					duration: 300,
					start: function() {
						thisBar.css('max-height','34px');
					},
					complete: function() {
						thisBar.remove();
						if( thisSpellList.is(':visible') && thisHotbarList.is(':empty') ) {
							 thisSpellList.stop().slideToggle(200);
						}
					}
				});
			} else if ( thisBar.hasClass('cyberware') ) {
				var bodyPart = thisBar.attr('class').split(' ')[1];
				var emptyMods = 0;
				thisBar.remove();
				for (var i = 0; i < $('.cyberware.' + bodyPart).children('.essence').length; i++) {
					if ( Number($(this).text()) ) emptyMods++;
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
	calculateEssence();
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
//Calculate stat pools based on current selections
function calculateStatPools(oldTypeOnly) {
	var curMightVal = Number(curMight.html());
	var maxMightVal = Number(maxMight.text());
	var curSpeedVal = Number(curSpeed.html());
	var maxSpeedVal = Number(maxSpeed.text());
	var curIntellectVal = Number(curIntellect.html());
	var maxIntellectVal = Number(maxIntellect.text());
	var mightBonus = 0;
	var speedBonus = 0;
	var intellectBonus = 0;
	var mightPenalty = 0;
	var speedPenalty = 0;
	var intellectPenalty = 0;
	//Get currently selected cyberware, and then add their amounts
	//Ignore cyberware granted by attributes
	$('.cyberware:not([data-spellid])').each( function() {
		var essenceVal = Number($('.essence .editable', this).html());
		var hasEssence = (essenceVal > 0 || essenceVal) && (essenceVal != ".");
		var bodyPart = $(this).attr('class').split(' ')[1];
		var oldType = $(this).attr('data-mod');
		var selectedType = $('.type select', this).val();
		if ( oldTypeOnly == "delete" && $(this).parents('.delete-space').length === 0 ) return;
		if ( oldType ) {
			switch ( bodyPart ) {
				case "skin":
					if ( oldType === "ST" ) console.log('Armour');
					else intellectPenalty -= 3;
				break;
				case "head":
					switch ( oldType ) {
						case "ST":
							mightPenalty -= 2;
							intellectBonus -= 2;
						break;
						case "LW":
							intellectPenalty -= 2;
						break;
						default:
							mightPenalty -= 3;
					}
				break;
				case "core":
					switch ( oldType ) {
						case "ST":
							speedPenalty -= 1;
							intellectPenalty -= 2;
							mightBonus -= 3;
						break;
						case "MW":
							speedPenalty -= 1;
							intellectPenalty -= 2;
						break;
						case "HW":
							speedPenalty -= 2;
							intellectPenalty -= 2;
						break;
						default:
							intellectPenalty -= 3;
					}
				break;
				case "leftarm":
					switch ( oldType ) {
						case "ST":
							intellectPenalty -= 1;
							mightBonus -= 1;
						break;
						case "LW":
							intellectPenalty -= 2;
						break;
						case "MW":
							speedPenalty -= 1;
							intellectPenalty -= 2;
						break;
						default:
							intellectPenalty -= 3;
					}
				break;
				case "rightarm":
					switch ( oldType ) {
						case "ST":
							intellectPenalty -= 1;
							mightBonus -= 1;
						break;
						case "LW":
							intellectPenalty -= 2;
						break;
						case "MW":
							speedPenalty -= 1;
							intellectPenalty -= 2;
						break;
						default:
							intellectPenalty -= 3;
					}
				break;
				case "leftleg":
					switch ( oldType ) {
						case "ST":
							intellectPenalty -= 1;
							speedBonus -= 1;
						break;
						case "LW":
							intellectPenalty -= 2;
						break;
						case "MW":
							speedPenalty -= 1;
							intellectPenalty -= 2;
						break;
						default:
							intellectPenalty -= 3;
					}
				break;
				case "rightleg":
					switch ( oldType ) {
						case "ST":
							intellectPenalty -= 1;
							speedBonus -= 1;
						break;
						case "LW":
							intellectPenalty -= 2;
						break;
						case "MW":
							speedPenalty -= 1;
							intellectPenalty -= 2;
						break;
						default:
							intellectPenalty -= 3;
					}
				break;
				default:
					intellectPenalty -= 3;
			}
		}
		if ( !oldTypeOnly && hasEssence ) {
			switch ( bodyPart ) {
				case "skin":
					if ( selectedType === "ST" ) console.log('Armour');
					else intellectPenalty += 3;
				break;
				case "head":
					switch ( selectedType ) {
						case "ST":
							mightPenalty += 2;
							intellectBonus += 2;
						break;
						case "LW":
							intellectPenalty += 2;
						break;
						default:
							mightPenalty += 3;
					}
				break;
				case "core":
					switch ( selectedType ) {
						case "ST":
							speedPenalty += 1;
							intellectPenalty += 2;
							mightBonus += 3;
						break;
						case "MW":
							speedPenalty += 1;
							intellectPenalty += 2;
						break;
						case "HW":
							speedPenalty += 2;
							intellectPenalty += 2;
						break;
						default:
							intellectPenalty += 3;
					}
				break;
				case "leftarm":
					switch ( selectedType ) {
						case "ST":
							intellectPenalty += 1;
							mightBonus += 1;
						break;
						case "LW":
							intellectPenalty += 2;
						break;
						case "MW":
							speedPenalty += 1;
							intellectPenalty += 2;
						break;
						default:
							intellectPenalty += 3;
					}
				break;
				case "rightarm":
					switch ( selectedType ) {
						case "ST":
							intellectPenalty += 1;
							mightBonus += 1;
						break;
						case "LW":
							intellectPenalty += 2;
						break;
						case "MW":
							speedPenalty += 1;
							intellectPenalty += 2;
						break;
						default:
							intellectPenalty += 3;
					}
				break;
				case "leftleg":
					switch ( selectedType ) {
						case "ST":
							intellectPenalty += 1;
							speedBonus += 1;
						break;
						case "LW":
							intellectPenalty += 2;
						break;
						case "MW":
							speedPenalty += 1;
							intellectPenalty += 2;
						break;
						default:
							intellectPenalty += 3;
					}
				break;
				case "rightleg":
					switch ( selectedType ) {
						case "ST":
							intellectPenalty += 1;
							speedBonus += 1;
						break;
						case "LW":
							intellectPenalty += 2;
						break;
						case "MW":
							speedPenalty += 1;
							intellectPenalty += 2;
						break;
						default:
							intellectPenalty += 3;
					}
				break;
				default:
					intellectPenalty += 3;
			}
			$(this).attr('data-mod', selectedType);
		}
	});
	//Calculate new values for all of the stat pools
	curMightVal = curMightVal + mightBonus - mightPenalty;
	curSpeedVal = curSpeedVal + speedBonus - speedPenalty;
	curIntellectVal = curIntellectVal + intellectBonus - intellectPenalty;
	maxMightVal = maxMightVal + mightBonus - mightPenalty;
	maxSpeedVal = maxSpeedVal + speedBonus - speedPenalty;
	maxIntellectVal = maxIntellectVal + intellectBonus - intellectPenalty;
	//No less than 0, or no less than 1 if max value is higher than 0
	if ( maxMightVal <= 0 ) maxMightVal = 0;
	if ( maxSpeedVal <= 0 ) maxSpeedVal = 0;
	if ( maxIntellectVal <= 0 ) maxIntellectVal = 0;
	if ( curMightVal <= 0 && maxMightVal != 0 ) curMightVal = 1;
	else if ( curMightVal <= 0 ) curMightVal = 0;
	if ( curSpeedVal <= 0 && maxSpeedVal != 0 ) curSpeedVal = 1;
	else if ( curSpeedVal <= 0 ) curSpeedVal = 0;
	if ( curIntellectVal <= 0 && maxIntellectVal != 0 ) curIntellectVal = 1;
	else if ( curIntellectVal <= 0 ) curIntellectVal = 0;
	//Apply the new values to the fields
	curMight.html(curMightVal);
	maxMight.text(maxMightVal);
	curSpeed.html(curSpeedVal);
	maxSpeed.text(maxSpeedVal);
	curIntellect.html(curIntellectVal);
	maxIntellect.text(maxIntellectVal);
};
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
	curMight = $('#might .current-value');
	maxMight = $('#might .pool-value');
	curSpeed = $('#speed .current-value');
	maxSpeed = $('#speed .pool-value');
	curIntellect = $('#intellect .current-value');
	maxIntellect = $('#intellect .pool-value');
	poolAddPoint = $('.pool .add-point');
	poolRemovePoint = $('.pool .remove-point');
	mightEdge = $('#might .edge-value');
	speedEdge = $('#speed .edge-value');
	intellectEdge = $('#intellect .edge-value');
	edgeAddPoint = $('.edge .add-point');
	edgeRemovePoint = $('.edge .remove-point');
	commitSection = $('#commit-button');
	commitButton = $('#commit-button .button');
	essenceStat = $('#essence');
	effortStat = $('#effort');
	availPoolStat = $('#available-points');
	availEdgeStat = $('#available-edgepoints');
	addSkillButton = $('#add-skill');
	skillError = $('#skill-list .error');
	skillList = $('#skill-list #skills');
	skillsDeleteSpace = $('#skill-list .delete-space');
	spellBook = $('#spellbook');
	spellbookButton = $('#open-spellbook');
	filterButtons = $('#spellbook .filters .button');
	loreButton = $('#open-archives');
	spellModal = $('#spellbook-background');
	enableCyberware = $('#enable-cyberware');
	cyberwareTooltip = $('#cyberware-tooltip');
	actionsEnablersSection = $('#actions-enablers');
	talentsSection = $('#talents');
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
	availSpellCount = 4;
	selectedSpellCount = 0;
	availPoints = 6;
	spentPoints = 0;
	mightOverflow = 0;
	speedOverflow = 0;
	intellectOverflow = 0;
	availEdge = 1;
	spentEdge = 0;
	curEffort = 1;
	curEssence = "6.00";
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
	//Populate inventory & skills select dropdowns
	//and initate drag and drop
	populateCyberwareSelect();
	populateInventorySelect();
	populateSkillsSelect();
	//Actions & Enablers Dragula
	dragula([actionsEnablersSection[0]], {
		moves: function(el,container,handle) {
			return handle.classList.contains('spell-handle');
		}
	});
	//Talents Dragula
	dragula([talentsSection[0]], {
		moves: function(el,container,handle) {
			return handle.classList.contains('spell-handle');
		}
	});
	//Skills Dragula
	var skillsDrake = dragula([skillList[0], skillsDeleteSpace[0]], {
			accepts: function(el,target,source,sibling) {
				if ( el.hasAttribute("data-spellid") && target.classList.contains('delete-space') ) return false;
				else return true;
			}, moves: function(el,container,handle) {
				return handle.classList.contains('handle');
			}
		}).on('drag', function(el,source) {
			el.style.display = "flex";
			if ( el.hasAttribute('data-spellid') && skillError.is(':visible') == false ) skillError.stop().slideToggle(150);
			else skillsDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) {
				firstDrag = false;
				containerHeight = skillList.height();
			}
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				skillsDeleteSpace.stop().animate({
					'height' : $('.gu-transit').css('height')
				}, 150);
				skillList.css('height', containerHeight);
			} else {
				skillsDeleteSpace.stop().animate({
					'height' : '34px'
				}, 150);
				skillList.css('height', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 0 ) {
					addSkill();
					skillList.removeAttr('style');
				} else {
					skillList.stop().animate({
						'height' : containerHeight - skillsDeleteSpace.height()
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				skillsDrake.remove();
			} else {
				skillList.removeAttr('style');
			}
			if ( el.hasAttribute('data-spellid') && skillError.is(':visible') ) skillError.stop().slideToggle(300);
			else if ( skillsDeleteSpace.is(':visible') ) {
				skillsDeleteSpace.stop().animate({
					'height' : '34px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			if ( el.hasAttribute('data-spellid') && skillError.is(':visible') ) skillError.stop().slideToggle(300);
			else if ( skillsDeleteSpace.is(':visible') ) {
				skillsDeleteSpace.stop().animate({
					'height' : '34px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		});
	skillsDrake;
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
			} else if ( el.hasAttribute('data-mod') && cyberError.is(':visible') == false ) {
				var selectedType = el.getAttribute('data-mod');
				var bodyPart = el.classList[1];
				var essenceVal = el.querySelector('.essence .editable').innerHTML;
				var stat;
				var statVal;
				var curStat;
				if ( selectedType == "ST" ) {
					switch ( bodyPart ) {
						case "skin":
							console.log("Armour");
						break;
						case "head":
							stat = "Intellect";
							statVal = 3;
						break;
						case "core":
							stat = "Might";
							statVal = 4;
						break;
						case "leftarm":
							stat = "Might";
							statVal = 2;
						break;
						case "rightarm":
							stat = "Might";
							statVal = 2;
						break;
						case "leftleg":
							stat = "Speed";
							statVal = 3;
						break;
						case "rightleg":
							stat = "Speed";
							statVal = 3;
						break;
					}
					switch ( stat ) {
						case "Might":
							curStat = maxMight;
						break;
						case "Speed":
							curStat = maxSpeed;
						break;
						case "Intellect":
							curStat = maxIntellect;
						break;
					}
					if ( Number(curStat.text()) >= statVal ) {
						cyberwareDeleteSpace.stop().slideToggle(150);
					} else {
						cyberError.text('You need at least ' + statVal + ' ' + stat + ' to remove this cyberware');
						cyberError.stop().slideToggle(150);
					}
				} else {
					cyberwareDeleteSpace.stop().slideToggle(150);
				}
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
				calculateStatPools("delete");
				cyberwareDrake.remove();
				calculateEssence();
				poolRemovePoint.each( function() {
					var maxPool = Number($('#' + $(this).closest('.stat-pool').attr('id') + ' .pool-value').text());
					if ( maxPool > 0 ) $(this).removeClass('disabled');
				});
				var bodyPart = el.classList[1];
				var emptyMods = 0;
				for (var i = 0; i < $('.cyberware.' + bodyPart).children('.essence').length; i++) {
					if ( Number($(this).text()) ) emptyMods++;
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
			else defaultContainerHeight = "208px";
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
			else defaultContainerHeight = "194px";
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
		var variantsVisible = variantsSection.is(':visible');
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
		} else if ( hybridVisible && !variantsVisible && !secFociVisible ) {
			extraAttributes.stop().slideToggle({
				duration: 300,
				done: function() {
					secSpecies.val('');
					hideExtraAttribute(hybridSection,false);
					genderFocusRow.addClass('last-row');
				}
			});
		//If only the variants and hybrid selectors are showing
		} else if ( hybridVisible && variantsVisible && !secFociVisible ) {
			//If the primary species is not Terran
			if ( priSpeciesVal != 6 ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						secSpecies.val('');
						variants.val('');
						hideExtraAttribute(hybridSection,false);
						hideExtraAttribute(variantsSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If the primary species is Terran
			} else {
				secSpecies.val('');
				hideExtraAttribute(hybridSection,true);
			}
		//If only the secondary foci and hybrid selectors are showing
		} else if ( hybridVisible && !variantsVisible && secFociVisible ) {
			secSpecies.val('');
			hideExtraAttribute(hybridSection,true);
		//If all selectors are showing
		} else if ( hybridVisible && variantsVisible && secFociVisible ) {
			//If the primary species is not Terran
			if ( priSpeciesVal != 6 ) {
				secSpecies.val('');
				variants.val('');
				hideExtraAttribute(hybridSection,true);
				hideExtraAttribute(variantsSection,true);
			//If the primary species is Terran
			} else {
				secSpecies.val('');
				hideExtraAttribute(hybridSection,true);
			}
		}
		//Repopulate all of the fields after cliking the toggle
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		//If only the secondary species is selected when clicked, hide the reset button
		if ( secSpecies.val() && !priSpeciesVal && !types.val() ) resetSection.addClass('hidden-section');
	});
	//Reset button to reset all values and hide extra sections
	//Does not affect hybrid toggle
	resetButton.click(function(){
		var extraAttributesVisible = extraAttributes.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var variantsVisible = variantsSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		availSpellCount = 4;
		selectedSpellCount = 0;
		descriptors.val('');
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		variants.val('');
		resetSection.addClass('hidden-section');
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
		if ( hybridVisible ) {
			if ( variantsVisible ) hideExtraAttribute(variantsSection,true);
			if ( secFociVisible ) hideExtraAttribute(secFociSection,true);
		} else if ( extraAttributesVisible ) {
			extraAttributes.stop().slideToggle({
				duration: 300,
				start: function() {
					if ( variantsVisible ) hideExtraAttribute(variantsSection,false);
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
		populateSpells();
	});
	species.on('change', function() {
		var priSpeciesVal = priSpecies.val();
		var secSpeciesVal = secSpecies.val();
		var extraAttributesVisible = extraAttributes.is(':visible');
		var variantsVisible = variantsSection.is(':visible');
		var hybridVisible = hybridSection.is(':visible');
		var secFociVisible = secFociSection.is(':visible');
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateVariants();
		populateSpells();
		loreButton.text('New Lore');
		//If user picks Terran, show genetic variations
		if ( priSpeciesVal == 6 || secSpeciesVal == 6 ) {
			if ( !extraAttributesVisible ) {
				showExtraAttribute(variantsSection,"137px",false);
				extraAttributes.stop().slideToggle({
					duration: 300,
					start: function() {
						genderFocusRow.removeClass('last-row');
					}
				});
			//Show the variants selector if it's not showing
			} else if ( !variantsVisible ) {
				showExtraAttribute(variantsSection,"137px",true);
			}
		} else {
			//If no other attributes are showing except the variants selector
			if ( variantsVisible && !hybridVisible && !secFociVisible ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						variants.val('');
						hideExtraAttribute(variantsSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If either of the other selectors are showing
			} else if ( variantsVisible && (hybridVisible || secFociVisible) ) {
				variants.val('');
				hideExtraAttribute(variantsSection,true);
			}
		}
	});
	types.on('change', function() {
		resetSection.removeClass('hidden-section');
		populateSpecies();
		populateFoci();
		populateVariants();
		populateSpells();
		resetAbilityCounters();
		loreButton.text('New Lore');
	});
	foci.on('change', function() {
		var extraAttributesVisible = extraAttributes.is(':visible');
		var variantsVisible = variantsSection.is(':visible');
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
			} else if ( secFociVisible && !hybridVisible && !variantsVisible ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						secFoci.val('');
						hideExtraAttribute(secFociSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If either of the other selectors are showing
			} else if ( secFociVisible && (variantsVisible || hybridVisible) ) {
				secFoci.val('');
				hideExtraAttribute(secFociSection,true);
			}
		} else if ( $(this).attr('id') == "foci" ) {
			if ( secFociVisible && !hybridVisible && !variantsVisible ) {
				extraAttributes.stop().slideToggle({
					duration: 300,
					done: function() {
						secFoci.val('');
						hideExtraAttribute(secFociSection,false);
						genderFocusRow.addClass('last-row');
					}
				});
			//If either of the other selectors are showing
			} else if ( secFociVisible && (variantsVisible || hybridVisible) ) {
				secFoci.val('');
				hideExtraAttribute(secFociSection,true);
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
	//Add or remove stat pool points with button clicks
	poolAddPoint.click( function() {
		var statPool = $(this).closest('.stat-pool').attr('id');
		var curVal = Number($('#' + statPool + ' .current-value').html());
		var poolVal = Number($('#' + statPool + ' .pool-value').text());
		var availPool = Number($('.value', availPoolStat).text());
		var availEdgeVal = Number($('.value', availEdgeStat).text());
		if ( availPool > 0 ) {
			availPool--;
			spentPoints++;
			$('#' + statPool + ' .current-value').html(curVal + 1);
			$('#' + statPool + ' .pool-value').text(poolVal + 1);
			$('.value', availPoolStat).text(availPool);
			if ( availPool === 0 ) {
				poolAddPoint.addClass('disabled');
				if ( availEdgeVal === 0 ) commitButton.removeClass('disabled');
			}
			poolRemovePoint.each( function() {
				var maxPool = Number($('#' + $(this).closest('.stat-pool').attr('id') + ' .pool-value').text());
				if ( maxPool > 0 ) $(this).removeClass('disabled');
			});
		}
	});
	poolRemovePoint.click( function() {
		var statPool = $(this).closest('.stat-pool').attr('id');
		var curVal = Number($('#' + statPool + ' .current-value').html());
		var poolVal = Number($('#' + statPool + ' .pool-value').text());
		var availPool = Number($('.value', availPoolStat).text());
		if ( spentPoints <= availPoints ) {
			poolAddPoint.removeClass('disabled');
			availPool++;
			spentPoints--;
			if ( curVal === poolVal ) $('#' + statPool + ' .current-value').html(curVal - 1);
			$('#' + statPool + ' .pool-value').text(poolVal - 1);
			$('.value', availPoolStat).text(availPool);
			poolRemovePoint.each( function() {
				var maxPool = Number($('#' + $(this).closest('.stat-pool').attr('id') + ' .pool-value').text());
				if ( maxPool === 0 || spentPoints === -availPoints ) $(this).addClass('disabled');
			});
		}
		commitButton.addClass('disabled');
	});
	edgeAddPoint.click( function() {
		var statPool = $(this).closest('.stat-pool').attr('id');
		var curVal = Number($('#' + statPool + ' .edge-value').text());
		var availPool = Number($('.value', availPoolStat).text());
		var availEdgeVal = Number($('.value', availEdgeStat).text());
		if ( availEdgeVal > 0 ) {
			availEdgeVal--;
			spentEdge++;
			$('#' + statPool + ' .edge-value').text(curVal + 1);
			$('.value', availEdgeStat).text(availEdgeVal);
			if ( availEdgeVal === 0 ) {
				edgeAddPoint.addClass('disabled');
				if ( availPool === 0) commitButton.removeClass('disabled');
			}
			edgeRemovePoint.each( function() {
				var maxEdge = Number($('#' + $(this).closest('.stat-pool').attr('id') + ' .edge-value').text());
				if ( maxEdge > -1 ) $(this).removeClass('disabled');
			});
		}
	});
	edgeRemovePoint.click( function() {
		var statPool = $(this).closest('.stat-pool').attr('id');
		var curVal = Number($('#' + statPool + ' .edge-value').text());
		var availEdgeVal = Number($('.value', availEdgeStat).text());
		if ( spentEdge <= availEdge ) {
			edgeAddPoint.removeClass('disabled');
			availEdgeVal++;
			spentEdge--;
			$('#' + statPool + ' .edge-value').text(curVal - 1);
			$('.value', availEdgeStat).text(availEdgeVal);
			edgeRemovePoint.each( function() {
				var maxEdge = Number($('#' + $(this).closest('.stat-pool').attr('id') + ' .edge-value').text());
				if ( maxEdge <= -1 ) $(this).addClass('disabled');
			});
		}
		commitButton.addClass('disabled');
	});
	commitButton.click( function() {
		$('.add-remove').hide(300);
		edgeAddPoint.hide(300);
		edgeRemovePoint.hide(300);
		setTimeout(function() {
			commitSection.slideToggle(300);
			if ( availPoolStat.is(':visible') ) {
					availPoolStat.animate({
						width : 0
					}, { 
					duration: 300,
					complete: function() {
						$(this).hide();
					}
				});
			}
			if ( availEdgeStat.is(':visible') ) {
				availEdgeStat.animate({
						width : 0
					}, { 
					duration: 300,
					complete: function() {
						$(this).hide();
					}
				});
			}
		}, 300);
	});
	//Make sure the current pool value doesn't exceed the current
	//maximum pool value
	$('.current-value').on('keyup blur paste', function() {
		var curVal = Number($(this).html());
		var maxVal = Number($(this).closest('.pool').children('.pool-value').text());
		if ( curVal > maxVal ) $(this).html(maxVal);
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
	//Show cyberware section and essence tracker
	//but only when no cyberware is installed
	enableCyberware.click( function() {
		var installedCyberware = [];
		$('.cyberware .essence .editable').each( function() {
			if ( Number($(this).html()) ) installedCyberware.push(Number($(this).html()));
		});
		if ( installedCyberware.length === 0 ) {
			$(this).toggleClass('clicked');
			cyberware.stop().slideToggle(500);
			if ( essenceStat.is(':visible') ) {
				essenceStat.animate( {
					width : '0'
					}, { duration: 300,
					complete: function() {
						essenceStat.hide();
						essenceStat.removeAttr('style');
					}
				});	
			} else {
				essenceStat.animate( {
					width : '124px'
					}, { duration: 300,
					start: function() {
						essenceStat.show();
					}
				});				
			}
		}
	});
	//Focus editable div fields when clicking on outter cells
	$('.item-list, #skill-list, #cyberware').on('click', 'td, div.spell, div.text-wrapper', function() {
		$('.editable', this).focus();
	});
	//Add skills when respective button is clicked
	addSkillButton.click( function() { addSkill(); });	
	//Check for changes in any of the skill proficiency dropdowns
	skillList.on('change', '.proficiency select', function() {
		var thisVal = $(this).val();
		var inabilityFields = $(this).parent('.proficiency').children('div:first-child, .inability');
		if ( thisVal === "I" ) inabilityFields.show();
		else inabilityFields.hide();
	});
	//Add notes and items when respective button is clicked
	addItemButton.click( function() { addItem(); });
	addArtifactButton.click( function() { addArtifact(); });
	addNoteButton.click( function() { addNote(); });
	addCyberwareButton.click( function() { 
		addCyberware($(this).closest('.cyber-section').attr('id'));
		if ( isTouchDevice() ) $('#cyberware-option em').show();
	});	
	//Filter inputs for level, weight. essence and value fields
	$('.item-list, #skill-list, #cyberware, .pool').on('keydown blur paste', '.level .editable, .value .editable, .weight .editable, .essence .editable, .inability, .current-value', function(e){
		var thisVal = $(this).html();
		var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([116,9,46,8,37,38,39,40].indexOf(e.keyCode) != -1);
        var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >=96 && e.keyCode <= 105);
        var vKey = 86, cKey = 67, aKey = 65;
		//Essence decimal controller
		var isEssence = $(this).closest('.essence').length;
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
			case isEssence && isPeriodKey && onePeriod:
                break;
            default:
                e.preventDefault();
        }
	});
	//Update slots text in carry weight to reflect amount of slots
	$('.item-list').on('keyup', 'td.weight .editable', function() {
		if ( $(this).text() == 1 ) $(this).parent('.weight').children('div:last-child').html('slot &nbsp;');
		else $(this).parent('.weight').children('div:last-child').text('slots');
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
	cyberware.on('keyup', '.essence .editable', function(){
		var essenceVal = Number($(this).html());
		var thisParent = $(this).closest('.cyberware');
		var oldType = thisParent.attr('data-mod');
		var bodyPart = thisParent.attr('class').split(' ')[1];
		var selectedType = $('.type select', thisParent).val();
		var returnedStats = validCyberware(selectedType,bodyPart,essenceVal,oldType);
		var priStat;
		var priNumber;
		var secStat;
		var secNumber;
		var copy;
		var emptyMods = 0;
		for (var i = 0; i < thisParent.children('.essence').length; i++) {
			if ( Number($(this).text()) ) emptyMods++;
		}
		if ( emptyMods ) $('#cyber-mannequin img.' + bodyPart).addClass('modded');
		else $('#cyber-mannequin img.' + bodyPart).removeClass('modded');
		if ( returnedStats != true || returnedStats != false ) {
			priStat = returnedStats[0];
			priNumber = returnedStats[1] + 1;
			secStat = returnedStats[2];
			secNumber = returnedStats[3] + 1;
		}
		if ( secStat ) copy = "You need at least " + priNumber + " " + priStat + " & " + secNumber +  " " + secStat + " to install this cyberware.";
		else copy = "You need at least " + priNumber + " " + priStat + " to install this cyberware.";
		if ( essenceVal == 0 || essenceVal == "." || !essenceVal ) {
			calculateStatPools();
			thisParent.removeAttr('data-mod');
		} else if ( returnedStats === true ) {
			if ( selectedType == "EA" ) {
				
			} else if ( oldType == "EA" ) {

			}
			calculateStatPools();			
		} else if ( returnedStats != false && returnedStats != true ) {
			$('.text', popupError).text(copy);
			if ( popupError.is(':visible') == false ) popupError.stop().slideToggle(300);
			$(this).html(0);
			calculateStatPools(true);
			thisParent.removeAttr('data-mod');
		}
		if ( $('.' + bodyPart + ' option:selected[value="ST"]').length === 0 ) {
			$('.' + bodyPart + ' option[value="ST"]').removeAttr('disabled');
			$('.' + bodyPart + ' .type select').trigger('chosen:updated');
		}
		calculateEssence();
	});
	//Calculate stats whenever cyberware is installed
	cyberware.on('change', '.type select', function() {
		var selectedType = $(this).val();
		var thisParent = $(this).closest('.cyberware');
		var oldType = thisParent.attr('data-mod');
		var bodyPart = thisParent.attr('class').split(' ')[1];
		var essenceVal = Number($('.essence .editable', thisParent).html());
		var returnedStats = validCyberware(selectedType,bodyPart,essenceVal,oldType);
		if ( returnedStats != true || returnedStats != false ) {
			priStat = returnedStats[0];
			priNumber = returnedStats[1] + 1;
			secStat = returnedStats[2];
			secNumber = returnedStats[3] + 1;
		}
		if ( selectedType == "ST" ) {
			$('.' + bodyPart + ' option[value="ST"]:not(:selected)').prop('disabled', true);
			$('.' + bodyPart + ' .type select').trigger('chosen:updated');
		}
		if ( $('.' + bodyPart + ' option:selected[value="ST"]').length == 0 ) {
			$('.' + bodyPart + ' option[value="ST"]').removeAttr('disabled');
			$('.' + bodyPart + ' .type select').trigger('chosen:updated');
		}
		if ( secStat ) copy = "You need at least " + priNumber + " " + priStat + " & " + secNumber +  " " + secStat + " to install this cyberware.";
		else copy = "You need at least " + priNumber + " " + priStat + " to install this cyberware.";
		if ( returnedStats === true ) {
			if ( selectedType == "EA" ) {
				
			} else if ( oldType == "EA" ) {

			}
			calculateStatPools();
		} else if ( returnedStats != false && returnedStats != true ) {
			$('.text', popupError).text(copy);
			if ( popupError.is(':visible') == false ) popupError.stop().slideToggle(300);
			$(this).val('');
			$(this).trigger('chosen:updated');
			calculateStatPools(true);
			thisParent.removeAttr('data-mod');
		}
		calculateEssence();
	});
	//Show modals on click
	$('#buttons .modal-button, .modal-background, .modal, .modal-header .button').click( function(e) {
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
	//Highlight spells in spellbook and keep track of spell count
	spellBook.on('click', '.spell', function() {
		if ( $(this).hasClass('required') == false && $(this).hasClass('selected') == false && selectedSpellCount < availSpellCount ) {
			$(this).addClass('selected');
			++selectedSpellCount;
			if ( $('#spellbook .filters #selected').hasClass('clicked') == false ) $(this).stop().slideToggle(500);
		} else if ( $(this).hasClass('required') == false && $(this).hasClass('selected') ) {
			$('.spell-list .spell[data-spellid="' + $(this).attr('id') + '"]').remove();
			$('.item-list tr[data-spellid="' + $(this).attr('id') + '"]').remove();
			$(this).removeClass('selected');
			--selectedSpellCount;
			if ( $('#spellbook .filters #available').hasClass('clicked') == false ) $(this).stop().slideToggle(500);
		}
		resetAbilityCounters();
		populateSpellLists();
	});
	filterButtons.click( function() {
		var spellState = $(this).attr('id');
		if ( spellState != "available" ) $('#spellbook .spell.' + spellState).stop().slideToggle(500);
		else $('#spellbook .spell').not('.required, .selected').stop().slideToggle(500);
		$(this).toggleClass('clicked');
	});
	//Listerers for mobile vs listeners for desktop
	if ( isTouchDevice() ) {
		//Show a sliding tooltip on click
		spellHotbars.on('click', '.spell', function() {
			var hotbar = $(this);
			var hotbarWidth = hotbar.width();
			var spellID = hotbar.data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			$('.tooltip:visible').not(tooltip).stop().slideToggle(500);
			if (tooltip.is(':visible')) {
				hotbar.css('width', hotbarWidth);
				tooltip.stop().slideToggle(500, function() {
					hotbar.css('width','');
					tooltip.appendTo($('body'));
				});
			} else {
				hotbar.css('width',hotbarWidth);
				tooltip.appendTo(hotbar);
				tooltip.css('width', hotbarWidth - 40);
				tooltip.stop().slideToggle({
						duration: 500, 
						start: function() {
							$(this).css('display', 'flex');
						},
						done: function() {
							hotbar.css('width','');
							$(this).css('width', hotbar.width() - 40 );
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
		enableCyberware.hover( function(targetElement){
			var installedCyberware = [];
			tooltipPosition(targetElement,cyberwareTooltip);
			$('.cyberware .essence .editable').each( function() {
				if ( Number($(this).html()) ) installedCyberware.push(Number($(this).html()));
			});
			if ( installedCyberware.length ) $('em', cyberwareTooltip).css('display','block');
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