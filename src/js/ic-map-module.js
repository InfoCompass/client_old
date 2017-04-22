"use strict";


angular.module('icMap', [
	'icServices'
])


.service('icMapItemMarker',[

	'$compile',

	function($compile){

		var icItemMarker = function(item, parentScope){

			var scope 	=  	parentScope.$new()

			scope.item 	= 	item
			
			var element = 	$compile('<ic-map-item-marker ic-item = "item"></ic-map-item-marker')(scope)
				//shadow	=	angular.element('<div class = "ic-map-marker-shadow"></div>')

			this.createIcon = function(){
				return element[0]
			}

			this.createShadow = function(){
				return //null shadow[0]
			}

		}

		return icItemMarker
	}
])


.service('icMapClusterMarker',[

	'$compile',

	function($compile, icSite){


		var icClusterMarker = function(cluster, parentScope){

			if(cluster._marker) return cluster._marker


			var scope 	=  	parentScope.$new(),
				element =	$compile('<ic-map-cluster-marker ic-cluster = "cluster"></ic-map-cluster-marker>')(scope)

			scope.cluster 			=	cluster
			cluster.scope 			= 	scope
			cluster._marker 		= 	this

			
			this.createIcon = function(){
				return cluster._icon || element[0]
			}

			this.createShadow = function(){
				return null //shadow[0]
			}


		}

		return icClusterMarker
	}
])


.directive('icMapItemMarker',[

	'icLanguages',
	'icSite',
	'$timeout',

	function(icLanguages, icSite, $timeout){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-map-item-marker.html',
			scope:			{
								icItem:		"<",
								icTitle: 	"<",
								icDetails:	"<"
							},

			link: function(scope, element){
				scope.icLanguages 	= icLanguages
				scope.icSite		= icSite

				// scope.$watch(
				// 	function(){
				// 		return  icSite.activeItem && icSite.activeItem.id
				// 	},
				// 	function(id){
				// 		element.toggleClass('active', !!(scope.icItem && id == scope.icItem.id))
						
				// 	}
				// )
			}

		}
	}

])


.directive('icMapClusterMarker',[

	'icSite',

	function(icSite){
		return {
			restrict:		'AE',
			templateUrl:	'partials/ic-map-cluster-marker.html',
			scope:			{
								icCluster:	"<"
							},

			link: function(scope){
				scope.$watch('icCluster', function(){
					scope.items = 	scope.icCluster.getAllChildMarkers()
									.map(function(marker){
										return marker.options.item
									})
				})

				scope.isActive = function(item){
					return 	item == icSite.activeItem
							?	0
							:	1
				}
			}

		}
	}

])


.service('icMapSpinnerControl', [

	'$compile',

	function($compile){

		var element = undefined

		L.Control.IcMapSpinner = L.Control.extend({
			onAdd: function(map) {
				return element && element[0]
			},

			onRemove: function(map) {
			}
		})

		this.setScope = function(scope){
			element = 	$compile('<ic-spinner active = "icSearchResults.listLoading()"></ic-spinner>')(scope)
		}
	}
])


.service('icMapExpandControl', [

	'$compile',

	function($compile){

		var element = undefined

		L.Control.IcMapExpand = L.Control.extend({
			onAdd: function(map) {
				return element && element[0]
			},

			onRemove: function(map) {
			}
		})

		this.setScope = function(scope){
			element = 	$compile('<ic-map-expand-control></ic-map-expand-control>')(scope)
		}
	}
])

.directive('icMapExpandControl',[

	'icSite',

	function(icSite){
		return {
			restrict : 		'E',
			scope:			true,
			templateUrl: 	'partials/ic-map-expand-control.html',

			link: function(scope){
				scope.icSite = icSite
			}
		}
	}
])


.service('icMapSwitchControl', [

	'$compile',

	function($compile){

		L.Control.icMapSwitchControl = L.Control.extend({
			onAdd: function(map) {
				this._container = this._container || $compile('<ic-map-switch-control ic-item = "'+this.options.key+'"></ic-map-switch-control>')(this.options.scope)[0]
				return this._container
			},

			onRemove: function(map) {
			}
		})
	}
])

