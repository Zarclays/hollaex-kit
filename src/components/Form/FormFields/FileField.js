import React, { Component } from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';
import { ActionNotification } from '../../';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

class FileField extends Component {
	state = {
		filename: '',
		fileArray: []
	};
	onClick = (ev) => {
		if (this.fileInput) {
			this.fileInput.click();
		}
	};

	onChange = (ev) => {
		if (this.props.multiple) {
			if (
				this.props.length >= ev.target.files.length &&
				this.state.fileArray.length + ev.target.files.length <=
					this.props.length
			) {
				let newFiles = [];
				Object.entries(ev.target.files).map(([key, value], index) =>
					newFiles.push(ev.target.files[key])
				);
				var joined = this.state.fileArray.concat(newFiles);
				this.setState({ fileArray: joined }, () => {
					this.props.input.onChange(this.state.fileArray);
				});
			}
		} else {
			const file = ev.target.files[0];
			this.setState({ filename: file.name });
			this.props.input.onChange(file);
		}
	};

	setRef = (el) => {
		this.fileInput = el;
	};

	render() {
		const { placeholder, multiple, length } = this.props;
		const { filename, fileArray } = this.state;
		const input = {
			onChange: this.onChange,
			ref: this.setRef,
			multiple: multiple ? multiple : false,
			accept: 'image/*',
			style: { display: 'none' }
		};

		return (
			<FieldWrapper {...this.props} onClick={this.onClick}>
				<div
					onClick={fileArray.length !== length ? this.onClick : ''}
					className={
						multiple && fileArray.length > 0
							? 'pointer multiple_file_wrapper'
							: 'pointer file_wrapper'
					}
				>
					{multiple && fileArray.length > 0 ? (
						fileArray.map((file, index) => (
							<div
								key={index}
								className={classnames('text_overflow', {
									placeholder: !file.name
								})}
							>
								{file.name}
							</div>
						))
					) : (
						<div
							className={classnames('text_overflow', {
								placeholder: !filename
							})}
						>
							{filename ? filename : placeholder}
						</div>
					)}
					{multiple
						? fileArray.length !== length &&
						  multiple && (
								<ActionNotification
									text={STRINGS.ADD_FILES}
									status="information"
									iconPath={ICONS.BLUE_CLIP}
									className="no_bottom pr-0 pl-0"
									useSvg={true}
								/>
						  )
						: !filename && (
								<ActionNotification
									text={STRINGS.ADD_FILES}
									status="information"
									iconPath={ICONS.BLUE_CLIP}
									className="no_bottom pr-0 pl-0"
									useSvg={true}
								/>
						  )}
					<input type="file" className="input_file" {...input} />
				</div>
			</FieldWrapper>
		);
	}
}

export default FileField;
