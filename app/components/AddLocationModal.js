import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import Row from './Row'
import Column from './Column'
import { GoogleMap, Marker, SearchBox } from 'react-google-maps'
import { ActionCreators } from '../actions/loc'
import EventAddTimeForm from './EventAddTimeForm'

class AddLocationModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			bounds: null,
			center: AddLocationModal.mapCenter,
			markers: []
		}
	}

	handleBoundsChanged () {
		this.setState({
			bounds: this.refs.map.getBounds(),
			center: this.refs.map.getCenter()
		});
	}

	handlePlacesChanged () {
		const places = this.refs.searchBox.getPlaces();
		const markers = [];
		const { dispatch } = this.props

		// Add a marker for each place returned from search bar
		places.forEach(function (place) {
			dispatch(ActionCreators.setPlace(place))
			markers.push({
				position: place.geometry.location
			});
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
		const { isOpen, handleClose, handleChange, loc } = this.props

		var modalStyle = {
			content: {
				top: '50%',
				left: '50%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
				width: '560px',
				padding: '30px'
			}
		}

		var inputStyle = {
			"border": "1px solid transparent",
			"borderRadius": "1px",
			"boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
			"boxSizing": "border-box",
			"MozBoxSizing": "border-box",
			"fontSize": "14px",
			"marginTop": "27px",
			"outline": "none",
			"padding": "0 12px",
			"textOverflow": "ellipses",
			"width": "298px",
			"left": "120px",
			"top": "-17px",
			"height": "40px !important"
		}				

		var containerProps = {
			...this.props,
			style: {
				height: "230px",
				width: "420px"
			}
		}

		var times;
		if (loc.hasOwnProperty('times')) {
			times = loc.times.map((t, i) => {
				return (<EventAddTimeForm time={t} timeIndex={i} />)
			})
		}

		return (
			<Modal
				className='modal'
				isOpen={isOpen}
				onRequestClose={handleClose}
				style={modalStyle}>

				<Row>
					<Column s='small-7'>
						<h1 className='modal-title'>Location & Times</h1>
					</Column>
					<Column s='small-5' a='right'>
						<a onClick={handleClose}>Close</a>
					</Column>
				</Row>

				<div className='modal-body'>
					<div className='modal-body-block'>
						<form>
							<label>
								<input className='small' type='text' name='name' placeholder='First Baptist East Campus' onChange={handleChange} value={location.name} />
								Location Name
							</label>
						</form>
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
								placeholder="Customized your placeholder"
								style={inputStyle} />

							{this.state.markers.map((marker, index) => (
								<Marker position={marker.position} key={index} />
							))}

						</GoogleMap>						
					</div>

					<div className='modal-body-block'>
						{times}
					</div>					

					<div>
					</div>
				</div>

				<a className='solid-button green'>Save this Location</a>
			</Modal>
		)
	}
}

AddLocationModal.mapCenter = {
	lat: 47.6205588,
	lng: -122.3212725
}

AddLocationModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	loc: PropTypes.object.isRequired
}

export default AddLocationModal