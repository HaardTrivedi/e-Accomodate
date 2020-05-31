import React, { Component } from 'react';
import './ReactTab.css';

export class ReactTab extends Component {
        constructor() {
                super();
                this.state = { currentIndex: 0 };
        }

        check_title_index(index) {
                return index === this.state.currentIndex
                        ? 'tab_title active'
                        : 'tab_title';
        }

        check_item_index(index) {
                return index === this.state.currentIndex
                        ? 'tab_item show'
                        : 'tab_item';
        }

        changeIndex = (index, element) => {
                this.props.setTab(element.props.name);
                this.setState({ currentIndex: index });
        };

        render() {
                return (
                        <div>
                                <div className='tab_title_wrap'>
                                        {React.Children.map(
                                                this.props.children,
                                                (element, index) => {
                                                        return (
                                                                <div
                                                                        onClick={() => this.changeIndex(index, element)}
                                                                        className={this.check_title_index(index)}
                                                                        style={element.props.style}>
                                                                        {element.props.name}
                                                                </div>
                                                        );
                                                }
                                        )}
                                </div>
                                <div className='tab_item_wrap'>
                                        {React.Children.map(
                                                this.props.children,
                                                (element, index) => {
                                                        return (
                                                                <div className={this.check_item_index(index)}>
                                                                        {element}
                                                                </div>
                                                        );
                                                }
                                        )}
                                </div>
                        </div>
                );
        }
}

export default ReactTab;
