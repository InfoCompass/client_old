"use strict";


angular.module('icDirectives', [
	'pascalprecht.translate',
	'icServices'
])


// Layout directives:

.directive('icHeader',[

	'ic',

	function(ic){
		return {
			restrict: 		"AE",
			templateUrl:	"partials/ic-header.html",
			scope:			{},

			link: 			function(scope){ scope.ic = ic }
		}
	}
])


.directive('icMainContent',[

	'ic',

	function(ic){
		return {
			restrict: 		"E",
			templateUrl:	"partials/ic-main-content.html",
			scope:			{},

			link: 			function(scope){ scope.ic = ic }
		}
	}
])


// Section directives:


.directive('icPage', [
	'ic',

	function(ic){
		return {
			restrict:		'E',
			scope:			{},

			link: function(scope, element){
				scope.ic = ic
			}
		}
	}

])
// Start with just the view, edit can be a different directive, maybe utilize switch


//Todo Filter für item links bauen ?
.directive('icSearchResultList', [

	'ic',

	function(ic){
		return 	{
			restrict:		'E',
			templateUrl:	'partials/ic-search-result-list.html',
			scope:			{},

			link: function(scope){
				scope.ic = ic
			}
		}
	}	
])


.directive('icItemPreview',[

	'ic',
	'icTaxonomy',

	function(ic, icTaxonomy){
		return {

			restrict: 		'AE',
			templateUrl: 	'partials/ic-item-preview.html',
			scope:			{
								icItem:	"<",
							},

			link: function(scope, element, attrs){
				scope.ic = ic

				scope.$watch(
					function(){ return scope.icItem.tags},
					function(){ 
						scope.icCategory 	= 	scope.icItem && icTaxonomy.getCategory(scope.icItem.tags) 
						scope.icType 		= 	scope.icItem && icTaxonomy.getType(scope.icItem.tags)
					},
					true
				)
			}
		}
	}
])


.directive('icItemFull',[

	'ic',
	'icSite',
	'icOverlays',
	'icItemStorage',
	'$q',

	function(ic, icSite, icOverlays, icItemStorage, $q){

		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-item-full.html',
			scope:			{},

			link: function(scope, element, attrs){
				scope.ic 	= ic
				
				scope.delete = function(){
					icOverlays.open('confirmationModal', 'INTERFACE.DELETE_ITEM_CONFIRMATION')
					.then(function(){
						return 	$q.when(icSite.activeItem.delete())
								.then(
									function(){
										icItemStorage
										.removeItem(icSite.activeItem)
										.refreshFilteredList()

										icSite.activeItem = undefined
										icOverlays.open('popup', 'INTERFACE.DELETE_ITEM_SUCESSFULL')
									},
									function(){
										icOverlays.open('popup', 'INTERFACE.DELETE_ITEM_FAILED')
									}
								)
					})
				}

				scope.$watch(
					function(){
						return icSite.activeItem
					},
					function(item){
						scope.item = item
					}
				) 
			
			}
		}
	}
])