.directive('icMapSwitchControl',[

	'icSite',
	'icMainMap',

	function(icSite, icMainMap){
		return {
			restrict : 		'E',
			scope:			{
								icItem:	'<',
							},

			templateUrl: 	'partials/ic-map-switch-control.html',

			link: function(scope){
				scope.focusItem = function(){
					if(!scope.icItem ||  !scope.icItem.latitude || !scope.icItem.longitude){
						console.warn('icMiniMap: focusItemOnMap: missing coordinates.')
						return null
					}

					icSite.switches.expandMap = true

					icMainMap.ready
					.then(function(map){
						map.setView([scope.icItem.latitude, scope.icItem.longitude], icMainMap.default.maxZoom)	

					})

				}
			}
		}
	}
])


.service('icMainMap', [

	'$q',

	function($q){

		var mapReady = $q.defer(),
			icMainMap = 	{
							ready:		mapReady.promise,
							default:	{
											center:		[52.500, 13.400],
											zoom:		11,
											minZoom:	11,
											maxZoom:	18
										},
							mapObject: 	undefined
						}

		icMainMap.setMapObject = function(obj){
			if(icMainMap.mapObject) console.warn('icMainMap: mapObject already set!')
			icMainMap.mapObject = obj
			mapReady.resolve(icMainMap.mapObject)
		}
		icMainMap.clearMapObject = function(){
			mapReady.reject('map object cleared')
			mapReady = $q.defer()
			icMainMap.mapObject = undefined
			icMainMap.ready	= mapReady.promise
		}

		return icMainMap
	}
])

