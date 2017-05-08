angular.module('plImages',[])

.provider('plImages',function(){

	var urls = []

	this.setUrls = function(a){
		urls = a
	}

	this.$get = [

		'$q',

		function($q){

			var self		= this, 
				deferred 	= $q.defer(),
				promises 	= [],
				list		= {}

			urls.forEach(function(url){
				var img 		= new Image(),
					deferred	= $q.defer()


				list[url] = true

				promises.push(deferred.promise)	

				img.addEventListener('load', function(){
					list[url] = false
					deferred.resolve(url)
					img = null
				})

				img.addEventListener('error', function(){
					console.warn('plImages: unable to load '+url)
					deferred.resolve(url)
					img = null
				})

				img.src = url

			})

			self.ready = $q.all(promises)

			return self

		}
	]

})