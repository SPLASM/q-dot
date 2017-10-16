import React from 'react';
import $ from 'jquery';

class MenuListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardTriggered: false
    };
  }

  handleRewardClick() {
    this.setState({
      rewardTriggered: !this.state.rewardTriggered
    });
  }

  render() {
    return (
      <li>
        <h4 className="col-xs-10">{this.props.menuItem.dish}</h4>
        <div className="col-sm-2 text-center price">
          ${this.props.menuItem.price}
        </div>
        <div className="col-xs-11">
          {this.props.menuItem.description}
        </div>
        { this.state.rewardTriggered ?
          <div className="d-inline">
            <button onClick={() => (this.props.removeOrder(this.props.menuItem, this.props.index))} className="getMenuBtn pull-right">Remove from Order</button>
            <span className="claimedRewardSpan pull-right">Enjoy your free potato</span>
            <i className="material-icons claimedRewardBtn pull-right">check_circle</i>
          </div>
          : this.props.order &&
          <div>
            { this.props.reward ?
              <div className="d-inline">
                <button onClick={() => (this.props.removeOrder(this.props.menuItem, this.props.index))} className="getMenuBtn pull-right">Remove from Order</button>
                <button onClick={() => this.handleRewardClick()} className={this.state.rewardTriggered ? '  btn-large disabled pull-right' : 'getMenuBtn getRewardBtn pull-right'}>Claim Reward</button>
              </div>
              : this.props.remove ?
                <button onClick={() => (this.props.removeOrder(this.props.menuItem, this.props.index))} className="getMenuBtn col-sm-6 col-sm-offset-6 col-xs-8 col-xs-offset-4">Remove from Order</button>
                :
                <button onClick={() => (this.props.addOrder(this.props.menuItem))} className="getMenuBtn col-sm-6 col-sm-offset-6 col-xs-8 col-xs-offset-4">Add to Order</button>
            }
          </div>
        }
      </li>
    );
  }
}

export default MenuListItem;
