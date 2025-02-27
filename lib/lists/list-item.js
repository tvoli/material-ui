'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react/addons');
var ColorManipulator = require('../utils/color-manipulator');
var StylePropable = require('../mixins/style-propable');
var Colors = require('../styles/colors');
var Transitions = require('../styles/transitions');
var Typography = require('../styles/typography');
var EnhancedButton = require('../enhanced-button');

var ListItem = React.createClass({
  displayName: 'ListItem',

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    disableTouchTap: React.PropTypes.bool,
    insetChildren: React.PropTypes.bool,
    leftAvatar: React.PropTypes.element,
    leftCheckbox: React.PropTypes.element,
    leftIcon: React.PropTypes.element,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    rightAvatar: React.PropTypes.element,
    rightIcon: React.PropTypes.element,
    rightIconButton: React.PropTypes.element,
    rightToggle: React.PropTypes.element,
    secondaryText: React.PropTypes.node,
    secondaryTextLines: React.PropTypes.oneOf([1, 2])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      secondaryTextLines: 1
    };
  },

  getInitialState: function getInitialState() {
    return {
      hovered: false,
      rightIconButtonHovered: false
    };
  },

  render: function render() {
    var _props = this.props;
    var disableTouchTap = _props.disableTouchTap;
    var insetChildren = _props.insetChildren;
    var leftAvatar = _props.leftAvatar;
    var leftCheckbox = _props.leftCheckbox;
    var leftIcon = _props.leftIcon;
    var onMouseOut = _props.onMouseOut;
    var onMouseOver = _props.onMouseOver;
    var rightAvatar = _props.rightAvatar;
    var rightIcon = _props.rightIcon;
    var rightIconButton = _props.rightIconButton;
    var rightToggle = _props.rightToggle;
    var secondaryText = _props.secondaryText;
    var secondaryTextLines = _props.secondaryTextLines;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['disableTouchTap', 'insetChildren', 'leftAvatar', 'leftCheckbox', 'leftIcon', 'onMouseOut', 'onMouseOver', 'rightAvatar', 'rightIcon', 'rightIconButton', 'rightToggle', 'secondaryText', 'secondaryTextLines', 'style']);

    var textColor = this.context.muiTheme.palette.textColor;
    var hoverColor = ColorManipulator.fade(textColor, 0.03);
    var singleAvatar = !secondaryText && (leftAvatar || rightAvatar);
    var singleNoAvatar = !secondaryText && !(leftAvatar || rightAvatar);
    var twoLine = secondaryText && secondaryTextLines === 1;
    var threeLine = secondaryText && secondaryTextLines > 1;
    var hasCheckbox = leftCheckbox || rightToggle;

    var styles = {
      root: {
        backgroundColor: this.state.hovered && !this.state.rightIconButtonHovered ? hoverColor : null,
        color: textColor,
        display: 'block',
        fontSize: 16,
        lineHeight: '16px',
        overflow: 'hidden',
        position: 'relative',
        transition: Transitions.easeOut()
      },

      //This inner div is need so that ripples will span the entire container
      innerDiv: {
        paddingLeft: leftIcon || leftAvatar || leftCheckbox || insetChildren ? 72 : 16,
        paddingRight: rightIcon || rightAvatar || rightIconButton ? 56 : rightToggle ? 72 : 16,
        paddingBottom: singleAvatar ? 20 : 16,
        paddingTop: singleNoAvatar || threeLine ? 16 : 20
      },

      label: {
        cursor: 'pointer'
      },

      icons: {
        height: 24,
        width: 24,
        display: 'block',
        position: 'absolute',
        top: twoLine ? 12 : singleAvatar ? 4 : 0,
        padding: 12
      },

      leftIcon: {
        color: Colors.grey600,
        fill: Colors.grey600,
        left: 4
      },

      rightIcon: {
        color: Colors.grey400,
        fill: Colors.grey400,
        right: 4
      },

      avatars: {
        position: 'absolute',
        top: singleAvatar ? 8 : 16
      },

      leftAvatar: {
        left: 16
      },

      rightAvatar: {
        right: 16
      },

      leftCheckbox: {
        position: 'absolute',
        display: 'block',
        width: 24,
        top: twoLine ? 24 : singleAvatar ? 16 : 12,
        left: 16
      },

      rightIconButton: {
        position: 'absolute',
        display: 'block',
        top: twoLine ? 12 : singleAvatar ? 4 : 0,
        right: 4
      },

      rightToggle: {
        position: 'absolute',
        display: 'block',
        width: 54,
        top: twoLine ? 25 : singleAvatar ? 17 : 13,
        right: 8
      },

      secondaryText: {
        fontSize: 14,
        lineHeight: threeLine ? '18px' : '16px',
        height: threeLine ? 36 : 16,
        margin: 0,
        marginTop: 4,
        color: Typography.textLightBlack,

        //needed for 2 and 3 line ellipsis
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: threeLine ? null : 'nowrap',
        display: threeLine ? '-webkit-box' : null,
        WebkitLineClamp: threeLine ? 2 : null,
        WebkitBoxOrient: threeLine ? 'vertical' : null
      }
    };

    var secondaryTextIsAnElement = React.isValidElement(secondaryText);

    var mergedRootStyles = this.mergeAndPrefix(styles.root, style);
    var mergedDivStyles = this.mergeAndPrefix(styles.root, styles.innerDiv, style);
    var mergedLabelStyles = this.mergeAndPrefix(styles.root, styles.innerDiv, styles.label, style);
    var mergedSecondaryTextStyles = secondaryTextIsAnElement ? this.mergeStyles(styles.secondaryText, secondaryText.props.style) : null;

    var contentChildren = [];

    this._pushElement(contentChildren, leftIcon, this.mergeStyles(styles.icons, styles.leftIcon));
    this._pushElement(contentChildren, rightIcon, this.mergeStyles(styles.icons, styles.rightIcon));
    this._pushElement(contentChildren, leftAvatar, this.mergeStyles(styles.avatars, styles.leftAvatar));
    this._pushElement(contentChildren, rightAvatar, this.mergeStyles(styles.avatars, styles.rightAvatar));
    this._pushElement(contentChildren, leftCheckbox, this.mergeStyles(styles.leftCheckbox));
    this._pushElement(contentChildren, rightIconButton, this.mergeStyles(styles.rightIconButton), {
      onMouseOver: this._handleRightIconButtonMouseOver,
      onMouseOut: this._handleRightIconButtonMouseOut,
      onTouchTap: this._handleRightIconButtonTouchTap,
      onMouseDown: this._handleRightIconButtonMouseUp,
      onMouseUp: this._handleRightIconButtonMouseUp
    });
    this._pushElement(contentChildren, rightToggle, this.mergeStyles(styles.rightToggle));

    if (this.props.children) contentChildren.push(this.props.children);
    if (secondaryText) contentChildren.push(React.isValidElement(secondaryText) ? React.cloneElement(secondaryText, { key: 'secondaryText', style: mergedSecondaryTextStyles }) : React.createElement(
      'div',
      { key: 'secondaryText', style: styles.secondaryText },
      secondaryText
    ));

    return hasCheckbox || disableTouchTap ? React.createElement(hasCheckbox ? 'label' : 'div', { style: hasCheckbox ? mergedLabelStyles : mergedDivStyles }, contentChildren) : React.createElement(
      EnhancedButton,
      _extends({}, other, {
        linkButton: true,
        onMouseOut: this._handleMouseOut,
        onMouseOver: this._handleMouseOver,
        style: mergedRootStyles }),
      React.createElement(
        'div',
        { style: styles.innerDiv },
        contentChildren
      )
    );
  },

  _pushElement: function _pushElement(children, element, baseStyles, additionalProps) {
    if (element) {
      var styles = this.mergeStyles(baseStyles, element.props.style);
      children.push(React.cloneElement(element, _extends({
        key: children.length,
        style: styles
      }, additionalProps)));
    }
  },

  _handleRightIconButtonMouseDown: function _handleRightIconButtonMouseDown(e) {
    var iconButton = this.props.rightIconButton;
    e.stopPropagation();
    if (iconButton.onMouseDown) iconButton.onDown(e);
  },

  _handleRightIconButtonMouseOut: function _handleRightIconButtonMouseOut(e) {
    var iconButton = this.props.rightIconButton;
    this.setState({ rightIconButtonHovered: false });
    if (iconButton.onMouseOut) iconButton.onMouseOut(e);
  },

  _handleRightIconButtonMouseOver: function _handleRightIconButtonMouseOver(e) {
    var iconButton = this.props.rightIconButton;
    this.setState({ rightIconButtonHovered: true });
    if (iconButton.onMouseOver) iconButton.onMouseOver(e);
  },

  _handleRightIconButtonMouseUp: function _handleRightIconButtonMouseUp(e) {
    var iconButton = this.props.rightIconButton;
    e.stopPropagation();
    if (iconButton.onMouseUp) iconButton.onUp(e);
  },

  _handleRightIconButtonTouchTap: function _handleRightIconButtonTouchTap(e) {
    var iconButton = this.props.rightIconButton;

    //Stop the event from bubbling up to the list-item
    e.stopPropagation();
    if (iconButton.onTouchTap) iconButton.onTouchTap(e);
  },

  _handleMouseOver: function _handleMouseOver(e) {
    this.setState({ hovered: true });
    if (this.props.onMouseOver) {
      this.props.onMouseOver(e);
    }
  },

  _handleMouseOut: function _handleMouseOut(e) {
    this.setState({ hovered: false });
    if (this.props.onMouseOut) {
      this.props.onMouseOut(e);
    }
  }

});

module.exports = ListItem;