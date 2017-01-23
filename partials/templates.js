angular.module('InfoCompass').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/ic-about.html',
    "<h2>{{'INTERFACE.ABOUT_HEADING' | translate}}</h2>\n" +
    "\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_0_1' | translate}}</p>\n" +
    "<img src = \"/images/infopoint-scharnweberstrasse_01.jpg\"/>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_0_2' | translate}}</p>\n" +
    "<img src = \"/images/infopoint-scharnweberstrasse_03.jpg\">\n" +
    "\n" +
    "\n" +
    "<h3>{{'INTERFACE.ABOUT_SUBHEADING_1' | translate}}</h3>\n" +
    "\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_1_1' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_1_2' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_1_3' | translate}}</p>\n" +
    "<img src = \"/images/infopoint-scharnweberstrasse_02.jpg\">\n" +
    "\n" +
    "\n" +
    "<h3>{{'INTERFACE.ABOUT_SUBHEADING_2' | translate}}</h3>\n" +
    "\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_2_1' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_2_2' | translate}}</p>\n" +
    "\n" +
    "\n" +
    "<h3>{{'INTERFACE.ABOUT_SUBHEADING_3' | translate}}</h3>\n" +
    "\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_3_1' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_3_2' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_3_3' | translate}}</p>\n" +
    "<p>{{'INTERFACE.ABOUT_PARAGRAPH_3_4' | translate}}</p>\n" +
    "\n" +
    "<ul>\n" +
    "	<li>Integrationsbeauftragte des <a class =\"highlight\" href=3D\"http://www.berlin.de/ba-reinickendorf/\">Bezirksamtes Reinickendorf</a></li>\n" +
    "	<li><a class =\"highlight\" href=3D\"http://www.albatrosggmbh.de\">Albatros gGmbH</a></li>\n" +
    "	<li>Designgruppe <a class =\"highlight\" href=3D\"http://place-making.org\">place/making (Konzept, Design und Umsetzung)</a></li>\n" +
    "</ul>\n"
  );


  $templateCache.put('partials/ic-confirmation-modal.html',
    "<div\n" +
    "	class		= \"message\" \n" +
    "	ng-repeat 	= \"message in icOverlays.messages.confirmationModal\">\n" +
    "	{{message | translate}}\n" +
    "</div>\n" +
    "<form>\n" +
    "	<div class = \"buttons\">\n" +
    "		<button \n" +
    "			type 		= \"button\"\n" +
    "			ng-click 	= \"cancel()\"\n" +
    "			tabindex	= \"2\"\n" +
    "		>\n" +
    "			{{'INTERFACE.CANCEL' | translate}}\n" +
    "		</button>\n" +
    "\n" +
    "		<button \n" +
    "			type 		= \"button\"\n" +
    "			ng-click 	= \"confirm()\"\n" +
    "			tabindex	= \"1\"\n" +
    "			ic-focus-me\n" +
    "		>\n" +
    "			{{ 'INTERFACE.CONFIRM' | translate}}\n" +
    "		</button>\n" +
    "	</div>\n" +
    "</form>"
  );


  $templateCache.put('partials/ic-filter-interface.html',
    "<div \n" +
    "	class = \"tags\"\n" +
    "	ng-if = \"icFilterConfig.filterBy.topics.length || icFilterConfig.filterBy.targetGroups.length || icFilterConfig.filterBy.state\"\n" +
    ">\n" +
    "\n" +
    "	<!--TOPICS -->\n" +
    "	<a 	\n" +
    "		ng-repeat = \"topic in icFilterConfig.filterBy.topics\"\n" +
    "		ng-click  = \"icFilterConfig.toggleFilter('topics', topic)\" \n" +
    "	>\n" +
    "		<span class =\"icon icon-nav-close\"></span>\n" +
    "		{{\"TOPICS.%s\" | fill : topic |translate}}\n" +
    "	</a>\n" +
    "\n" +
    "\n" +
    "	<!--TARGET_GROUPS -->\n" +
    "	<a \n" +
    "		ng-repeat = \"targetGroup in icFilterConfig.filterBy.targetGroups\"\n" +
    "		ng-click  = \"icFilterConfig.toggleFilter('targetGroups', targetGroup)\" \n" +
    "	>\n" +
    "		<span class =\"icon icon-nav-close\"></span>\n" +
    "		{{\"TARGET_GROUPS.%s\" | fill : targetGroup |translate}}\n" +
    "	</a>\n" +
    "\n" +
    "\n" +
    "	<!--TARGET_GROUPS -->\n" +
    "	<a \n" +
    "		ng-if		= \"icFilterConfig.filterBy.state\"\n" +
    "		ng-click  	= \"icFilterConfig.filterBy.state = undefined\" \n" +
    "	>\n" +
    "		<span class =\"icon icon-nav-close\"></span>\n" +
    "		{{\"INTERFACE.ITEM_STATE_%s\" | fill: icFilterConfig.filterBy.state | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div class = \"controls\">	\n" +
    "	<button\n" +
    "		ng-class	= \"{'active': open == 'sort'}\"\n" +
    "		ic-click 	= \"toggleSortPanel()\" \n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		{{\"INTERFACE.SORT\" | translate}}\n" +
    "	</button><!--\n" +
    "\n" +
    " --><button\n" +
    "		ng-class	= \"{'active': open == 'filter'}\"\n" +
    "		ic-click 	= \"toggleFilterPanel()\" \n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		{{\"INTERFACE.FILTER\" | translate}}\n" +
    "	</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div \n" +
    "	class 	= \"panel sort\"\n" +
    "	ng-if 	= \"open == 'sort'\" \n" +
    ">\n" +
    "	<a\n" +
    "		ng-click	= \"icFilterConfig.reverse = !icFilterConfig.reverse\" \n" +
    "		ng-class 	= \"{'icon-interface-checkbox-selected' :icFilterConfig.reverse, 'icon-interface-checkbox': !icFilterConfig.reverse}\"\n" +
    "		ic-touch-me\n" +
    "	> {{'INTERFACE.SORT_REVERSE' | translate }}</a>\n" +
    "\n" +
    "	<hr/>\n" +
    "\n" +
    "	<a \n" +
    "		ng-click	= \"icFilterConfig.orderBy = 'title'\"\n" +
    "		ng-class 	= \"{'icon-interface-radio-selected' : icFilterConfig.orderBy == 'title', 'icon-interface-radio': icFilterConfig.orderBy != 'title'}\"\n" +
    "		ic-touch-me\n" +
    "	> \n" +
    "		{{'INTERFACE.SORT_TITLE' | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "\n" +
    "	<a \n" +
    "		ng-show		= \"['events', 'services'].indexOf(icFilterConfig.filterBy.type) != -1\"\n" +
    "		ng-click	= \"icFilterConfig.orderBy = 'start_date'\"\n" +
    "		ng-class 	= \"{'icon-interface-radio-selected' : icFilterConfig.orderBy == 'start_date', 'icon-interface-radio': icFilterConfig.orderBy != 'start_date'}\"\n" +
    "		ic-touch-me\n" +
    "	> \n" +
    "		{{'INTERFACE.SORT_DATE' | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "	<a \n" +
    "		ng-show		= \"icUser.can('edit_items')\"\n" +
    "		ng-click	= \"icFilterConfig.orderBy = 'created_on'\"\n" +
    "		ng-class 	= \"{'icon-interface-radio-selected' : icFilterConfig.orderBy == 'created_on', 'icon-interface-radio': icFilterConfig.orderBy != 'created_on'}\"\n" +
    "		ic-touch-me\n" +
    "	> \n" +
    "		{{'INTERFACE.SORT_CREATION_DATE' | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "		<a \n" +
    "		ng-show		= \"icUser.can('edit_items')\"\n" +
    "		ng-click	= \"icFilterConfig.orderBy = 'last_edit_on'\"\n" +
    "		ng-class 	= \"{'icon-interface-radio-selected' : icFilterConfig.orderBy == 'last_edit_on', 'icon-interface-radio': icFilterConfig.orderBy != 'last_edit_on'}\"\n" +
    "		ic-touch-me\n" +
    "	> \n" +
    "		{{'INTERFACE.SORT_LAST_EDIT' | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div \n" +
    "	class 	= \"panel filter\"\n" +
    "	ng-if	= \"open == 'filter'\" \n" +
    ">\n" +
    "\n" +
    "	<a \n" +
    "		class		= \"heavy\"\n" +
    "		ng-class	= \"{'icon-interface-arrow-right': !expand.topics, 'icon-interface-arrow-down': expand.topics}\" \n" +
    "		ic-click 	= \"expand.topics = !expand.topics\"\n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		{{\"INTERFACE.TOPICS\" | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "	<div ng-if = \"expand.topics\">\n" +
    "		<a \n" +
    "			ng-click 	= \"icFilterConfig.clearFilter('topics')\" \n" +
    "			ng-class 	= \"{'icon-interface-checkbox-selected' : icFilterConfig.matchFilter('topics', undefined), 'icon-interface-checkbox': !icFilterConfig.matchFilter('topics', undefined)}\"\n" +
    "			ic-touch-me\n" +
    "		>\n" +
    "			{{\"INTERFACE.TOPICS_ALL\" | translate}}\n" +
    "		</a>\n" +
    "		<a \n" +
    "			ng-repeat 	= \"topic in icConfigData.topics | orderBy : 'toString()| uppercase | prepend: \\'TOPICS.\\' |translate'\"\n" +
    "			ng-click 	= \"icFilterConfig.toggleFilter('topics', topic)\" \n" +
    "			ng-class 	= \"{'icon-interface-checkbox-selected' : icFilterConfig.matchFilter('topics', topic), 'icon-interface-checkbox': !icFilterConfig.matchFilter('topics', topic)}\"\n" +
    "			ic-touch-me			\n" +
    "		>\n" +
    "			{{topic | uppercase | prepend: \"TOPICS.\" |translate}}\n" +
    "		</a>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<hr/>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<a \n" +
    "		class		= \"heavy\"\n" +
    "		ng-class	= \"{'icon-interface-arrow-right': !expand.targetGroups, 'icon-interface-arrow-down': expand.targetGroups}\" \n" +
    "		ic-click 	= \"expand.targetGroups = !expand.targetGroups\"\n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		{{\"INTERFACE.TARGET_GROUPS\" | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "	<div ng-if = \"expand.targetGroups\">\n" +
    "		<a \n" +
    "			ng-click 	= \"icFilterConfig.clearFilter('targetGroups')\" \n" +
    "			ng-class 	= \"{'icon-interface-checkbox-selected' : icFilterConfig.matchFilter('targetGroups', undefined), 'icon-interface-checkbox': !icFilterConfig.matchFilter('targetGroups', undefined)}\"\n" +
    "			ic-touch-me			\n" +
    "		>\n" +
    "			{{\"INTERFACE.TARGET_GROUPS_ALL\" | translate}}\n" +
    "		</a>\n" +
    "		<a \n" +
    "			ng-repeat 	= \"targetGroup in icConfigData.targetGroups | orderBy : 'toString()| uppercase | prepend: \\'TARGET_GROUPS.\\' |translate'\"\n" +
    "			ng-click 	= \"icFilterConfig.toggleFilter('targetGroups', targetGroup)\" \n" +
    "			ng-class 	= \"{'icon-interface-checkbox-selected' : icFilterConfig.matchFilter('targetGroups', targetGroup), 'icon-interface-checkbox': !icFilterConfig.matchFilter('targetGroups', targetGroup)}\"\n" +
    "			ic-touch-me			\n" +
    "		>\n" +
    "			{{targetGroup | uppercase | prepend: \"TARGET_GROUPS.\" |translate}}\n" +
    "		</a>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<hr ng-if		= \"icUser.can('edit_items')\"/>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<a \n" +
    "		class		= \"heavy\"\n" +
    "		ng-if		= \"icUser.can('edit_items')\"\n" +
    "		ng-class	= \"{'icon-interface-arrow-right': !expand.state, 'icon-interface-arrow-down': expand.state}\" \n" +
    "		ng-click 	= \"expand.state = !expand.state\"\n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		{{\"INTERFACE.ITEM_STATE\" | translate}}\n" +
    "	</a>\n" +
    "\n" +
    "	<div ng-if = \"expand.state && icUser.can('edit_items')\">\n" +
    "\n" +
    "		<a \n" +
    "			ng-click 	= \"icFilterConfig.filterBy.state = undefined\" \n" +
    "			ng-class 	= \"{'icon-interface-radio-selected' : !icFilterConfigfilterBy.state, 'icon-interface-radio': icFilterConfig.filterBy.state}\"\n" +
    "			ic-touch-me			\n" +
    "		>\n" +
    "			{{\"INTERFACE.ITEM_STATE_ALL\" | translate}}\n" +
    "		</a>\n" +
    "\n" +
    "		<a \n" +
    "			ng-repeat 	= \"state in  ['published', 'draft', 'suggestion', 'archived']\"\n" +
    "			ng-click 	= \"icFilterConfig.filterBy.state = state\" \n" +
    "			ng-class 	= \"{'icon-interface-radio-selected' : icFilterConfig.filterBy.state == state, 'icon-interface-radio': icFilterConfig.filterBy.state != state}\"\n" +
    "			ic-touch-me			\n" +
    "		>\n" +
    "			{{'INTERFACE.ITEM_STATE_%s' | fill : state |translate}}\n" +
    "		</a>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/ic-full-item.html',
    "<ic-unavailable ng-if =\"!loading && !item\"></ic-unavailable>\n" +
    "\n" +
    "<div class = \"meta screen-only\">\n" +
    "	<div  \n" +
    "		ng-if	= \"icUser.can('add_new_items') && (item.meta.created_on || item.created_by)\"\n" +
    "		class 	= \"nondescript\"\n" +
    "	>\n" +
    "		{{'INTERFACE.CREATED_BY' | translate}} {{item.meta.created_by || ('INTERFACE.UNKNOWN' | translate) }}, {{ (item.meta.created_on | icDate : true) || ('INTERFACE.UNKNOWN' | translate)}}\n" +
    "	</div>\n" +
    "\n" +
    "	<div \n" +
    "		ng-if	= \"icUser.can('edit_items')  && (item.meta.last_edit_on || item.last_edit_by)\"\n" +
    "		class 	= \"nondescript\"\n" +
    "	>\n" +
    "		{{'INTERFACE.LAST_EDIT_BY' | translate}} {{item.meta.last_edit_by || ('INTERFACE.UNKNOWN' | translate) }}, {{ (item.meta.last_edit_on| icDate : true) || ('INTERFACE.UNKNOWN' | translate)}}\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<article \n" +
    "	ng-if = \"item && !editMode\"\n" +
    ">\n" +
    "\n" +
    "\n" +
    "	<h2 ng-if = \"item.state == 'new' && icUser.can('add_new_items')\"> 		{{ 'INTERFACE.ADD_NEW_ITEM'		| translate }}</h2>\n" +
    "	<h2 ng-if = \"item.state == 'new' && icUser.can('suggest_new_items')\"> 	{{ 'INTERFACE.SUGGEST_NEW_ITEM'	| translate }}</h2>\n" +
    "\n" +
    "	<div ng-if = \"icUser.can(edit_items)\" class = \"last-edit\"> {{'INTERFACE.LAST_EDIT' | translate}}: {{item.lastEdit | icDate}}</div>\n" +
    "\n" +
    "	<ic-spinner active = \"loading\"></ic-spinner>\n" +
    "\n" +
    "\n" +
    "	<!-- start item title -->\n" +
    "\n" +
    "	<h2 class 	= \"title\" >\n" +
    "		<span class = \"iblock\">\n" +
    "			{{ item.title }}\n" +
    "		</span>\n" +
    "\n" +
    "		<span \n" +
    "			class = \"state iblock\"\n" +
    "			ng-if = \"icUser.can('edit_items') && item.state\"\n" +
    "		>\n" +
    "			[ {{item.state | uppercase | prepend : 'INTERFACE.ITEM_STATE_' | translate}} ]\n" +
    "		</span>\n" +
    "	</h2>\n" +
    "\n" +
    "	<!-- end item title -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- definition -->\n" +
    "\n" +
    "	<h3 class 	= \"definition\"> {{ item.definition[language] }}</h3>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- type -->\n" +
    "\n" +
    "	<div class 	= \"type\">\n" +
    "		<div>{{\"TYPES.%s\" | fill : item.type | translate}}</div>\n" +
    "	</div>\n" +
    "	\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- topic and targets groups -->\n" +
    "\n" +
    "\n" +
    "	<div class 	= \"topics-and-target-groups highlight\">\n" +
    "		<a \n" +
    "			ng-repeat 	= \"topic in item.topics\"\n" +
    "			ng-class	= \"{'primary' : item.primaryTopic == topic}\"\n" +
    "			class		= \"highlight\"\n" +
    "			ng-href		= \"/#/tp/{{topic}}\"\n" +
    "		>{{topic | uppercase | prepend : \"TOPICS.\" | translate }}</a><!--\n" +
    "	--><a \n" +
    "			ng-repeat 	= \"target_group in item.targetGroups\"\n" +
    "			class		= \"highlight\"\n" +
    "			ng-href		= \"/#/tg/{{target_group}}\"\n" +
    "		>{{target_group | uppercase | prepend : \"TARGET_GROUPS.\" | translate }}</a>\n" +
    "\n" +
    "		<img \n" +
    "			class		= \"print-only\"\n" +
    "			ng-src 		= \"/images/icon_topic_{{item.primaryTopic}}_black.svg\" \n" +
    "		/>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "	<!-- image -->\n" +
    "\n" +
    "	<img\n" +
    "		class			= \"hero\" \n" +
    "		ng-show			= \"item.imageUrl && !fallback\" \n" +
    "		ng-src 			= \"{{ item.imageUrl }}\"\n" +
    "		ic-image-bad	= \"fallback = true\" \n" +
    "		ic-image-good	= \"fallback = false\"\n" +
    "		ic-track-image-state\n" +
    "	/>\n" +
    "\n" +
    "	<div\n" +
    "		ng-if 	= \"icUser.can('edit_items') && item.imageUrl && fallback\" \n" +
    "		class 	= \"fallback\"\n" +
    "		title 	= \"{{'INTERFACE.UNABLE_TO_LOAD_IMAGE' | translate }}\"\n" +
    "	>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- description -->\n" +
    "\n" +
    "	<p \n" +
    "		ng-bind-html 	= \"item.description[language] | trustAsHtml\"\n" +
    "		class			= \"description\"\n" +
    "	>\n" +
    "	</p>\n" +
    "\n" +
    "\n" +
    "	<hr/>\n" +
    "\n" +
    "	<!-- address -->\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if			= \"item.address\"\n" +
    "		ic-title 		= \"'INTERFACE.ITEM_ADDRESS' | translate\"\n" +
    "		ic-content		= \"item.address\"\n" +
    "		ic-extra-lines	= \"[(item.zip||'') + ' ' + (item.location||''), item.country]\"\n" +
    "		ic-extra-links	= \"{'Google Maps' : GMLink, 'OpenStreetMap' : OSMLink}\"\n" +
    "		ic-icon			= \"'address'| icIcon : 'item' : 'black'\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- geo coordinates -->\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if			= \"item.longitude && item.latitude && !item.address\"\n" +
    "		ic-title 		= \"'INTERFACE.ITEM_GEO_COORDINATES' | translate\"\n" +
    "		ic-content		= \"item.latitude + ', ' +item.longitude\"\n" +
    "		ic-icon			= \"'geo_coordinates'| icIcon : 'item' : 'black'\"\n" +
    "		ic-extra-links	= \"{'Google Maps' : GMLink, 'OpenStreetMap' : OSMLink}\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- misc -->\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-repeat	= \"key in ['name', 'website', 'email', 'phone', 'facebook', 'twitter', 'price', 'maxParticipants']\"\n" +
    "		ng-if		= \"item[key]\"\n" +
    "		ic-title 	= \"'INTERFACE.ITEM_%s' | fill : key | translate\"\n" +
    "		ic-content	= \"item[key]\"\n" +
    "		ic-icon		= \"key | icIcon : 'item' : 'black'\"\n" +
    "		ic-link		= \"::key | icLinkPrefix\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "	<!-- start and end dates -->\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if		= \"item.startDate && item.endDate\"\n" +
    "		ic-title 	= \"'INTERFACE.ITEM_DATES' | translate\"\n" +
    "		ic-content	= \"(item.startDate | icDate) +' – '+ (item.endDate | icDate)\"\n" +
    "		ic-icon		= \"'startDate' | icIcon : 'item' : 'black'\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if		= \"item.startDate && !item.endDate\"\n" +
    "		ic-title 	= \"'INTERFACE.ITEM_START_DATE' | translate\"\n" +
    "		ic-content	= \"item.startDate | icDate\"\n" +
    "		ic-icon		= \"'startDate' | icIcon : 'item' : 'black'\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if		= \"item.endDate && !item.startDate\"\n" +
    "		ic-title 	= \"'INTERFACE.ITEM_END_DATE' | translate\"\n" +
    "		ic-content	= \"item.endDate | icDate\"\n" +
    "		ic-icon		= \"'startDate' | icIcon : 'item' : 'black'\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- hours -->\n" +
    "\n" +
    "	<ic-info-tag\n" +
    "		ng-if			= \"item.hours\"\n" +
    "		ic-title 		= \"'INTERFACE.ITEM_HOURS' | translate\"\n" +
    "		ic-extra-lines	= \"item.hours | icSplit : ','\"\n" +
    "		ic-icon			= \"'hours'| icIcon : 'item' : 'black'\"\n" +
    "	>\n" +
    "	</ic-info-tag>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<hr/>\n" +
    "\n" +
    "\n" +
    "	<qrcode \n" +
    "		version					=	\"3\" \n" +
    "		error-correction-level	=	\"M\" \n" +
    "		size					=	\"200\" \n" +
    "		data					=	\"{{item.id | icItemLink}}\"\n" +
    "		ng-if					=	\"item\"\n" +
    "		ic-toggle-overlay		=	\"qrcode\"\n" +
    "	>\n" +
    "	</qrcode>\n" +
    "\n" +
    "	<div class =\"link-to-item print-only\">\n" +
    "		{{item.id | icItemLink}}\n" +
    "	</div>\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<div \n" +
    "		ng-if = \"icUser.can('edit_items') && item.comment\"\n" +
    "		class = \"nondescript screen-only wsp\"\n" +
    "	>{{item.comment}}</div> <!-- dont insert linebreaks here -->\n" +
    "\n" +
    "	<div class = \"logo print-only\">\n" +
    "		<ic-text-logo></ic-text-logo> Berlin\n" +
    "	</div>\n" +
    "\n" +
    "	<div class = \"url print-only\">\n" +
    "		www.info-compass.eu\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "</article>\n" +
    "\n" +
    "\n" +
    "<!-- EDIT MODE -->\n" +
    "\n" +
    "\n" +
    "<article ng-if = \"item && editMode\">\n" +
    "\n" +
    "	<!-- title -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"title\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "	<div\n" +
    "		ng-if = \"editMode && itemEdit.title\"\n" +
    "	>\n" +
    "		<div\n" +
    "			ng-repeat 	= \"title in icConfigData.titles\"\n" +
    "			ng-if		= \"(item.title | stripSpecialChars) != (itemEdit.title | stripSpecialChars) && (title | stripSpecialChars) == (itemEdit.title | stripSpecialChars)\"\n" +
    "			\n" +
    "		>\n" +
    "			{{'INTERFACE.POSSIBLE_ITEM_DUPLICATE' | translate}}: {{title}}\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "	<!-- definition -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"definition\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"true\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "	<!-- description -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type 				= \"text\"\n" +
    "		ic-key					= \"description\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"true\"\n" +
    "	></ic-item-edit-property>\n" +
    "	\n" +
    "	<!-- image -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"imageUrl\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr/>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- type -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type					= \"string\"\n" +
    "		ic-options				= \"::icConfigData['types']\"\n" +
    "		ic-option-label			= \"option | uppercase | prepend : 'TYPES.' | translate\"\n" +
    "		ic-key					= \"type\"\n" +
    "		ic-item					= \"item\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<!-- topics -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type					= \"array\"\n" +
    "		ic-options				= \"::icConfigData['topics']\"\n" +
    "		ic-option-label			= \"option | uppercase | prepend : 'TOPICS.' | translate\"\n" +
    "		ic-key					= \"topics\"\n" +
    "		ic-item					= \"item\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<!-- primary topic -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type					= \"string\"\n" +
    "		ic-options				= \"itemEdit.topics\"\n" +
    "		ic-option-label			= \"option | uppercase | prepend : 'TOPICS.' | translate\"\n" +
    "		ic-key					= \"primaryTopic\"\n" +
    "		ic-item					= \"item\"\n" +
    "	></ic-item-edit-property>\n" +
    "	\n" +
    "\n" +
    "	<!-- target groups -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ic-type					= \"array\"\n" +
    "		ic-options				= \"::icConfigData['targetGroups']\"\n" +
    "		ic-option-label			= \"option | uppercase | prepend : 'TARGET_GROUPS.' | translate\"\n" +
    "		ic-key					= \"targetGroups\"\n" +
    "		ic-item					= \"item\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<!-- address, zip, location, country, startDate ... -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-repeat				= \"key in ['address', 'zip', 'location', 'country', 'startDate', 'endDate', 'hours']\"\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"{{key}}\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<!--social media -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-repeat				= \"key in ['website', 'facebook', 'twitter']\"\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"{{key}}\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<!--contat details -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-repeat				= \"key in ['name', 'email', 'phone']\"\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"{{key}}\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<!-- misc -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-repeat				= \"key in ['maxParticipants', 'longitude', 'latitude']\"\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"{{key}}\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-repeat				= \"key in ['price']\"\n" +
    "		ic-type 				= \"string\"\n" +
    "		ic-key					= \"{{key}}\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-translatable			= \"false\"\n" +
    "		ic-force-number			= \"true\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "	<hr />\n" +
    "\n" +
    "	<!-- state -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-if					= \"icUser.can('edit_items')\"\n" +
    "		ic-type					= \"string\"\n" +
    "		ic-options				= \"::['draft', 'published', 'suggestion', 'archived']\"\n" +
    "		ic-option-label			= \"'INTERFACE.ITEM_STATE_%s' | fill : option | translate\"\n" +
    "		ic-key					= \"state\"\n" +
    "		ic-item					= \"item\"\n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- Suggestion comment -->\n" +
    "\n" +
    "	<ic-item-edit-property\n" +
    "		ng-if					= \"icUser.can('edit_items') || icUser.can('add_new_items') || icUser.can('suggest_item_edits') || icUser.can('suggest_new_items')\"\n" +
    "		ic-type					= \"text\"\n" +
    "		ic-key					= \"comment\"\n" +
    "		ic-item					= \"item\"\n" +
    "		ic-ignore-current-value	= \"!icUser.can('edit_items')\" \n" +
    "	></ic-item-edit-property>\n" +
    "\n" +
    "\n" +
    "</article>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<footer ng-if = \"item\">\n" +
    "	<div class = \"tools\">\n" +
    "		<a \n" +
    "			ng-click 	= \"print()\"\n" +
    "			ng-if		= \"!editMode\"\n" +
    "			class		= \"icon-interface-print\"\n" +
    "			ic-touch-me\n" +
    "		>	\n" +
    "			{{'INTERFACE.PRINT' | translate}}		\n" +
    "		</a>\n" +
    "\n" +
    "		<a \n" +
    "			ng-if				= \"!editMode\"\n" +
    "			ic-toggle-overlay	= \"sharingMenu\"\n" +
    "			class				= \"icon-interface-share\"\n" +
    "			ic-touch-me\n" +
    "		>				\n" +
    "			{{'INTERFACE.SHARE'	| translate}}		\n" +
    "		</a>\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"cancelEdit()\"\n" +
    "			ng-if		= \"editMode\"\n" +
    "			class		= \"icon-interface-cancel\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.CANCEL' | translate}} </a>\n" +
    "\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"edit()\"\n" +
    "			ng-show		= \"!editMode\"\n" +
    "			class		= \"icon-interface-edit\"\n" +
    "			ic-touch-me\n" +
    "		> {{ (icUser.can('edit_items') ? 'INTERFACE.EDIT' : 'INTERFACE.SUGGEST_EDIT') | translate}} </a>\n" +
    "\n" +
    "\n" +
    "		<a\n" +
    "			ng-click	= \"archive()\"\n" +
    "			ng-if		= \"item.state != 'archived'\"\n" +
    "			ng-show		= \"icUser.can('delete_items') && !editMode\"\n" +
    "			class		= \"icon-interface-delete\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.ARCHIVE' | translate }}</a>\n" +
    "\n" +
    "\n" +
    "		<a\n" +
    "			ng-click	= \"delete()\"\n" +
    "			ng-if		= \"item.state == 'archived'\"\n" +
    "			ng-show		= \"icUser.can('delete_items') && !editMode\"\n" +
    "			class		= \"icon-interface-delete\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.DELETE' | translate }}</a>\n" +
    "\n" +
    "\n" +
    "		<!-- submit -->\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"submitItemEdits()\"\n" +
    "			ng-if		= \"item.state != 'new' && icUser.can('edit_items') && editMode\"\n" +
    "			class		= \"icon-interface-save\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.SUBMIT_ITEM_EDITS' | translate}} </a>\n" +
    "\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"submitNewItem()\"\n" +
    "			ng-if		= \"item.state == 'new' && icUser.can('add_new_items') && editMode\"\n" +
    "			class		= \"icon-interface-save\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.SUBMIT_NEW_ITEM' | translate}} </a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "		<!-- Suggestion -->\n" +
    "\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"submitEditSuggestions()\"\n" +
    "			ng-if		= \"item.state != 'new' && icUser.can('suggest_item_edits') && editMode\"\n" +
    "			class		= \"icon-interface-save\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.SUBMIT_EDIT_SUGGESTIONS' | translate}} </a>\n" +
    "\n" +
    "		<a \n" +
    "			ng-click	= \"submitItemSuggestion()\"\n" +
    "			ng-if		= \"item.state == 'new' && icUser.can('suggest_new_items') && editMode\"\n" +
    "			class		= \"icon-interface-save\"\n" +
    "			ic-touch-me\n" +
    "		> {{'INTERFACE.SUBMIT_ITEM_SUGGESTION' | translate}} </a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	</div>\n" +
    "</footer>\n"
  );


  $templateCache.put('partials/ic-header.html',
    "	<button\n" +
    "		type				= \"button\"	\n" +
    "		class 				= \"icon-nav-menu fleft text-right\"\n" +
    "		ic-toggle-overlay 	= \"mainMenu\" \n" +
    "		ng-if				= \"icMenu\"\n" +
    "		ic-touch-me	\n" +
    "	>{{\"INTERFACE.MENU\" | translate }}</button>\n" +
    "\n" +
    "	<button\n" +
    "		type				= \"button\"\n" +
    "		class				= \"icon-interface-close fleft\"\n" +
    "		ng-if				= \"icCloseItem\"\n" +
    "		ng-click			= \"icSite.clearItem()\"\n" +
    "		ic-touch-me	\n" +
    "	></button>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<button \n" +
    "		type				= \"button\"\n" +
    "		class 				= \"icon-interface-share highlight\"\n" +
    "		ng-if				= \"icShare\"\n" +
    "		ic-toggle-overlay	= \"sharingMenu\"\n" +
    "		ic-touch-me	\n" +
    "	></button>\n" +
    "	\n" +
    "	<button \n" +
    "		type				= \"button\"\n" +
    "		class 				= \"icon-interface-print highlight\"\n" +
    "		ng-if				= \"icPrint\"\n" +
    "		ng-click			= \"print()\"\n" +
    "		ic-touch-me	\n" +
    "	></button>\n" +
    "\n" +
    "	<button \n" +
    "		type				= \"button\"\n" +
    "		class 				= \"icon-nav-language text-left\"\n" +
    "		ng-if				= \"icLanguages\"\n" +
    "		ic-toggle-overlay 	= \"languageMenu\" \n" +
    "		ic-touch-me	\n" +
    "	>\n" +
    "		<span ng-if = \"icLarge\">\n" +
    "			{{\"INTERFACE.LANGUAGES\" | translate }}\n" +
    "		</span>\n" +
    "	</button>"
  );


  $templateCache.put('partials/ic-impress.html',
    "<h2>{{'INTERFACE.IMPRESS_HEADING' | translate}}</h2>\n" +
    "\n" +
    "<p>\n" +
    "Verband für sozial-kulturelle Arbeit e.V. <br/>\n" +
    "Tucholskystr. 11 <br/>\n" +
    "10117 Berlin <br/>\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Tel. +49 / (0)30 / 28 09 61 03\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Vorsitzender: Prof. Stephan F. Wagner, Renate Wilkening (Stellv.)\n" +
    "Geschäftsführerin: Barbara Rehbehn (ViSdP)\n" +
    "Registernummer: VR 28242 B\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "	<a href =\"www.vska.de\">www.vska.de</a>\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Angaben gemäß § 5 TMG, § 10 MDStV </br>\n" +
    "Haftungshinweis: </br>\n" +
    "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. </br>\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Verantwortlich Konzeption, Design, Entwicklung: <br/>\n" +
    "place/making Stefan Göllner, Jan Lindenberg GbR\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Bei Fragen zum info-compass Projekt wenden Sie sich bitte an: <br/>\n" +
    "E-Mail: kontakt@info-compass.net\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "Projektwebsite (Deutsch): <a href = \"www.info-compass.berlin\">www.info-compass.berlin</a>\n" +
    "</p>\n"
  );


  $templateCache.put('partials/ic-info-tag.html',
    "<div class = \"icon\"><img ng-src = \"{{icIcon}}\"/></div>\n" +
    "<div class = \"title\"> {{icTitle}} </div>\n" +
    "<div class = \"content\">		\n" +
    "	<a \n" +
    "		class 	= \"highlight\"\n" +
    "		ng-if	= \"link\"\n" +
    "		ng-href = \"{{link}}\"\n" +
    "		target	= \"_blank\"\n" +
    "	>\n" +
    "		{{icContent}}	\n" +
    "	</a>\n" +
    "\n" +
    "	<span\n" +
    "		ng-if 	= \"!link\"\n" +
    "	>\n" +
    "		{{icContent}}	\n" +
    "	</span>\n" +
    "\n" +
    "	<div \n" +
    "		ng-repeat 	= \"line in icExtraLines\"\n" +
    "		ng-if		= \"line | trim\"\n" +
    "		class		= \"extra-line\"\n" +
    "	>\n" +
    "		{{line}}\n" +
    "	</div>\n" +
    "\n" +
    "	<div \n" +
    "		ng-repeat 	= \"(name, href) in icExtraLinks\"\n" +
    "		ng-if		= \"name | trim\"\n" +
    "		class		= \"extra-link screen-only\"\n" +
    "	>\n" +
    "		<a class =\"highlight\" ng-href = \"{{href}}\">{{name}}</a>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('partials/ic-item-edit-property.html',
    "<h4\n" +
    "	ic-click 	= \"expand = !expand\"\n" +
    "	ng-class	= \"{'icon-interface-arrow-right': !expand, 'icon-interface-arrow-down': expand}\"\n" +
    "	ic-touch-me\n" +
    "> {{'INTERFACE.ITEM_%s' | fill : icKey | translate}} {{ icTranslatable ? '('+icLanguages.currentLanguage+')' : ''}}</h4>\n" +
    "<div \n" +
    "	ng-if	= \"expand\"\n" +
    "	class 	= \"requirement\"\n" +
    ">{{'INTERFACE.ITEM_%s_REQUIREMENT' | fill : icKey | translate}}</div>\n" +
    "\n" +
    "\n" +
    "<form \n" +
    "	ng-submit 	= \"allowLocalEdit && update()\"\n" +
    "	ng-if		= \"expand\"\n" +
    ">\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- String -->	\n" +
    "\n" +
    "	<div ng-if	= \"::icType == 'string' && !icOptions\" >\n" +
    "\n" +
    "		<div \n" +
    "			ng-if 	= \"showCurrentValue\"\n" +
    "			class 	= \"current-value {{diff() ? 'diff' : ''}} \"\n" +
    "		>\n" +
    "			{{value.current || ('INTERFACE.EMPTY' | translate) }}\n" +
    "		</div>	\n" +
    "\n" +
    "		<input \n" +
    "			type 		= \"text\"\n" +
    "			ng-model	= \"value.new\" \n" +
    "		></input>\n" +
    "	</div>\n" +
    "\n" +
    "	<div ng-if = \"::icType == 'string' && icOptions != undefined\">\n" +
    "\n" +
    "		<div \n" +
    "			ng-if 	= \"showCurrentValue\"\n" +
    "			class 	= \"current-value {{diff() ? 'diff' : ''}} \"\n" +
    "		>\n" +
    "			{{ value.current ? icOptionLabel({option:value.current}) : ('INTERFACE.EMPTY' | translate) }}\n" +
    "		</div>	\n" +
    "\n" +
    "		<div class = \"options\">\n" +
    "			<a \n" +
    "				ng-repeat 	= \"option in icOptions\"\n" +
    "				ng-class 	= \"{'icon-interface-radio-selected' : value.new == option , 'icon-interface-radio': value.new  != option}\"\n" +
    "				ng-click	= \"value.new = option\"\n" +
    "			>{{icOptionLabel({option: option}) }}</a>\n" +
    "			<span ng-if = \"icOptions.length == 0\">{{'INTERFACE.NO_OPTIONS' | translate}}</span>\n" +
    "		</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- Text -->\n" +
    "\n" +
    "	<div ng-if		= \"::icType == 'text'\">\n" +
    "\n" +
    "		<div \n" +
    "			ng-if 	= \"showCurrentValue\"\n" +
    "			class 	= \"current-value {{diff() ? 'diff' : ''}} \"\n" +
    "		>\n" +
    "			{{value.current || ('INTERFACE.EMPTY' | translate) }}\n" +
    "		</div>	\n" +
    "		\n" +
    "		<textarea\n" +
    "			ng-model	= \"value.new\"\n" +
    "			ic-auto-grow\n" +
    "		></textarea>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- Array -->\n" +
    "\n" +
    "	<div ng-if	= \"::icType == 'array'\">\n" +
    "\n" +
    "		<div \n" +
    "			ng-if 	= \"showCurrentValue\"\n" +
    "			class 	= \"current-value {{diff() ? 'diff' : ''}} \"\n" +
    "		>\n" +
    "			<span ng-repeat = \"option in value.current\">\n" +
    "				{{icOptionLabel({option: option})}}{{$last ? '' : ','}}\n" +
    "			</span>\n" +
    "			{{value.current.length == 0 ? ('INTERFACE.EMPTY' | translate) : ''}}\n" +
    "		</div>	\n" +
    "\n" +
    "		<div class = \"options\">\n" +
    "			<a \n" +
    "				ng-repeat 	= \"option in ::icOptions\"\n" +
    "				ng-class 	= \"{'icon-interface-checkbox-selected' : value.new.indexOf(option) != -1 , 'icon-interface-checkbox': value.new.indexOf(option) == -1}\"\n" +
    "				ng-click	= \"toggleOption(option)\"\n" +
    "			>{{icOptionLabel({option: option})}}</a>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<button\n" +
    "		ng-show		= \"allowLocalEdit\"\n" +
    "		type 		= \"submit\"\n" +
    "		ng-disabled	= \"updating || value.new == value.current\" \n" +
    "	>\n" +
    "		{{ \"INTERFACE.UPDATE\" | translate }}\n" +
    "	</buton>\n" +
    "\n" +
    "	<button\n" +
    "		ng-show		= \"allowLocalEdit\"\n" +
    "		ic-click	= \"revert()\" \n" +
    "		ng-disabled	= \"updating || value.new == value.current\"\n" +
    "		type		= \"button\"\n" +
    "	>\n" +
    "		{{ \"INTERFACE.REVERT\" | translate }}\n" +
    "	</buton>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('partials/ic-language-menu.html',
    "<h2>\n" +
    "	{{\"INTERFACE.CHOOSE_LANGUAGE\" | translate}}\n" +
    "</h2>\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ng-repeat 	= \"language in ::icLanguages.availableLanguages\"\n" +
    "	ng-click	= \"icLanguages.currentLanguage = language\"\n" +
    "	ng-class 	= \"{'highlight active': icLanguages.currentLanguage == language}\"	\n" +
    "	ic-touch-me	\n" +
    ">\n" +
    "	<span class = \"native\">{{\"LANGUAGES.\"+language.toUpperCase()+\".NATIVE\" | translate}}</span>\n" +
    "	<span \n" +
    "		ng-if = \"icLanguages.currentLanguage != language\"\n" +
    "		class = \"translation light\"\n" +
    "	>\n" +
    "			{{\"LANGUAGES.\"+language.toUpperCase()+\".NAME\" | translate}}\n" +
    "	</span>\n" +
    "</a>"
  );


  $templateCache.put('partials/ic-layout.html',
    "<!--\n" +
    "\n" +
    "\n" +
    " --><section \n" +
    "		class   = \"page\"\n" +
    "		ng-if   = \"icSite.show('page')\"\n" +
    "	>\n" +
    "		<div ng-include = \"icSite.pageUrl\"></div>\n" +
    "	</section><!--\n" +
    "\n" +
    "\n" +
    " --><section \n" +
    "		class	= \"filter\"    \n" +
    "		ng-if	= \"icSite.show('filter')\"\n" +
    "	>\n" +
    "		<ic-section-filter></ic-section-filter>\n" +
    "	</section><!--\n" +
    "\n" +
    "\n" +
    " --><section \n" +
    "		class   = \"list\"  \n" +
    "		ng-if   = \"icSite.show('list')\"\n" +
    "		fake-scroll-bump\n" +
    "	>\n" +
    "		<ic-section-list\n" +
    "			ic-show-filter  =   \"smlLayout.mode.name == 'XS' || (smlLayout.mode.name == 'M' && icSite.show('item'))\" \n" +
    "		></ic-section-list>\n" +
    "	</section><!--\n" +
    "\n" +
    "\n" +
    "	 <ic-horizontal-swipe-list-x\n" +
    "		ic-model-as = \"icId\"\n" +
    "		ic-previous = \"icSearchResults.getPreviousId(icModel)\"\n" +
    "		ic-current  = \"icSite.params.item\"\n" +
    "		ic-next     = \"icSearchResults.getNextId(icModel)\"\n" +
    "		ic-on-turn  = \"icSite.addItemToPath(icModel)\"\n" +
    "	>\n" +
    "--><section \n" +
    "		class   		= \"item\" \n" +
    "		ng-if   		= \"icSite.show('item')\"\n" +
    "		ic-scroll-top 	= \"{{icSite.params.item}}\" \n" +
    "	>                   \n" +
    "		<ic-header\n" +
    "			ng-if 			= \"icSite.useLocalHeader('item')\"\n" +
    "			ic-close-item	= \"true\"\n" +
    "			ic-share		= \"true\"\n" +
    "			ic-print		= \"true\"\n" +
    "		>\n" +
    "		</ic-header>\n" +
    "		<ic-section-item></ic-section-item>\n" +
    "	</section><!--\n" +
    "	 </ic-horizontal-swipe-list>\n" +
    "	 -->\n" +
    "\n"
  );


  $templateCache.put('partials/ic-login.html',
    "<div\n" +
    "	class		= \"message\" \n" +
    "	ng-repeat 	= \"message in icOverlays.messages.login\"\n" +
    ">\n" +
    "	{{message | translate}}\n" +
    "</div>\n" +
    "\n" +
    "<form ng-submit = \"login()\">\n" +
    "	<label>\n" +
    "		{{'INTERFACE.USERNAME' | translate}}\n" +
    "		<input\n" +
    "			type 		= \"text\"\n" +
    "			ng-model 	= \"username\"	\n" +
    "			tabindex	= \"1\"	\n" +
    "			ic-focus-me		 \n" +
    "		></input>\n" +
    "	</label>\n" +
    "	<label>\n" +
    "		{{'INTERFACE.PASSWORD' | translate}}\n" +
    "		<input\n" +
    "			type 		= \"password\"\n" +
    "			ng-model 	= \"password\"	\n" +
    "			tabindex	= \"2\"		 		 \n" +
    "		></input>\n" +
    "	</label>\n" +
    "\n" +
    "	<div class = \"buttons\">\n" +
    "		<button \n" +
    "			type 		= \"button\"\n" +
    "			ng-click 	= \"cancel()\"\n" +
    "			tabindex	= \"4\"		 		 \n" +
    "		>\n" +
    "			{{ 'INTERFACE.CANCEL' | translate}}\n" +
    "		</button>\n" +
    "\n" +
    "		<button \n" +
    "			type 		= \"submit\"\n" +
    "			tabindex	= \"3\"		 \n" +
    "		>\n" +
    "			{{'INTERFACE.LOGIN' | translate}}\n" +
    "		</button>\n" +
    "	</div>\n" +
    "</form>"
  );


  $templateCache.put('partials/ic-main-menu.html',
    "<h1\n" +
    "	ic-home\n" +
    "	ic-toggle-overlay \n" +
    "	class	= \"logo pointer\"\n" +
    ">\n" +
    "	<ic-text-logo></ic-text-logo>\n" +
    "</h1>\n" +
    "\n" +
    "<ic-search				\n" +
    "	class 			= \"white right\"\n" +
    "	ic-on-update	= \"icSite.clearItem(); icFilterConfig.clearFilter();icOverlays.toggle('mainMenu');\"\n" +
    "></ic-search>\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ic-home\n" +
    "	ic-toggle-overlay \n" +
    "	ic-touch-me\n" +
    "	class			= \"heavy\"\n" +
    ">\n" +
    "	Home\n" +
    "</a>\n" +
    "\n" +
    "<div>\n" +
    "	<a \n" +
    "		ng-repeat 	= \"type in ::icConfigData.types\"\n" +
    "		ng-href		= \"/t/{{::type}}\"\n" +
    "		ng-click 	= \"icOverlays.toggle()\" \n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		<span \n" +
    "			class 		= \"icon\"\n" +
    "			style		= \"background-image: url({{::type | icIcon : 'type' : 'color'}});\"\n" +
    "		>		\n" +
    "		</span><!--\n" +
    "	 --><div>\n" +
    "			{{\"TYPES.%s\" | fill : type | translate}}\n" +
    "		</div>\n" +
    "	</a>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<!-- topics -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "<a\n" +
    "	ng-click 	= \"expand.topics = !expand.topics\"\n" +
    "	ng-class	= \"{'icon-interface-arrow-up': expand.topics, 'icon-interface-arrow-down': !expand.topics}\"\n" +
    "	class	 	= \"expand heavy\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{\"INTERFACE.TOPICS\" | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<div ng-show = \"expand.topics\">\n" +
    "	<a \n" +
    "		ng-repeat 	= \"topic in ::icConfigData.topics\"\n" +
    "		ng-href		= \"/tp/{{::topic}}\"\n" +
    "		ng-click 	= \"icOverlays.toggle()\" 		\n" +
    "		ic-touch-me\n" +
    "	>\n" +
    "		<span \n" +
    "			class 		= \"icon\"\n" +
    "			style		= \"background-image: url({{::topic | icIcon : 'topic' : 'black'}});\"\n" +
    "		><!--\n" +
    "	 --></span>\n" +
    "		{{topic | uppercase | prepend : \"TOPICS.\" | translate}}\n" +
    "	</a>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ng-if 		= \"icUser.authToken\" \n" +
    "	class 		= \"xjust\"\n" +
    "	ng-click 	= \"logout()\" \n" +
    "	ic-touch-me\n" +
    "><span>{{icUser.name}}</span>  <span>{{'INTERFACE.LOGOUT' | translate}}</span></a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ng-click 		= \"addNewItem(); icSite.addItemToPath(newItemId)\"\n" +
    "	ic-toggle-overlay\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	<span ng-if = \"icUser.can('suggest_new_items')\">	{{ 'INTERFACE.SUGGEST_NEW_ITEM'	| translate}} </span>\n" +
    "	<span ng-if = \"icUser.can('add_new_items')\"> 		{{ 'INTERFACE.ADD_NEW_ITEM' 	| translate}} </span>\n" +
    "</a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ng-if 				= \"!icUser.authToken\"\n" +
    "	ic-toggle-overlay 	= \"login\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.LOGIN' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<a\n" +
    "	ng-if	= \"icUser.can('edit_items')\"\n" +
    "	ng-href = \"/st/draft\"\n" +
    "	ic-toggle-overlay\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.DRAFT_ITEMS' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<a\n" +
    "	ng-if	= \"icUser.can('edit_items')\"\n" +
    "	ng-href = \"/st/suggestion\"\n" +
    "	ic-toggle-overlay\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.SUGGESTED_ITEMS' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<a\n" +
    "	ng-if	= \"icUser.can('edit_items')\"\n" +
    "	ng-href = \"/st/archived\"\n" +
    "	ic-toggle-overlay\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.ARCHIVED_ITEMS' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ic-toggle-overlay	 = \"about\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.ABOUT' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "\n" +
    "<a \n" +
    "	ic-toggle-overlay	 = \"impress\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.IMPRESS' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<a\n" +
    "	ng-if				= \"icUser.can('recreateUsers')\"\n" +
    "	class 				= \"nondescript\"\n" +
    "	ng-click			= \"recreateUsers()\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.RECREATE_USERS' | translate}}\n" +
    "</a>\n" +
    "\n" +
    "\n" +
    "<a\n" +
    "	ng-if				= \"icUser.can('parseFrontEndMessages')\"\n" +
    "	class 				= \"nondescript\"\n" +
    "	ng-click			= \"parseFrontendMessages()\"\n" +
    "	ic-touch-me\n" +
    ">\n" +
    "	{{'INTERFACE.PARSE_FRONTEND_MESSAGES' | translate}}\n" +
    "</a>\n"
  );


  $templateCache.put('partials/ic-overlays.html',
    "<ic-main-menu			ng-class = \"{'ic-hide': !icOverlays.show.mainMenu}\"			class = \"white left\">	</ic-main-menu>\n" +
    "<ic-language-menu 		ng-class = \"{'ic-hide': !icOverlays.show.languageMenu}\" 	class = \"white right\">	</ic-language-menu>	\n" +
    "<ic-sharing-menu 		ng-class = \"{'ic-hide': !icOverlays.show.sharingMenu}\" 		class = \"white right\">	</ic-sharing-menu>\n" +
    "\n" +
    "<ic-spinner				ng-class = \"{'ic-hide': !icOverlays.show.spinner}\" 			active = \"true\">		</ic-spinner>\n" +
    "\n" +
    "<ic-confirmation-modal	ng-if = \"icOverlays.show.confirmationModal\" 				class = \"white center\">	</ic-confirmation-modal>\n" +
    "<ic-popup				ng-if = \"icOverlays.show.popup\" 							class = \"white center\">	</ic-popup>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div \n" +
    "	ng-if		=	\"icOverlays.show.about\"\n" +
    "	ng-include 	= 	\"'partials/ic-about.html'\"\n" +
    "	class		=	\"white center greedy\"\n" +
    ">\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div \n" +
    "	ng-if		=	\"icOverlays.show.impress\"\n" +
    "	ng-include 	= 	\"'partials/ic-impress.html'\"\n" +
    "	class		=	\"white center greedy\"\n" +
    ">\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<ic-login \n" +
    "	ng-if 				= \"icOverlays.show.login\" \n" +
    "	class 				= \"white center\"\n" +
    ">\n" +
    "\n" +
    "</ic-login>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div \n" +
    "	class 				=	\"qrcode black full\"\n" +
    "	ic-toggle-overlay	=	\"qrcode\"\n" +
    "	ng-if				=	\"icOverlays.show.qrcode\"\n" +
    ">\n" +
    "	<qrcode \n" +
    "		version					=	\"3\" \n" +
    "		error-correction-level	=	\"M\" \n" +
    "		size					=	\"200\" \n" +
    "		data					=	\"{{icSite.params.item | icItemLink}}\"\n" +
    "	>\n" +
    "	</qrcode>\n" +
    "	<div>{{icSite.params.item | icItemLink}}</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('partials/ic-popup.html',
    "<div\n" +
    "	class		= \"message\" \n" +
    "	ng-repeat 	= \"message in icOverlays.messages.popup\">\n" +
    "	{{message | translate}}\n" +
    "</div>\n" +
    "\n" +
    "<div class = \"buttons\">\n" +
    "	<button \n" +
    "		type 		= \"button\"\n" +
    "		ng-click 	= \"okay()\"\n" +
    "		ic-focus-me\n" +
    "	>\n" +
    "		{{ 'INTERFACE.OKAY' | translate}}\n" +
    "	</button>\n" +
    "</div>"
  );


  $templateCache.put('partials/ic-preview-item.html',
    "<div \n" +
    "	class = \"icon bg-{{icType | icColor}}\"\n" +
    "	 style = \"background-image: url({{icTopic|icIcon : 'topic' :'white'}})\"\n" +
    "	 title = \"{{'TOPICS.%s' | fill : icTopic |translate }}\"\n" +
    ">\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div \n" +
    "	class 	= \"content\"\n" +
    "	title 	= \"{{icTitle}}\"\n" +
    "\n" +
    ">\n" +
    "\n" +
    "		<div class =\"title\">\n" +
    "			{{icTitle}}\n" +
    "		</div>\n" +
    "\n" +
    "		<div class = \"brief\">\n" +
    "			<span class = \"date heavy\" ng-if = \"icStartDate\">{{icStartDate | icDate}}</span> {{icBrief}}\n" +
    "		</div>\n" +
    "</div>"
  );


  $templateCache.put('partials/ic-quick-filter.html',
    "<a \n" +
    "		ng-repeat 	= \"type in ::icConfigData.types\"\n" +
    "		ng-click 	= \"icFilterConfig.addFilter('type', type)\" \n" +
    "		ng-class 	= \"{'active' : icFilterConfig.matchFilter('type', type)}\"\n" +
    "		class		= \"border-{{::type | icColor}}\"\n" +
    "		style		= \"background-image: url({{::type | icIcon : 'type' :'color'}});\"\n" +
    "		title		= \"{{'TYPES.%s' | fill : type | translate}}\"\n" +
    "		ic-touch-me\n" +
    ">\n" +
    "	{{meta[type] === undefined ? '–' : meta[type]}}\n" +
    "</a>"
  );


  $templateCache.put('partials/ic-search-result-list.html',
    "<ic-spinner active = \"icSearchResults.listLoading()\"></ic-spinner>\n" +
    "\n" +
    "<a\n" +
    "	ng-repeat		= \"item in icSearchResults.filteredList\"\n" +
    "	ng-href			= \"{{icHref({itemId:item.id})}}\"\n" +
    "	ic-last-added 	= \"{{item == icSearchResults.lastAddedItem}}\" \n" +
    ">\n" +
    "\n" +
    "	<ic-preview-item\n" +
    "		ic-title 		= \"item.title\"\n" +
    "		ic-brief		= \"item.definition[language]\"\n" +
    "		ic-topic		= \"item.primaryTopic\"\n" +
    "		ic-type			= \"item.type\"\n" +
    "		ic-start-date 	= \"item.startDate\" \n" +
    "		ng-class		= \"{active: icActive({itemId: item.id})}\"\n" +
    "	>\n" +
    "	</ic-preview-item>\n" +
    "</a>\n" +
    "\n" +
    "<ic-spinner \n" +
    "	ng-if 	= \"!icSearchResults.noMoreItems\"\n" +
    "	active 	= \"icSearchResults.listLoading()\"\n" +
    "></ic-spinner>\n" +
    "\n" +
    "<div ng-if = \"icSearchResults.noMoreItems\" class =\"no-more-items\">{{'INTERFACE.NO_MORE_ITEMS' | translate}}</div>\n" +
    "\n"
  );


  $templateCache.put('partials/ic-search-term.html',
    "<div ng-if	= \"icFilterConfig.searchTerm\">\n" +
    "		» <span>{{icFilterConfig.searchTerm | uppercase}}</span> «\n" +
    "		<span>({{icSearchResults.meta['total']}})</span>\n" +
    "		<button \n" +
    "			class 		= \"icon-nav-close\"\n" +
    "			ng-click 	= \"icFilterConfig.searchTerm = ''\" \n" +
    "		></button>\n" +
    "</div>\n" +
    "\n" +
    "<hr ng-if	= \"icFilterConfig.searchTerm\"/>\n"
  );


  $templateCache.put('partials/ic-search.html',
    "<form\n" +
    "	ng-submit = \"update()\"\n" +
    ">\n" +
    "\n" +
    "	<div class = \"search-term\"> \n" +
    "		<input\n" +
    "			id					= \"search-term\" 			\n" +
    "			tabindex			= \"1\"\n" +
    "			type 				= \"text\" \n" +
    "			ng-model 			= \"searchTerm\"\n" +
    "			placeholder			= \"{{'INTERFACE.SEARCH' | translate }}\"\n" +
    "		>\n" +
    "		</input>\n" +
    "		<button \n" +
    "			class 	= \"icon-nav-search\"\n" +
    "			type	= \"submit\"	 \n" +
    "		>\n" +
    "		</button>\n" +
    "	</div>\n" +
    "</form>"
  );


  $templateCache.put('partials/ic-section-filter.html',
    "<ic-filter-interface expand-filter = \"true\">\n" +
    "</ic-filter-interface>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('partials/ic-section-item.html',
    "<ic-full-item 	\n" +
    "	ng-if 			= \"icSite.params.item\" \n" +
    "	ic-id 			= \"icSite.params.item\"\n" +
    "\n" +
    "></ic-full-item>\n" +
    "<ic-unavailable	ng-if = \"!icSite.params.item\"></ic-unavailable>\n"
  );


  $templateCache.put('partials/ic-section-list.html',
    "<ic-search-term></ic-search-term>\n" +
    "\n" +
    "<ic-filter-interface\n" +
    "	ng-if = \"icShowFilter\"\n" +
    ">\n" +
    "</ic-filter-interface>\n" +
    "\n" +
    "\n" +
    "<ic-quick-filter>\n" +
    "</ic-quick-filter>\n" +
    "\n" +
    "<ic-search-result-list\n" +
    "	ic-href 	= \"icSite.getNewPath({'item': itemId})\"\n" +
    "	ic-active	= \"icSite.params.item == itemId\"\n" +
    ">\n" +
    "</ic-search-result-list>\n" +
    "\n"
  );


  $templateCache.put('partials/ic-sharing-menu.html',
    "<h2>\n" +
    "	{{\"INTERFACE.SHARE\" | translate}}\n" +
    "</h2>\n" +
    "\n" +
    "<a \n" +
    "	ng-repeat  	= \"platform in platforms\"\n" +
    "	ng-href		= \"{{platform.link}}\" \n" +
    "	ic-touch-me\n" +
    ">\n" +
    "		<span \n" +
    "			class 		= \"icon\"\n" +
    "			style		= \"background-image: url({{::platform.name | icIcon : 'item' : 'black'}});\"\n" +
    "		>		\n" +
    "		</span>\n" +
    "	{{platform.name | uppercase | prepend: \"INTERFACE.SHARE.\" | translate}}\n" +
    "</a>\n" +
    "\n" +
    "<br/>\n" +
    "<br/>\n" +
    "\n" +
    "<textarea readonly>{{url}}</textarea>"
  );


  $templateCache.put('partials/ic-tile.html',
    "<div \n" +
    "	class = \"background {{::icIcon ? 'icon' : ''}} {{::icImage ? 'image' : ''}}\" \n" +
    "	style = \"background-image: url({{::icImage||icIcon }})\"\n" +
    ">\n" +
    "</div>\n" +
    "\n" +
    "<div class =\"content\">\n" +
    "	<div ng-if = \"icTitle\" class =\"title\">{{icTitle}}</div>\n" +
    "	<div ng-if = \"icBrief\" class =\"brief\">{{icBrief}}</div>\n" +
    "</div>"
  );


  $templateCache.put('pages/main.html',
    "<header>\n" +
    "	<h1\n" +
    "		class = \"logo {{ smlLayout.mode.name != 'XS' ? 'shift' : ''}}\"\n" +
    "	>	<ic-text-logo></ic-text-logo>\n" +
    "	</h1>\n" +
    "	<div class = \"claim\">\n" +
    "		{{'INTERFACE.CLAIM' | translate}}\n" +
    "	</div>\n" +
    "\n" +
    "</header>\n" +
    "\n" +
    "<div\n" +
    "	no-text-nodes \n" +
    "	class = \"tiles\"\n" +
    ">\n" +
    "\n" +
    "	\n" +
    "\n" +
    "	\n" +
    "	\n" +
    "	<a\n" +
    "		ng-repeat	= \"type in icConfigData.types\"\n" +
    "		ng-href 	= \"{{icSite.getNewPath({t: type}, true)}}\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"'TYPES.'+type | uppercase | translate\"\n" +
    "		ic-brief	= \"\"\n" +
    "		ic-icon		= \"type | icIcon : 'type' : 'white'\"\n" +
    "		ic-type		= \"type\"\n" +
    "	></a>\n" +
    "\n" +
    "	<a\n" +
    "		ng-href 	= \"/s/infopoint\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"'Infopoints'\"\n" +
    "		ic-brief	= \"\"\n" +
    "		ic-type		= \"'places'\"\n" +
    "		ic-image	= \"'/images/tile_infopoints.jpg'\"\n" +
    "	></a>\n" +
    "\n" +
    "\n" +
    "	<a\n" +
    "		ng-href 	= \"/tg/children\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"'TARGET_GROUPS.CHILDREN' | translate\"\n" +
    "		ic-brief	= \"'INTERFACE.TARGET_GROUP' |translate\"\n" +
    "		ic-image	= \"'/images/tile_children.jpg'\"\n" +
    "	></a>\n" +
    "\n" +
    "	<a\n" +
    "		ng-href 	= \"/t/events/tp/culture\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"('TYPES.EVENTS' | translate) + ','  + ('TOPICS.CULTURE' | translate)\"\n" +
    "		ic-brief	= \"('INTERFACE.TYPE' |translate) +', '+ ('INTERFACE.TOPIC' |translate)\"\n" +
    "		ic-image	= \"'/images/tile_events_culture.jpg'\"\n" +
    "	></a>\n" +
    "\n" +
    "	<a\n" +
    "		ng-href 	= \"/tg/women\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"'TARGET_GROUPS.WOMEN' | translate\"\n" +
    "		ic-brief	= \"'INTERFACE.TARGET_GROUP' |translate\"\n" +
    "		ic-image	= \"'/images/tile_women.jpg'\"\n" +
    "	></a>\n" +
    "\n" +
    "	<a\n" +
    "		ng-href 	= \"/tp/work\"\n" +
    "		ic-tile\n" +
    "		ic-title	= \"'TOPICS.WORK' | translate\"\n" +
    "		ic-brief	= \"'INTERFACE.TOPIC' |translate\"\n" +
    "		ic-image	= \"'/images/tile_work.jpg'\"\n" +
    "	></a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<!-- <a \n" +
    "		href 		= \"#{{::icSite.getNewPath({item: index})}}\" \n" +
    "		ic-tile\n" +
    "		ic-title	= \"::Mock.random(['Kurs', 'Angebot', 'Projekt', 'Termine'], index+5)\"\n" +
    "		ic-brief	= \"::Mock.random(['von Beispielinitiative', 'für Beispieltext', 'mit Blindtext', 'im Beispielamt'], index+3)\"\n" +
    "		ic-image	= \"::Mock.image(index+2)\"\n" +
    "		ic-type		= \"::Mock.random(['events', 'services', 'places', 'information'], index+1)\"\n" +
    "\n" +
    "		ng-repeat 	= \"index in ::Mock.arr(16)\"\n" +
    "	></a> -->\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );

}]);