.directive('icItemFullEdit',[

	'ic',
	'icItemEdits',
	'icSite',
	'icItemStorage',
	'icTaxonomy',
	'icOverlays',
	'$rootScope',
	'$q',

	function(ic, icItemEdits, icSite, icItemStorage, icTaxonomy, icOverlays, $rootScope, $q){

		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-item-full-edit.html',
			scope:			{},

			link: function(scope, element, attrs){
				scope.ic = ic

				scope.validate = function(){
					return !scope.validationFunctions.filter(function(fn){ return fn() })[0]
				}

				scope.cancel = function(){
					if(scope.icItem.internal.new) icSite.activeItem = undefined
					ic.site.editItem = false
				}

				scope.revertAll = function(){
					scope.icEdit.importData(scope.icItem.exportData())
				}

				scope.submit = function(){

					if(!scope.icEdit) return null

					var item 		= scope.icItem,
						edit 		= scope.icEdit

					if(!scope.validate()) return icOverlays.open('popup', 'INTERFACE.EDIT_ERRORS')	

					icOverlays.toggle('spinner', true)

					$q.when(
						item.internal.new
						?	edit.submitAsNew()
						:	edit.update()
					)
					.then(
						function(item_data){
							item.internal.new = false
							item.id = item_data.id

							icItemStorage.storeItem(item_data)
							icItemStorage.refreshFilteredList()

							icSite.updateUrl()
							icSite.editItem = false


							return icOverlays.open('popup', 'INTERFACE.UPDATE_SUCESSFUL')
						},
						function(){
							return icOverlays.open('popup', 'INTERFACE.UPDATE_FAILED')
						}
					)

				}

				scope.$watch(
					function(){
						return icSite.activeItem
					},
					function(item){
						scope.icItem = item
						scope.icEdit = icItemEdits.get(item)
					}
				) 

				function removeTagFromEdit(tag){
					var pos = scope.icEdit.tags.indexOf(tag)

					if(pos != -1) scope.icEdit.tags.splice(pos,1)
				}


				// keep tag and taxonomy consistency
				scope.$watch('icEdit.tags', function(){

					if(!scope.icEdit) return null

					// make sure there is only one type:
					var type 		= icTaxonomy.getType(scope.icEdit.tags)

					icTaxonomy.types.forEach(function(tag){ if(tag != (type && type.name)) removeTagFromEdit(tag) })

					var category 	= icTaxonomy.getCategory(scope.icEdit.tags)

					icTaxonomy.categories.forEach(function(c){ 	
						if(c.name != (category && category.name)){
							removeTagFromEdit(c.name) 
							c.tags.forEach(removeTagFromEdit)
						}
					})


				},
				true)
			
			},

			controller: function($scope){
				$scope.validationFunctions = $scope.validationFunctions || []
				this.registerValidationFunction = function(fn){
					$scope.validationFunctions.push(fn)
				}
			}
		}
	}
])



