import React, { Component } from 'react'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import filter from 'lodash.filter'

export default class LocationSearch extends Component {
    constructor(props) {
      super(props);
      this.state = { address: '' };
    }

    componentDidMount(){
        const {location} = this.props
        if(location){
            this.setState({ address: location })
        }
    }
  
    handleChange = address => {
      this.setState({ address });
    };
  
    
    handleSelect = address => {
      //Determine State and Country via JSON response using lodash filter.
      //Admin_Area_Level_1 is state, short_name example: 'MT'
        geocodeByAddress(address).then(result => {
          var addProps = result[0].address_components
          var state = filter(addProps, {types: ["administrative_area_level_1"] })[0].short_name
          var country = filter(addProps, {types: ["country"] })[0].short_name

          this.setState({ address })
          
          let locationInfo = {address, state, country}
          this.props.updateLocation(locationInfo)
        })
    };
  
    render() {
      return (
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item'; 
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      );
    }
  }
