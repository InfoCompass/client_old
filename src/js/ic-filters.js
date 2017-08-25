"use strict";


angular.module('icFilters', [
	'icServices',
])


.filter('icLink',[

	'icSite',

	function(icSite){
		return function(config){
			return icSite.getNewPath(config)
		}
	}
	
])

.filter('icType', [

	'icTaxonomy',

	function(icTaxonomy){
		return function(item_or_tags){
			return item_or_tags && icTaxonomy.getType(item_or_tags.tags || item_or_tags)
		}
	}
])

.filter('icCategory', [

	'icTaxonomy',

	function(icTaxonomy){
		return function(item_or_tags){
			return item_or_tags && icTaxonomy.getCategory(item_or_tags.tags || item_or_tags)
		}
	}
])


.filter('icSubCategories', [

	'icTaxonomy',

	function(icTaxonomy){
		return function(item_or_tags){
			return item_or_tags && icTaxonomy.getSubCategories(item_or_tags.tags || item_or_tags)
		}
	}
])




.filter('osmLink', [
	function(){
		return function(config){
			return 	config.longitude && config.latitude
					?	'https://www.openstreetmap.org/?mlat='+config.latitude +'&mlon=' + config.longitude + '#map=17/'+config.latitude+'/'+config.longitude
					:	'https://www.openstreetmap.org/search?query='+config.address + ', ' + config.zip + ', ' + config.city
		}
	}
])




.filter('gmLink', [
	function(){
		return function(config){
			return	config.longitude && config.latitude
					?	'https://www.google.de/maps/place/'+config.latitude+'+' + config.longitude + '/@'+config.latitude + ',' + config.longitude +',17z'
					:	'https://www.google.de/maps/place/'+config.address+', '+config.zip+', '+config.city
		}
	}
])



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




.filter('icDate', [

	'icSite',

	function(icSite){

		var toLocaleDateStringSupportsLocales 	= false,
			dates								= {}

		try {
			new Date().toLocaleString('i')
		} catch (e) {
			toLocaleDateStringSupportsLocales =  e instanceof RangeError
		}

		function icDateFilter(date_str, use_time){

			if(!date_str) return undefined

			dates[date_str] 						= dates[date_str] || {}
			dates[date_str][icSite.currentLanguage]	= dates[date_str][icSite.currentLanguage] || {}


			if(!dates[date_str][icSite.currentLanguage].withoutTime){
				dates[date_str][icSite.currentLanguage].withoutTime = 	toLocaleDateStringSupportsLocales
																		?	new Date(date_str).toLocaleDateString(icSite.currentLanguage)
																		:	date_str
			} 

			if(!dates[date_str][icSite.currentLanguage].withTime && use_time){
				dates[date_str][icSite.currentLanguage].withTime	= 	dates[date_str][icSite.currentLanguage].withoutTime +
																			(
																				toLocaleDateStringSupportsLocales
																				?	new Date(date_str).toLocaleTimeString(icSite.currentLanguage)
																				:	''
																			)
			}

			return 	use_time
					?	dates[date_str][icSite.currentLanguage].withTime
					:	dates[date_str][icSite.currentLanguage].withoutTime

		}

		icDateFilter.$stateful = true

		return icDateFilter

	}
])


.filter('icItemLink',[
	function(){
		return function(item_or_id){
			if(!item_or_id) return ''
			return location.origin+'/item/'+(item_or_id.id || item_or_id) 
		}
	}
])


.filter('trustAsHtml',[
	'$sce',

	function($sce){
		return function(html){
			return $sce.trustAsHtml(html)
		}
	}
])