.directive('icItemPropertyEdit', [

	'icSite',
	'icItemEdits',
	'icItemConfig',
	'ic',
	'$q',
	'$parse',

	function(icSite, icItemEdits, icItemConfig, ic, $q, $parse){
		return {
			restrict:		'AE',
			require:		['^^icItemFullEdit'],
			scope:			{
								icItem:					"<",
								icKey:					"@",
								icType:					"@",

								icOptions:				"<?",
								icOptionLabel:			"&?",
								icOptionIconClass:		"&?",
								icForceChoice:			"<?"

							},

			templateUrl: 	function(tElement, tAttrs){
								if(tAttrs.icOptions)	return "partials/ic-item-property-edit-options.html"
								
								return "partials/ic-item-property-edit-simple-value.html"

							},

			link: function(scope, element, attrs, ctrls){

				scope.ic				=	ic
				scope.value				=	{
												edit: 		undefined,
												current: 	undefined
											}
				scope.icProperty			=	icItemConfig.properties.filter(function(property){ return property.name == scope.icKey })[0]
				
				if(scope.icOptions === true){
					scope.icOptions	 =	scope.icProperty.options
				}

				scope.icAllowMultipleChoices = scope.icAllowMultipleChoices || false


				scope.icTranslatable 			= attrs.icTranslatable 			? $parse(attrs.icTranslatable)() 			: false
				scope.icHideErrors				= attrs.icHideErrors			? $parse(attrs.icHideErrors)()				: false
				scope.icAllowMultipleChoices	= attrs.icAllowMultipleChoices	? $parse(attrs.icAllowMultipleChoices)()	: false



				function copyOptions(array){

					if(!array) return undefined
					if(!array.forEach) array = [array]

					var matching_options = 	scope.icOptions
											?	scope.icOptions.filter(function(option){
													return array.indexOf(option) != -1
												})
											:	[]

					return 	scope.icType == 'array'
							?	matching_options
							:	matching_options[0]
				}




				scope.$watch('icItem', function(a, b){
					scope.icEdit = scope.icItem && icItemEdits.get(scope.icItem.id)

					// check coherence:
					if(scope.icEdit && scope.icEdit[scope.icKey] === undefined){
						console.warn('icItemPropertyEdit: unknown property: ', scope.icKey)
						return null
					}

					if(scope.icItem && scope.icEdit) setupWatchers()
				})


				function setupWatchers(){

						// update local value, when the original changes (most likely because it finshed downloading, i.e. after storing to the backend)
						scope.$watch(
							function(){
								return scope.icItem && scope.icItem[scope.icKey]
							},

							function(v){
								if(!scope.icItem) return null

								if(scope.icItem.internal.new){
									scope.hideCurrentValue = true
								}

								if(scope.icOptions){
									scope.value.current = copyOptions(scope.icItem[scope.icKey])
								}else{
									scope.value.current = 	scope.icTranslatable 
															?	angular.copy(scope.icItem[scope.icKey][icSite.currentLanguage])
															:	angular.copy(scope.icItem[scope.icKey])
								}

								//reset local edit value, if it was undefined. Should only happen when the property is edited for the first time:
								if(scope.value.edit === undefined) scope.value.edit = angular.copy(scope.value.current)

							},
							true
						)

						// update local value, when the edit changes (most likely different property changed the current one depends on)
						scope.$watch(
							function(){
								return scope.icEdit && scope.icEdit[scope.icKey]
							},

							function(v){
								if(!scope.icEdit) return null

								if(scope.icOptions){
									scope.value.edit = 	copyOptions(scope.icEdit[scope.icKey])
									return undefined
								} 


								scope.value.edit = 	scope.icTranslatable 
													?	angular.copy(scope.icEdit[scope.icKey][icSite.currentLanguage])
													:	angular.copy(scope.icEdit[scope.icKey])

							},
							true
						)


						scope.$watch(
							function(){
								return scope.icOptions
							},

							function(v){

								if(!scope.icOptions) return null

								if(scope.icOptions === true){
									scope.icOptions = scope.icProperty.options
								}

								scope.value.edit 	= copyOptions(scope.icEdit[scope.icKey])
								scope.value.current	= copyOptions(scope.icItem[scope.icKey])

								scope.validate()
							},
							true
						)


						// update local value, if it is translatable, when current language changes:
						scope.$watch(
							function(){
								return icSite.currentLanguage
							},
							function(a,b){
								if( a!=b && scope.icTranslatable){
									scope.value.edit 	= angular.copy(scope.icEdit[scope.icKey][icSite.currentLanguage])
									scope.value.current = angular.copy(scope.icItem[scope.icKey][icSite.currentLanguage])
								}
							}
						)


						// update global edit and check for errors, when local edit changes
						scope.$watch('value.edit', function(){


							if(typeof scope.value.edit == 'string'){
								scope.value.edit = scope.value.edit.replace(/(^\s+|\s{2,}$)/g, '')
							}

							if(scope.icTranslatable){
								scope.icEdit[scope.icKey][icSite.currentLanguage] = angular.copy(scope.value.edit)
								scope.validate()
								return undefined
							} 

							if(scope.icOptions && scope.icType == 'array') {
								scope.icOptions.forEach(function(option){
									var pos_1 = scope.icEdit[scope.icKey].indexOf(option),
										pos_2 = scope.value.edit.indexOf(option)

									if(pos_1 != -1) scope.icEdit[scope.icKey].splice(pos_1, 1)
									if(pos_2 != -1) scope.icEdit[scope.icKey].push(option)
								})

								scope.validate()
								return undefined
							}

							scope.icEdit[scope.icKey] = angular.copy(scope.value.edit)
								scope.validate()
								return undefined

						}, true)
				}





				scope.validate = function(){
					scope.error 	= 	scope.icForceChoice && !(scope.value.edit.length)
										?	{ code: "SELECT_AT_LEAST_ONE_OPTION"	}
										:	scope.icEdit.getErrors(scope.icKey)

					element.toggleClass('invalid', scope.error)
					return scope.error
				}

				ctrls.forEach(function(ctrl){ ctrl.registerValidationFunction(scope.validate)	})


				scope.revert = function(){
					scope.value.edit = angular.copy(scope.value.current)
				}

				scope.diff = function(){
					switch(scope.icType){
						case "string": 	return 	scope.value.edit != scope.value.current; break;
						case "text": 	return 	scope.value.edit != scope.value.current; break;
						case "array": 	return 		!scope.value.current
												||	!scope.value.edit
												||	(scope.value.current.length != scope.value.edit.length)
												||	scope.value.current.some(function(option){ return scope.value.edit.indexOf(option) == -1 })
												||	scope.value.edit.some(function(option){ return scope.value.current.indexOf(option) == -1 })
					}
				}

				scope.toggleOption = function(option){

					if(scope.icType == 'string'){
						scope.value.edit = 	scope.value.edit == option
											? null
											: option
						return undefined
					}

					if(!scope.icAllowMultipleChoices){
						scope.value.edit = 	scope.value.edit.filter(function(entry){
												return scope.icOptions.indexOf(entry) == -1
											})
					}

					var pos = scope.value.edit.indexOf(option)

					pos == -1
					?	scope.value.edit.push(option)
					:	scope.value.edit.splice(pos,1)	

				}

			}
		}
	}
])



