import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { GoogleMap, Marker, SearchBox } from 'react-google-maps'
import LocationAddTime from './LocationAddTime'
import ErrorMessage from '../../../../../../app/components/ErrorMessage'
import { FormattedMessage } from 'react-intl'

class LocationEdit extends Component {

	constructor(props) {
		super(props)
		this.state = {
			bounds: null,
			center: LocationEdit.mapCenter,
			markers: []
		}

		// const { loc } = props
	}

	handleBoundsChanged () {
		const { loc } = this.props
		if (typeof loc.place === 'object' && typeof loc.place.geometry === 'object') {
			this.mapPlaces([loc.place], false)

			if (typeof loc.formatted_address === 'string') {
				this.refs.searchBox.state.inputElement.value = loc.formatted_address
			}
		}

		this.setState({
			bounds: this.refs.map.getBounds(),
			center: this.refs.map.getCenter()
		});
	}


	handlePlacesChanged () {
		const places = this.refs.searchBox.getPlaces();
		this.mapPlaces(places)
		return;
	}

	mapPlaces(places, triggerChoose = true) {
		const markers = [];
		const { dispatch, handleChoosePlace } = this.props

		// Add a marker for each place returned from search bar
		places.forEach(function (place) {
			markers.push({
				position: place.geometry.location
			});

			if (triggerChoose) {
				handleChoosePlace(place)
			}
		});

		// Set markers; set map center to first search result
		const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

		this.setState({
			center: mapCenter,
			markers: markers
		});

		return;
	}

	render() {
		const { handleCancel, handleChange, handleSave, handleSetTime, handleAddTime, handleRemoveTime, loc, intl } = this.props

		var inputStyle = {
			"border": "1px solid transparent",
			"borderRadius": "1px",
			"boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
			"boxSizing": "border-box",
			"MozBoxSizing": "border-box",
			"fontSize": "14px",
			"marginTop": "12px",
			"outline": "none",
			"padding": "19px 12px !important",
			"textOverflow": "ellipses",
			"width": "524px",
			"left": "120px",
			"top": "0px",
			"height": "40px !important",
			"background-color": "white"
		}

		var containerProps = {
			...this.props,
			style: {
				height: "230px",
				width: "100%"
			}
		}

		var times;
		if (loc.hasOwnProperty('times')) {
			times = loc.times.map((t, i) => {
				return (<LocationAddTime tz={loc.timezone} intl={intl} key={i} time={t} timeIndex={i} handleTimeChange={handleSetTime} handleRemoveTime={handleRemoveTime} />)
			})
		}

		var gMap = null;
		if (loc.type === 'physical') {
			gMap = (
				<GoogleMap
					center={this.state.center}
					containerProps={containerProps}
					defaultZoom={15}
					onBoundsChanged={::this.handleBoundsChanged}
					ref="map">

					<SearchBox
						bounds={this.state.bounds}
						controlPosition={google.maps.ControlPosition.TOP_LEFT}
						onPlacesChanged={::this.handlePlacesChanged}
						ref="searchBox"
						placeholder={intl.formatMessage({id:"features.EventEdit.features.location.components.LocationEdit.prompt"})}
						style={inputStyle} />

					{this.state.markers.map((marker, index) => (
						<Marker position={marker.position} key={index} />
					))}

				</GoogleMap>
			)
		}

		var locationDetails = null;
		if (loc.type === 'physical') {
			locationDetails = (
				<div className='form-body-block text-left'>
					<form>
						<Row>
							<Column s='small-6'>
								<input className='small' type='text' name='country' placeholder={intl.formatMessage({id:"features.EventEdit.features.location.components.LocationEdit.country"})} onChange={handleChange} value={loc.country} />
							</Column>
							<Column s='small-6'>
								<input className='small' type='text' name='timezone' placeholder={intl.formatMessage({id:"features.EventEdit.features.location.components.LocationEdit.timezone"})} onChange={handleChange} value={loc.timezone} />
							</Column>
						</Row>
					</form>
				</div>
			)
		} else {
			locationDetails = (
				<div className='form-body-block text-left'>
					<form>
						<Row>
							<Column s='small-6 end'>
								<input className='small' type='text' name='timezone' placeholder={intl.formatMessage({id:"features.EventEdit.features.location.components.LocationEdit.timezone"})} onChange={handleChange} value={loc.timezone} />
							</Column>
						</Row>
					</form>
				</div>
			)
		}

		return (
			<div className='modal'>
				<div className='form-body'>
					<div className='form-body-block white'>
						<form className="locationForm">
							<label>
								<input className='small' type='text' name='name' placeholder={intl.formatMessage({id:"features.EventEdit.features.location.components.LocationEdit.namePrompt"})} onChange={handleChange} value={loc.name} />
								<span className="left"><FormattedMessage id="features.EventEdit.features.location.components.LocationEdit.name" /></span><span className="labelRight"><FormattedMessage id="features.EventEdit.features.location.components.LocationEdit.nameOptional" /></span>
							</label>
						</form>
						{gMap}
					</div>

					<div className='form-body-block white text-left'>
						{times}
						<a onClick={handleAddTime}><FormattedMessage id="features.EventEdit.features.location.components.LocationEdit.addAnother" /></a>
					</div>

					{locationDetails}

					<div className='form-actions text-right'>
						<ErrorMessage hasError={loc.hasError === true} errors={loc.errors} />
						<a onClick={handleCancel}><FormattedMessage id="features.EventEdit.features.location.components.LocationEdit.cancel" /></a>
						<a className='solid-button green' onClick={handleSave}><FormattedMessage id="features.EventEdit.features.location.components.LocationEdit.save" /></a>
					</div>
				</div>

			</div>
		)
	}
}

LocationEdit.mapCenter = {
	lat: 47.6205588,
	lng: -122.3212725
}

LocationEdit.propTypes = {
	handleCancel: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	loc: PropTypes.object.isRequired
}

export default LocationEdit
