import React from 'react';
import Glyph from './glyph.components.jsx';
import SearchGlyphList from './search-glyph-list.components.jsx';
import GlyphTagList from './glyph-tag-list.components.jsx';
import ReactGeminiScrollbar from 'react-gemini-scrollbar';
import Log from '../services/log.services.js';
import LocalClient from '../stores/local-client.stores.jsx';

export default class GlyphList extends React.Component {

	componentWillMount() {
		this.client = LocalClient.instance();
	}

	shouldComponentUpdate(newProps) {
		if (this.props.selected === newProps.selected &&
			this.props.selectedTag === newProps.selectedTag &&
			_.isEqual(this.props.pinned, newProps.pinned).length &&
			this.props.glyphs === newProps.glyphs) {
			return false;
		}
		else {
			return true;
		}
	}

	exportOTF() {
		this.client.dispatchAction('/export-otf', {merged:true});

		Log.ui('GlyphList.exportOTF');
	}

	render() {
		if (process.env.__SHOW_RENDER__) {
			console.log('[RENDER] GlyphList');
		}
		const selectedGlyph = this.props.selected;
		const glyphs = _.pick(this.props.glyphs, (glyph) => {
			if (glyph[0].src) {
				return glyph[0].src.tags.indexOf(this.props.selectedTag) !== -1;
			}
			else return false;
		});
		return (
			<div className="glyph-list clearfix">
				<GlyphTagList selected={this.props.selectedTag} pinned={this.props.pinned} tags={this.props.tags}/>
				<ReactGeminiScrollbar>
					<div className="glyph-list-glyphs">
						{
							_.map(glyphs, (glyph, unicode) => {
								if (selectedGlyph === unicode)
									return (<Glyph glyph={glyph} selected={true} unicode={unicode} key={unicode} />);
								else
									return (<Glyph glyph={glyph} selected={false} unicode={unicode} key={unicode} />);

							})
						}
					</div>
				</ReactGeminiScrollbar>
				<SearchGlyphList/>
				<div title="Export and download your font" className="export-btn" onClick={() => { this.exportOTF() }}>Export OTF</div>
			</div>
		);
	}
}
