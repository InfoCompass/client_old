"use strict";

// Everything connected to the initialization of the the infoCompass module


angular.module('icInit', [
	'icApi',
	'plImages',
	'pascalprecht.translate'
])



// App Configuration Data


.service('icConfigData',[

	'icApi',
	'$q',

	function(icApi, $q){

		var icConfigData = 	{
								//must all be undefined
								types:				undefined,
								topics:				undefined,
								titles:				undefined,
								availableLanguages: undefined
							}


		icConfigData.getTypeById = function(id){
			return icConfigData.types.filter(function(type){ return type.id == id })[0]
		}

		icConfigData.getTypeByUri = function(uri){
			return icConfigData.types.filter(function(type){ return type.uri == uri })[0]
		}

		icConfigData.getTopicById = function(id){
			return icConfigData.topics.filter(function(topic){ return topic.id == id })[0]
		}

		icConfigData.getTopicUri = function(uri){
			return icConfigData.topics.filter(function(topic){ return topic.uri == uri })[0]
		}

		function unique(arr){
			var result = []

			arr.forEach(function(item){
				if(result.indexOf(item) == -1) result.push(item)
			})

			return result
		}

		icConfigData.ready	=	icApi.getConfigData()
								.then(
									function(result){
										icConfigData.types 				= unique(result.types)
										icConfigData.topics 			= unique(result.topics)
										icConfigData.targetGroups		= unique(result.target_groups)
										icConfigData.availableLanguages = unique(result.langs)
										icConfigData.titles				= unique(result.titles)
										//icConfigData.titles 			= result.titles
									},
									function(){
										return $q.reject("Unable to load config data.")
									}
								)

		return icConfigData
	}
])






// App Language Data




.service('icLanguages', [

	'$window',
	'$rootScope',
	'$q',
	'$translate',
	'icConfigData',
	'icApi',

	function($window, $rootScope, $q, $translate, icConfigData, icApi){

		var icLanguages 			= 	{
											availableLanuages:	undefined,
											currentLanguages:	undefined,
											fallbackLanguage:	undefined,									
										}


		icConfigData.ready
		.then(function(){
			icLanguages.availableLanguages 	= 	icConfigData.availableLanguages
			icLanguages.fallbackLanguage	= 	icLanguages.availableLanguages.indexOf('en') != -1
												?	'en'
												:	icLanguages.availableLanguages[0]
		})

		icLanguages.ready = 	icApi.getInterfaceTranslations()
								.then(
									function(translationTable){
										return translationTable
									},
									function(){
										return $q.reject("Unable to load language data.")
									}
								)

		function objectKeysToUpperCase(obj){
			var up = {}

				for(var key in obj){

					up[key.toUpperCase()] = typeof obj[key] == 'object'
											?	objectKeysToUpperCase(obj[key])
											:	obj[key]
				}

			return up
		}


		icLanguages.getTranslationTable = function(lang){
			return	icLanguages.ready
					.then(function(translations){
						return objectKeysToUpperCase(translations)[lang.toUpperCase()]
					})
		}



		function guessLanguage(){
			icLanguages.currentLanguage =	icLanguages.currentLanguage 
											|| $window.localStorage.getItem('language') 
											|| navigator.language.substr(0,2)
											|| 'en'
		}

		guessLanguage()

		var $_body = document.getElementsByTagName('body')[0]

		$rootScope.$watch(
			function(){ return icLanguages.availableLanguages && icLanguages.currentLanguage }, 
			function(cl){

				if(!icLanguages.availableLanguages) return null

				if(icLanguages.availableLanguages.indexOf(icLanguages.currentLanguage) == -1) 
					icLanguages.currentLanguage = icLanguages.fallbackLanguage

				$translate.use(icLanguages.currentLanguage)
				$window.localStorage.setItem('language',icLanguages.currentLanguage)
			}
		)


		return	icLanguages
	}
])



.factory('icInterfaceTranslationLoader', [

	'icLanguages',

	function(icLanguages){
		return 	function(options){
					if(!options || !options.key) throw new Error('Couldn\'t use icInterfaceTranslationLoader since no language key is given!');
					return icLanguages.getTranslationTable(options.key)
				}
	}
])






.config([
	'$translateProvider',
	'plImagesProvider',

	function($translateProvider,plImagesProvider){
		$translateProvider.useLoader('icInterfaceTranslationLoader')
		$translateProvider.useSanitizeValueStrategy('sanitizeParameters')
		$translateProvider.preferredLanguage('en')

		plImagesProvider
		.setUrls(<!--grunt images-->)
	}
])





// 



.service('icInit',[

	'$q',
	'$timeout',
	'icConfigData',
	'icLanguages',
	'plImages',


	function($q, $timeout, icConfigData, icLanguages, plImages){


		var	documentReady 	= $q.defer(),
			self			= this

		if(document.readyState.match(/complete/)) {
			documentReady.resolve()
		} else {
			window.addEventListener('load', function(){
				documentReady.resolve()
			})
		}

		self.progress 	= 1 // starts with 1 because angular already running
		self.max		= 5

		icConfigData.ready
		.then(function(){ console.log('configdata'); self.progress++ })		
		
		icLanguages.ready
		.then(function(){ console.log('languages'); self.progress++ })		

		plImages.ready
		.then(function(){ console.log('images'); self.progress++ })

		documentReady.promise
		.then(function(){ console.log('doc'); self.progress++ })


		self.ready = $q.all([
			icConfigData.ready,
			icLanguages.ready,
			plImages.ready,
			documentReady.promise
		])

		return self
	}
])






.directive('icLoadingScreen',[

	'$q',
	'$timeout',
	'$rootScope',

	function($q, $timeout){
		return {
			restrict:	'AE',
			scope:		true,

			link: function(scope, element, attrs, ctrl, transclude){


				var unwatch		= undefined



				function clear(){
					element.remove()
					scope.$destroy()
					//unwatch()
				}

				unwatch = scope.$watch(attrs.icReady , function(ready){ 


					if(!ready) 			return null
					if(ready === true) 	ready = $q.resolve()

					
					ready
					// .then(function(){
					// 	var deferred 			= $q.defer(),
					// 		has_transition 		= undefined,
					// 		no_transition_timer = $timeout(2000, false) 

						
					// 	no_transition_timer
					// 	.then(function(){
					// 		deferred.resolve()
					// 	})

					// 	element.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(){
					// 		deferred.resolve()
					// 	})

					// 	return deferred.promise
					// })
					.then(
						function(){
							return $timeout(parseInt(attrs.icMinDuration)||0)
						},
						function(reason){
							scope.error = reason	
							return $q.reject(reason)				
						}
					)
					.then(clear)

				})
			}
		}
	}
])