.directive('icMap',[

	'$rootScope',
	'$timeout',
	'icSearchResults',
	'icMainMap',
	'icMapItemMarker',
	'icMapClusterMarker',
	'icMapExpandControl',
	'icMapSpinnerControl',
	'icSite',

	function($rootScope, $timeout, icSearchResults, icMainMap, icMapItemMarker, icMapClusterMarker, icMapExpandControl, icMapSpinnerControl, icSite){
		return {
			restrict: 'AE',

			link: function(scope, element, attrs){


				var markers = 	L.markerClusterGroup({
									maxClusterRadius: 			40,
									spiderfyOnMaxZoom:			false,
									chunkedLoading:				true,
									iconCreateFunction: function(cluster) {										
										return 	new icMapClusterMarker(cluster, scope)
									}
								} ),
					map 	= 	L.map(element[0], {
									center: 		icMainMap.default.center,
									zoom: 			icMainMap.default.zoom,
									minZoom:		icMainMap.default.minZoom,
									maxZoom:		icMainMap.default.maxZoom,
									zoomControl: 	false,
									trackSize:		false,
									maxBounds:		[
														[52.80, 13.80], 
														[52.20, 13.00]
													]
								})



				icMainMap.setMapObject(map)

				scope.icSearchResults = icSearchResults

				new L.Control.Zoom({
					position: 	'topright' 	
				}).addTo(map)

				icMapExpandControl.setScope(scope)

				new L.Control.IcMapExpand({ 
					position: 	'topleft',
				}).addTo(map)


				icMapSpinnerControl.setScope(scope)

				new L.Control.IcMapSpinner({ 
					position: 	'bottomleft',
				}).addTo(map)

				L.tileLayer(
					'https://{s}.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoicmhvdGVwIiwiYSI6ImNqMGRib2dmYTAwMGEzMnBkNDBuZ2dqMHMifQ.LNUbADugC76iQ91I73xFwg', 
					{
						attribution: '&copy; <a href ="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					}
				).addTo(map)

				map.addLayer(markers)

				var width 					= undefined,
					height					= undefined,
					scheduled_adjustment	= undefined

				function adjustSize(delay){

					delay = parseInt(delay) || 50
					
					if(delay > 400) return null
					if(scheduled_adjustment) $timeout.cancel(scheduled_adjustment)

					scheduled_adjustment = $timeout(function(){
						if(width !== element[0].clientWidth || height !== element[0].clientHeight){
							map.invalidateSize(false)
							width 	= element[0].clientWidth
							height 	= element[0].clientHeight

							adjustSize()					
						} else{
							adjustSize(delay *2)
						}

					}, delay , false)
				}


				angular.element(window).on('resize', adjustSize)


				function getMarker(item){
					return 	new L.marker(
								[item.latitude, item.longitude], 
								{
									icon: new icMapItemMarker(item, scope),
									item: item,
									riseOnHover: true
								}
							)
				}

				function updateListMarkers(list){

							var items_to_be_left_alone = 	markers.getLayers()
															.filter(function(marker){ 
																if(
																		// in searchresults:
																		list.indexOf(marker.options.item) != -1
																		// current item:
																	||	(icSite.activeItem && marker.options.item.id == icSite.activeItem.id)
																){
																	return true
																} else {
																	markers.removeLayer(marker)
																	return false
																}
															})
															.map(function(marker){
																return marker.options.item
															})
															,
								additional_items		=	list
															.filter(function(item){
																return 		item.latitude 
																		&&	item.longitude
																		&&	items_to_be_left_alone.indexOf(item) == -1
															})

							markers.addLayers(additional_items.map(getMarker))
							//markers.refreshClusters()
				}

				function updateCurrentItemMarker(previous, current){
					var previous_item	= previous,
						item			= current


					if(previous_item == item) return null

					//remove previous item marker:
					if(previous_item){
						markers.getLayers(function(marker){
							if(marker.options.item.id == previous_item.id) markers.removeLayer(marker)
						})
					}

					//add current item marker:
					if(item){
						var marker_already_present = false
						markers.getLayers(function(marker){
							if(marker.options.item.id == item.id) marker_already_present = true
						})
						if(!marker_already_present)	markers.addLayer(getMarker(item))
					}

					//markers.refreshClusters()
				}



				var	stop_watching_filteredList = $rootScope.$watchCollection(
						function(){ return icSearchResults.filteredList	},
						function(list){
							window.requestAnimationFrame(function(){
								updateListMarkers(list)								
							})
						}
					),

					stop_watching_currentItem = $rootScope.$watch(
						function(){ return [icSite.activeItem, icSite.activeItem && icSite.activeItem.longitude, icSite.activeItem && icSite.activeItem.latitude] }, 
						function(p,c){
							window.requestAnimationFrame(function(){
								updateCurrentItemMarker(p[0],c[0])								
							})
						}, 
						true
					),

					stop_watching_displayedSections = $rootScope.$watch(
						function(){ return icSite.displayedSections },
						function(){
							window.requestAnimationFrame(function(){
								adjustSize()
							})
						},
						true
					)



				scope.$on('$destroy', function(){
					icMainMap.clearMapObject()
					stop_watching_filteredList()
					stop_watching_displayedSections()
					stop_watching_currentItem()
					angular.element(window).off('resize', adjustSize)

				})


			}
		}
	}
])



.directive('icMiniMap',[

	'icMapItemMarker',
	'icMapSwitchControl',
	'icSite',


	function(icMapItemMarker, icMapSwitchControl, icSite){
		return {
			restrict: 	'AE',
			scope:		{
							icItem: 	'<',
						},

			link: function(scope, element){

				var	map 	= 	L.map(element[0], {
									zoom: 			16,
									minZoom:		16,
									maxZoom:		16,
									zoomControl: 	false,
									doubleClickZoom:false,
									scrollWheelZoom:false,
									boxZoom:		false,
									dragging:		false,
									touchZoom:		false
								}),
					marker	=	undefined

				
				if (map.tap) {
				  map.tap.disable();
				}



				new L.Control.icMapSwitchControl({ 
					position: 	'topright',
					scope:		scope,
					key:		'icItem'
				}).addTo(map)

				L.tileLayer(
					'https://{s}.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoicmhvdGVwIiwiYSI6ImNqMGRib2dmYTAwMGEzMnBkNDBuZ2dqMHMifQ.LNUbADugC76iQ91I73xFwg', 
					{
						attribution: '&copy; <a href ="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					}
				).addTo(map)

		
				scope.$watch('icItem', function(icItem){
					if(marker) marker.remove()

					marker = L.marker(
						[scope.icItem.latitude, scope.icItem.longitude], 
						{
							icon: new icMapItemMarker(icItem, scope),
							item: icItem,
						}
					)
					.addTo(map)

					map.setView([icItem.latitude, icItem.longitude])
				})


			}
		}
	}

])
