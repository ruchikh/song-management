import React, { Component } from 'react';
import { Input, Card, CardText, CardBody, CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import { DeleteOutlined, EditOutlined } from "@material-ui/icons";
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';

const url = "data.json"

class SongList extends Component {
	state = {
		songData: [],
		id: null,
		song_name: '',
		album_name: '',
		lyric_text: '',
		upvote: 0,
		downvote: 0,
		isEditing: false,
	}

	componentDidMount() {
		fetch(url).then(res => res.json()).then(data => this.setState({
			songData: data.sampleData,
		}))
	}

	addData = e => {
		e.preventDefault();
		const { song_name, album_name, lyric_text } = this.state;
		if (!song_name || !album_name || !lyric_text) return;
		let songData = [
			{
				id: Math.random(),
				song_name: song_name,
				album_name: album_name,
				lyric_text: lyric_text,
				upvote: 0,
				downvote: 0,
			},
			...this.state.songData,
		];

		this.setState({
			songData
		});
		this.reset();
	};

	removeData = id => {
		const { songData } = this.state;
		let dataLists = songData.filter(data => {
			return data.id !== id;
		});

		this.setState({
			songData: dataLists,
		});
	};

	reset = () => {
		this.setState({
			song_name: "",
			album_name: "",
			lyric_text: ""
		});
	};

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	// search by song_name
	handleSearchChange = value => {
		const lowercasedValue = value.toLowerCase();

		if(!value) return;

		this.setState(prevState => {
			const songData = prevState.songData.filter(el =>
				el.song_name.toLowerCase().includes(lowercasedValue)
			);

			return { songData };
		});

	};

	handleUpvote = (id, value) => {
		const { songData } = this.state;
		let upvoteLists = songData.filter(data => {
			if(data.id === id) {
				return data.upvote += value;
			} else {
				return songData
			}
		});

		console.log(upvoteLists, 'upvoteLists')

		this.setState({
			songData: upvoteLists,
		});
	}

	handleUnupvote = (id, value) => {
		const { songData } = this.state;
		let unUpvoteLists = songData.filter(data => {
			if(data.id === id) {
				return data.downvote += value;
			} else {
				return songData
			}
		});

		this.setState({
			songData: unUpvoteLists,
		});
	}


	handleUpdate = (e, id) => {
		const index = this.state.songData.findIndex(data => {
			return data.id === id;
		});
		const data = Object.assign({}, this.state.songData[index])

		this.setState({
			id: data.id,
			song_name: data.song_name,
			album_name: data.album_name,
			lyric_text: data.lyric_text,
			upvote: data.upvote,
			downvote: data.downvote,
			isEditing: true
		});
	};

	saveUpdate = (e, id) => {
		const newData = this.state.songData.map(data => {
			if (data.id === id) {
				return {
					song_name: this.state.song_name,
					album_name: this.state.album_name,
					lyric_text: this.state.lyric_text,
					upvote: this.state.upvote,
					downvote: this.state.downvote,
				};
			}
			return data;
		});

		this.setState(
			{
				songData: newData,
				isEditing: false
			},
			() => {
				this.reset();
			}
		);
	};

	render() {
		const {songData, isEditing, id} = this.state;

		return (
			<Row className="song-list">
				<Col className="song-list-col">
					<Input type="text" name="song_name" onChange={this.handleChange} value={this.state.song_name || ''} placeholder="Add song name"/>
					<Input type="text" name="album_name" onChange={this.handleChange} value={this.state.album_name || ''} placeholder="Add song album name"/>
					<textarea type="text" name="lyric_text" onChange={this.handleChange} value={this.state.lyric_text || ''} placeholder="Add song lyrics" />
					{isEditing ? <button className="add-button" onClick={(e) => this.saveUpdate(e, id)}>Save <SaveIcon /></button>
						: <button className="add-button" onClick={(e) => this.addData(e)}>Add <AddIcon /></button>
					}
					<Input type="text" placeholder="Search" className="search-bar" onChange={(e) => this.handleSearchChange(e.target.value)}/>
					{songData && songData.map((item, i) => {
						const {song_name, album_name, id, upvote, downvote, lyric_text } = item;
						return (
							<Card key={i}>
								<CardBody>
									<div className="card-body-main">
									<div>
										<CardTitle tag="h2">{song_name}</CardTitle>
										<CardSubtitle tag="h3" className="mb-2 text-muted">{album_name}</CardSubtitle>
										<CardText>{lyric_text}</CardText>
									</div>
									<div>
										<button onClick={(e) => this.handleUpdate(e, id)}><EditOutlined /></button>
										<button onClick={() => this.removeData(id)}><DeleteOutlined /></button>
									</div>
									</div>
									<button onClick={() => this.handleUpvote(id, 1)}>{upvote} <ArrowUpwardOutlinedIcon /></button>
									<button onClick={() => this.handleUnupvote(id, -1)}>{downvote} <ArrowDownwardOutlinedIcon /></button>

								</CardBody>
							</Card>
						)
					})}
				</Col>
			</Row>
		);
	}
}

export default SongList;