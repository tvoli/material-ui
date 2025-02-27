'use strict';

var React = require('react');
var StylePropable = require('./mixins/style-propable');
var Draggable = require('react-draggable2');
var Transitions = require('./styles/transitions.js');
var FocusRipple = require('./ripples/focus-ripple');

var Slider = React.createClass({
  displayName: 'Slider',

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    required: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    error: React.PropTypes.string,
    description: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onDragStart: React.PropTypes.func,
    onDragStop: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      required: true,
      disabled: false,
      defaultValue: 0,
      step: 0.01,
      min: 0,
      max: 1,
      dragging: false
    };
  },

  getInitialState: function getInitialState() {
    var value = this.props.value;
    if (value == null) value = this.props.defaultValue;
    var percent = (value - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    return {
      value: value,
      percent: percent,
      focused: false,
      active: false,
      hovered: false
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.value != null) {
      this.setValue(nextProps.value);
    }
  },

  getTheme: function getTheme() {
    return this.context.muiTheme.component.slider;
  },

  getStyles: function getStyles() {
    var size = this.getTheme().handleSize + this.getTheme().trackSize;
    var gutter = (this.getTheme().handleSizeDisabled + this.getTheme().trackSize) / 2;
    var fillGutter = this.getTheme().handleSizeDisabled - this.getTheme().trackSize;
    var styles = {
      root: {
        touchCallout: 'none',
        userSelect: 'none',
        cursor: 'default',
        height: this.getTheme().handleSizeActive,
        position: 'relative',
        marginTop: 24,
        marginBottom: 48
      },
      track: {
        position: 'absolute',
        top: (this.getTheme().handleSizeActive - this.getTheme().trackSize) / 2,
        left: 0,
        width: '100%',
        height: this.getTheme().trackSize
      },
      filledAndRemaining: {
        position: 'absolute',
        top: 0,
        height: '100%',
        transition: Transitions.easeOut(null, 'margin')
      },
      percentZeroRemaining: {
        left: 1,
        marginLeft: gutter
      },
      handle: {
        boxSizing: 'border-box',
        position: 'absolute',
        cursor: 'pointer',
        pointerEvents: 'inherit',
        top: (this.getTheme().handleSizeActive - this.getTheme().trackSize) / 2 + 'px',
        left: '0%',
        zIndex: 1,
        margin: this.getTheme().trackSize / 2 + 'px 0 0 0',
        width: this.getTheme().handleSize,
        height: this.getTheme().handleSize,
        backgroundColor: this.getTheme().selectionColor,
        backgroundClip: 'padding-box',
        border: '0px solid transparent',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        transition: Transitions.easeOut('450ms', 'border') + ',' + Transitions.easeOut('450ms', 'width') + ',' + Transitions.easeOut('450ms', 'height'),
        overflow: 'visible'
      },
      handleWhenDisabled: {
        boxSizing: 'content-box',
        cursor: 'not-allowed',
        backgroundColor: this.getTheme().trackColor,
        width: this.getTheme().handleSizeDisabled,
        height: this.getTheme().handleSizeDisabled,
        border: '2px solid white'
      },
      handleWhenPercentZero: {
        border: this.getTheme().trackSize + 'px solid ' + this.getTheme().trackColor,
        backgroundColor: this.getTheme().handleFillColor,
        boxShadow: 'none'
      },
      handleWhenActive: {
        borderColor: this.getTheme().trackColorSelected,
        width: this.getTheme().handleSizeActive,
        height: this.getTheme().handleSizeActive,
        transition: Transitions.easeOut('450ms', 'backgroundColor') + ',' + Transitions.easeOut('450ms', 'width') + ',' + Transitions.easeOut('450ms', 'height')
      },
      ripples: {
        height: '300%',
        width: '300%',
        top: '-12px',
        left: '-12px'
      },
      handleWhenDisabledAndZero: {
        width: size / 2 + 'px',
        height: size / 2 + 'px'
      },
      handleWhenPercentZeroAndHovered: {
        border: this.getTheme().trackSize + 'px solid ' + this.getTheme().handleColorZero,
        width: size + 'px',
        height: size + 'px'
      }
    };
    styles.filled = this.mergeAndPrefix(styles.filledAndRemaining, {
      left: 0,
      backgroundColor: this.props.disabled ? this.getTheme().trackColor : this.getTheme().selectionColor,
      marginRight: fillGutter,
      width: this.state.percent * 100 + (this.props.disabled ? -1 : 0) + '%'
    });
    styles.remaining = this.mergeAndPrefix(styles.filledAndRemaining, {
      right: 0,
      backgroundColor: this.getTheme().trackColor,
      marginLeft: fillGutter,
      width: (1 - this.state.percent) * 100 + (this.props.disabled ? -1 : 0) + '%'
    });

    styles.percentZeroRemaining.width = styles.remaining.width - styles.percentZeroRemaining.left;

    return styles;
  },

  render: function render() {
    var percent = this.state.percent;
    if (percent > 1) percent = 1;else if (percent < 0) percent = 0;
    var gutter = (this.getTheme().handleSizeDisabled + this.getTheme().trackSize) / 2;
    var fillGutter = this.getTheme().handleSizeDisabled - this.getTheme().trackSize;

    var styles = this.getStyles();
    var sliderStyles = this.mergeAndPrefix(styles.root, this.props.style);
    var trackStyles = styles.track;
    var filledStyles = styles.filled;
    var remainingStyles = this.mergeAndPrefix(styles.remaining, percent === 0 && styles.percentZeroRemaining);
    var handleStyles = percent === 0 ? this.mergeAndPrefix(styles.handle, styles.handleWhenPercentZero, this.state.active && styles.handleWhenActive, this.state.focused && { outline: 'none' }, this.state.hovered && styles.handleWhenPercentZeroAndHovered, this.props.disabled && styles.handleWhenDisabledAndZero) : this.mergeAndPrefix(styles.handle, this.state.active && styles.handleWhenActive, this.state.focused && { outline: 'none' }, this.props.disabled && styles.handleWhenDisabled);

    var rippleStyle = { height: '12px', width: '12px' };

    if ((this.state.hovered || this.state.focused) && !this.props.disabled) {
      remainingStyles.backgroundColor = this.getTheme().trackColorSelected;
    }

    if (percent === 0) filledStyles.marginRight = gutter;
    if (this.state.percent === 0 && this.state.active) remainingStyles.marginLeft = fillGutter;

    var rippleShowCondition = (this.state.hovered || this.state.focused) && !this.state.active && this.state.percent !== 0;
    var rippleColor = this.state.percent === 0 ? this.getTheme().handleColorZero : this.getTheme().rippleColor;
    var focusRipple;
    if (!this.props.disabled && !this.props.disableFocusRipple) {
      focusRipple = React.createElement(FocusRipple, {
        ref: 'focusRipple',
        key: 'focusRipple',
        style: rippleStyle,
        innerStyle: styles.ripples,
        show: rippleShowCondition,
        color: rippleColor });
    }

    return React.createElement(
      'div',
      { style: this.props.style },
      React.createElement('span', { className: 'mui-input-highlight' }),
      React.createElement('span', { className: 'mui-input-bar' }),
      React.createElement(
        'span',
        { className: 'mui-input-description' },
        this.props.description
      ),
      React.createElement(
        'span',
        { className: 'mui-input-error' },
        this.props.error
      ),
      React.createElement(
        'div',
        { style: sliderStyles,
          onFocus: this._onFocus,
          onBlur: this._onBlur,
          onMouseOver: this._onMouseOver,
          onMouseOut: this._onMouseOut,
          onMouseUp: this._onMouseUp },
        React.createElement(
          'div',
          { ref: 'track', style: trackStyles },
          React.createElement('div', { style: filledStyles }),
          React.createElement('div', { style: remainingStyles }),
          React.createElement(
            Draggable,
            { axis: 'x', bound: 'point',
              cancel: this.props.disabled ? '*' : null,
              start: { x: percent * 100 + '%' },
              constrain: this._constrain(),
              onStart: this._onDragStart,
              onStop: this._onDragStop,
              onDrag: this._onDragUpdate,
              onMouseDown: this._onMouseDown },
            React.createElement(
              'div',
              { style: handleStyles, tabIndex: 0 },
              focusRipple
            )
          )
        )
      ),
      React.createElement('input', { ref: 'input', type: 'hidden',
        name: this.props.name,
        value: this.state.value,
        required: this.props.required,
        min: this.props.min,
        max: this.props.max,
        step: this.props.step })
    );
  },

  getValue: function getValue() {
    return this.state.value;
  },

  setValue: function setValue(i) {
    // calculate percentage
    var percent = (i - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    // update state
    this.setState({
      value: i,
      percent: percent
    });
  },

  getPercent: function getPercent() {
    return this.state.percent;
  },

  setPercent: function setPercent(percent) {
    var value = this._alignValue(this._percentToValue(percent));
    this.setState({ value: value, percent: percent });
  },

  clearValue: function clearValue() {
    this.setValue(0);
  },

  _alignValue: function _alignValue(val) {
    var _props = this.props;
    var step = _props.step;
    var min = _props.min;

    var valModStep = (val - min) % step;
    var alignValue = val - valModStep;

    if (Math.abs(valModStep) * 2 >= step) {
      alignValue += valModStep > 0 ? step : -step;
    }

    return parseFloat(alignValue.toFixed(5));
  },

  _constrain: function _constrain() {
    var _this = this;

    var _props2 = this.props;
    var min = _props2.min;
    var max = _props2.max;
    var step = _props2.step;

    return function (pos) {
      var pixelMax = React.findDOMNode(_this.refs.track).clientWidth;
      var pixelStep = pixelMax / ((max - min) / step);

      var cursor = min;
      var i;
      for (i = 0; i < (max - min) / step; i++) {
        var distance = pos.left - cursor;
        var nextDistance = cursor + pixelStep - pos.left;
        if (Math.abs(distance) > Math.abs(nextDistance)) {
          cursor += pixelStep;
        } else {
          break;
        }
      }
      return {
        left: cursor
      };
    };
  },

  _onFocus: function _onFocus(e) {
    this.setState({ focused: true });
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _onBlur: function _onBlur(e) {
    this.setState({ focused: false, active: false });
    if (this.props.onBlur) this.props.onBlur(e);
  },

  _onMouseOver: function _onMouseOver() {
    this.setState({ hovered: true });
  },

  _onMouseOut: function _onMouseOut() {
    this.setState({ hovered: false });
  },

  _onMouseUp: function _onMouseUp() {
    if (!this.props.disabled) this.setState({ active: false });
  },

  _onMouseDown: function _onMouseDown() {
    if (!this.props.disabled) this.setState({ active: true });
  },

  _onDragStart: function _onDragStart(e, ui) {
    this.setState({
      dragging: true,
      active: true
    });
    if (this.props.onDragStart) this.props.onDragStart(e, ui);
  },

  _onDragStop: function _onDragStop(e, ui) {
    this.setState({
      dragging: false,
      active: false
    });
    if (this.props.onDragStop) this.props.onDragStop(e, ui);
  },

  _onDragUpdate: function _onDragUpdate(e, ui) {
    if (!this.state.dragging) return;
    if (!this.props.disabled) this._dragX(e, ui.position.left);
  },

  _dragX: function _dragX(e, pos) {
    var max = React.findDOMNode(this.refs.track).clientWidth;
    if (pos < 0) pos = 0;else if (pos > max) pos = max;
    this._updateWithChangeEvent(e, pos / max);
  },

  _updateWithChangeEvent: function _updateWithChangeEvent(e, percent) {
    if (this.state.percent === percent) return;
    this.setPercent(percent);
    var value = this._alignValue(this._percentToValue(percent));
    if (this.props.onChange) this.props.onChange(e, value);
  },

  _percentToValue: function _percentToValue(percent) {
    return percent * (this.props.max - this.props.min) + this.props.min;
  }

});

module.exports = Slider;