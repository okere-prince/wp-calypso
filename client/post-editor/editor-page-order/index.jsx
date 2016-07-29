/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import TextInput from 'components/forms/form-text-input';
import { recordEvent, recordStat } from 'lib/posts/stats';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getEditorPostId } from 'state/ui/editor/selectors';
import { getEditedPostValue } from 'state/posts/selectors';
import { editPost } from 'state/posts/actions';

class EditorPageOrder extends Component {
	static propTypes = {
		siteId: PropTypes.number,
		postId: PropTypes.number,
		menuOrder: PropTypes.number
	};

	static defaultProps = {
		menuOrder: 0
	};

	constructor() {
		super( ...arguments );

		this.editMenuOrder = this.editMenuOrder.bind( this );
	}

	editMenuOrder( event ) {
		const newOrder = parseInt( event.target.value ) || 0;
		const { menuOrder, siteId, postId } = this.props;
		if ( newOrder === menuOrder ) {
			return;
		}

		recordStat( 'advanced_menu_order_changed' );
		recordEvent( 'Changed page menu order' );
		this.props.editPost( { menu_order: newOrder }, siteId, postId );
	}

	render() {
		const { translate, menuOrder } = this.props;

		return (
			<div className="editor-page-order">
				<label>
					<span className="editor-page-order__label-text">
						{ translate( 'Order', { context: 'Editor: Field label for page menu order.' } ) }
					</span>
					<TextInput
						type="number"
						value={ menuOrder }
						pattern="[0-9]*"
						onChange={ this.editMenuOrder }
						onBlur={ this.editMenuOrder }
						className="editor-page-order__input" />
				</label>
			</div>
		);
	}
}

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const postId = getEditorPostId( state );
		const menuOrder = getEditedPostValue( state, siteId, postId, 'menu_order' );

		return { siteId, postId, menuOrder };
	},
	{ editPost }
)( localize( EditorPageOrder ) );
