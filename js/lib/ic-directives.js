"use strict";


angular.module('icDirectives', [
	'icServices'
])





/* sections: */

.directive('icSectionFilter',[

	function(){
		return {
			restrict: 		"AE",
			templateUrl:	"partials/ic-section-filter.html",
			scope:			{},
		}
	}
])


.directive('icSectionList',[

	'icSite',
	'icSearchResults',

	function(icSite, smlLayout, icSearchResults){
		return {
			restrict: 		"AE",
			templateUrl:	"partials/ic-section-list.html",
			scope:			{
								icShowFilter:	'<'
							},

			link: function(scope, element, attrs){
				scope.icSite 	= icSite
			}
		}
	}
])


.directive('icSectionItem',[

	'icSite',

	function(icSite){
		return {
			restrict: 		"AE",
			templateUrl:	"partials/ic-section-item.html",
		}
	}
])





.directive('icHeader',[

	'icFilterConfig',
	'icSite',

	function(icFilterConfig, icSite){
		return {
			restrict: 		"AE",
			templateUrl:	"partials/ic-header.html",
			scope:			{
								icMenu:			"<",
								icCloseItem:	"<",
								icShare:		"<",
								icPrint:		"<",
								icLanguages:	"<",
								icLarge:		"<"
							},

			link: function(scope, element, attr){
				
				scope.icSite			= icSite
				scope.icFilterConfig	= icFilterConfig
			
				scope.print				= function(){ window.print() 		}
				scope.closeItem			= function(){ icsite.clearItem()	}
			}
		}
	}
])







.directive('icSearchResultList', [

	'icSearchResults',
	'icFilterConfig',
	'icLanguages',

	function(icSearchResults, icFilterConfig, icLanguages){
		return {
			restrict:		'AE',
			templateUrl: 	'partials/ic-search-result-list.html',
			scope:			{
								icHref:			"&",
								icActive:		"&",
								icExtraFilter:	"<"
							},

			link: function(scope, element, attrs){
				scope.icSearchResults 	= icSearchResults 
				scope.icFilterConfig	= icFilterConfig

				scope.$on('icScrollBump', function(){
					icSearchResults.download()
				})


				scope.$watch(
					function(){
						return icLanguages.currentLanguage
					},
					function(){
						scope.language = icLanguages.currentLanguage
					}
				)
			}
		}
	}
])






//TDOD Bump stört wenn nachgeladen wird: anders lösen, bump weglassen
.directive('icScrollBump', [

	'$timeout',
	'$window',

	function($timeout, $window){

		return {
			restrict: 	'A',
			transclude: true,
			scope:		true,
			template:	'<div class = "shuttle" ng-transclude></div>',

			link: function(scope, element, attrs, controller){

				var shuttle		= element.find('div').eq(0),
					bumper 		= angular.element('<div class = "bumper"></div>'),
					bumping		= false,
					scroll_stop = null,
					ignore_next_scroll = false

				element.append(bumper)
			

				if($window.getComputedStyle(element[0]).position == 'static') 
					element.css('position', 'relative')

				shuttle.css({
					'min-height':			'100%',
					'transform': 			'translateY(0px)',
					'transition-property':	'transform',
				})

				bumper.css({
					'padding':				'0',
					'height': 				'50%',
					'width':				'auto',
				})

				function reset(){
					bumping = false

					var client_height	= element[0].clientHeight,
						scroll_top		= element[0].scrollTop,
						bottom			= shuttle[0].offsetTop + shuttle[0].offsetHeight,
						overflow		= bottom - scroll_top - client_height,
						duration 		= 800


					function swap(){

						shuttle.css({
							'transform': 			'translateY(0px)',
							'transition-duration':	'0ms'
						})

						element[0].scrollTop += overflow
						ignore_next_scroll = true


					}

					if(overflow < 0){



						window.requestAnimationFrame(function(){
							$timeout(swap, duration, false)
							shuttle.css({
								'transition-duration':	duration+'ms',
								'transform':			'translateY('+(-overflow)+'px)'
							})
						})
					}
					
				}

				function bump(){

					var client_height	= element[0].clientHeight,
						scroll_top		= element[0].scrollTop,
						bottom			= shuttle[0].offsetTop + shuttle[0].offsetHeight,
						overflow		= bottom - scroll_top - client_height

					if(overflow > client_height) return null

					if(!bumping) scope.$broadcast('icScrollBump')
					bumping = true
				
				}


				element.on('scroll', function(event){
					if(ignore_next_scroll){
						ignore_next_scroll = false
						return null
					}

					$window.requestAnimationFrame(bump)


					if(scroll_stop) $timeout.cancel(scroll_stop)
					scroll_stop = $timeout(reset, 200, false)

				})
			},
		}
	}
])






.directive('icPreviewItem',[

	function(){
		return {

			restrict: 		'AE',
			templateUrl: 	'partials/ic-preview-item.html',
			scope:			{
								icTitle:	"<",
								icBrief: 	"<",
								icType:		"<",
								icTopic:	"<",
								icStartDate:"<"
							},

			link: function(scope, element, attrs){
			}
		}
	}
])