.directive('icItemProperty', [

	function(){

		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-item-property.html',
			scope:			{
								icTitle:		"<",
								icContent:		"<",
								icExtraLines:	"<",
								icExtraLinks:	"<",
								icIcon:			"<",
								icLink:			"<",
							},

			link: function(scope, element, attrs){
				scope.$watch('icContent', function(){
					if(typeof scope.icLink == "string"){
						scope.link = scope.icLink + scope.icContent
					}
				})

			}
		}
	}
])



.directive('icLogoText',[
	function(){
		return {
			templateUrl:	'partials/ic-logo-text.html'
		}
	}
])

.directive('icLogoFull',[
	function(){
		return {
			templateUrl:	'partials/ic-logo-full.html'
		}
	}
])

.directive('icMainMenu', [
	function(){
		return {
			templateUrl:	'partials/ic-main-menu.html'
		}
	}
])

.directive('icBreadcrumbs',[
	'ic',

	function(){
		return {
			templateUrl:	'partials/ic-breadcrumbs.html'
		}
	}
])

.directive('icSearch',[

	'ic',
	'icSite',

	function(ic, icSite){
		return {
			restrict: 		'E',
			templateUrl:	'partials/ic-search.html',
			scope:			{
								icOnSubmit: 	'&',
								icOnUpdate: 	'&',
								icButtonLabel:	'<'	,
								icFocus:		'<'
							},

			link: function(scope, element, attrs){

				scope.ic		= ic

				scope.update = function(search_term){
					var input = element[0].querySelector('#search-term')
					
					search_term = search_term.replace(/[\/?#]+/g,' ')


					input.focus()
					input.blur()

					if(scope.icOnSubmit) scope.icOnSubmit()


					if(search_term.replace(/s+/,'')){

						if(scope.icOnUpdate) scope.icOnUpdate()
						icSite.searchTerm = search_term
						icSite.list = true
						icSite.activeItem = null //TODO
					}

					scope.searchTerm = undefined
				}

			}
		}
	}
])


.directive('icTaxonomyTagList', [

	'ic',
	'icTaxonomy',

	function(ic, icTaxonomy){
		return {
			restrict:		'E',
			templateUrl:	'partials/ic-taxonomy-tag-list.html',
			scope:			{
								icTags: "<"
							},

			link: function(scope, element){
				scope.ic = ic
			}
		}
	}
])
	
.directive('icTaxonomyFilter',[

	'ic',
	'icTaxonomy',

	function(ic, icTaxonomy) {
		return {
			restrict:		'E',
			templateUrl:	'partials/ic-taxonomy-filter.html',

			link: function(scope, element){
				scope.ic 		= 	ic
				scope.expand 	= 	{
										categories: 	true,
										unsortedTags: 	true
									}
			}
		}
	}
])

.directive('icTaxonomyFilterTagList', [

	'ic',
	'icTaxonomy',

	function(ic, icTaxonomy){
		return {
			restrict:		'E',
			templateUrl:	'partials/ic-taxonomy-filter-tag-list.html',

			link: function(scope, element){
				scope.ic = ic
			}
		}
	}
])
	



.directive('icOverlays', [

	'icOverlays',
	'ic',

	function(icOverlays, ic){

		return {

			restrict:	"AE",
			templateUrl:"partials/ic-overlays.html",
			scope:		true,

			link: function(scope, element, attrs, ctrl, transclude){
				icOverlays.registerScope(scope)
				scope.ic = ic

				var body = angular.element(document.getElementsByTagName('body'))

				function close(){
					icOverlays.toggle(null)
					scope.$digest()
				}

				function elementClose(e){
					if(element[0] == e.target) close()					
				}

				function bodyClose(e){
					if(e.code == 'Escape') close()
				}


				element.on('click',	elementClose)

				body.on('keydown',	bodyClose)

				scope.$on('$destroy', function(){
					body.off(bodyClose)
				})

			}
				
		}
	}
])



.directive('icConfirmationModal', [

	'icOverlays',

	function(icOverlays){
		return {
			restrict:		'AE',
			transclude:		true,
			templateUrl:	'partials/ic-confirmation-modal.html',

			link: function(scope){

				scope.icOverlays = icOverlays


				scope.cancel = function(){
					icOverlays.deferred.confirmationModal.reject()
					icOverlays.toggle('confirmationModal')
				}

				scope.confirm = function(){
					icOverlays.deferred.confirmationModal.resolve()
					icOverlays.toggle('confirmationModal')
				}
			}
		}
	}
])


.directive('icPopup', [

	'icOverlays',

	function(icOverlays){
		return {
			restrict:		'AE',
			transclude:		true,
			templateUrl:	'partials/ic-popup.html',

			link: function(scope){

				scope.icOverlays = icOverlays

				scope.okay = function(){
					icOverlays.toggle('popup')
				}

			}
		}
	}
])




.directive('icLanguageMenu', [

	'ic',

	function(ic){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-language-menu.html',
			scope:			{},

			link: function(scope, element){				
				scope.ic = ic
			}
		}
	}

])



.directive('icSharingMenu', [

	'$location', 
	'icSite',
	'icLanguages',


	function($location, icSite, icLanguages){
		return {
			restrict: 		'AE',
			templateUrl:	'partials/ic-sharing-menu.html',

			link: function(scope){

				scope.vars = {}

				function getVars(){

					if(!icSite.activeItem)				return null
					if(!icSite.activeItem.title) 		return null
					if(!icSite.activeItem.id)			return null

					var abs_url 	= 	$location.absUrl(),
						path		= 	$location.path(),
						title		=	icSite.activeItem.title,
						url			= 	abs_url.replace(path, '')
										+'/item/'	+ icSite.activeItem.id
										+'/l/'		+ icSite.currentLanguage

					scope.vars.url 		= url
					scope.vars.title	= title

					return scope.vars
				}

				scope.$watch(
					getVars,
					function(v){
						if(!v){
							scope.platforms = []
							return null
						}

						scope.platforms = [
							{name: 'email',		link: 'mailto:?subject=Infocompass: '+v.title+'&body='+v.url},
							{name: 'twitter', 	link: 'https://twitter.com/intent/tweet?text='+v.title+'&url='+v.url+'&hashtags=infocompass'},
							// {name: 'facebook', 	link: 'https://www.facebook.com/sharer/sharer.php?u='+v.url+'&t='+v.title},
							// {name: 'google+', 	link: 'https://plus.google.com/share?url='+url},
							// {name: 'linkedin', 	link: 'https://www.linkedin.com/shareArticle?mini=true&url='+url},
							{name: 'whatsapp',	link: 'whatsapp://send?text='+v.title+': '+v.url}
						]						
					},
					true
				)

			}
		}
	}

])


.directive('icLogin',[

	'icUser',
	'icOverlays',
	'icItemStorage',

	function(icUser, icOverlays, icItemStorage){
		return {
			restrict:		'E',
			templateUrl:	'partials/ic-login.html',
			transclude:		true,

			link: function(scope, element){
				scope.username = ''
				scope.password = ''

				scope.login = function(){
					icOverlays.toggle('spinner', true, true)
					icUser.login(scope.username, scope.password)
					.then(
						function(){
							scope.username = ''
							scope.password = ''

							icItemStorage.downloadAll()

							return 	icOverlays.open('popup', 'INTERFACE.LOGIN_SUCCESSFULL')
									.finally(function(){
										if(icOverlays.deferred.login) icOverlays.deferred.login.resolve()
									})

						},
						function(reason){
							console.warn('icLoginDirective:', reason)
							var messages = 	{
												'unknown user': 	'INTERFACE.LOGIN_UNKNOWN_USERNAME',
												'invalid password':	'INTERFACE.LOGIN_INVALID_PASSWORD',
												'locked account':	'INTERFACE.LOGIN_ACCOUNT_LOCKED'
											}

							return icOverlays.open('login', messages[reason] || 'INTERFACE.UNKNOWN', icOverlays.deferred.login, true)
						}
					)
				}

				scope.cancel = function(){
					scope.username = ''
					scope.password = ''					
					if(icOverlays.deferred.login) icOverlays.deferred.login.reject()
					icOverlays.toggle('login', false)
				}

			}
		}
	}
])




