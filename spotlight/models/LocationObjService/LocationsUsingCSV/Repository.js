define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function LocationsUsingCSVRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	LocationsUsingCSVRepository.prototype = Object.create(BaseRepository.prototype);
	LocationsUsingCSVRepository.prototype.constructor = LocationsUsingCSVRepository;

	//For Operation 'importLocations' with service id 'importLocations4486'
	LocationsUsingCSVRepository.prototype.importLocations = function(params, onCompletion){
		return LocationsUsingCSVRepository.prototype.customVerb('importLocations', params, onCompletion);
	};

	//For Operation 'getImportLocationsStatus' with service id 'getImportLocationsStatus6540'
	LocationsUsingCSVRepository.prototype.getImportLocationsStatus = function(params, onCompletion){
		return LocationsUsingCSVRepository.prototype.customVerb('getImportLocationsStatus', params, onCompletion);
	};

	//For Operation 'downloadLocationsCSV' with service id 'downloadLocationsCSV5844'
	LocationsUsingCSVRepository.prototype.downloadLocationsCSV = function(params, onCompletion){
		return LocationsUsingCSVRepository.prototype.customVerb('downloadLocationsCSV', params, onCompletion);
	};

	return LocationsUsingCSVRepository;
})