.directive('icFullItem',[

	'$q',
	'icSearchResults',
	'icLanguages',
	'icItemEdits',
	'icConfigData',
	'icUser',
	'icSite', //TODO shoudln't be here
	'icOverlays', 

	function($q, icSearchResults, icLanguages, icItemEdits, icConfigData, icUser, icSite, icOverlays){

		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-full-item.html',
			scope:			{
								icId:			"<",
							},

			link: function(scope, element, attrs){

				scope.icSearchResults 	= icSearchResults
				scope.icConfigData		= icConfigData
				scope.icUser			= icUser

				scope.editMode			= false

				scope.edit = function() {
					scope.editMode = true
				}

				scope.cancelEdit = function(){
					if(scope.item.state == 'new'){
						var confirm = $q.defer()

						icOverlays.open('confirmationModal', 'INTERFACE.CONFIRM_CANCEL_SUGGESTION', confirm)

						confirm.promise
						.then(function(){
							scope.editMode = false
							icSite.clearItem()	
						})
					} else {
						scope.editMode = false
					}
					
				}


				function handleError(error){
					if(error.status == 422){
						console.warn('icFullItem: invalid data:', error.data)
						scope.itemEdit.setInvalidKeys(error.data)
						return icOverlays.open('popup', 'INTERFACE.PLEASE_CORRECT_INPUT')
					}

					if([401, 403].indexOf(error.status) != -1)
						return icOverlays.open('popup', 'INTERFACE.ACCESS_DENIED')					
					
					return icOverlays.open('popup', 'INTERFACE.SERVER_FAULT')					
				}

				function beforeSubmission() {
					delete scope.itemEdit.invalidFields 
					icOverlays.open('spinner')
				}

				function afterSubmission(){
					icOverlays.toggle(null)
				}
				


				scope.submitItemEdits = function(){
					beforeSubmission()

					scope.itemEdit.update()
					.then(
						function(item_data){
							scope.item.importData(item_data)
							scope.itemEdit.importData(item_data)

							scope.item.id 		= item_data.id
							scope.itemEdit.id 	= item_data.id

							var message = "INTERFACE.ITEM_EDITS_APPLIED"
							
							return	icOverlays.open('popup', message)
									.then(
										null,
										function(){
											scope.editMode		= false										
										}
									)
						},
						function(error){
							icOverlays.open('popup', 'INTERFACE.UNABLE_TO_SUBMIT_ITEM_EDITS')
							return handleError(error)								
						}
					)
					.finally(afterSubmission)
				}


				scope.submitNewItem = function(){
					beforeSubmission()
					
					scope.itemEdit.submitAsNew()
					.then(
						function(item_data){
							scope.item.importData(item_data)
							scope.itemEdit.importData(item_data)

							scope.item.id 		= item_data.id
							scope.itemEdit.id 	= item_data.id

							var message = "INTERFACE.ITEM_SUBMITTED"

							switch(scope.item.state){
								case "published":	message = 'INTERFACE.ITEM_PUBLISHED'; 		break;
								case "draft":		message = 'INTERFACE.ITEM_SAVED_AS_DRAFT'; 	break;
							}

							return	icOverlays.open('popup', message)
									.then(
										null,
										function(){
											scope.editMode		= false
											icSite.addItemToPath(scope.item.id)	
										}
									)

						},
						function(error){
							icOverlays.open('popup', 'INTERFACE.UNABLE_TO_SUBMIT_NEW_ITEM')
							return handleError(error)
						}
					)
					.finally(afterSubmission)

				}

				scope.submitEditSuggestions = function(){
					beforeSubmission()
					
					scope.itemEdit.update(null,  null)
					.then(
						function(item_data){
							return	icOverlays.open('popup', 'INTERFACE.EDIT_SUGGESTION_SUBMITTED')
									.then(
										null,
										function(){
											scope.item.importData(item_data)
											scope.itemEdit.importData(item_data)

											scope.saving_failed	= false
											scope.editMode		= false
										}
									)
						},
						function(error){
							icOverlays.open('popup', 'INTERFACE.UNABLE_TO_SUBMIT_EDIT_SUGGESTIONS')
							return handleError(error)
						}
					)
					.finally(function(){afterSubmission})

				}

				scope.submitItemSuggestion = function(){
					beforeSubmission()
					
					scope.itemEdit.submitAsNew(null, null)
					.then(
						function(){
							return	icOverlays.open('popup', 'INTERFACE.ITEM_SUGGESTION_SUBMITTED')
									.then(
										null,
										function(){
											icSite.clearItem()
										}
									)
						},
						function(error){
							icOverlays.open('popup', 'INTERFACE.UNABLE_TO_SUBMIT_ITEM_SUGGESTION')
							return handleError(error)
						}
					)
					.finally(function(){afterSubmission})
				}


				scope.print = function(){
					window.print()
				}

				scope.archive = function(){
					beforeSubmission()
					icOverlays.open('confirmationModal', 'INTERFACE.CONFIRM_ARCHIVE')
					.then(function(){
						return 	scope.item.delete()
								.then(
									function(){
										icSearchResults.removeItem(scope.item)
										scope.item.state = 'archived'
										return 	icOverlays.open('popup', 'INTERFACE.ITEM_ARCHIVED')
									},
									function(){
										return 	icOverlays.open('popup', 'INTERFACE.UNABLE_TO_ARCHIVE_ITEM')
									}
								)
					})
					.finally(function(){afterSubmission})
				}


				scope.delete = function(){
					beforeSubmission()
					icOverlays.open('confirmationModal', 'INTERFACE.CONFIRM_DELETION')
					.then(function(){
						return 	scope.item.delete()
								.then(
									function(){
										icSearchResults.removeItem(scope.item)
										return 	icOverlays.open('popup', 'INTERFACE.ITEM_DELETED')
												.finally(function(){													
													icSite.clearItem()										
												})
									},
									function(){
										return 	icOverlays.open('popup', 'INTERFACE.UNABLE_TO_DELETE_ITEM')
									}
								)
					})
					.finally(function(){afterSubmission})
				}


				scope.$watch('icId', function(id){
					scope.item 		= icSearchResults.getItem(id)
					scope.itemEdit 	= icItemEdits.open(id)
					
					scope.editMode	= scope.item.state == 'new'

					if(scope.item.state == 'new'){
						scope.itemEdit.state =	icUser.can('add_new_items')
												?	'draft'
												:	'suggestion'
					}else{
						icSearchResults.downloadItem(id)
						.then(
							null,
							function(){
								if(scope.item.preliminary) scope.item = undefined
							}
						)
					}
					
				})

				scope.$watch(
					function(){
						if(!scope.item) return ''

						return 	scope.item.longitude && scope.item.latitude
								?	'https://www.openstreetmap.org/?mlat='+scope.item.latitude +'&mlon=' + scope.item.longitude + '#map=17/'+scope.item.latitude+'/'+scope.item.longitude
								:	'https://www.openstreetmap.org/search?query='+scope.item.address + ', ' + scope.item.zip + ', ' + scope.item.location
					},
					function(OSMlink){
						scope.OSMLink = OSMlink
					}
				)

				scope.$watch(
					function(){
						if(!scope.item) return ''

						return	scope.item.longitude && scope.item.latitude
								?	'https://www.google.de/maps/place/'+scope.item.latitude+'+' + scope.item.longitude + '/@'+scope.item.latitude + ',' + scope.item.longitude +',17z'
								:	'https://www.google.de/maps/place/'+scope.item.address+', '+scope.item.zip+', '+scope.item.location
					},
					function(GMLink){
						scope.GMLink = GMLink
					}
				)

				scope.$watch(
					function(){
						return scope.icId && icSearchResults.itemLoading(scope.icId)
					},

					function(loading){
						scope.loading = loading
					}
				)

				scope.$watch(
					function(){
						return icLanguages.currentLanguage
					},
					function(){
						scope.language = icLanguages.currentLanguage
					}
				)

			}
		}
	}
])



