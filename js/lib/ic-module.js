"use strict";


angular.module('InfoCompassModule',[
	"icApi",
	"smlLayout",
	"ngSanitize",
	"icInit",
	"icServices",
	"icDirectives",
	"monospaced.qrcode",
])


.config([
	'icApiProvider',
	'smlLayoutProvider',
	'$compileProvider',

	function(icApiProvider, smlLayoutProvider, $compileProvider){

  		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|whatsapp|mailto):/)

		//$animateProvider.classNameFilter(/animate-me/)

		icApiProvider.setBase('http://127.0.0.1:3000')


		smlLayoutProvider.setModes([			
			{
				name:		'XS',	
				width: 		23,
				stretch:	true
			},	
			{
				name:		'S',
				width:		48,
				stretch:	true
			},
			{
				name:		'M',
				width:		64,
				stretch:	false
			},
			{
				name:		'L',
				width:		80,
				stretch:	false
			},
			{
				name:		'XL',
				width:		120,
				stretch:	false
			}
		])
	}
])


.controller('InfoCompassCtrl',[
	
	'$scope',
	'icInit',
	'icSite',
	'icFilterConfig',
	'smlLayout',
	'icConfigData',
	'icLanguages',
	'icSearchResults',


	function($scope, icInit, icSite, icFilterConfig, smlLayout, icConfigData, icLanguages, icSearchResults){
		$scope.icSite 			= icSite
		$scope.icLanguages 		= icLanguages 
		$scope.icInit			= icInit
		$scope.smlLayout		= smlLayout 		//Muss das wirklich?
		$scope.icConfigData		= icConfigData 
		$scope.icSearchResults	= icSearchResults
	}

])




