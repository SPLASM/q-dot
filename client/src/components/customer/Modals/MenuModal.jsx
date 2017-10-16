import React from 'react';
import MenuListItem from '../MenuListItem.jsx'

const MenuModal = (props) => {
  let id = props.order ? 'customer-menu-order' : 'customer-menu';
  return (<div style={{background: 'none', boxShadow: 'none'}} id={id} className="modal fade" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h2 className="modal-title">Menu</h2>
        </div>
        <div className="modal-body text-left">
          { props.order && props.modalOrdered.length > 0 &&
          <div>
            <h3 className="col-xs-12 text-center">Ordered</h3>
            <ul className="menu col-xs-12" style={{borderBottom: '1px solid lightgray'}}>
              {props.modalOrdered.map((menuItem, index) => {
                return <MenuListItem remove removeOrder={props.removeOrder} index={index} order={props.order} menuItem={menuItem} key={index} reward={props.reward}/>
              })}
            </ul>
            <h3 className="col-xs-12 text-center">Menu</h3>
          </div>
        }
          <ul style={{width: '100%'}} className="menu">
            {props.modalRestaurant.map((menuItem, index) => {
              return <MenuListItem addOrder={props.addOrder} order={props.order} menuItem={menuItem} key={index}/>
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>);
}

export default MenuModal;