.directive('icInfoTag', [

	function(){

		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-info-tag.html',
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


.directive('icSharingMenu', [

	'$rootScope',
	'$location', 
	'icSite',
	'icSearchResults',
	'icLanguages',


	function($rootScope, $location, icSite, icSearchResults, icLanguages){
		return {
			restrict: 		'AE',
			templateUrl:	'partials/ic-sharing-menu.html',

			link: function(scope){

				scope.vars = {}

				function getVars(){
					scope.item = icSearchResults.getItem(icSite.params.item)
					if(!scope.item)				return null
					if(!scope.item.title) 		return null
					if(!scope.item.id)			return null

					var abs_url 	= 	$location.absUrl(),
						path		= 	$location.path(),
						title		=	scope.item.title,
						url			= 	abs_url.replace(path, '')
										+'/item/'	+ scope.item.id
										+'/l/'		+ icLanguages.currentLanguage

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
							{name: 'facebook', 	link: 'https://www.facebook.com/sharer/sharer.php?u='+v.url+'&t='+v.title},
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



.directive('icLanguageMenu', [

	'icLanguages',

	function(icLanguages){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-language-menu.html',
			scope:			{},

			link: function(scope, element){				
				scope.icLanguages = icLanguages
			}
		}
	}

])


.directive('icMainMenu', [

	'icConfigData',
	'icSite',
	'icFilterConfig',
	'icOverlays',
	'icUser',
	'icApi', //Todo not nice, templates should to be able to acces api, thats weird
	'icSearchResults',

	function(icConfigData, icSite, icFilterConfig, icOverlays, icUser, icApi, icSearchResults){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-main-menu.html',
			scope:			{},

			link: function(scope, element){				
				scope.icConfigData 		= icConfigData
				scope.icSite 			= icSite
				scope.icFilterConfig 	= icFilterConfig
				scope.icOverlays		= icOverlays
				scope.icUser			= icUser

				scope.expand 	= {}

				scope.icApi 			= icApi //TODO: not nice

				scope.logout = function(){
					icApi.logout()
					icSite.clearParams()
					icOverlays.open('popup', 'INTERFACE.LOGOUT_COMPLETE')

				}

				scope.addNewItem = function(){
					var item = icSearchResults.addNewItem()
					
					scope.newItemId = item.id
				}

				scope.recreateUsers = function(){

					icOverlays.open('spinner')

					return	icApi.recreateUsers()
							.then(
								function(){
									icOverlays.open('popup', 'INTERFACE.USERS_RECREATED')
								},

								function(){
									icOverlays.open('popup', 'INTERFACE.UNABLE_TO_RECREATE_USERS')
								}
							)
				}

				scope.parseFrontendMessages = function(){
					
					icOverlays.open('spinner')

					return 	icApi.parseFrontendMessages()
							.then(
								function(){
									icOverlays.open('popup', 'INTERFACE.FRONTEND_MESSAGES_PARSED')
								},

								function(){
									icOverlays.open('popup', 'INTERFACE.UNABLE_TO_PARSE_FRONTEND_MESSAGES')
								}
							)
				}
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






.filter('icColor', function(){
	return 	function(str){
				switch(str){
					case 'information': return "blue"; 		break;
					case 'events':		return "purple";	break;
					case 'places':		return "orange";	break;
					case 'services':	return "yellow";	break;
					default:			return "white";		break
				}
			}
})


.filter('icIcon', function(){
	return 	function(str, pre, color){
			var p = pre		|| 'type',
				c = color 	|| 'black'


			switch(str){
				case 'information': return "/images/icon_"+p+"_information_"+c+".svg"; 	break;
				case 'events':		return "/images/icon_"+p+"_events_"+c+".svg";		break;
				case 'places':		return "/images/icon_"+p+"_places_"+c+".svg";		break;
				case 'services':	return "/images/icon_"+p+"_services_"+c+".svg";		break;

				case 'city':		return "/images/icon_"+p+"_city_"+c+".svg";			break;
				case 'education':	return "/images/icon_"+p+"_education_"+c+".svg";	break;
				case 'social':		return "/images/icon_"+p+"_social_"+c+".svg";		break;
				case 'health':		return "/images/icon_"+p+"_health_"+c+".svg";		break;
				case 'leisure':		return "/images/icon_"+p+"_leisure_"+c+".svg";		break;
				case 'work':		return "/images/icon_"+p+"_work_"+c+".svg";			break;
				case 'support':		return "/images/icon_"+p+"_support_"+c+".svg";		break;
				case 'law':			return "/images/icon_"+p+"_law_"+c+".svg";			break;
				case 'culture':		return "/images/icon_"+p+"_culture_"+c+".svg";		break;

				case 'email':		return "/images/icon_"+p+"_email_"+c+".svg";		break;
				case 'address':		return "/images/icon_"+p+"_place_"+c+".svg";		break;
				case 'phone':		return "/images/icon_"+p+"_phone_"+c+".svg";		break;
				case 'hours':		return "/images/icon_"+p+"_time_"+c+".svg";			break;				
				case 'website':		return "/images/icon_"+p+"_link_"+c+".svg";			break;	
				
				case 'twitter':		return "/images/icon_"+p+"_twitter_"+c+".svg";		break;				
				case 'facebook':	return "/images/icon_"+p+"_facebook_"+c+".svg";		break;				
				case 'whatsapp':	return "/images/icon_"+p+"_whatsapp_"+c+".svg";		break;				
				// default:			return "/images/icon_nav_close.svg";				break;
				default:			return "/images/icon_topic_information_white.svg";	console.warn('icIcon: missing icon displayed as info!'); break;
			}
		}
})


.filter('icLinkPrefix', function(){
	return function(key){
		return	{
					'website':		'',
					'twitter':		'',
					'facebook':		'',
					'linkedin':		'',
					'instagram':	'',
					'pinterest':	'',
					'email':		'mailto:',
					'phone':		'tel:'
				}[key]
	}
})


.filter('icAddParameters',[

	'icSite',

	function(icSite){
		return function(params){
			if(typeof params == 'string') params = icsite.path2params(param)
			return icSite.getNewPath(params, 'add')
		}
	}
])


.filter('icToggleParameters',[

	'icSite',

	function(icSite){
		return function(params){
			if(typeof params == 'string') params = icsite.path2params(param)
			return icSite.getNewPath(params, 'toggle')
		}
	}
])



.directive('icTile', [

	'icColorFilter',

	function(icColorFilter){


		return {
			restrict:		'AE',
			transclude:		true,
			templateUrl:	'partials/ic-tile.html',

			scope:			{
								icType:		"<",
								icImage:	"<",
								icIcon:		"<",
								icTitle:	"<",
								icBrief:	"<"
							},

			link: function(scope, element, attrs){
				element.addClass('bg-'+icColorFilter(scope.icType))

				scope.$watch('icType', function(new_value, old_value){
					element.removeClass	('bg-'+icColorFilter(old_value))
					element.addClass	('bg-'+icColorFilter(new_value))
				})
			}
		
		}

	}
])








.directive('noTextNodes', [
	function(){
		return {
			restrict:	'AE',
			priority:	1000,

			link: function(scope, element, attrs){

				var nodes 		= element[0].childNodes,
					text_nodes 	= []

				for (var i = 0; i < nodes.length; i++) {
						if(nodes[i].nodeType == 3) text_nodes.push(nodes[i])
				} 

				text_nodes.forEach(function(node){
					element[0].removeChild(node)
				})

			}
		}
	}
])



.directive('icSpinner', [

	'$timeout',

	function($timeout){
		return {
			restrict:	'AE',
			template:	'<div class = "foreground"></div><div class = "background">',
			scope:		{
							active:	"<"
						},

			link: function(scope, element, attrs){

				var to = undefined 

				scope.$watch('active', function(active){
					if(to) $timeout.cancel(to)

					active
					?	element.addClass('active')
					:	to = $timeout(function(){ element.removeClass('active') }, 1000, false)
				})
			}
		}
	}
])



.directive('icFilterInterface', [

	'icFilterConfig',
	'icConfigData',
	'icUser',

	function(icFilterConfig, icConfigData, icUser){
		return {
			restrict: 		'AE',
			templateUrl:	'partials/ic-filter-interface.html',
			scope:			{
								expandFilter:	'<'
							},

			link: function(scope, element,attrs){
				scope.open 				= false
				scope.icFilterConfig 	= icFilterConfig
				scope.icConfigData 		= icConfigData
				scope.icUser			= icUser
				scope.expand			= {}


				if(scope.expandFilter){
					scope.open 					= 'filter'
					scope.expand.topics 		= !!icFilterConfig.filterBy.topics.length
					scope.expand.targetGroups 	= !!icFilterConfig.filterBy.targetGroups.length
					scope.expand.state			= !!icFilterConfig.filterBy.state
				}

				scope.toggleSortPanel = function(){
					scope.open = 	scope.open != 'sort'
									?	'sort'
									:	false
				}

				scope.toggleFilterPanel = function(){
					scope.open = 	scope.open != 'filter'
									?	'filter'
									:	false
				}
			}
		}
	}
])





.directive('icQuickFilter', [

	'icFilterConfig',
	'icConfigData',
	'icSearchResults',

	function(icFilterConfig, icConfigData, icSearchResults){
		return {
			restrict: 		'AE',
			templateUrl:	'partials/ic-quick-filter.html',
			scope:			{},

			link: function(scope, element,attrs){
				scope.icFilterConfig 	= icFilterConfig
				scope.icConfigData 		= icConfigData

				scope.$watch(
					function(){
						return icSearchResults.meta
					},

					function(meta){
						scope.meta = meta
					}
				)
			}
		}
	}
])


.filter('stripSpecialChars', [
	function(){
		return function(str){
			return str.replace(/[^a-zA-Z]/gi, '').toUpperCase()
		}
	}
])


.filter('trustAsHtml', [
	'$sce', 

	function ($sce) { 
		return function (text) {
			return $sce.trustAsHtml(text)
		}
	}
])


.filter('fill', [
	function(){
		return function(str, rep){
			rep = 	rep || ''
			rep = 	rep
					.replace(/\s/, '_')
					.replace(/([A-Z])/g, '_$1').toUpperCase()
			return str.replace(/%s/, rep)
		}
	}
])


.filter('prepend',[
	function(){
		return function(str, pre){
			return pre+str
		}
	}
])

.filter('append',[
	function(){
		return function(str, suf){
			return str+suf
		}
	}
])





// .directive('icTriplet', [

// 	'$timeout',
// 	'$compile',
// 	'icSite',
// 	'icSearchResults',

// 	function($timeout, $compile, icSite, icSearchResults){
// 		return {
// 			restrict:	"AE",
// 			scope:		{
// 							icId:	"<"
// 						},
// 			template:	'<div class ="shuttle">'+
// 						'</div>',	

// 			link: function(scope, element, attrs, ctrl){

// 				var previous_item, current_item, next_item,
// 					width,
// 					shuttle = element.find('div').eq(0)



// 				previous_item		= $compile('<ic-full-item ic-id = "previousId">	</ic-full-item>')(scope)
// 				current_item 		= $compile('<ic-full-item ic-id = "currentId">	</ic-full-item>')(scope)
// 				next_item 			= $compile('<ic-full-item ic-id = "nextId">		</ic-full-item>')(scope)

// 				scope.$watch('icId', function(id){
// 					scope.previousId	= icSearchResults.getPreviousId(id)
// 					scope.currentId 	= id
// 					scope.nextId		= icSearchResults.getNextId(id)
// 				})

// 				scope.$watch(
// 					function(){ return icSearchResults.filteredList.length},
// 					function(){
// 						scope.previousId	= icSearchResults.getPreviousId(scope.currentId)
// 						scope.nextId		= icSearchResults.getNextId(scope.currentId)
// 					}
// 				)


// 				element.css({
// 					display:			'block'
// 				})

// 				width = element[0].clientWidth

// 				element.css({
// 					width:				width+'px',
// 					overflowX:			'scroll'
// 				})

// 				shuttle.css({
// 					display:			'inline-block',
// 					whiteSpace:			'nowrap',
// 					transition:			'transform 0 ease-in',
// 					'will-change':		'scroll-position transform', 
// 				})

// 				element.append(shuttle)

// 				shuttle
// 				.append(previous_item)
// 				.append(current_item)
// 				.append(next_item)

// 				shuttle.children()
// 				.css({
// 					display:			'inline-block',
// 					width:				width+'px',
// 					verticalAlign:		'top',
// 					whiteSpace:			'normal'
// 				})	
				

// 				var scroll_stop 		= undefined,
// 					ignore_next_scroll 	= true,
// 					slide_off			= false

// 				element[0].scrollLeft 	= width



// 				function swap(){

// 					ignore_next_scroll = true

// 					shuttle.css({
// 						'transform':			'translateX(0px)',
// 						'transition-duration':	'0ms'
// 					})	


// 					if(scope.snapTo == 'next'){
// 						scope.previousId		= scope.currentId
// 						scope.currentId			= scope.nextId
// 						scope.nextId			= icSearchResults.getNextId(scope.nextId)
// 					}

// 					if(scope.snapTo == 'previous'){
// 						scope.nextId			= scope.currentId
// 						scope.currentId			= scope.previousId
// 						scope.previousId		= icSearchResults.getPreviousId(scope.previousId)
// 					}
					
// 					ignore_next_scroll		= true
// 					element[0].scrollLeft 	= width

// 					if(scope.snapTo != 'current'){
// 						scope.$digest()
// 						$timeout(function(){ 
// 							icSite.addItemToPath(scope.currentId) 
// 							slide_off = false
// 						} , 30, false)
// 					}

// 				}

// 				function snap() {	


// 					var scroll_left 	= element[0].scrollLeft,
// 						scroll_width	= shuttle[0].scrollWidth
						
// 					scope.snapTo = 'current'



// 					if(scroll_left < 0.4*scroll_width/3) scope.snapTo = scope.previousId 	? 'previous' 	: 'current'
// 					if(scroll_left > 1.6*scroll_width/3) scope.snapTo = scope.nextId		? 'next'		: 'current'

// 					var scroll_to 	= 	{
// 											previous:	0,
// 											current:	width,
// 											next:		2*width
// 										}[scope.snapTo],		

// 						distance 	= 	scroll_left - scroll_to,
// 						duration	=	Math.abs(distance/width) * 400


// 					shuttle.css({
// 						'transform':			'translateX('+distance+'px)',
// 						'transition-duration':	duration+'ms'
// 					})


// 					$timeout(swap, duration, false)
// 				}



// 				element.on('scroll', function(e){
// 					e.stopPropagation()
					
// 					console.log('scroll')

// 					if(ignore_next_scroll){ ignore_next_scroll = false; return null }

// 					if(scroll_stop) $timeout.cancel(scroll_stop)

// 					if(slide_off) return null

// 					scroll_stop = 	$timeout(snap, 100, false)
// 				})

// 			}
// 		}
// 	}
// ])






.directive('icTextLogo', [

	function(){
		return {
			restrict: 'E',
			template: "<span>Info</span><span>Compass</span>"
		}
	}
])










.directive('icSearch',[

	'icConfigData',
	'icFilterConfig',

	function(icConfigData, icFilterConfig){
		return {
			restrict: 		'E',
			templateUrl:	'partials/ic-search.html',
			scope:			{
								icOnSubmit: 	'&',
								icOnUpdate: 	'&'
							},

			link: function(scope, element, attrs){

				
				//scope.icTitles 			= icConfigData.titles
				scope.icFilterConfig	= icFilterConfig
				scope.searchTerm		= ''

				scope.update = function(){
					var input = element[0].querySelector('#search-term')
					
					input.focus()
					input.blur()

					if(scope.icOnSubmit) scope.icOnSubmit()

					if(scope.searchTerm){
						icFilterConfig.searchTerm = scope.searchTerm.replace(/[\/?#]+/g,' ')
						if(scope.icOnUpdate){
							scope.icOnUpdate()
						}
					}

					scope.searchTerm = undefined
				}

			}
		}
	}
])























.directive('icHorizontalSwipeListX', [

	'$timeout',
	'$compile',
	'icSite',
	'icSearchResults',

	function($timeout, $compile, icSite, icSearchResults){
		return {
			restrict:	"AE",
			scope:		{
							icModelAs:	"@",
							icPrevious:	"&",
							icCurrent:	"<",
							icNext:		"&",
							icOnTurn:	"&"
						},
			priority:	0,
			transclude:	true,
			template:	'<button ng-if = "previousModel" ng-click = "previous()" class ="left"></button>'+
						'<div class ="wrapper">'+
						'	<div class ="shuttle"></div>'+
						'</div>'+
						'<button ng-if = "nextModel" ng-click = "next()" class ="right"></button>',	

			link: function(scope, element, attrs, ctrl, transclude){

				var width,
					wrapper = element.find('div').eq(0),
					shuttle = wrapper.find('div').eq(0)



				var previous_scope	= scope.$parent.$new(),
					current_scope 	= scope.$parent.$new(),
					next_scope		= scope.$parent.$new()
					
				scope.previousModel	= undefined
				scope.currentModel	= undefined
				scope.nextModel		= undefined



				function updateScopes(newCurrentModel, digest){
					current_scope[scope.icModelAs]	= scope.currentModel		= newCurrentModel
					previous_scope[scope.icModelAs]	= scope.previousModel		= scope.icPrevious({'icModel': newCurrentModel})
					next_scope[scope.icModelAs]		= scope.nextModel			= scope.icNext({'icModel': newCurrentModel})




					if(digest){
						current_scope.$digest()
						previous_scope.$digest()
						next_scope.$digest()

						var items = shuttle.children()

						items[0].scrollTop = items[1].scrollTop = items[2].scrollTop = 0
						items[1].focus()

					}

				}

				scope.$watch('icCurrent', function(id){ updateScopes(id) })

				scope.$watch(
					function(){ return icSearchResults.filteredList.length} ,
					function(){ updateScopes(scope.icCurrent) }
				)


				element.css({
					display:			'inline-block',
					height:				'100%'
				})

				wrapper.css({
					display:			'inline-block',
					height:				'100%'

				})

				// width 	= element[0].clientWidth

				wrapper.css({
					overflowX:			'scroll',
					overflowY:			'hidden'
				})

				shuttle.css({
					display:			'inline-block',
					height:				'100%',					
					whiteSpace:			'nowrap',
					transition:			'transform 0 ease-in',
					'will-change':		'scroll-position transform', 
					overflow:			'hidden',
				})

				

				transclude(previous_scope, function(clone, scope){
					shuttle.append(clone)
				})

				transclude(current_scope, function(clone, scope){
					shuttle.append(clone)
				})

				transclude(next_scope, function(clone, scope){
					shuttle.append(clone)
				})


				shuttle.children()
				.css({
					display:			'inline-block',
					verticalAlign:		'top',
					whiteSpace:			'normal',
					transitionProperty: 'transform'
				})	

				//remove text nodes:
				
				var nodes 		= shuttle[0].childNodes,
					text_nodes 	= []

				for (var i = 0; i < nodes.length; i++) {
						if(nodes[i].nodeType == 3) text_nodes.push(nodes[i])
				} 

				text_nodes.forEach(function(node){
					shuttle[0].removeChild(node)
				})


				//handle Resize:
				function handleResize(){
					window.requestAnimationFrame(function(){
						width = shuttle.children()[0].offsetWidth
						wrapper.css({width: width+'px'})				
						wrapper[0].scrollLeft = width	
					})
				}
				
				handleResize()

				angular.element(window).on('resize', handleResize)
				
				scope.$on('$destroy', function(){
					angular.element(window).off('resize', handleResize)
				})





				var scroll_stop 		= undefined,
					ignore_next_scroll 	= true,
					slide_off			= false




				function swap(){


					ignore_next_scroll = true

					shuttle.css({
						'transform':			'translateX(0px)',
						'transition-duration':	'0ms'
					})	


					if(scope.snapTo == 'next'){
						updateScopes(scope.nextModel, true)
					}

					if(scope.snapTo == 'previous'){
						updateScopes(scope.previousModel, true)
					}
					

					ignore_next_scroll		= true
					wrapper[0].scrollLeft 	= width

					if(scope.snapTo != 'current'){
						$timeout(function(){ 
							scope.icOnTurn({icModel: scope.currentModel})
							slide_off = false
						} , 30, false)
					}

				}

				function snap() {	

					// console.log(snap)


					var scroll_left 	= wrapper[0].scrollLeft,
						scroll_width	= shuttle[0].scrollWidth
						
					scope.snapTo = 'current'



					if(scroll_left < 0.4*scroll_width/3) scope.snapTo = scope.previousModel 	? 'previous' 	: 'current'
					if(scroll_left > 1.6*scroll_width/3) scope.snapTo = scope.nextModel			? 'next'		: 'current'

					var scroll_to 	= 	{
											previous:	0,
											current:	width,
											next:		2*width
										}[scope.snapTo],		

						distance 	= 	scroll_left - scroll_to,
						duration	=	Math.abs(distance/width) * 400


					shuttle.css({
						'transform':			'translateX('+distance+'px)',
						'transition-duration':	duration+'ms'
					})

					shuttle.children().css({
						transform:				'translateX(0px)',
						'transition-duration':	duration+'ms'
					})


					$timeout(swap, duration, false)
				}


				scope.previous = function(){
					scope.snapTo = 'previous'
					$timeout(swap, 0, false)
				}

				scope.next = function(){
					scope.snapTo = 'next'
					$timeout(swap, 0, false)
				}

				wrapper.on('scroll', function(e){
					e.stopPropagation()

					//console.log('scroll')
					
					if(ignore_next_scroll){ ignore_next_scroll = false; return null }

					window.requestAnimationFrame(function(){
						var left = wrapper[0].scrollLeft


						shuttle.children().eq(0)
						.css({
							transform:				'translateX('+(left < width ? left/2 : 0)+'px)',
							'transition-duration':	'0ms'
						})

						shuttle.children().eq(1)
						.css({
							transform:				'translateX('+(left > width ? (left-width)/2 : 0)+'px)',
							'transition-duration':	'0ms'
						})

					})

					if(scroll_stop) $timeout.cancel(scroll_stop)

					if(slide_off) return null

					scroll_stop = 	$timeout(snap, 100, false)
				})

			}
		}
	}
])








.directive('icHorizontalSwipeList', [

	'$timeout',
	'$compile',
	'icSite',
	'icSearchResults',

	function($timeout, $compile, icSite, icSearchResults){
		return {
			restrict:	"AE",
			scope:		{
							icModelAs:	"@",
							icPrevious:	"&",
							icCurrent:	"<",
							icNext:		"&",
							icOnTurn:	"&"
						},
			priority:	0,
			transclude:	true,
			template:	'<button ng-if = "previousModel" ng-click = "previous()" class ="left"></button>'+
						'<div class ="wrapper">'+
						'	<div class ="shuttle"></div>'+
						'</div>'+
						'<button ng-if = "nextModel" ng-click = "next()" class ="right"></button>',	

			link: function(scope, element, attrs, ctrl, transclude){

				var width,
					wrapper = element.find('div').eq(0),
					shuttle = wrapper.find('div').eq(0)



				var previous_scope	= scope.$parent.$new(),
					current_scope 	= scope.$parent.$new(),
					next_scope		= scope.$parent.$new()
					
				scope.previousModel	= undefined
				scope.currentModel	= undefined
				scope.nextModel		= undefined



				function updateScopes(newCurrentModel, digest){
					current_scope[scope.icModelAs]	= scope.currentModel		= newCurrentModel
					previous_scope[scope.icModelAs]	= scope.previousModel		= scope.icPrevious({'icModel': newCurrentModel})
					next_scope[scope.icModelAs]		= scope.nextModel			= scope.icNext({'icModel': newCurrentModel})




					if(digest){
						current_scope.$digest()
						previous_scope.$digest()
						next_scope.$digest()

						var items = shuttle.children()

						items[0].scrollTop = items[1].scrollTop = items[2].scrollTop = 0
						items[1].focus()

					}

				}

				scope.$watch('icCurrent', function(id){ updateScopes(id) })

				scope.$watch(
					function(){ return icSearchResults.filteredList.length} ,
					function(){ updateScopes(scope.icCurrent) }
				)


				element.css({
					display:			'inline-block',
					height:				'100%'
				})

				wrapper.css({
					display:			'inline-block',
					height:				'100%',
					//willChange:			'scroll-position',
					overflowX:			'scroll',
					overflowY:			'hidden'
				})

				shuttle.css({
					display:			'inline-block',
					height:				'100%',					
					whiteSpace:			'nowrap',
					transition:			'transform 0 ease-in',
					overflow:			'hidden',
				})

				

				transclude(previous_scope, function(clone, scope){
					shuttle.append(clone)
				})

				transclude(current_scope, function(clone, scope){
					shuttle.append(clone)
				})

				transclude(next_scope, function(clone, scope){
					shuttle.append(clone)
				})


				shuttle.children()
				.css({
					display:			'inline-block',
					verticalAlign:		'top',
					whiteSpace:			'normal'
				})	

				//remove text nodes:
				
				var nodes 		= shuttle[0].childNodes,
					text_nodes 	= []

				for (var i = 0; i < nodes.length; i++) {
						if(nodes[i].nodeType == 3) text_nodes.push(nodes[i])
				} 

				text_nodes.forEach(function(node){
					shuttle[0].removeChild(node)
				})


				//handle Resize:
				function handleResize(){
					window.requestAnimationFrame(function(){
						width = shuttle.children()[0].offsetWidth
						wrapper.css({width: width+'px'})				
						wrapper[0].scrollLeft = width	
					})
				}
				
				handleResize()

				angular.element(window).on('resize', handleResize)
				
				scope.$on('$destroy', function(){
					angular.element(window).off('resize', handleResize)
				})





				var scroll_stop 		= undefined,
					ignore_next_scroll 	= true,
					slide_off			= false



				function swap(){


					shuttle.css({
						'transform':			'translateX(0px)',
						'transition-duration':	'0ms'
					})	


					if(scope.snapTo == 'next'){
						updateScopes(scope.nextModel, true)
					}

					if(scope.snapTo == 'previous'){
						updateScopes(scope.previousModel, true)
					}
					

					ignore_next_scroll		= true
					wrapper[0].scrollLeft 	= width

					if(scope.snapTo != 'current'){
						$timeout(function(){ 
							scope.icOnTurn({icModel: scope.currentModel})
							slide_off = false
						} , 30, false)
					}

				}

				function snap() {	

					// console.log(snap)


					var scroll_left 	= wrapper[0].scrollLeft
						
					scope.snapTo = 'current'



					if(scroll_left < previous_boundry) scope.snapTo = scope.previousModel 	? 'previous' 	: 'current'
					if(scroll_left > 1.6*scroll_width/3) scope.snapTo = scope.nextModel			? 'next'		: 'current'

					var scroll_to 	= 	{
											previous:	0,
											current:	width,
											next:		2*width
										}[scope.snapTo],		

						distance 	= 	scroll_left - scroll_to,
						duration	=	Math.abs(distance/width) * 400


					shuttle.css({
						'transform':			'translateX('+distance+'px)',
						'transition-duration':	duration+'ms'
					})

					shuttle.children().css({
						transform:				'translateX(0px)',
						'transition-duration':	duration+'ms'
					})


					$timeout(swap, duration, false)
				}


				scope.previous = function(){
					scope.snapTo = 'previous'
					$timeout(swap, 0, false)
				}

				scope.next = function(){
					scope.snapTo = 'next'
					$timeout(swap, 0, false)
				}



				var last_scroll_left 	= undefined,
					scroll_left			= undefined,
					scroll_width		= undefined,
					count				= 0,
					watch				= false



				function watchScroll(){
					if(!watch) count = 0

					scroll_left 	= wrapper[0].scrollLeft
					scroll_width	= shuttle[0].scrollWidth

					if(scroll_left != last_scroll_left){
						shuttle.children().eq(0)
						.css({
							transform:				'translateX('+(scroll_left < width ? Math.floor(scroll_left/2) : 0)+'px)',
						})

						shuttle.children().eq(1)
						.css({
							transform:				'translateX('+(scroll_left > width ? Math.floor((scroll_left-width)/2) : 0) +'px)',
						})
					}

					count = 	scroll_left == last_scroll_left 
								?	count + 1 
								:	0
					
					if(count > 5){
						//console.log(scroll_left, width)
						if(scroll_left < 0.4*width) 	wrapper[0].scrollLeft -= width/50
						if(scroll_left > 1.6*width) 	wrapper[0].scrollLeft += width/50

						if(scroll_left >= 0.4*width && scroll_left <= 1.6*width && scroll_left != width){
							wrapper[0].scrollLeft	= 	scroll_left > width
													?	Math.min(width, wrapper[0].scrollLeft-width/50)
													:	Math.max(width, wrapper[0].scrollLeft+width/50)
						}
					}

					if(count < 10 ){						
						watch = true
						window.requestAnimationFrame(watchScroll)
					} else {
						watch = false
					}

					last_scroll_left = scroll_left
				}

				wrapper.on('scroll', function(e){
					e.stopPropagation()

					if(slide_off) 	return null
					if(watch) 		return null
					if(ignore_next_scroll){ ignore_next_scroll = false; return null }
					
					watchScroll()

					// console.log('scroll')
					

					

					// if(scroll_stop) $timeout.cancel(scroll_stop)

					// if(slide_off) return null

					// scroll_stop = 	$timeout(snap, 100, false)
				})

			}
		}
	}
])




.directive('icSearchTerm', [

	'icFilterConfig',
	'icSearchResults',

	function(icFilterConfig, icSearchResults){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-search-term.html',

			link: function(scope){
				scope.icFilterConfig 	= icFilterConfig
				scope.icSearchResults 	= icSearchResults
			}
		}
	}
])















.directive('icOverlays', [

	'icOverlays',

	function(icOverlays){

		return {

			restrict:	"AE",
			templateUrl:"partials/ic-overlays.html",
			scope:		true,

			link: function(scope, element, attrs, ctrl, transclude){
				icOverlays.registerScope(scope)
				scope.icOverlays = icOverlays

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


.directive('icHome', [

	'$location',

	function($location){

		return {
			restrict:	"A",

			link: function(scope, element){

				element.on('click', function(){
					scope.$apply(function(){
						$location.path('/')
					})
				})

			}
		}
	}
])

.directive('icToggleOverlay',[

	'icOverlays',

	function(icOverlays){
		return {
			restrict:	"A",

			link: function(scope, element, attrs){

				function toggle(e){
					// e.preventDefault()
					//e.stopPropagation()
					icOverlays.toggle(attrs.icToggleOverlay)
					icOverlays.$digest()					
				}

				element.on('click', toggle)
				scope.$on('$destroy', function(){ element.off('click', toggle) })
			}
		}
	}
])


.directive('icClick',[
	function(){
		return {
			restrict:	'A',

			link: function(scope, element, attrs){

				function trigger(e){
					e.stopPropagation()
					scope.$eval(attrs.icClick)
					scope.$digest()					
				}

				element.on('click', trigger)
				scope.$on('$destroy', function(){ element.off('click', trigger) })
			}
		}
	}
])



.directive('icItemEditProperty', [

	'icItemEdits',
	'icUser',
	'icLanguages',
	'icOverlays',
	'$q',

	function(icItemEdits, icUser, icLanguages, icOverlays, $q){
		return {
			restrict:		'AE',
			scope:			{
								icKey:					"@",
								icTitle: 				"<",
								icItem:					"<",
								icType:					"@",
								icOptions:				"<",
								icOptionLabel:			"&",
								icIgnoreCurrentValue:	"<",	//Workaround, TODO
								icForceNumber:			"<"		//Workaround, TODO
							},

			templateUrl: 	"partials/ic-item-edit-property.html",

			link: function(scope, element, attrs){

				var itemEdit = icItemEdits.open(scope.icItem.id)

				scope.icTranslatable 	= 	'icTranslatable' in attrs && scope.$eval(attrs.icTranslatable) !== false
				scope.icLanguages		= 	icLanguages
				scope.value				=	{}
				scope.expand			=	undefined
				scope.showCurrentValue	=	scope.icItem.state != 'new'

				scope.update = function(){
					scope.updating = true
					itemEdit
					.update(scope.icKey, scope.icTranslatable ? icLanguages.currentLanguage : undefined)
					.then(
						function(item_data){
							scope.icItem.importData(item_data)
							refreshValues()
						},
						function(reason){
							icOverlays.open('popup', 'INTERFACE.UNABLE_TO_SUBMIT_EDITS')
							return $q.reject(reason)
						}
					)
					.finally(function(){
						scope.updating = false
					})
				}

				scope.revert = function(){
					scope.value.new = angular.copy(scope.value.current)
				}

				scope.autoTranslate = function(){
					if(!scope.icTranslatable) console.warn('icItemEdit: field not translatable: ', scope.icKey); return null

					icLanguages.availableLanguages.forEach(function(language){
						if(!scope.icItem[scope.icKey][language]) {
							scope.icItem[scope.icKey][language] = 'googleTranslate:'
						}						
					})

				}

				scope.diff = function(){
					if(!scope.value.new) 		return !!scope.value.current
					if(!scope.value.current) 	return !!scope.value.new

					switch(scope.icType){
						case "string": 	return scope.value.new != scope.value.current; break;
						case "text": 	return scope.value.new != scope.value.current; break;
						case "array": 	return scope.value.new.length != scope.value.current.length || scope.value.new.some(function(option){ return scope.value.current.indexOf(option) == -1 })
					}
				}

				scope.toggleOption = function(option){
					var pos = scope.value.new.indexOf(option)

					return	pos != -1
							?	scope.value.new.splice(pos,1)
							:	scope.value.new.push(option)

				}






				function refreshValues(){
					itemEdit = icItemEdits.open(scope.icItem.id)

					scope.value.new			= 	angular.copy(
													scope.icTranslatable
													?	itemEdit[scope.icKey][icLanguages.currentLanguage] 
													:	itemEdit[scope.icKey]
												)


					scope.value.current		= 	angular.copy(
													scope.icTranslatable
													?	scope.icItem[scope.icKey][icLanguages.currentLanguage] 
													:	scope.icItem[scope.icKey]
												)
					//workaround, actually the backend should never hand out this value if it is to be ignored:
					if(scope.icIgnoreCurrentValue){
						scope.value.current = ''
					}else{
						//keep this until workaround is no longer neccessary:
						if(!scope.value.new || scope.value.new.length == 0) scope.value.new = angular.copy(scope.value.current)
					}

					scope.expand = (scope.expand === undefined ? scope.value.new || undefined : scope.expand)
				}





				scope.$watch(function(){ return icLanguages.currentLanguage }, refreshValues)

				
				scope.$watch(
					function(){ 
						return scope.icItem.state != 'new' && icUser.can('edit_items')
					},
					function(allowLocalEdit){
						scope.allowLocalEdit = 	allowLocalEdit
					}
				)

				scope.$watch(
					function(){ return itemEdit.isInvalidKey(scope.icKey)},
					function(invalid){
						element.toggleClass('invalid', invalid)
					}
				)

				scope.$watch('icItem[icKey]', refreshValues, true)

				scope.$watch('value.new', function(){

					if(scope.icForceNumber){	//Workaround
						if(!scope.value.new.match(/^\d*\.?\d{0,2}$/)){
							scope.value.new = 	scope.value.new
												.replace(/[^\d,.]/, '')
												.replace(/,/,'.')
												.replace(/^(\d*\.\d{2})\d*/, '$1')
							scope.value.new = String((parseFloat(scope.value.new) || 0 ).toFixed(2))
						}
					}

					if(scope.icTranslatable){
						itemEdit[scope.icKey][icLanguages.currentLanguage] = scope.value.new
					} else {
						itemEdit[scope.icKey] = scope.icForceNumber		//Workaround
												?	String((parseFloat(scope.value.new) || 0 ).toFixed(2))
												:	scope.value.new
					}

					itemEdit.validateKey(scope.icKey)
				})
			}
		}
	}
])


.filter('icItemLink',[
	function(){
		return function(id){
			return location.origin+'/item/'+id
		}
	}
])


.directive('icTouchMe', [
	function(){
		return {
			restrict:		'A',
			link: function(scope, element, attrs){

				var fading_time = attrs.icTouchMe || 400

				function add(){
					angular.element(document.body).one('touchend mouseup', remove)									
					element.addClass('ic-touched')	
				}
				function remove(){
					element.addClass('ic-touch-fade')
					window.requestAnimationFrame(function(){
						element.removeClass('ic-touched')					
						window.setTimeout(function(){
							element.removeClass('ic-touch-fade')
						}, fading_time)
					})
				}

				element.on('touchstart mousedown', add)

				scope.$on('$destroy', function(){
					element.off('touchstart mousedown', add)
					angular.element(document.body).off('touchend mouseup', remove)
				})

			}
		}
	}
])


.filter('icSplit', function(){

	var cache = {} // we need this to prevent angular from throwing infdig

	return function(str, splitter){
		var a = str.split(splitter)

		cache[str] = cache[str] || []
		while(cache[str].length) cache[str].pop()

		a.forEach(function(entry){
			cache[str].push(entry)
		})

		return cache[str]
	}
})

.filter('icDate', [

	'icLanguages',

	function(icLanguages){

		var toLocaleDateStringSupportsLocales 	= false

		try {
			new Date().toLocaleString('i')
		} catch (e) {
			toLocaleDateStringSupportsLocales =  e instanceof RangeError
		}

		function icDateFilter(date_str, use_time){
			var d = new Date(date_str)

			if(toLocaleDateStringSupportsLocales){
				return 	d.toLocaleDateString(icLanguages.currentLanguage) + (use_time ? ' ' + d.toLocaleTimeString(icLanguages.currentLanguage) : '')
			} else {
				return date_str
			}

		}

		icDateFilter.$stateful = true

		return icDateFilter

	}
])

.filter('trim',[

	function(){
		return function(str){
			str = str || ''
			return str.replace(/^\s+|\s+$/g,'')
		}
	}
])



//TODO: remove this
.directive('fakeScrollBump', [

	'icSearchResults',

	function(icSearchResults){
		return {
			restrict:	'A',

			link: function(scope, element, attrs){

				function trigger(){
					requestAnimationFrame(function(){

						if(icSearchResults.listLoading()) 	return null
						if(icSearchResults.noMoreItems) 	return null

						var boundry 	= element[0].scrollHeight

						if(element[0].scrollTop + 2*element[0].clientHeight <= boundry) return null

						if(!icSearchResults.listLoading()){
							icSearchResults
							.download()
							.then(function(){
								trigger()
							})
						}

					})
				}

				element.on('scroll', trigger)
			}
		}
	}
])



.directive('icTrackImageState', [
	function(){
		return {
			restrict:	"A",
			scope:		{
							icImageBad: 	'&?',
							icImageGood:	'&?'
						},

			link: function(scope, element, attrs){

				function check(){
					return element[0].complete && (element[0].naturalWidth == "undefined" || element[0].naturalWidth !== 0)
				}

				function update(digest){
					var last = scope.displayable

					scope.displayable = check()

					if(scope.displayable !== last){

						scope.displayable
						?	scope.icImageGood()
						:	scope.icImageBad()

						if(digest) scope.$parent.$digest()
					}					
				}

				element.on('error load', 	function(){ update(true) })
				scope.$parent.$watch(		function(){ update(false) })

			}
		}
	}
])


.directive('icAutoGrow', [

	function(){
		return {
			restrict:	"A",
			require:	"ngModel",

			link: function(scope, element, attrs){

				function resize(value){
					window.requestAnimationFrame(function(){
						element.css('height', 'auto')
						if(value) element.css('height', element[0].scrollHeight + 'px')
					})
				}

				element.on('blur keyup keydown change',resize)
				scope.$watch(attrs.ngModel, resize)
			}
		}
	}

])


.directive('icLogin',[

	'$rootScope',
	'icApi',
	'icOverlays',

	function($rootScope, icApi, icOverlays){
		return {
			restrict:		'E',
			templateUrl:	'partials/ic-login.html',
			transclude:		true,

			link: function(scope, element){
				scope.username = ''
				scope.password = ''

				scope.login = function(){
					icOverlays.toggle('spinner', true, true)
					icApi.login(scope.username, scope.password)
					.then(
						function(){
							scope.username = ''
							scope.password = ''
							return 	icOverlays.open('popup', 'INTERFACE.LOGIN_SUCCESSFULL')
									.finally(function(){
										console.dir(icOverlays.deferred.login)
										icOverlays.deferred.login.resolve()
									})

						},
						function(reason){
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



.directive('icFocusMe', [

	function(){
		return {
			restrict:	'A',
			priority:	0,

			link: function(scope, element){
				element[0].focus()
			}
		}
	}
])


.directive('icScrollTop', [
	function(){
		return {
			restrict:	'A',
			priority:	0,

			link: function(scope, element, attrs){
				scope.$watch(
					function(){
						return attrs.icScrollTop
					}, 
					function(){
						element[0].scrollTop = 0
					}
				)
			}
		}		
	}
])